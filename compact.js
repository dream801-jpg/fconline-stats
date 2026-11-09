// 넥슨 match-detail 응답 한 경기를 대시보드용으로 줄인다.
// build.mjs(Node)와 대시보드의 새로고침 버튼(브라우저)이 이 파일 하나를 같이 쓴다 — 고칠 때 한 곳만 고치면 됨.
//
// 반환값
//   shots / oShots: [분, x, y, 결과(1유효 2빗나감 3골), 슛종류, 박스안(1/0), spId, 하프(0전반 1후반 2·3연장),
//                    도움 spId(없으면 0), 도움 x, 도움 y]
//   pl: [spId, 포지션, 평점, 골, 도움, 슈팅, 강화등급, 유효슈팅, 패스시도, 패스성공,
//        드리블시도, 드리블성공, 태클시도, 태클성공, 인터셉트, 공중볼시도, 공중볼성공, 블록]
function compactMatch(d, myOuids, nickname) {
  if (!d || !d.matchInfo) return null;
  const P24 = 16777216;
  const OFFSET = [0, 2700, 5400, 6300, 7200];
  const RESULT = { '승': 'W', '무': 'D', '패': 'L' };
  const me = d.matchInfo.find(i => myOuids.includes(i.ouid)) || d.matchInfo.find(i => i.nickname === nickname);
  if (!me) return null;
  const opp = d.matchInfo.find(i => i !== me) || null;
  const r2 = v => Math.round((v || 0) * 100) / 100;
  const r3 = v => Math.round((v || 0) * 1000) / 1000;

  const shots = side => ((side && side.shootDetail) || []).map(s => {
    const t = s.goalTime || 0;
    const half = Math.floor(t / P24);
    if (half >= 4) return null; // 승부차기 제외
    const sec = t - half * P24 + OFFSET[half];
    const ast = s.assist && s.assistSpId > 0 ? s.assistSpId : 0;
    return [Math.floor(sec / 60), r3(s.x), r3(s.y), s.result, s.type, s.inPenalty ? 1 : 0, s.spId || 0, half,
      ast, ast ? r3(s.assistX) : 0, ast ? r3(s.assistY) : 0];
  }).filter(Boolean);

  const pl = (me.player || [])
    .filter(p => p.status && (p.spPosition !== 28 || p.status.spRating > 0))
    .map(p => {
      const s = p.status;
      return [p.spId, p.spPosition, r2(s.spRating), s.goal || 0, s.assist || 0, s.shoot || 0, p.spGrade || 0,
        s.effectiveShoot || 0, s.passTry || 0, s.passSuccess || 0, s.dribbleTry || 0, s.dribbleSuccess || 0,
        s.tackleTry || 0, s.tackle || 0, s.intercept || 0, s.aerialTry || 0, s.aerialSuccess || 0, s.block || 0];
    });
  const rated = pl.filter(p => p[2] > 0);

  const goals = s => (s && (s.goalTotalDisplay ?? s.goalTotal)) || 0;
  const so1 = (me.shoot && me.shoot.shootOutScore) || 0;
  const so2 = (opp && opp.shoot && opp.shoot.shootOutScore) || 0;
  const md = me.matchDetail || {};
  const utc = /[zZ]|[+-]\d\d:?\d\d$/.test(d.matchDate) ? d.matchDate : d.matchDate + 'Z';

  return {
    id: d.matchId,
    t: new Date(Date.parse(utc) + 9 * 3600e3).toISOString().slice(0, 16), // 한국 시간
    mt: d.matchType,
    res: RESULT[md.matchResult] || 'D',
    end: md.matchEndType || 0,
    gf: goals(me.shoot),
    ga: opp ? goals(opp.shoot) : null,
    so: so1 || so2 ? [so1, so2] : null,
    opp: (opp && opp.nickname) || null,
    poss: md.possession ?? null,
    // matchDetail.averageRating 은 4 안팎으로 선수 평점(6~8)과 기준이 달라 쓰지 않는다
    rat: rated.length ? r2(rated.reduce((a, p) => a + p[2], 0) / rated.length) : 0,
    g: (me.shoot && me.shoot.goalTotal) || 0,
    sh: (me.shoot && me.shoot.shootTotal) || 0,
    sot: (me.shoot && me.shoot.effectiveShootTotal) || 0,
    oSh: opp && opp.shoot ? opp.shoot.shootTotal : null,
    oSot: opp && opp.shoot ? opp.shoot.effectiveShootTotal : null,
    pT: (me.pass && me.pass.passTry) || 0,
    pS: (me.pass && me.pass.passSuccess) || 0,
    shots: shots(me),
    oShots: shots(opp),
    pl,
  };
}
