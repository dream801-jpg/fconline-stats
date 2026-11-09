// 넥슨 오픈 API에서 내 FC온라인 경기 기록을 받아 data/ 에 쌓고, 끝나면 대시보드를 다시 만든다.
// 실행: node fetch.mjs   (설정은 .env)
//
// - 경기 상세는 끝난 뒤 바뀌지 않으므로 data/raw/<matchId>.json 으로 한 번만 받는다.
// - 개발 키 한도(초당 5회, 하루 1,000회)를 넘지 않게 호출 간격과 실행당 호출 수를 제한한다.
//   한도에 걸려 멈추면 내일 다시 실행하면 이어서 받는다.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from './build.mjs';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const DATA = path.join(ROOT, 'data');
const RAW = path.join(DATA, 'raw');
const META = path.join(DATA, 'meta');
const BASE = 'https://open.api.nexon.com';

const env = loadEnv(path.join(ROOT, '.env'));
const KEY = env.NEXON_API_KEY;
const NICK = env.FC_NICKNAME;
const TYPES = (env.FC_MATCHTYPES || '50').split(',').map(s => Number(s.trim())).filter(Boolean);
const MAX_MATCHES = Number(env.FC_MAX_MATCHES) || 300;
const BUDGET = Number(env.FC_CALL_BUDGET) || 900;
const GAP_MS = 230; // 초당 5회 미만

if (!KEY || !NICK) {
  console.error('.env 에 NEXON_API_KEY 와 FC_NICKNAME 을 채워 주세요. (.env.example 참고)');
  process.exit(1);
}

const ERROR_HINT = {
  OPENAPI00003: '식별자(ouid/matchid)가 올바르지 않음',
  OPENAPI00004: '파라미터가 빠졌거나 잘못됨 — 닉네임 철자 확인',
  OPENAPI00005: 'API 키가 올바르지 않음 — .env 의 NEXON_API_KEY 확인',
  OPENAPI00006: '게임 또는 경로가 잘못됨',
  OPENAPI00007: '호출 한도 초과',
  OPENAPI00009: '데이터 준비 중',
  OPENAPI00010: '게임 점검 중',
  OPENAPI00011: 'API 점검 중',
};

class BudgetError extends Error {}

let calls = 0;
let lastCall = 0;
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function api(p, params = {}, { keyless = false } = {}) {
  if (!keyless && calls >= BUDGET) throw new BudgetError();
  const url = new URL(p, BASE);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

  for (let attempt = 0; attempt < 5; attempt++) {
    const wait = lastCall + GAP_MS - Date.now();
    if (wait > 0) await sleep(wait);
    lastCall = Date.now();
    if (!keyless) calls++;

    const res = await fetch(url, { headers: keyless ? {} : { 'x-nxopen-api-key': KEY } });
    if (res.ok) return res.json();

    const body = await res.json().catch(() => ({}));
    const code = body?.error?.name;
    if (res.status === 429 || code === 'OPENAPI00007') {
      if (attempt === 4) throw new BudgetError();
      await sleep(1500 * (attempt + 1));
      continue;
    }
    if (code === 'OPENAPI00009') return null; // 아직 준비 안 된 경기 — 다음 실행 때 다시
    throw new Error(`${res.status} ${code || ''} ${ERROR_HINT[code] || body?.error?.message || ''} (${url.pathname})`);
  }
}

async function main() {
  fs.mkdirSync(RAW, { recursive: true });
  fs.mkdirSync(META, { recursive: true });

  // 1) 계정 — ouid는 게임 업데이트로 바뀔 수 있어서 매번 새로 받고, 예전 ouid도 기억해 둔다.
  const prev = readJSON(path.join(DATA, 'account.json')) || {};
  const { ouid } = await api('/fconline/v1/id', { nickname: NICK });
  const basic = await api('/fconline/v1/user/basic', { ouid });
  const maxDivision = await api('/fconline/v1/user/maxdivision', { ouid });
  const account = {
    ouid,
    nickname: basic?.nickname || NICK,
    level: basic?.level ?? null,
    maxDivision: maxDivision || [],
    knownOuids: [...new Set([...(prev.knownOuids || []), ouid])],
    fetchedAt: new Date().toISOString(),
  };
  writeJSON(path.join(DATA, 'account.json'), account);
  console.log(`계정: ${account.nickname} (Lv.${account.level})`);

  // 2) 경기 목록 — 최신순으로 오므로 이미 아는 경기만 나오는 페이지에서 멈춘다.
  const indexFile = path.join(DATA, 'index.json');
  const index = readJSON(indexFile) || {};
  for (const type of TYPES) {
    let added = 0;
    for (let offset = 0; offset < MAX_MATCHES; offset += 100) {
      const limit = Math.min(100, MAX_MATCHES - offset);
      const list = (await api('/fconline/v1/user/match', { ouid, matchtype: type, offset, limit })) || [];
      const ids = list.map(x => (typeof x === 'string' ? x : x?.matchId)).filter(Boolean);
      const fresh = ids.filter(id => !index[id]);
      for (const id of fresh) index[id] = type;
      added += fresh.length;
      if (ids.length < limit || fresh.length === 0) break;
    }
    console.log(`모드 ${type}: 새 경기 ${added}개`);
  }
  writeJSON(indexFile, index);

  // 3) 경기 상세 — 아직 안 받은 것만.
  const pending = Object.keys(index).filter(id => !fs.existsSync(path.join(RAW, `${id}.json`)));
  console.log(`상세 받을 경기: ${pending.length}개 (이번 실행 남은 호출 ${BUDGET - calls}회)`);
  let done = 0;
  try {
    for (const id of pending) {
      const detail = await api('/fconline/v1/match-detail', { matchid: id });
      if (detail) writeJSON(path.join(RAW, `${id}.json`), detail);
      if (++done % 25 === 0) console.log(`  ${done}/${pending.length}`);
    }
  } catch (e) {
    if (!(e instanceof BudgetError)) throw e;
    console.warn(`호출 한도에 닿아 멈춤: ${done}/${pending.length}개 받음. 내일 다시 실행하면 이어서 받습니다.`);
  }

  // 4) 메타데이터 (키 필요 없음, 호출 수에 안 들어감) — 7일 지나면 새로 받는다.
  for (const name of ['matchtype', 'spposition', 'division', 'division-volta', 'class', 'seasonid', 'spid']) {
    const file = path.join(META, `${name}.json`);
    const fresh = fs.existsSync(file) && Date.now() - fs.statSync(file).mtimeMs < 7 * 864e5;
    if (fresh) continue;
    try {
      writeJSON(path.join(META, `${name}.json`), await api(`/static/fconline/meta/${name}.json`, {}, { keyless: true }));
    } catch (e) {
      console.warn(`메타 ${name} 받기 실패 (없어도 대시보드는 만들어짐): ${e.message}`);
    }
  }

  console.log(`API 호출 ${calls}회 사용`);
  const out = build({ dataDir: DATA });
  console.log(`대시보드: ${out}`);
}

function loadEnv(file) {
  const env = { ...process.env };
  if (!fs.existsSync(file)) return env;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
  return env;
}
function readJSON(f) {
  try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return null; }
}
function writeJSON(f, v) {
  fs.writeFileSync(f, JSON.stringify(v));
}

main().catch(e => {
  console.error('실패:', e.message);
  process.exit(1);
});
