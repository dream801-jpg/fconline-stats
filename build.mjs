// data/ 의 원본 JSON을 대시보드용 요약 데이터로 줄이고, template.html 에 넣어 out/dashboard.html 하나로 만든다.
// 실행: node build.mjs [데이터폴더] [출력파일]

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const COMPACT_SRC = fs.readFileSync(path.join(ROOT, 'compact.js'), 'utf8');
const compactMatch = new Function(`${COMPACT_SRC}\nreturn compactMatch;`)();
const FALLBACK_TYPES = { 30: '리그 친선', 40: '클래식 1on1', 50: '공식경기', 52: '감독모드', 60: '공식 친선' };

export function build({ dataDir = path.join(ROOT, 'data'), outFile = path.join(ROOT, 'out', 'dashboard.html'), mock = false } = {}) {
  const account = readJSON(path.join(dataDir, 'account.json'));
  if (!account) throw new Error(`${dataDir}/account.json 이 없습니다. 먼저 node fetch.mjs 를 실행하세요.`);
  const meta = name => readJSON(path.join(dataDir, 'meta', `${name}.json`)) || [];
  const myOuids = [...new Set([account.ouid, ...(account.knownOuids || [])])];

  const rawDir = path.join(dataDir, 'raw');
  const files = fs.existsSync(rawDir) ? fs.readdirSync(rawDir).filter(f => f.endsWith('.json')) : [];
  const usedSp = new Set();
  const matches = [];
  let outOfRange = 0;
  for (const f of files) {
    const m = compactMatch(readJSON(path.join(rawDir, f)), myOuids, account.nickname);
    if (!m) continue;
    for (const s of [...m.shots, ...m.oShots]) {
      if (s[1] < -0.05 || s[1] > 1.05 || s[2] < -0.05 || s[2] > 1.05) outOfRange++; // 골라인 위 슛은 1.01 정도로 나옴
      if (s[6]) usedSp.add(s[6]);
      if (s[8]) usedSp.add(s[8]);
    }
    for (const p of m.pl) usedSp.add(p[0]);
    matches.push(m);
  }
  matches.sort((a, b) => a.t.localeCompare(b.t));
  if (outOfRange) console.warn(`주의: 슛 좌표 ${outOfRange}개가 0~1 범위를 벗어남 — 슈팅 맵 좌표 해석을 확인해야 함`);

  // 선수 이름·시즌 — 실제로 나온 선수만 남긴다 (spid 메타 전체는 4MB).
  const spName = new Map(meta('spid').map(s => [s.id, s.name]));
  const className = classNames(meta('class'), meta('seasonid'));
  const players = {};
  for (const id of usedSp) players[id] = { n: spName.get(id) || null, c: className.get(Math.floor(id / 1e6)) || null };
  // 시즌(클래스) 배지 이미지 — 실제로 나온 시즌만
  const classImg = new Map(meta('class').map(c => [c.class, c.classImg]));
  for (const s of meta('seasonid')) if (!classImg.has(s.seasonId)) classImg.set(s.seasonId, s.seasonImg);
  const classes = {};
  for (const id of usedSp) { const k = Math.floor(id / 1e6); if (classImg.get(k)) classes[k] = classImg.get(k); }

  const typeNames = { ...FALLBACK_TYPES };
  for (const t of meta('matchtype')) typeNames[t.matchtype] = t.desc;
  const divisions = Object.fromEntries([...meta('division-volta'), ...meta('division')].map(x => [x.divisionId, x.divisionName]));

  const dataset = {
    mock,
    generatedAt: account.fetchedAt || new Date().toISOString(),
    user: { nickname: account.nickname, level: account.level },
    maxDivision: (account.maxDivision || []).map(m => ({ mt: m.matchType, division: m.division, date: m.achievementDate || null })),
    divisions,
    matchTypes: Object.fromEntries([...new Set(matches.map(m => m.mt))].map(t => [t, typeNames[t] || `모드 ${t}`])),
    positions: Object.fromEntries(meta('spposition').map(p => [p.spposition, p.desc])),
    players,
    classes,
    matches,
  };

  const template = fs.readFileSync(path.join(ROOT, 'template.html'), 'utf8');
  const json = JSON.stringify(dataset).replace(/</g, '\\u003c');
  const html = template
    .replace('/*__COMPACT__*/', () => COMPACT_SRC)
    .replace('__FCO_DATA__', () => json);
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, html);
  console.log(`경기 ${matches.length}개 → ${outFile}`);
  return outFile;
}

export function classNames(classMeta, seasonMeta) {
  const m = new Map(classMeta.map(c => [c.class, c.className]));
  for (const s of seasonMeta) if (!m.has(s.seasonId)) m.set(s.seasonId, s.className);
  return m;
}
function readJSON(f) {
  try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return null; }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [dir, out] = process.argv.slice(2);
  build({ dataDir: dir ? path.resolve(dir) : undefined, outFile: out ? path.resolve(out) : undefined });
}
