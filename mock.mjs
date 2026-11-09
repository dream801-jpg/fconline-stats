// API 키 없이 대시보드 모양을 미리 보기 위한 가상 데이터.
// 실제 API 응답과 같은 모양의 JSON을 data-mock/ 에 만들고 out/dashboard-mock.html 을 빌드한다.
// 실행: node mock.mjs

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from './build.mjs';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const DIR = path.join(ROOT, 'data-mock');
fs.rmSync(DIR, { recursive: true, force: true });
fs.mkdirSync(path.join(DIR, 'raw'), { recursive: true });
fs.mkdirSync(path.join(DIR, 'meta'), { recursive: true });

let seed = 20261110;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) % 2 ** 32) / 2 ** 32);
const pick = a => a[Math.floor(rnd() * a.length)];
const poisson = l => { let k = 0, p = 1; const L = Math.exp(-l); do { k++; p *= rnd(); } while (p > L); return k - 1; };
const P24 = 2 ** 24;

const ME = 'mock-me';
const squad = [
  [0, '가상 골키퍼'], [7, '가상 왼쪽 풀백'], [6, '가상 센터백 A'], [4, '가상 센터백 B'], [3, '가상 오른쪽 풀백'],
  [10, '가상 수비형 미드'], [15, '가상 중앙 미드 A'], [13, '가상 중앙 미드 B'],
  [27, '가상 왼쪽 윙어'], [25, '가상 스트라이커'], [23, '가상 오른쪽 윙어'],
  [28, '가상 교체 공격수'], [28, '가상 교체 미드'],
].map(([pos, name], i) => ({ spId: (800 + (i % 3)) * 1e6 + 100001 + i, pos, name }));

function side(ouid, nickname, strength, shotsN, possession) {
  const shootDetail = [];
  const shooters = squad.filter(p => p.pos >= 13 && p.pos !== 28);
  for (let i = 0; i < shotsN; i++) {
    const inBox = rnd() < 0.62;
    const x = inBox ? 0.85 + rnd() * 0.14 : 0.68 + rnd() * 0.17;
    const y = inBox ? 0.3 + rnd() * 0.4 : 0.15 + rnd() * 0.7;
    const close = (x - 0.68) / 0.31;
    const r = rnd();
    const result = r < 0.08 + close * 0.32 * strength ? 3 : r < 0.55 ? 1 : 2;
    const minute = Math.floor(rnd() ** 0.85 * 92);
    const goalTime = minute < 45 ? minute * 60 + Math.floor(rnd() * 60) : P24 + (minute - 45) * 60 + Math.floor(rnd() * 60);
    const shooter = pick(shooters);
    shootDetail.push({
      goalTime, x: +x.toFixed(4), y: +y.toFixed(4), type: pick([1, 1, 1, 2, 2, 3, 6, 12]), result,
      spId: shooter.spId, spGrade: 5, spLevel: 1, spIdType: false, assist: result === 3 && rnd() < 0.7,
      assistSpId: -1, assistX: 0, assistY: 0, hitPost: false, inPenalty: inBox,
    });
  }
  const goals = shootDetail.filter(s => s.result === 3).length;
  const sot = shootDetail.filter(s => s.result !== 2).length;
  const passTry = 80 + Math.floor(possession * 1.6 + rnd() * 30);
  const player = squad.map(p => {
    const played = p.pos !== 28 || rnd() < 0.5;
    const g = shootDetail.filter(s => s.spId === p.spId && s.result === 3).length;
    return {
      spId: p.spId, spPosition: p.pos, spGrade: 5,
      status: {
        shoot: shootDetail.filter(s => s.spId === p.spId).length, effectiveShoot: 0, assist: rnd() < 0.15 ? 1 : 0, goal: g,
        dribble: 0, intercept: 0, defending: 0, passTry: 0, passSuccess: 0, dribbleTry: 0, dribbleSuccess: 0,
        ballPossesionTry: 0, ballPossesionSuc: 0, aerialTry: 0, aerialSuccess: 0, blockTry: 0, block: 0,
        tackleTry: 0, tackle: 0, yellowCards: 0, redCards: 0,
        spRating: played ? +(5.8 + rnd() * 2 + g * 0.8 + strength * 0.4).toFixed(1) : 0,
      },
    };
  });
  return {
    ouid, nickname, division: 900,
    matchDetail: {
      seasonId: 0, matchResult: '', matchEndType: 0, systemPause: 0, foul: 0, injury: 0, redCards: 0, yellowCards: 0,
      dribble: 0, cornerKick: 0, possession, OffsideCount: 0, averageRating: +(6.2 + rnd() * 1.4 + strength * 0.3).toFixed(2), controller: 'pad',
    },
    shoot: { shootTotal: shotsN, effectiveShootTotal: sot, shootOutScore: 0, goalTotal: goals, goalTotalDisplay: goals },
    shootDetail,
    pass: { passTry, passSuccess: Math.floor(passTry * (0.72 + rnd() * 0.18)) },
    defence: {},
    player,
  };
}

const now = Date.UTC(2026, 10, 10, 6, 0);
const hourWeight = [0.4, 0.2, 0.05, 0, 0, 0, 0, 0.05, 0.1, 0.1, 0.2, 0.3, 0.5, 0.4, 0.4, 0.5, 0.6, 0.8, 1, 1.2, 1.4, 1.5, 1.3, 0.9];
const sampleHourKST = () => {
  const total = hourWeight.reduce((a, b) => a + b);
  let r = rnd() * total;
  for (let h = 0; h < 24; h++) if ((r -= hourWeight[h]) <= 0) return h;
  return 21;
};

for (let i = 0; i < 170; i++) {
  const mt = i % 6 === 0 ? 52 : 50;
  const daysAgo = Math.floor((i / 170) * 60);
  const hourKST = sampleHourKST();
  const t = new Date(now - daysAgo * 864e5);
  t.setUTCHours((hourKST + 24 - 9) % 24, Math.floor(rnd() * 60), Math.floor(rnd() * 60));
  const form = 0.75 + 0.35 * Math.sin(i / 14);
  const lateNight = hourKST < 3 ? -0.25 : 0;
  const myStr = Math.max(0.3, form + lateNight + (rnd() - 0.5) * 0.3);
  const oppStr = 0.75 + (rnd() - 0.5) * 0.4;
  const poss = Math.max(30, Math.min(70, Math.round(50 + (myStr - oppStr) * 20 + (rnd() - 0.5) * 14)));
  const me = side(ME, '내닉네임', myStr, Math.max(3, poisson(8 + myStr * 4)), poss);
  const op = side(`opp-${i}`, `상대${String(i).padStart(3, '0')}`, oppStr, Math.max(2, poisson(8 + oppStr * 3)), 100 - poss);
  const gf = me.shoot.goalTotal, ga = op.shoot.goalTotal;
  me.matchDetail.matchResult = gf > ga ? '승' : gf < ga ? '패' : '무';
  op.matchDetail.matchResult = gf < ga ? '승' : gf > ga ? '패' : '무';
  const id = `mock${String(i).padStart(4, '0')}`;
  const detail = { matchId: id, matchDate: t.toISOString().slice(0, 19), matchType: mt, matchInfo: i % 2 ? [me, op] : [op, me] };
  fs.writeFileSync(path.join(DIR, 'raw', `${id}.json`), JSON.stringify(detail));
}

const w = (n, v) => fs.writeFileSync(path.join(DIR, 'meta', `${n}.json`), JSON.stringify(v));
w('matchtype', [{ matchtype: 50, desc: '공식경기' }, { matchtype: 52, desc: '감독모드' }]);
w('spposition', ['GK', 'SW', 'RWB', 'RB', 'RCB', 'CB', 'LCB', 'LB', 'LWB', 'RDM', 'CDM', 'LDM', 'RM', 'RCM', 'CM', 'LCM', 'LM', 'RAM', 'CAM', 'LAM', 'RF', 'CF', 'LF', 'RW', 'RS', 'ST', 'LS', 'LW', 'SUB'].map((desc, spposition) => ({ spposition, desc })));
w('division', [{ divisionId: 800, divisionName: '슈퍼챔피언스' }, { divisionId: 900, divisionName: '챔피언스' }, { divisionId: 1000, divisionName: '슈퍼챌린지' }]);
w('class', [{ class: 800, className: 'MOCK A' }, { class: 801, className: 'MOCK B' }, { class: 802, className: 'MOCK C' }]);
w('spid', squad.map(p => ({ id: p.spId, name: p.name })));
fs.writeFileSync(path.join(DIR, 'account.json'), JSON.stringify({
  ouid: ME, nickname: '내닉네임', level: 312, knownOuids: [ME], fetchedAt: new Date(now).toISOString(),
  maxDivision: [{ matchType: 50, division: 900, achievementDate: '2026-10-02T11:20:00' }, { matchType: 52, division: 1000, achievementDate: '2026-09-14T13:00:00' }],
}));

build({ dataDir: DIR, outFile: path.join(ROOT, 'out', 'dashboard-mock.html'), mock: true });
