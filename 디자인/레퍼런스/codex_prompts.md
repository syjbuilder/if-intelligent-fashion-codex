# Codex에 붙여넣을 디자인 수정 프롬프트 가이드

> 본인이 이미 만든 사이트에 레퍼런스 영상의 인터랙션을 옮기고 싶을 때 사용. 
> 6개 블록(Prompt A ~ F) 각각 독립적으로 적용 가능. 위에서 아래로 순서대로 적용하면 자연스러움.

---

## 사용법 요약

1. 아래 블록 중 적용할 부분의 "프롬프트" 영역을 그대로 복사
2. Codex / Cursor / Copilot에 붙여넣고 **본인 프로젝트의 관련 파일을 같이 첨부**
3. 필요 시 변수명·셀렉터·브랜드명만 본인 사이트에 맞게 치환
4. 각 블록 마지막의 "검증 체크리스트"로 동작 확인

각 블록은 **자연어 지시 + 참조 코드 스니펫 + 검증** 3단으로 구성.

---

## Prompt A — Welcome 텍스트 등장 애니메이션 (영상 4초 부근)

### 디자인 의도
"Welcome" 디스플레이 타이틀이 처음 등장할 때, **블러 + 살짝 큰 스케일 + 자간 살짝 벌어진 상태**에서 시작해 1.1초간 또렷해지는 슬로우 모션 페이드인. 그 뒤 0.8초쯤 늦게 서브타이틀이 아래에서 떠오름. 럭셔리 브랜드의 "느림"을 시각적으로 표현하는 핵심 모먼트.

### 프롬프트
````
Hero 섹션의 메인 디스플레이 타이틀(예: "Welcome", h1)에 등장 애니메이션을 추가해줘. 
아래 keyframes를 그대로 사용하고, hero가 처음 보일 때 1.1초간 ease-out-expo 곡선으로 적용:

@keyframes welcomeIn {
  0%   { opacity: 0; filter: blur(22px); transform: scale(1.045); letter-spacing: 0.04em; }
  60%  { opacity: 0.8; filter: blur(6px); transform: scale(1.01); letter-spacing: 0.005em; }
  100% { opacity: 1; filter: blur(0);   transform: scale(1);     letter-spacing: -0.01em; }
}

서브타이틀(p 태그)에는 같은 hero가 활성일 때 800ms 딜레이 후 700ms 동안:
@keyframes subtitleIn {
  0% { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
}

추가 요구사항:
- ease 곡선은 cubic-bezier(0.16, 1, 0.3, 1) 사용
- 페이지 재방문 / 라우트 복귀 시에도 다시 재생되도록 hero에 .active 클래스 토글 시 keyframes가 재실행되게 하기 (필요하면 element.classList.remove('active'); void el.offsetWidth; element.classList.add('active'); 패턴 사용)
- 모바일에서 letter-spacing 진폭은 0.03em 정도로 살짝 줄이기 (선택사항)
````

### 검증 체크리스트
- [ ] 페이지 첫 진입 시 Welcome이 흐릿한 큰 글자에서 또렷하게 자리 잡으며 등장
- [ ] 서브타이틀이 약 1초 뒤에 아래에서 부드럽게 떠오름
- [ ] hero를 다른 화면에서 다시 보여줄 때 애니메이션이 다시 재생됨
- [ ] 폰트가 Cormorant 등 세리프이며, italic alternate가 적용된 글자(예: "Welc**o**me"의 'o') 보임

---

## Prompt B — 검색 입력 시 2단계 신(scene) 전환

### 디자인 의도
사용자가 검색바에 프롬프트를 입력하고 Enter/Send 누르면 결과 페이지로 즉시 가지 않고:
1. **0.9초** "Understanding the query" (현재 hero 위에 작은 라운드 인디케이터)
2. **1.9초** Quote 신으로 전환 (브라운 보케 배경 + 디스플레이 풀스크린 인용구) — Stage A
3. **2.2초** Cream 로딩 신 (크림 BG + "Gathering inspiration" + 손그림 도시 일러스트가 line-draw 애니메이션으로 그려짐) — Stage B
4. **1.3초** 같은 신 위에서 텍스트만 "Curating suggestions"로 변경
5. 결과 그리드 등장

총 약 6.3초의 "장인의 의식" 같은 흐름을 만들어, 결과의 가치를 끌어올리는 패턴.

### 프롬프트
````
검색바에서 프롬프트를 입력하고 전송했을 때, 결과로 바로 가지 않고 아래 5단계 전환을 차례로 보여주는 함수를 만들어줘. 각 단계마다 현재 화면을 페이드아웃하고 다음 화면을 페이드인.

async function runQuery(prompt) {
  if (busy) return;
  busy = true;

  // 1. Understanding the query
  showLoadingPill('Understanding the query');
  await wait(900);

  // 2. Stage A: Quote scene (brown bokeh full-screen)
  showScene('quote');
  showLoadingPill('Crafting your answer');
  await wait(1900);

  // 3. Stage B: Cream loading scene
  showScene('loading');
  setLoadingTitle('Gathering <em>in</em>spiration');
  showLoadingPill('Gathering inspiration');
  await wait(2200);

  // 4. Same scene, text swap
  setLoadingTitle('Curating <em>su</em>ggestions');
  showLoadingPill('Curating suggestions');
  await wait(1300);

  // 5. Results
  showScene('results');
  setResultsTitle(`For ${prompt}, a quiet edit`);
  hideLoadingPill();

  busy = false;
}

요구사항:
- 각 신은 동일 stage 안의 다른 section으로 만들고, .active 토글로 opacity 700~900ms 페이드 전환
- 신 전환 시 keyframes 다시 재생되게 .active 제거 → reflow → 다시 추가하는 패턴 사용
- "Quote 신"은 어두운 갈색 보케(블러된 라디얼 그라디언트), 가운데 디스플레이 세리프 풀스크린 인용구 + 위·아래 매듭 디바이더
- "Cream 로딩 신"은 크림(#ece6d8) 배경, 가운데 디스플레이 타이틀, 그 아래 SVG 도시 스카이라인이 stroke-dasharray + stroke-dashoffset로 line-draw 되며 약 2.2초간 그려짐
- 검색바와 상단 아이콘은 스테이지 바뀌어도 항상 떠 있고, 컬러 모드만 부드럽게 바뀜 (어두운 hero/quote에서는 흰색, 크림/결과에서는 어두운색)
- await wait(ms)는 const wait = ms => new Promise(r => setTimeout(r, ms)); 로 정의

신 전환 모드 클래스 핸들러도 함께 만들어줘:
function setMode(mode) {
  // 'hero' | 'quote' | 'cream'
  topbar.classList.toggle('dark', mode === 'cream');
  footer.classList.toggle('dark', mode === 'cream');
  dock.classList.toggle('dim', mode === 'quote');
  dock.classList.toggle('cream', mode === 'cream');
}
````

### 검증 체크리스트
- [ ] 프롬프트 입력 후 Enter → 즉시 결과로 가지 않고, 인용구 → 손그림 → 결과 그리드 순으로 흐름
- [ ] 각 단계 사이 페이드 전환이 끊기지 않음 (점프 X)
- [ ] 도시 일러스트가 처음부터 끝까지 손으로 그려지듯 line-draw됨
- [ ] 상단바·하단 검색바 색상이 신에 따라 자연스럽게 변함

---

## Prompt C — 손그림 도시 SVG (line-draw 애니메이션)

### 디자인 의도
영상의 솔로메오 마을 일러스트를 자체 자산으로 대체. 길이 ~2200px 정도의 단일 path를 만들고 stroke-dasharray로 그리는 애니메이션 적용.

### 프롬프트
````
"Gathering inspiration" 로딩 신 안에 SVG 도시 스카이라인을 추가해줘. 요구사항:

1. viewBox="0 0 800 220", width은 min(820px, 90vw)
2. 단일 path로 도시 외곽선 (집 + 탑 + 종탑 + 종려나무)
3. 별도 path로 태양(circle), 새 두 마리(짧은 wave path)
4. stroke 색은 어두운 잉크색(#1a1815), stroke-width 1.1, stroke-linecap round
5. 메인 도시 path는 stroke-dasharray:2200; stroke-dashoffset:2200; 로 시작
6. 신이 active 상태가 되면 .skyline path { animation: linedraw 2200ms 200ms ease-out forwards; } 적용
   @keyframes linedraw { to { stroke-dashoffset: 0; } }
7. 태양은 stroke-dasharray:60 / 800ms / delay 1800ms
8. 새들은 stroke-dasharray:24 / 600ms / delay 2200ms

도시 외곽선의 path d 속성 예시 (이 형태를 기반으로 본인 도시 모양으로 변형):
d="M40 170 L 80 170 L 80 130 L 110 130 L 110 100 L 130 100 L 130 130 L 160 130 L 160 170 ..."
````

### 검증 체크리스트
- [ ] 손글씨처럼 한 번에 쭉 그어지는 느낌
- [ ] 그려지는 동안 끊김이나 점프 없음
- [ ] 다시 신에 진입할 때 처음부터 그려짐

---

## Prompt D — 우상단 시계 아이콘 → 히스토리 패널 + 삭제 모달

### 디자인 의도
- 시계 아이콘 클릭 → 오른쪽에서 슬라이드 인하는 다크 그래디언트 패널 (560px)
- 각 row: 검색어 + 타임스탬프 + 우측 chevron (호버 시 좌측에 휴지통 fade-in)
- row 클릭 → 패널 닫고 그 검색어로 다시 runQuery 실행
- 휴지통 클릭 → 그 row만 삭제, 패널은 유지
- 하단: "Clear all" + "Start a new conversation" 두 버튼
- "Clear all" → 중앙 모달 ("Delete all sessions?") → "Cancel" / "Delete"
- 모두 삭제 후 → 패널 안 빈 상태(empty state)로 변경: 작은 라벨 + 큰 인용구 + "Start a conversation" 버튼

### 프롬프트
````
우상단 시계 아이콘 (#btnHistory)을 클릭하면 검색 히스토리 패널이 오른쪽에서 슬라이드인 되는 기능을 구현해줘.

레이아웃:
- aside.drawer.drawer-history (width: min(560px, 92vw), 100vh)
- 어두운 그래디언트 배경 (linear-gradient(180deg, #3d3a37, #2a2723)), 텍스트 #f1ece0
- 우상단 X 닫기 버튼 (원형, hover 시 살짝 밝아짐)
- 본문은 history-row들의 스택 (스크롤 가능)
- 하단에 두 버튼: "Clear all" (보더리스 pill) + "Start a new conversation" (흰색 채움 pill)

state는 메모리에만 저장:
let history = [
  { text: "I need an outfit for a movie premiere", at: Date.now() - 1000*60*32 },
  ...
];

각 row의 마크업:
<div class="history-row">
  <div class="text">{text}</div>
  <div class="ts">06.05.26 | 16:27</div>
  <div class="actions">
    <button class="trash">🗑</button>
    <button class="chevron">›</button>
  </div>
</div>

스타일:
- row는 border-radius 14px, padding 18px 22px, background rgba(255,255,255,.06)
- 호버 시 background rgba(255,255,255,.10)
- .trash는 기본 opacity 0 + translateX(8px), 호버 시 opacity 0.7 + 원위치
- 클릭 핸들러: 휴지통 클릭 시 history.splice(idx,1); renderHistory(); / row 클릭 시 closeDrawer() + runQuery(text)

"Clear all" → 중앙 모달 표시:
<div class="modal">
  <h4>Delete all sessions?</h4>
  <p>By proceeding, you will delete all conversations.</p>
  <button>Cancel</button> <button class="primary">Delete</button>
</div>

모달은 backdrop 페이드 350ms + scale(.96 → 1) 적용. Delete 클릭 시 history = []; renderHistory(); closeModal();

빈 상태 (history.length === 0):
- 작은 라벨 "Your history is empty"
- 큰 디스플레이 인용구 (Cormorant italic alternate 사용)
  "Elegance emerges in the space where idea, form, and matter converge."
  ※ 위 문구는 영상에서 본 영감 — 그대로 쓰지 말고 우리 브랜드 톤에 맞게 다시 작성할 것
- 흰색 채움 pill 버튼 "Start a conversation" → 패널 닫고 검색바 포커스

전환:
- 패널: transform: translateX(100%) → 0, transition 700ms cubic-bezier(0.16, 1, 0.3, 1)
- ESC 키 또는 backdrop 클릭 시 닫기
- 패널이 열려있으면 다른 패널 자동 닫기
````

### 검증 체크리스트
- [ ] 시계 아이콘 클릭 → 패널이 오른쪽에서 부드럽게 슬라이드인
- [ ] 각 행 hover 시 좌측에 휴지통이 슬라이드 인
- [ ] 휴지통 클릭 → 그 행만 삭제, 패널 유지
- [ ] "Clear all" → 모달 → "Delete" → 패널이 빈 상태(인용구)로 변경
- [ ] 빈 상태에서 "Start a conversation" → 패널 닫히고 검색바 포커스
- [ ] ESC로 패널/모달 닫힘

---

## Prompt E — 하트 아이콘 → 위시리스트 풀스크린 패널

### 디자인 의도
- 하트 아이콘 클릭 → 풀스크린에 가까운 패널이 슬라이드 인 (620px)
- 어두운 그래디언트 배경 (위는 다크 슬레이트, 아래는 와인/브라운)
- 좌상단 small caps "MY WISHLIST (0)"
- 가운데에 "Your Wishlist is empty" + 큰 디스플레이 인용구
- 하단에 흰색 채움 pill "Start your Wishlist"
- 우상단에 X 닫기 (밝은색 처리)

영상에서 두드러지는 포인트는 **인용구의 진입 페이드 + 자간 살짝 변화**. Welcome처럼 블러 페이드 인.

### 프롬프트
````
우상단 하트 아이콘 (#btnWishlist)을 클릭하면 위시리스트 패널이 오른쪽에서 슬라이드인 되도록 구현해줘.

레이아웃:
- aside.drawer.drawer-wishlist (width: min(620px, 96vw), 100vh)
- 어두운 그래디언트: linear-gradient(180deg, #2c2e3a 0%, #1a1815 65%, #2a1f17 100%)
- 텍스트 컬러 #f1ece0
- 우상단 X 닫기 (원형, 흰색 stroke, 살짝 밝은 배경)

내부 구조 (모두 가운데 정렬, 위에서 아래로):
1. 좌상단에만 정렬: small caps "MY WISHLIST (0)" — 11px, letter-spacing 0.18em, uppercase
2. 위에서 18vh 띄우고: "Your Wishlist is empty" — 14.5px, opacity 0.85
3. 그 아래 큰 인용구 (디스플레이 세리프, clamp(34px, 4vw, 58px), line-height 1.18):
   "The refinement of details: a subtle dialogue in constant pursuit of balance."
   ※ italic alternate 사용 (예: <em>refinement</em>, <em>subtle</em>, <em>balance</em>)
4. 40px 띄우고 흰색 채움 pill "Start your Wishlist" → 패널 닫기

진입 애니메이션:
- 패널 자체: translateX(100% → 0) 700ms ease-out-expo
- 인용구는 패널 안에서 추가로 페이드인: opacity 0 → 1, blur(14px) → 0, translateY(8px) → 0, 1100ms 지연 100ms

backdrop 0.18 dim 처리, ESC/backdrop 클릭으로 닫힘.
````

### 검증 체크리스트
- [ ] 하트 클릭 → 우측에서 패널 슬라이드 인
- [ ] 인용구가 패널 등장 직후 살짝 늦게 부드럽게 또렷해짐
- [ ] "Start your Wishlist" 클릭 → 패널 닫힘
- [ ] 어두운 그래디언트에 흰색·세리프 텍스트 대비가 우아함

---

## Prompt F — 백(가방) 아이콘 → 우측 화이트 사이드 패널 + 배경 갈색

### 디자인 의도
- 백 아이콘 클릭 → 같은 위치에서 슬라이드 인하지만 **흰색** 패널 (다른 두 패널과 다른 톤)
- 그와 동시에 **본문 배경이 어두운 갈색 그래디언트로 페이드** (드라마 효과)
- 패널 상단: "Your selection (0)" + X 닫기
- 본문: "The selection is empty" + 디스플레이 세리프 인용구
- 그 아래에 모델 사진 한 장 (placeholder 가능)

### 프롬프트
````
우상단 백(가방) 아이콘 (#btnBag) 클릭 시 우측에서 흰색 사이드 패널이 슬라이드인 되며, 동시에 본문 뒤쪽 배경이 어두운 갈색 그래디언트로 페이드 인 되도록 구현해줘.

배경 (백 패널 전용):
<div class="drawer-bag-bg"></div>
- position fixed, inset 0, z-index 95 (패널보다 한 단계 아래)
- background: linear-gradient(135deg, #1c1815 0%, #2d211a 60%, #3d2a1c 100%)
- 기본 opacity 0, .show 클래스 붙으면 opacity 1, transition 600ms

패널:
- aside.drawer.drawer-bag (width: min(720px, 96vw), 100vh)
- background: #ffffff, color: var(--c-ink) (#1a1815)
- padding 78px 30px 30px

내부 구조:
1. 상단 헤더: <h3>Your selection (0)</h3> (Inter 18px, 기본 weight) + 우상단 X 닫기
2. "The selection is empty" — 13.5px, color #5a544c, 가운데 정렬
3. 큰 디스플레이 인용구 (Cormorant 28~46px clamp, line-height 1.18, 가운데 정렬, max-width 480px):
   "True allure is found in the balance that lets every piece breathe."
4. 그 아래 .photo (flex:1, 최소 높이 340px, 둥근 모서리 6px)
   - 실제 모델 사진이 없으면 linear-gradient(135deg, #d6cdbb, #9c8d72 60%, #564a3a)로 placeholder
   - 실제 사진을 넣을 때는 object-fit: cover, object-position: center

전환 순서:
1. 백 클릭 → drawer-bag-bg에 .show 추가 (배경 페이드 600ms)
2. 동시에 .drawer-bag에 .open 추가 (translateX 100% → 0, 700ms)
3. 닫기 시 두 클래스 모두 제거

상단바·하단 검색바 색상은 cream 모드처럼 어두운 글씨로 전환.
````

### 검증 체크리스트
- [ ] 백 아이콘 클릭 → 화면 뒤쪽이 갈색으로 어두워지면서 흰색 패널이 슬라이드 인
- [ ] 패널이 흰색이고 인용구가 검은색 세리프로 또렷
- [ ] 닫기 시 갈색 배경도 함께 페이드 아웃
- [ ] 모델 사진 자리가 있고 placeholder 그래디언트가 보임 (실 사진 교체 가능)

---

## 부록 — 톤·인용구 작성 가이드

영상에서 본 인용구는 모두 **저작권 있는 브랜드 카피**이므로 그대로 사용 X. 본인 브랜드용으로 새로 짤 때 다음 패턴 따르면 톤 일치:

- **구조**: "[추상명사]은(는) [장소·매개]에서 [추상행위]되는 곳에서 [상태]을(를) 발견한다."
- **공통어**: harmony, balance, elegance, refinement, allure, comfort, stillness, breath, line, grace, slowness, attention
- **금지어**: amazing, incredible, awesome, must-have (광고 톤)
- **길이**: 대략 12~20단어. 한 호흡에 읽히는 길이.

예시 (직접 작성):
- "Quiet allure rests where every line is given the room to breathe."
- "True grace appears in the slowness between intention and gesture."
- "Refinement is the conversation a garment holds with the body that wears it."

italic alternate 강조 후보 (디스플레이 폰트가 Cormorant Garamond일 때 효과 좋음):
- 첫 음절 한 글자 (Welc**o**me, Cur**a**ting, **G**athering)
- 단어의 일부 (in **in**spiration, su**g**gestions)
- 추상명사 통째로 (refinement, balance, allure, grace)

---

## 부록 — Cormorant Garamond + Inter 임포트

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400;1,500&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
```

```css
:root {
  --font-display: 'Cormorant Garamond', 'Times New Roman', serif;
  --font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}
```

---

## 부록 — 컬러 토큰 (CSS Variables)

```css
:root {
  /* 잉크/크림/페이퍼 */
  --c-ink: #1a1815;
  --c-ink-soft: #3a352e;
  --c-cream: #ece6d8;
  --c-cream-grey: #9e9a92;
  --c-paper: #f7f3eb;

  /* 시네마틱 dusk */
  --c-night-1: #1c2332;
  --c-night-2: #7a7785;
  --c-night-3: #c2a48a;
  --c-night-4: #4a3a30;

  /* Quote (브라운 보케) */
  --c-quote-bg: #3a2a1c;
  --c-quote-bg-2: #1a0e08;

  /* 이징 */
  --ease-soft: cubic-bezier(.4, 0, .2, 1);
  --ease-out-expo: cubic-bezier(.16, 1, .3, 1);
}
```

이 토큰들을 본인 사이트 CSS 변수에 옮긴 다음 컴포넌트에서 `color: var(--c-ink)` 식으로 참조하면 모드 전환·다크모드 확장이 쉬워짐.

---

## 적용 순서 추천

1. **부록 (폰트·컬러 토큰)** 먼저 → 디자인 시스템 베이스
2. **Prompt A (Welcome 애니)** → 첫인상의 슬로우 모션
3. **Prompt B (2단계 신 전환)** → 핵심 사용자 흐름
4. **Prompt C (손그림)** → 로딩 신의 시그니처
5. **Prompt D, E, F** → 우상단 3개 패널
6. **인용구·카피 톤** → 마지막 마감
