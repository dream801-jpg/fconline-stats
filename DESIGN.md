---
name: FC온라인 내 전광판
description: 내 스쿼드의 득점·도움을 밤 경기 전광판처럼 켜 보이는 개인 전적 대시보드
colors:
  led-amber: "#ffb627"
  amber-wash: "rgba(255,182,39,.12)"
  led-lime: "#9be15d"
  led-red: "#ff5a4e"
  unlit-grey: "#6b716c"
  board-black: "#0b0d0c"
  panel: "#151a17"
  panel-raised: "#1b211d"
  line: "#252d28"
  line-strong: "#333d37"
  ink: "#f4f1e8"
  ink-soft: "#cfccc1"
  ink-faint: "#a19e92"
  night-pitch: "#163021"
  pitch-line: "#2d5c43"
  grade-bronze: "#c98a55"
  grade-silver: "#bcc5cc"
  grade-gold: "#e9c46a"
typography:
  scoreboard:
    fontFamily: "Barlow Condensed, Malgun Gothic, sans-serif"
    fontSize: "112px"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.02em"
    fontFeature: "tnum"
  led-number:
    fontFamily: "Barlow Condensed, Malgun Gothic, sans-serif"
    fontSize: "56px"
    fontWeight: 700
    lineHeight: 1
    fontFeature: "tnum"
  headline:
    fontFamily: "Do Hyeon, Malgun Gothic, Apple SD Gothic Neo, sans-serif"
    fontSize: "32px"
    fontWeight: 400
    lineHeight: 1.1
  title:
    fontFamily: "Do Hyeon, Malgun Gothic, Apple SD Gothic Neo, sans-serif"
    fontSize: "24px"
    fontWeight: 400
    lineHeight: 1.2
  player-name:
    fontFamily: "Do Hyeon, Malgun Gothic, Apple SD Gothic Neo, sans-serif"
    fontSize: "19px"
    fontWeight: 400
    lineHeight: 1.2
  stat-number:
    fontFamily: "Barlow Condensed, Malgun Gothic, sans-serif"
    fontSize: "17px"
    fontWeight: 600
    fontFeature: "tnum"
  body:
    fontFamily: "system-ui, -apple-system, Segoe UI, Malgun Gothic, Apple SD Gothic Neo, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "system-ui, -apple-system, Segoe UI, Malgun Gothic, Apple SD Gothic Neo, sans-serif"
    fontSize: "12px"
    fontWeight: 500
    letterSpacing: "0.04em"
rounded:
  bar: "2px"
  chip: "3px"
  control: "4px"
  board: "8px"
  pill: "999px"
spacing:
  dot: "4px"
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "20px"
  xl: "24px"
  xxl: "32px"
  section: "48px"
  page-end: "64px"
components:
  button-amber:
    backgroundColor: "{colors.led-amber}"
    textColor: "{colors.board-black}"
    rounded: "{rounded.control}"
    padding: "8px 16px"
    height: "40px"
  button-default:
    backgroundColor: "{colors.panel-raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "8px 16px"
    height: "40px"
  segment-on:
    backgroundColor: "{colors.led-amber}"
    textColor: "{colors.board-black}"
    rounded: "{rounded.chip}"
    padding: "0 12px"
    height: "34px"
  board:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.board}"
    padding: "20px 24px"
  chip-info:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink-soft}"
    rounded: "{rounded.control}"
    padding: "4px 10px"
  grade-bronze:
    backgroundColor: "{colors.grade-bronze}"
    textColor: "{colors.board-black}"
    rounded: "{rounded.chip}"
    padding: "0 6px"
  grade-silver:
    backgroundColor: "{colors.grade-silver}"
    textColor: "{colors.board-black}"
    rounded: "{rounded.chip}"
    padding: "0 6px"
  grade-gold:
    backgroundColor: "{colors.grade-gold}"
    textColor: "{colors.board-black}"
    rounded: "{rounded.chip}"
    padding: "0 6px"
  pip-win:
    backgroundColor: "{colors.led-lime}"
    textColor: "{colors.board-black}"
    rounded: "{rounded.chip}"
    width: "36px"
    height: "32px"
  pip-draw:
    backgroundColor: "{colors.unlit-grey}"
    textColor: "{colors.ink}"
    rounded: "{rounded.chip}"
    width: "36px"
    height: "32px"
  pip-loss:
    backgroundColor: "{colors.led-red}"
    textColor: "{colors.board-black}"
    rounded: "{rounded.chip}"
    width: "36px"
    height: "32px"
  input-key:
    backgroundColor: "{colors.board-black}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "8px 12px"
    height: "40px"
---

# Design System: FC온라인 내 전광판

## Overview

**Creative North Star: "야간 경기 전광판"**

화면 전체가 불 꺼진 경기장의 무광 검정 전광판이다. 바탕은 거의 검정에 가까운 녹빛 검정이고, 그 위에 한 단 밝은 패널이 보드처럼 놓인다. 빛은 숫자에서만 난다: 득점·도움·공격P·스코어 같은 큰 숫자가 LED 앰버로 켜지고, 4px 도트 마스크가 그 숫자를 전광판 픽셀로 만든다. 나머지는 모두 조용한 따뜻한 회백색 글자와 1px 선이다.

밀도는 높지만 질서가 있다. 보드는 8px 모서리의 평면 사각형이고, 그 안의 표·미터·타임라인은 1px 구분선으로만 나뉜다. 그림자·광택·유리·장식 그라데이션은 쓰지 않는다. 피치는 투광등 아래 어두운 잔디색 평면이고, 선수 카드의 강화 등급만 동·은·금의 평면 칩으로 게임 언어를 가져온다.

색은 의미를 진다. 앰버는 "내 쪽·지금 선택한 것", 레드는 "상대·패", 라임은 "승", 소등 회색은 "무"다. 결과 색은 언제나 승/무/패 글자와 함께 나온다.

**Key Characteristics:**
- 다크 전용(`color-scheme: dark`), 라이트 모드 없음
- LED 도트 숫자는 큰 숫자에만, 작은 수치는 같은 콘덴스드 서체의 평문
- 간판체(Do Hyeon) 제목·선수 이름, 콘덴스드(Barlow Condensed) 숫자, 시스템 한글 본문
- 4px 도트 피치 간격 모듈
- 평면 보드, 1px 선, 그림자·그라데이션·광택 없음
- 새로고침으로 바뀐 LED 숫자만 제자리에서 차례로 다시 켜짐

## Colors

검정 보드 위에 LED 세 색(앰버·라임·레드)과 등급 금속 세 색만 켜지는 절제된 야간 팔레트.

### Primary
- **LED 앰버** (`led-amber`): 큰 LED 숫자, 내 골 분(分) 표기, 선택 상태(눌린 세그먼트, 선택 선수 링·평점 칩), 주 동작 버튼(새로고침), 정렬 중인 열, 미터 채움, 포커스 링, 링크, 텍스트 선택 배경. 화면의 "켜진 불"은 거의 다 이 색이다.
- **앰버 워시** (`amber-wash`): 선택된 표 행·펼친 경기 행의 바탕. 앰버를 배경에 쓸 때는 이 12% 워시만 쓴다.

### Secondary
- **LED 라임** (`led-lime`): 승. 승 칩 배경, 승 범례, 팀 기록 승 수 LED.
- **LED 레드** (`led-red`): 상대와 패. 패 칩, 상대 골 분 표기, 상대 슛·실점 차트, 오류 문구.
- **소등 회색** (`unlit-grey`): 무. 꺼진 전구처럼 색이 빠진 회색.

### Tertiary
- **강화 동** (`grade-bronze`), **강화 은** (`grade-silver`), **강화 금** (`grade-gold`): 선수 강화 등급 칩 전용. 강화 금은 상단 바의 최고 등급 이름 강조에도 쓰인다.
- **야간 피치** (`night-pitch`) / **피치 라인** (`pitch-line`): 포메이션·슈팅 맵 잔디면과 라인.

### Neutral
- **무광 보드 검정** (`board-black`): 페이지 바탕, 고정 가이드 줄 바탕, 경기 상세 펼침 바탕, 밝은 칩 위 글자색.
- **패널** (`panel`): 보드(카드) 바탕, 칩·세그먼트 바탕.
- **한 단 밝은 패널** (`panel-raised`): 버튼·셀렉트·툴팁·호버된 표 행.
- **선** (`line`) / **진한 선** (`line-strong`): 보드 테두리·표 구분선 / 컨트롤 테두리·스크롤바.
- **잉크** (`ink`): 본문과 강조 글자. 순백이 아닌 따뜻한 회백.
- **옅은 잉크** (`ink-soft`): 보조 글자, 상대 팀 이름, 범례.
- **흐린 잉크** (`ink-faint`): 표 머리, 날짜, 설명, 표본이 적은 행. 패널 위에서도 AA 대비를 지키는 가장 옅은 단계이므로 이보다 더 흐리게 쓰지 않는다.

### Named Rules
**내 편·상대 규칙.** 앰버는 내 쪽과 선택, 레드는 상대와 패. 같은 화면에서 이 의미를 뒤집지 않는다(예: 상대 데이터를 앰버로 칠하지 않는다).

**글자 병기 규칙.** 승·무·패 색은 단독으로 나오지 않는다. 칩·표·범례 어디서든 "승/무/패" 글자가 같이 있어야 한다.

**등급 문턱 규칙.** 강화 등급 칩 색은 +2~4 동, +5~7 은, +8 이상 금, +1은 진한 선 회색이다. 이 문턱을 바꾸지 않는다.

## Typography

**Display Font:** Do Hyeon (Malgun Gothic, Apple SD Gothic Neo 대체)
**Number Font:** Barlow Condensed 500/600/700 (Malgun Gothic 대체), 항상 고정폭 숫자(`tabular-nums`)
**Body Font:** 시스템 한글 (system-ui, Segoe UI, Malgun Gothic, Apple SD Gothic Neo)

두 웹폰트는 Google Fonts에서 `display=swap`으로 받는다. 로딩 실패 시 시스템 한글로 그대로 읽혀야 한다.

**Character:** 경기장 간판 같은 굵은 한글 간판체와 전광판 숫자처럼 좁고 높은 콘덴스드 숫자가 짝을 이루고, 읽어야 하는 문장은 시스템 서체가 맡는다.

### Hierarchy
- **Scoreboard** (700, 112px, 폰 84px, 행간 1): 방금 경기 스코어 하나. LED 도트 마스크.
- **LED Number** (700, 26~64px, 행간 1): 팀 기록 64px(폰 40), 선수 상세 56px(폰 44), 순위표 공격P 40px·골/도움 32px(폰 32/26), 차트 머리 숫자 40px, 경기 목록 스코어 26px(폰 22). 모두 LED 도트 마스크.
- **Headline** (Do Hyeon 400, 32px, 폰 26px): 닉네임, 선택 선수 이름. 구역 제목은 28px.
- **Title** (Do Hyeon 400, 24px, 행간 1.2): 보드 제목, 방금 경기 팀 이름.
- **Player Name** (Do Hyeon 400, 15~19px): 순위표 19px, 타임라인 17px, 피치 노드 15px(폰 12px). `keep-all` 줄바꿈.
- **Stat Number** (Barlow Condensed 600~700, 14~20px): 표 수치 17px, 골 분 18px, 미터 값 16px, 순위 번호 20px. 도트 마스크 없음.
- **Body** (400, 14px, 행간 1.5): 본문·표·설명.
- **Label** (500, 12~13px): 표 머리 12px(자간 0.04em), 보조 설명·범례 13px. 대문자 변환 없음.

### Named Rules
**큰 숫자만 켠다 규칙.** LED 도트 마스크는 22px 이상, 화면의 핵심 숫자에만 쓴다. 표 안의 작은 수치·라벨·본문에는 절대 씌우지 않는다. 도트가 작은 글자를 먹으면 읽히지 않는다.

**간판체는 이름에만 규칙.** Do Hyeon은 닉네임·제목·선수/팀 이름에만 쓰고, 문장·설명·숫자에는 쓰지 않는다.

## Layout

최대 폭 1440px 컨테이너, 좌우 32px(폰 16px) 여백, 끝 여백 64px(폰 48px). 모든 간격은 4px 도트 피치의 배수(4·8·12·16·20·24·32·48·64)다. 보드 사이 24px, 구역 제목 위 48px, 보드 안쪽 20px 24px(폰 16px).

구성은 위에서 아래로: 상단 바(닉네임·등급 칩·업데이트 상태·새로고침) → 스크롤해도 고정되는 가이드 줄(현재 범위 문장 + 모드 셀렉트·범위 세그먼트, 위아래 1px 선) → 방금 경기 + 득점 순위 2단(1100px 이상에서 600px : 나머지) → 피치 포메이션 + 선택 선수 2단(1000px 이상 5:7) → 팀 기록 LED 보드(7칸, 폰 3칸) → 차트 그리드(960px 이상 2단, 1200px 이상 3단, 슈팅 맵은 2칸×2행) → 경기 기록 표.

폰(720px 이하)에서는 모든 2단이 1단으로 쌓이고, 순위표는 짧은 이름으로, 경기 표는 결과·상대를 셀 안에 겹쳐 넣는다. 핵심 정보를 가로 스크롤 뒤에 숨기지 않는다(넓은 선수 표만 첫 열 고정 후 가로 스크롤 허용). 터치 목표는 40px(세그먼트 34px, 결과 칩 32px·폰 28px) 이상.

## Elevation & Depth

평면 시스템이다. 깊이는 그림자가 아니라 바탕 세 단(보드 검정 → 패널 → 한 단 밝은 패널)과 1px 선으로 만든다. 장식 그라데이션·광택·유리·글로우는 없다. LED 도트 마스크는 `radial-gradient`로 구현되지만 이는 픽셀 격자를 만드는 마스크이지 시각적 그라데이션이 아니므로 금지 대상이 아니다.

### Shadow Vocabulary
- **떠 있는 툴팁** (`box-shadow: 0 8px 24px rgba(0,0,0,.5)`): 커서를 따라 뜨는 툴팁 하나에만.
- **선택 링** (`box-shadow: 0 0 0 2px board-black, 0 0 0 4px led-amber`): 피치에서 선택된 선수 얼굴의 이중 링. 번짐 없는 단색 링.
- **피치 위 이름 가독성** (`text-shadow: 0 1px 2px rgba(0,0,0,.8)`): 잔디 위 선수 이름에만.

### Named Rules
**평면 보드 규칙.** 보드와 카드에는 그림자를 주지 않는다. 위로 뜨는 것은 툴팁뿐이다.

## Shapes

작고 일정한 모서리. 보드·피치 8px, 버튼·셀렉트·칩·입력 4px, 결과 칩·등급 칩·평점 칩 3px, 막대·범례 사각 2px. 선수 얼굴은 원(테두리 1px 진한 선, 피치에서는 2px 검정), 콤비 선수 칩만 알약(999px). 막대 차트는 위쪽만 2px 둥글린다. 테두리는 모두 1px 단색이며 가상 데이터 안내만 점선이다.

## Components

### Buttons
- **Shape:** 살짝 둥근 사각 (4px), 최소 높이 40px, 아이콘 16px + 글자 600.
- **Amber (주 동작):** 앰버 바탕·검정 글자. 화면당 하나(새로고침). 호버 시 밝기 1.08.
- **Default:** 한 단 밝은 패널 바탕, 진한 선 테두리. 호버 시 테두리만 흐린 잉크로.
- **Icon:** 40×40px, 18px 선 아이콘(이전/다음 선수).
- **Disabled / 진행 중:** 투명도 0.6, 아이콘 1초 회전(움직임 줄이기 설정 시 정지).

### Segmented Control
- 패널 바탕 4px 상자 안 2px 여백, 버튼 34px 높이 3px 모서리. 눌린 칸은 앰버 바탕·검정 굵은 글자(`aria-pressed`). 범위(최근 20/50/100/전체)·내 슈팅/상대 슈팅 전환에 쓴다.

### Chips
- **정보 칩:** 패널 바탕, 진한 선 테두리, 4px, 13px 옅은 잉크. 최고 등급 이름은 강화 금 굵게.
- **강화 등급 칩:** "+N" 콘덴스드 13px 700, 검정 글자, 3px, 높이 18px. 동·은·금 문턱은 색상 규칙 참조.
- **결과 칩 (최근 10경기):** 36×32px(폰 28×28), 3px, 승 라임·무 소등 회색·패 레드, 안에 승/무/패 글자. 누르면 해당 경기로 이동.
- **콤비 선수 칩:** 알약, 얼굴 28px + 이름 + 앰버 콘덴스드 숫자.

### Cards / Containers (보드)
- **Corner Style:** 8px
- **Background:** 패널
- **Shadow Strategy:** 없음 (평면 보드 규칙)
- **Border:** 1px 선
- **Internal Padding:** 20px 24px, 폰 16px
- 머리: 왼쪽 Title 크기 간판체 제목, 오른쪽/아래 13px 흐린 잉크 설명.

### Inputs / Fields
- **Style:** 보드 검정 바탕, 진한 선 테두리, 4px, 40px 높이. 셀렉트는 한 단 밝은 패널 바탕.
- **Focus:** 전역 2px 앰버 외곽선, 2px 띄움.
- **Error:** 레드 600 글자.

### Navigation (가이드 줄)
- 상단 고정, 보드 검정 바탕, 위아래 1px 선, 12px 상하 여백. 왼쪽은 "모드 · 최근 N경기 · 기간" 문장(값만 잉크 굵게), 오른쪽은 모드 셀렉트와 범위 세그먼트. 폰에서는 줄바꿈해 왼쪽 정렬.

### Tables
- 1px 아래 구분선만, 세로선 없음. 머리 12px 흐린 잉크 500, 수치 열 오른쪽 정렬·고정폭 숫자. 호버 행은 한 단 밝은 패널, 선택·펼친 행은 앰버 워시, 표본 적은 행은 흐린 잉크. 정렬 중인 열 머리는 앰버 굵게 + 삼각 아이콘.

### LED 숫자 (시그니처)
Barlow Condensed 700, 기본 앰버(팀 기록에서는 승 라임·패 레드·무 옅은 잉크), 4px 격자 원형 도트 마스크. 새로고침으로 값이 바뀐 숫자만 0.64초 8단계로 깜빡이며 다시 켜지고, 여러 개면 지연을 두고 차례로 켜진다. 열과 위치는 고정, 값만 바뀐다. 움직임 줄이기 설정에서는 꺼진다.

### 야간 피치 포메이션
68:80 비율 잔디면, 피치 라인 1px 테두리 8px. 선수 노드는 얼굴 52px(폰 40) + 간판체 이름 + 검정 평점 칩(평점 높으면 앰버 글자). 선택 노드는 앰버 이중 링과 앰버 평점 칩. 오른쪽 아래에 포메이션 이름을 콘덴스드 28px로.

### Meter
라벨 80px | 8px 높이 트랙(선 색, 2px) 앰버 채움 | 콘덴스드 값 48px 열.

## Do's and Don'ts

### Do:
- **Do** 다크 전용으로 만든다. `color-scheme: dark`를 선언하고 라이트 변형을 만들지 않는다.
- **Do** 큰 핵심 숫자(22px 이상)에만 LED 도트 마스크를 씌우고, 기본 색은 LED 앰버로 한다.
- **Do** 모든 간격을 4px 배수로 잡는다(4·8·12·16·20·24·32·48·64).
- **Do** 앰버는 내 쪽·선택·주 동작, 레드는 상대·패로 쓴다.
- **Do** 승·무·패 색 옆에 항상 승/무/패 글자를 둔다.
- **Do** 강화 등급 칩은 +2~4 동, +5~7 은, +8 이상 금으로 칠한다.
- **Do** 제목·이름은 Do Hyeon, 숫자는 Barlow Condensed 고정폭, 문장은 시스템 한글로 쓰고 웹폰트 실패 시 Malgun Gothic/Apple SD Gothic Neo로 떨어지게 한다.
- **Do** 터치 목표를 40px 이상으로, 포커스는 2px 앰버 외곽선으로 보인다.
- **Do** 새로고침 애니메이션은 바뀐 값에만 적용하고 `prefers-reduced-motion`에서 끈다.

### Don't:
- **Don't** 보드·카드에 그림자, 글로우, 광택, 유리(backdrop-filter), 장식 그라데이션을 넣지 않는다.
- **Don't** 표 수치·라벨·본문 같은 작은 글자에 LED 도트 마스크를 씌우지 않는다.
- **Don't** 승·무·패를 색만으로 구분하지 않는다.
- **Don't** 흐린 잉크보다 더 옅은 글자색을 만들지 않는다(AA 대비).
- **Don't** 넥슨·EA 로고나 상표, 공식 사이트처럼 보이는 장치를 흉내 내지 않는다.
- **Don't** 같은 정보를 한 화면에 두 번 표기하지 않는다.
