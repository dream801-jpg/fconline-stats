---
version: 1
slug: "template-html"
primary_target: "template.html"
related_targets: []
---

# Surface: FC온라인 내 전적 대시보드 (template.html → out/dashboard.html)

Mode: operate. Scope: 단일 페이지 전체 재디자인(데이터·기능·새로고침 동작은 유지). 폰·PC 둘 다 1급.
Job: 방금/최근 폼 확인, 이 범위 득점·도움 기여 선수 파악, 선수 상세(골·도움·합작·평점 흐름·슈팅 위치), 팀 패턴, 경기별 골 기록.
Constraints: 사용자 지정 "FC온라인 게임 느낌"(강화 등급 동·은·금, 시즌 표기, 등급, 포메이션) — 넥슨/EA 로고·상표 흉내 금지. 출처 표기 유지. 키보드·터치 접근(크리틱 P1).
Unresolved: 시즌 배지 이미지(classImg) 사용 여부는 빌드에서 로딩 실패 시 텍스트로 대체.

## Direction contract
THESIS: 내 스쿼드를 밤 경기 전광판처럼 — 득점·도움 숫자가 조명처럼 켜지는 선수 중심 화면. 흰 카드 위 KPI 6칸 줄, 차트 그리드, 표로 끝나는 분석 대시보드 기본 배치를 거부한다.
OWN-WORLD: 무광 검정 전광판 바탕과 한 단 밝은 패널, LED 앰버가 큰 숫자와 선택 상태를 맡고, 승=LED 라임·패=LED 레드·무=소등 회색(항상 글자 병기), 야간 피치 녹색 필드, 강화 등급 동·은·금 평면 칩. 선수 이름·제목은 간판체(Do Hyeon), 큰 숫자만 콘덴스드 숫자에 4px 도트 마스크, 본문은 시스템 한글. 간격은 도트 피치 4px 배수. 그라데이션·광택·유리 없음. 같은 정보 두 번 표기 금지.
STORY: 열자마자 방금 경기와 최근 10경기 폼, 이 범위 득점 순위를 읽는다 → 선수를 눌러(폰은 좌우로 넘겨) 골·도움·합작·평점 흐름으로 들어간다 → 아래에서 팀 패턴과 경기별 골 기록을 펼친다.
FIRST VIEWPORT: 상단 바에 닉네임·등급 칩·가이드 줄(모드·경기 수·기간, 스크롤해도 고정)·모드/범위·앰버 새로고침. 본문 왼쪽은 방금 경기 전광판(대형 LED 스코어, 골 이벤트 분·득점자·도움, 최근 10경기 승무패 칩과 합계), 오른쪽은 득점 순위 보드(상위 5: 얼굴·이름·+등급·골/도움/공격P LED 숫자). 그 바로 아래 야간 피치 포메이션과 선택 선수 패널.
FORM: 경기장 LED 전광판 — 내 후보 목록 6번째, seed:caa0e73400029e82. 시그니처: LED 도트 숫자, 새로고침으로 바뀐 숫자는 제자리에서 차례로 다시 켜진다(열은 고정, 값만 바뀜).
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
