# UI 디자인 가이드

> **이 문서는 IF의 유일한 살아있는 운영 디자인 스펙(operational design spec)이다.**
> harness 워크플로우가 UI 작업의 기준으로 읽는다. 디자인이 바뀌면 **이 문서를 갱신한다.**
>
> 기준 시안: `디자인/if-homepage-v0.7.html` (Landing Long-form, 2026-05-26 — Typography 7원칙 재설계).
> 이전 시안: `디자인/if-homepage-v0.6.html` (2026-05-20) 비교용 보존.
> 디자인 탐색·의사결정 기록(어떻게 여기까지 왔는지)은 `디자인/I.F 디자인 계획 v0.0.md`(archive)에 있다.
> 값이 시안과 충돌하면 v0.7 시안의 실제 값이 우선한다.

## 디자인 컨셉 & 원칙

컨셉: **Editorial AI Studio** — 패션 에디터의 작업실 같은 AI 스타일 디렉터.

1. **AI는 조용하게, 룩은 감각적으로, 상품은 명확하게.** AI를 기술 데모로 과시하지 않고
   브랜드 경험을 돕는 조용한 레이어로 둔다.
2. AI 챗봇보다 감각적 / 일반 쇼핑몰보다 덜 복잡 / Pinterest보다 구매에 가까움.
3. 모든 결과 화면은 한국 20-30대 여성 데일리 패션을 기준으로 한다. 룩 카드는 "예쁜 이미지"보다
   "이 조합을 실제로 찾을 수 있겠다"는 감각을 우선한다.

## 화면 구조 (v0.6 — 단일 HTML, 4-tier routing)

`<body data-page="…">` 어트리뷰트로 4개 최상위 화면을 토글한다.

| data-page | 화면 | 성격 |
|-----------|------|------|
| `landing` | 랜딩 (long-form 스크롤) | in-flow scrollable 페이지 |
| `auth` | 로그인/회원가입 | fixed overlay (z 150) |
| `history` | 히스토리/저장 룩 | fixed overlay (z 140) |
| `studio` | AI 워크스페이스 | fixed overlay (z 100) |

- **랜딩**은 일반 스크롤 페이지: `hero → how-it-works → curated-preview → site-footer`. `Get Started`/curated 카드 클릭 시 `body.atelier-ready` 추가 → studio가 fixed overlay로 덮고 body scroll lock.
- **studio** 내부는 `<body data-scene="…">`로 scene 전환: `explore → loading → results`.
- 상태 클래스: `body.atelier-ready`(studio 진입), `body.is-logged-in`(로그인 mock), `body.results-on`, `body.look-{office|date|sport}`(결과 슬라이드 톤 토글).

## 색상 (v0.7 `:root` 토큰 — 중성화)

| 토큰 | 값 | 용도 |
|------|------|------|
| `--ink` | `#1a1a1a` | 주 텍스트 / 다크 배경 (중성 다크) |
| `--ink-soft` | `#4a4a48` | 보조 텍스트 (중성 회색) |
| `--muted` | `#8a8a86` | 캡션·eyebrow·placeholder (중성 미디엄 회색) |
| `--paper` | `#f5f5f3` | 페이지 배경 (중성 오프화이트) |
| `--cream` | `#eaeae6` | 카드/면 배경 (중성 베이지 회색) |
| `--white` | `#fbfbfa` | 다크 위 텍스트 / 최밝은 면 |
| `--line` | `rgba(26,26,26,0.10)` | 구분선 |
| `--accent` | `#4a2e16` | 포인트 컬러 (Espresso Brown). 페이지당 ≤2회. *v0.7.0의 `#6a6234` 다크 올리브 브라운은 녹색 기미가 거슬려 v0.7.1에서 교체.* |

- v0.6의 `--sage`, `--stone`, `--quote-a`, `--quote-b`, **`--rose`** 토큰은 전부 삭제. rose 톤이 배경에 깔리는 느낌이 사용자분 시선에 거슬려 중성 팔레트로 전환.
- 다크 신 배경(Hero / Auth / Loading): 동일한 다크 워밍 그라디언트 공유 — `radial(rgba(180,140,88,0.18)) + radial(rgba(0,0,0,0.68)) + linear(#0b0908 → #2a2018 → #1b140f)` + grain 텍스처 8% opacity. "잠시 멈춤·기다림"면이 한 톤으로 통일.
- **결과 carousel**: 룩별 배경 톤 토글 폐기. 3 슬라이드(Office/Date/Sport) 모두 `var(--paper)` 단일 배경 — 옷 SVG는 ink stroke으로 또렷이 보임. 룩 구분은 슬라이드 메타 텍스트와 가먼트 SVG 형태로만.
- **Explore/Curated/Saved 카드**: tone-office (베이지·웜드 그레이) / tone-date (초콜릿·카멜) / tone-sport (다크 부라운·차콜). 분홍·자주·녹색 톤 전부 unhook.
- **랜딩 hero**: 단색 `#121211` + grain noise만. v0.6의 radial 두 개(rose + sage) + heroDrift 애니메이션 삭제.
- 랜딩 섹션별 톤: hero=다크 단색, how-it-works=페이퍼, curated-preview=페이퍼(동일 면), footer=ink.

### 배경 ↔ 텍스트 궁합 매트릭스

| 배경 | 1차 텍스트 | 2차 텍스트 | 캡션·메타 |
|------|-----------|-----------|-----------|
| `--paper` | `--ink` | `--ink-soft` | `--muted` |
| `--cream` | `--ink` | `--ink-soft` | `--muted` |
| `--ink` 다크 단색 | `--white` | `rgba(251,251,250,0.7)` | `rgba(251,251,250,0.5)` |
| Hero/Auth/Loading 다크 워밍 | `--white` | `rgba(251,251,250,0.7)` | `rgba(251,251,250,0.5)` |
| Date 카드 (다크 초콜릿·카멜) | `#f3eee2` warm off-white | — | — |
| Sport 카드 (다크 부라운·차콜) | `#f3eee2` | — | — |
| Office 카드 (라이트 베이지) | `--ink` | — | — |

카드 가먼트 SVG는 `currentColor` 사용 → 카드 배경 톤에 따라 자동 반전 (다크 카드 = 라이트 SVG, 라이트 카드 = 다크 SVG).

## 타이포그래피 (v0.7 — Mobile UI 7원칙 적용)

폰트 가족·weight·size 토큰을 시스템으로 박제. v0.6의 누적 현행값 위계 → v0.7에서 의도된 토큰
시스템으로 전환.

### 폰트 가족 (단일 산세리프 통일)

- 영문·숫자: `Inter` (Google Fonts, weight 400·600·800)
- 한글: `Pretendard Variable` (CDN)
- 시스템 fallback: `system-ui, -apple-system, BlinkMacSystemFont, sans-serif`
- v0.6의 `Playfair Display`(에디토리얼 세리프) + `Manrope`(본문) 조합 폐기. 7원칙 §5(폰트 가족 1~2개).

### Weight 스케일 (3단 고정)

| 토큰 | weight | 용도 |
|------|--------|------|
| `--w-regular` | 400 | 본문, eyebrow 약, 메타데이터 |
| `--w-semibold` | 600 | sub-headline, 카드 라벨, refine chip |
| `--w-extrabold` | 800 | 헤드라인, CTA, eyebrow uppercase, step-num, 가격 |

- **500/700 사용 금지** (7원칙 §6). Inter 자체에 light/medium/semibold/bold 다 있지만 의도적으로 3단만 노출.

### Size 스케일

| 토큰 | 값 | 용도 |
|------|-----|------|
| `--t1` | `clamp(48px, 7vw, 96px)` | hero title. *v0.7.1.1 — 9vw/128 → 7vw/96으로 축소, 두 줄 wrap 시 viewport 잘림 방지.* |
| `--t2` | `clamp(40px, 5.4vw, 72px)` | 섹션 헤드라인 (How it works / Curated / Gate / Auth / Brand-strip / Slide-title) |
| `--t3` | `clamp(24px, 2.4vw, 32px)` | sub-headline, History title, Bag title, Loading title, Modal-doc title |
| `--t4` | 18px | sub copy 강 (section-sub, footer-tagline) |
| `--t5` | 16px | 본문 — 모바일 최소 (7원칙 §7) |
| `--t6` | 13px | 메타·캡션·refine chip·footer-link |
| `--t7` | 12px | eyebrow uppercase, footer-copy, CTA 라벨 |
| `--t8` | 11px | fineprint (auth-fineprint, modal 등) |

- inline `clamp()` 분산 → 토큰화. hierarchy가 시안 안에서 일관됨 (7원칙 §4).

### 정렬·강조 규칙

- **3줄 이상 본문은 좌측 정렬 강제** (7원칙 §2). `section-sub`, `step-desc`, `footer-affiliate`,
  `auth-fineprint`, `modal-doc` body, `slide-desc`, `bag-copy` 등 multi-line body 일괄.
- 1~2줄 헤드라인·CTA 라벨·eyebrow·메타데이터는 섹션 안에서 통일된다면 center/left 모두 허용.
- **강조 패턴은 3개만**: ①Bold(400 → 800 한 단어) ②Color(`var(--accent)` 한 단어, 페이지당 ≤2회) ③Size(hierarchy 토큰 차이). 그 외 (italic, scaleX, rotate, underline, 형광, 박스) 일체 금지.
- italic 0건: `<em>`/`<i>`/`font-style: italic` CSS 시안 안에 0 hit.
- 폰트 자체 비율 존중: `transform: scaleX(0.94/0.95)` 모두 제거 (v0.6 → v0.7).

## 컴포넌트 (v0.7 실제 값)

- **CTA 버튼 (`.cta`)**: `inline-flex`, **min 200×56px** (모바일 터치, 7원칙 §7), `border-radius: 999px`(pill),
  border 1px currentColor, backdrop blur 제거, hover 시 `translateY(-2px)`.
  - `.cta-dark` 변형 = light 섹션용 다크 ink 배경.
  - `.cta-accent` 변형 = 다크 올리브 브라운 배경 + 흰 텍스트. **페이지당 최대 1개** 핵심 전환 CTA(Get Started)에만.
- **브랜드 마크 (`.brand strong`)**: `IF` 두 글자 (점 제거), `font-size: 24px`, `font-weight: 800`,
  `letter-spacing: -0.04em` (loiseau식 타이트한 lockup). v0.6의 `I.F` Playfair 500 30px → 변경.
- **knot SVG 장식 (`<svg class="knot">`)**: brand-strip, auth-card, loading-wrap 3곳에서 제거 — italic 제거와 함께 Editorial 장식 일관성 차원.
- **프롬프트 도크 (`.dock`)**: pill(`999px`), `width: min(690px, 86vw)`, 48px 원형 `.dock-btn`
  + `.dock-input`(h48, 15px). 슬라이드 톤에 따라 `.dock.cream`/`.dock.dim`.
- **Explore 검색바 (`.explore-search`)**: dock과 동형, explore scene 상단 sticky(`top: 76px`).
- **칩 (`.chip`)**: `padding: 8px 14px`, `999px`, 12px. 기본은 다크 배경용(반투명 흰).
  라이트 배경 변형은 selector specificity 강화 — `.chip.refine-chip`·`.season-prompts .chip`
  (각각 0,0,2,0)으로 base를 이김 + `backdrop-filter: none` 명시 + 솔리드 `#ffffff` 배경.
- **Explore 카드 (`.explore-card`)**: `aspect-ratio: 3/4`, 룩별 톤 그라디언트 + 가먼트 SVG,
  `border-radius: 4px`, 등장 stagger(`cardIn`). Explore 12개 / curated-preview 6개.
- **결과 carousel**: 풀블리드, 박스 경계 없음. `.carousel-nav`는 상단 중앙(topbar 아래),
  버튼 34px. 키보드 ← → 이동. 슬라이드별 `slide-meta`(태그·타이틀·설명) + 액션 버튼.
- **상품 드로어 (`.drawer-bag`)**: 슬라이드별 `View products` CTA(우상단 고정)로 우측 슬라이드 인.
  룩별 4개 카테고리 상품 카드 + ₩ 가격. **모바일에서는 하단 바텀시트**(`translateY`, grab handle).
- **랜딩 How it works**: 3-step 세로 풀폭 — 큰 number(01/02/03, `--rose`) + Playfair 헤딩
  + Manrope 본문 + 라인 드로잉 SVG. 카드 그리드 아님.
- **Site footer**: 짙은 인크 톤. 브랜드 + 이용약관/개인정보/문의 링크 + **어필리에이트 고지** + ©.
- **약관/개인정보 모달 (`.modal-doc`)**: 풀스크린 dim + 페이퍼 톤 카드, 내부 스크롤.
  이용약관 6섹션 / 개인정보처리방침 8섹션.
- **auth-screen**: 다크 워밍 그라디언트 + 중앙 카드 + knot SVG + 소셜 3버튼
  (Google 화이트 / Kakao `#FEE500` / Naver `#03C75A`).
- **history-page**: 로그인 시 `saved-grid`(저장 룩 카드), 비로그인 시 `history-gate`
  (가입 유도 — 헤드라인 + sample 룩 흐림 + CTA).
- **scroll-hint**: hero 하단 chevron + 라벨, `scrollChevron` 무한 애니메이션.
- **menu-tray**: 4항목 — Explore / Recent prompts / Saved Looks / New Prompt + Demo 로그인 토글
  (디자인 확인용, 부트스트랩 단계에서 제거).

## Mini-action 3개 (ADR-009)

V0는 풀 멀티턴 채팅 X. 싱글샷 워크스페이스 위에 3개 mini-action만:

1. **다시 생성** — 결과 카드 위 버튼. 같은 의도로 룩 1-3개 재생성.
2. **정제 칩** — "더 캐주얼하게"·"색 변경"·"가격대 ↓" 등. silent filter 아님 — 클릭 시
   새 conversation turn으로 `runQuery()` 재실행(loading scene 재생).
3. **More Like This** — 각 룩/상품 카드 우하단. 그 룩 기반 변주 3개.

풀 채팅 UI는 V0 도입하지 않는다.

## UI 형태 일반 규칙

- 카드 radius는 8px 이하 기본. pill 형태 액션 요소(CTA, dock, chip)는 `999px`.
- 패션 이미지 영역은 크게, 상품 정보 영역은 밀도 있게.
- 버튼은 명확한 동작 중심. 아이콘은 저장·공유·외부 링크·새 프롬프트 등 명확한 액션에만.

## 애니메이션

- 허용: 느린 이미지 스케일, blur/fade 텍스트 등장(`welcomeIn` 1.1초), 패널 슬라이드,
  카드 stagger reveal(`cardIn`), scene 전환(`explore → loading → results`),
  스크롤 진입 fade-in(`IntersectionObserver` + `.reveal`/`.in-view`).
- easing: `--ease: cubic-bezier(0.22,1,0.36,1)`, `--ease-out-expo: cubic-bezier(0.16,1,0.3,1)`.
- 로딩 신은 도시/건축 라인이 아니라 패션 작업 언어(옷걸이 가먼트 라인업) 선형 애니메이션.
- 스케일되는 stroked SVG는 `vector-effect: non-scaling-stroke`로 선 굵기 일정 유지.

## 모바일 반응형

- 브레이크포인트: `@media (max-width: 768px)` + `(max-width: 480px)`.
- `drawer-bag`은 우측 슬라이드 → **하단 바텀시트**(`translateY`)로 전환.
- carousel slide-meta는 가먼트 아래로 stack, refine chips는 가로 스크롤.
- Explore/Saved/curated 그리드는 2열(480 이하 1열). footer-grid는 단일 컬럼.
- 약관 모달은 모바일에서 풀스크린.

## 안티패턴 — 하지 마라

| 금지 사항 | 이유 |
|-----------|------|
| italic으로 단어 강조하기 | weight·color·size로만 강조한다 (v0.7 7원칙 §1·§3) |
| `transform: scaleX/rotate`로 폰트·요소 인위 변형 | 폰트 자체 비율 존중. loiseau 영향. |
| 포인트 컬러를 페이지당 3회 이상 사용 | 절제될수록 강조가 살아난다. accent ≤ 2회 강제. |
| 따뜻한 베이지·rose·sage·wine 톤이 배경에 깔리는 것 | v0.7에서 중성 오프화이트·중성 회색·다크 카멜로 통일. |
| weight 500·700 사용 | weight 3단(400/600/800)만 허용. |
| 일반 쇼핑몰처럼 상품 그리드가 먼저 보이는 구조 | IF는 룩 보드가 먼저 보여야 함 |
| 범용 AI 챗봇처럼 채팅창만 강조되는 구조 | 스타일 디렉터에게 요청하는 느낌이어야 함 |
| 카드가 과도하게 많은 SaaS 랜딩 페이지 | 브랜드 감성이 죽음 (PRD §9.1 — How it works는 카드 그리드 X) |
| 베이지/핑크 계열만 반복되는 단조로운 패션몰 느낌 | 톤이 진부해짐 |
| 감성 이미지는 좋은데 상품 연결이 약해 보이는 결과 화면 | I.F의 승부처는 룩→상품 연결 |
| 너무 많은 필터로 첫 사용을 무겁게 만드는 구조 | 탐색 피로 가중 |
| 결과 카드에 텍스트가 패션 이미지보다 강하게 보이는 것 | 타이틀·카운터 비중 축소 유지 |
| 상반신 클로즈업·하의 잘림·런웨이/코스튬풍 룩 이미지 | 상품 매칭 불가 = 실패 결과 |
| 사람 사진·인종/지역 마커가 드러나는 이미지 | ADR-006 — V0는 가먼트 SVG + 톤 그라디언트만 |
| WebAssembly 3D·사이트 사운드·커스텀 커서 등 과시형 모션 | "AI는 조용하게" 원칙 위반 |

I.F의 Editorial AI Studio 방향은 Brunello 레퍼런스 기반으로 frosted glass / soft blur를
의도적으로 사용한다 — "backdrop-filter 금지" 같은 범용 안티슬롭 규칙은 적용하지 않는다.

## 레퍼런스

- Brunello Cucinelli Online Boutique AI — 맥락형 프롬프트 바, 조용한 인터랙션, 발견 경험.
- Monks.com / Dogstudio (2026-05 분석) — 타이포·레이아웃 레퍼런스. 상세 분석은
  `디자인/I.F 디자인 계획 v0.0.md`(archive) 참조.
- 시안 진화: v0.3.2(풀스크린 atelier) → v0.4.0(풀블리드 carousel) → v0.4.1(패션 우선 재배치)
  → v0.5(4-tier routing·Explore·mini-action) → v0.6(랜딩 long-form·footer·약관 모달).
  상세는 `디자인/I.F 디자인 계획 v0.0.md` 14·17장.
