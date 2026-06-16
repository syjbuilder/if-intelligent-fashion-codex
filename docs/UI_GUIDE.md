# UI 디자인 가이드

> **이 문서는 IF의 유일한 살아있는 운영 디자인 스펙(operational design spec)이다.**
> harness 워크플로우가 UI 작업의 기준으로 읽는다. 디자인이 바뀌면 **이 문서를 갱신한다.**
>
> 기준 시안: `디자인/if-homepage-v0.7.html` (Landing Long-form, v0.7.3까지 누적 — Typography 7원칙 재설계 + 스크롤 모션).
> **2026-06 디자인 보강 패스(v0.8)부터는 구현 코드(`src/`)가 기준선이다** — 시안 HTML은 v0.7.3에서 동결.
> v0.8 변경: Ink Violet accent + 히어로 마네킹 실사 로테이션 + 한 화면 섹션 리듬 + SectionHeader/px-gutter 토큰 통일 (이 문서에 반영됨).
> 이전 시안(v0.0~v0.6)은 `디자인/archive/`에 보관 (참고만, 변경 안 함).
> 디자인 탐색·의사결정 기록(어떻게 여기까지 왔는지)은 `디자인/I.F 디자인 계획 v0.0.md`(archive)에 있다.

## 디자인 컨셉 & 원칙

컨셉: **Editorial AI Studio** — 패션 에디터의 작업실 같은 AI 스타일 디렉터.

1. **AI는 조용하게, 룩은 감각적으로, 상품은 명확하게.** AI를 기술 데모로 과시하지 않고
   브랜드 경험을 돕는 조용한 레이어로 둔다.
2. AI 챗봇보다 감각적 / 일반 쇼핑몰보다 덜 복잡 / Pinterest보다 구매에 가까움.
3. 모든 결과 화면은 한국 20-30대 여성 데일리 패션을 기준으로 한다. 룩 카드는 "예쁜 이미지"보다
   "이 조합을 실제로 찾을 수 있겠다"는 감각을 우선한다.

## 화면 구조 (v0.7 — 단일 HTML, 4-tier routing)

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
| `--accent` | `#49476e` | 포인트 컬러 (**Ink Violet**, v0.8 갱신 — 사용자 결정). 페이지당 ≤2회. *v0.7.0 `#6a6234` 다크 올리브 → v0.7.1 `#4a2e16` 에스프레소 브라운 → v0.7.2 `#3d4f6b` muted slate → v0.8 `#49476e` ink violet(보라 기운의 에디토리얼·하이패션 무드, 20-30 여성 타깃).* |
| `--accent-rgb` | `73, 71, 110` | glass alpha 합성용. `.cta-accent` 배경 `rgba(var(--accent-rgb), 0.55)`. |
| `--accent-glow-rgb` | `118, 114, 172` | 다크 신 글로우용 밝은 변주 (v0.8 신규, `#7672ac`). hero 배경·scrim radial에 사용. **accent 교체 시 tailwind `accent` + 이 두 변수 + HowItWorks step-num raw hex(4곳)를 함께 갱신.** |

- v0.6의 `--sage`, `--stone`, `--quote-a`, `--quote-b`, **`--rose`** 토큰은 전부 삭제. rose 톤이 배경에 깔리는 느낌이 사용자분 시선에 거슬려 중성 팔레트로 전환. v0.7.2에서 다시 한 단계 — 에스프레소 브라운까지 따뜻한 잔여 톤을 muted slate로 통일.
- 다크 신 배경(Hero / Auth / Loading): 동일한 다크 슬레이트 그라디언트 공유 — `radial(rgba(61,79,107,0.18)) + radial(rgba(0,0,0,0.68)) + linear(#0a0c12 → #1e2733 → #0a0c10)` + grain 텍스처. v0.7.2까지의 워밍 브라운(`rgba(180,140,88) + #0b0908→#1b140f`)에서 전환. "잠시 멈춤·기다림"면이 한 톤으로 통일.
- **결과 carousel**: 룩별 배경 톤 토글 폐기. 3 슬라이드(Office/Date/Sport) 모두 `var(--paper)` 단일 배경 — 옷 SVG는 ink stroke으로 또렷이 보임. 룩 구분은 슬라이드 메타 텍스트와 가먼트 SVG 형태로만.
- **Explore/Curated/Saved 카드**: tone-office (베이지·웜드 그레이) / tone-date (초콜릿·카멜) / tone-sport (다크 부라운·차콜). 카드는 룩의 무드를 표현하는 콘텐츠이므로 톤 다양성 유지 — 페이지 UI 크롬(다크 신·CTA·dock·강조 워드)만 슬레이트 통일.
- **랜딩 hero (v0.8 — 마네킹 실사 레이어 합성)**: 레이어 순서 ① `bg-hero-dark` 3-layer 그라디언트(글로우는 `rgba(var(--accent-glow-rgb), 0.18)`) ② `.hero-figure`(z1) — 좌측 `clamp(320px, 42vw, 580px)` 마네킹 룩 실사 스택, 우측 가장자리 `mask-image` 페이드 ③ `.hero-scrim`(z2) — 좌(0.30)→우(0.94) 어두워지는 가로 그라디언트 + 좌상(18% 30%) accent 글로우 + grain ④ 텍스트/CTA(z10). 모바일(≤900px)은 figure 풀블리드 + 균일 다크 베일. *v0.7의 글래스 룩 패널 5개(`.hero-lookbook`)는 실사 레이어가 역할을 대체하며 제거.*
- 랜딩 섹션별 톤: hero=다크+실사, how-it-works=페이퍼, curated-preview=페이퍼(동일 면), footer=ink. **섹션 사이 그라데이션 zone 없음**. **한 화면 리듬(v0.8)**: how-it-works·curated-preview는 `min-h-[100svh]` + flex 세로 센터링으로 각 섹션이 약 한 화면에 수렴 — 전체 페이지 scroll-snap은 도입하지 않음(짧은 화면 콘텐츠 갇힘·mix-blend topbar 플리커 회피).

### 배경 ↔ 텍스트 궁합 매트릭스

| 배경 | 1차 텍스트 | 2차 텍스트 | 캡션·메타 |
|------|-----------|-----------|-----------|
| `--paper` | `--ink` | `--ink-soft` | `--muted` |
| `--cream` | `--ink` | `--ink-soft` | `--muted` |
| `--ink` 다크 단색 | `--white` | `rgba(255,255,255,0.7)` | `rgba(255,255,255,0.5)` |
| Hero/Auth/Loading 다크 슬레이트 | `--white` | `rgba(255,255,255,0.7)` | `rgba(255,255,255,0.5)` |
| Date 카드 (다크 초콜릿·카멜) | `#f3eee2` warm off-white | — | — |
| Sport 카드 (다크 부라운·차콜) | `#f3eee2` | — | — |
| Office 카드 (라이트 베이지) | `--ink` | — | — |

- 워밍 화이트 `rgba(251,250,242,...)`(v0.7까지 사용)는 v0.7.3에서 중성 화이트 `rgba(255,255,255,...)`로 일괄 교체. 페이지 톤 일관성 — 다크 신은 슬레이트, 텍스트는 순수 화이트.

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

### 섹션 헤더 단일 패턴 + 가로 거터 (v0.8)

- **`SectionHeader` 컴포넌트**(`src/components/ui/SectionHeader.tsx`)가 유일한 섹션 헤더 패턴:
  eyebrow(`t7` 800 uppercase tracking 0.18em) + 제목(`t2`, compact 변형은 `t3`, 800) + 서브카피(`t4`, 좌측 정렬, max 46ch).
  적용: HowItWorks·CuratedPreview·ExploreScene(h1)·HistoryOverlay(h1 compact). ad-hoc `text-[58px]`/`text-[30px]` 같은 px 크기 금지 — t1~t8 토큰만.
- **가로 거터 표준**: 모든 페이지/씬 컨테이너는 `px-6 md:px-gutter`(= 34px, tailwind `spacing.gutter`). `px-[34px]`/`px-[52px]`/`px-7` 혼용 금지.

### 정렬·강조 규칙

- **3줄 이상 본문은 좌측 정렬 강제** (7원칙 §2). `section-sub`, `step-desc`, `footer-affiliate`,
  `auth-fineprint`, `modal-doc` body, `slide-desc`, `bag-copy` 등 multi-line body 일괄.
- 1~2줄 헤드라인·CTA 라벨·eyebrow·메타데이터는 섹션 안에서 통일된다면 center/left 모두 허용.
- **강조 패턴은 3개만**: ①Bold(400 → 800 한 단어) ②Color(`var(--accent)` 한 단어, 페이지당 ≤2회) ③Size(hierarchy 토큰 차이). 그 외 (italic, scaleX, rotate, underline, 형광, 박스) 일체 금지.
- italic 0건: `<em>`/`<i>`/`font-style: italic` CSS 시안 안에 0 hit.
- 폰트 자체 비율 존중: `transform: scaleX(0.94/0.95)` 모두 제거 (v0.6 → v0.7).

## 컴포넌트 (v0.7 실제 값)

- **CTA 버튼 (`.cta`)**: `inline-flex`, **min 200×56px** (모바일 터치, 7원칙 §7), `border-radius: 999px`(pill),
  border 1px currentColor, hover 시 `translateY(-2px)` + `rgba(255,255,255,0.18)` glass 톤.
  - `.cta-dark` 변형 = light 섹션용 다크 ink 배경.
  - `.cta-accent` 변형 = **ink violet 글래스** (v0.8 색 갱신). `background: rgba(var(--accent-rgb), 0.55)` + `backdrop-filter: blur(14px) saturate(1.1)` + `border: 1px solid rgba(255,255,255,0.18)` + 부드러운 box-shadow. hover 시 alpha 0.72. **페이지당 최대 1개** 핵심 전환 CTA(Get Started)에만.
- **브랜드 마크 (`.brand strong`)**: `IF` 두 글자 (점 제거), `font-size: 24px`, `font-weight: 800`,
  `letter-spacing: -0.04em` (loiseau식 타이트한 lockup). v0.6의 `I.F` Playfair 500 30px → 변경.
- **랜딩 topbar (`.landing-topbar`, v0.7.2 신규 위치)**: `<body data-page="landing">` 직속 (`.landing` 섹션 바깥). `position: fixed; mix-blend-mode: difference; color: #ffffff`. 다크 영역에선 흰색 그대로, 페이퍼 영역에선 자동 검정으로 반전. *왜 body 직속인가 — `.landing`이 `z-index:1`로 자체 stacking context를 만들어서 그 안에 두면 형제 섹션(`.how-it-works` 등) 위에서 difference가 작동 안 함.* studio·auth·history 진입 시 `display: none`.
- **knot SVG 장식 (`<svg class="knot">`)**: brand-strip, auth-card, loading-wrap 3곳에서 제거 — italic 제거와 함께 Editorial 장식 일관성 차원.
- **프롬프트 도크 (`.dock`)**: pill(`999px`), `width: min(690px, 86vw)`, 48px 원형 `.dock-btn`
  + `.dock-input`(h48, 15px). 슬라이드 톤에 따라 `.dock.cream`/`.dock.dim`. **v0.7.3 색감**: 기본 background `rgba(13, 16, 22, 0.58)` cool slate dark, `.dock.dim` `rgba(40, 50, 65, 0.46)` 슬레이트. 이전 워밍 `rgba(17,15,13,0.54)` / `rgba(76,60,46,0.42)` 폐기.
- **Explore 검색바 (v0.8 — "질문이 곧 무대")**: 풀블리드 sticky 스트립 폐기. `PromptDock variant="search" size="lg"`(input h-14·`t4`, 버튼 56px)를 **헤딩 직하 `max-w-[760px]` 블록**에 두고, sticky(`top-[72px]`)는 도크 pill 자체만 — 셸은 공용 `.glass-search` + `border-line`(스크롤 위에서 자체 글래스로 떠 보임 방지). 시즌 칩은 도크 바로 아래 non-sticky. 입력창 폭을 헤딩 measure에 묶어 "따로 노는" 부유감을 제거한다.
- **칩 (`.chip`)**: `padding: 8px 14px`, `999px`, 12px. 기본은 다크 배경용(반투명 흰).
  라이트 배경 변형은 selector specificity 강화 — `.chip.refine-chip`·`.season-prompts .chip`
  (각각 0,0,2,0)으로 base를 이김 + `backdrop-filter: none` 명시 + 솔리드 `#ffffff` 배경.
- **Explore 카드 (`.explore-card`)**: `aspect-ratio: 3/4`, 룩별 톤 그라디언트 + 가먼트 SVG,
  `border-radius: 4px`, 등장 stagger(`cardIn`). Explore 12개 / curated-preview 6개.
- **결과 carousel**: 풀블리드, 박스 경계 없음. `.carousel-nav`는 상단 중앙(topbar 아래),
  버튼 34px. 키보드 ← → 이동. 슬라이드별 `slide-meta`(태그·타이틀·설명) + 액션 버튼.
- **상품 패널 (`.product-panel`)**: v0.7.3에서 워밍 `rgba(255,250,242,0.68)` → 중성 `rgba(255,255,255,0.68)`. `.panel-copy`/`.product-item small` 워밍 회색(`#776f66`·`#7b746b`·`#6f685f`) → 슬레이트 회색 `#5a5f68` 일괄.
- **상품 드로어 (`.drawer-bag`)**: 슬라이드별 `View products` CTA(우상단 고정)로 우측 슬라이드 인.
  룩별 4개 카테고리 상품 카드 + ₩ 가격. **모바일에서는 하단 바텀시트**(`translateY`, grab handle).
- **랜딩 hero kicker**: v0.7.3 카피 갱신 — "AI Lookbook / Seoul Daily Wear" → **"Only AI Lookbook / Built for your day"**. 지역(Seoul) 마커 제거, 명시적 차별화(Only) + 개인화(your day) 강조.
- **랜딩 hero title**: v0.7.3에서 `background-clip: text` 그라데이션 텍스트 폐기 → 솔리드 `var(--white)`. *.reveal-words split-word reveal과 충돌해 단어가 안 보이던 이슈 해결.* v0.7.1.2 그라데이션은 이미 매우 옅었기에 시각 손실 거의 없음.
- **랜딩 How it works**: 3-step **풀폭 단일 컬럼 (v0.7.2 재정렬)** — SectionHeader + steps 좌측 시작선 정렬. 각 step grid `88px | 1fr | 200px`. 큰 number(01/02/03)는 `t2` + accent 색(raw hex — 워드 강조 ≤2회 카운트에서 제외하는 컨벤션), step 제목은 `t3`. v0.8: `min-h-[100svh]` 센터링으로 한 화면 수렴(py-20, GarmentSvg 132px). 카드 그리드 아님.
- **랜딩 Curated preview (v0.8 — 가로 룩북 레일)**: 룩 6장을 3×2 세로 그리드 대신 **한 줄 가로 스크롤 레일**로 — `overflow-x-auto` + `snap-x snap-mandatory`, 카드 폭 `clamp(232px, 21vw, 300px)`. 룩북을 넘겨보는 에디토리얼 무드 + 섹션이 한 화면에 수렴. 쇼핑몰 그리드-first 안티패턴 회피와도 정합.
- **Site footer**: 짙은 인크 톤. 브랜드 + 이용약관/개인정보/문의 링크 + **어필리에이트 고지** + ©.
- **약관/개인정보 모달 (`.modal-doc`)**: 풀스크린 dim + 페이퍼 톤 카드, 내부 스크롤.
  이용약관 6섹션 / 개인정보처리방침 8섹션.
- **auth-screen**: **다크 슬레이트 그라디언트 (v0.7.3 갱신)** + 중앙 카드 + 소셜 3버튼 (Google 화이트 / Kakao `#FEE500` / Naver `#03C75A`). 이전 워밍 브라운 그라디언트(`rgba(180,140,88) + #0b0908→#1b140f`) 폐기.
- **history-page (Saved Looks)**: 로그인 시 `saved-grid`(저장 룩 카드, gap 3.5 — curated와 동일), 비로그인 시 `history-gate`
  (가입 유도 — 헤드라인 + sample 룩 흐림 + CTA). 헤더는 SectionHeader compact(eyebrow `t7` "Atelier" + h1 `t3` "Saved Looks") — v0.8에서 eyebrow t8 → t7로 통일.
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
- **`.reveal-words` (v0.7.2 신규)**: 텍스트를 단어 단위 span으로 분해 후 `overflow:hidden` wrap 안에서 `translateY(110% → 0)` 60ms stagger 슬라이드 업. `<strong class="accent">` 같은 인라인 요소는 단어 1개 단위로 보존. 적용: hero-title, how-it-works headline, curated headline. *v0.7.3에서 `.word { padding-bottom: 0.18em; margin-bottom: -0.18em }`로 descender 보존(g·y·p 잘림 방지).*
- **`.section-in` (v0.7.3 신규, 섹션 진입 stagger)**: `.how-it-works`·`.curated-preview`·`.site-footer` 자체를 별도 `sectionObserver`로 관찰 (`threshold: 0.15, rootMargin: 0 0 -10%`). 진입 시 내부 콘텐츠(`.step`·`.explore-card`·`.footer-brand/links/affiliate`)가 transition-delay stagger로 fade+translateY. v0.7.2의 42vh `.page-fade` 그라데이션 zone을 대체 (사용자 피드백 — 그라데이션 영역 과대).
- **히어로 마네킹 로테이션 (v0.8 신규, `HeroFigure`)**: 7장 crossfade 스택, `HERO_ROTATE_MS = 2400ms` 간격(사용자 요구 "약 2초"). 전환 = opacity 880ms + `rotateY(16deg)→0` + `scale(1.06)→1` 1100ms(ease-expo, perspective 1400px) — "도는 느낌". 이미지에 `saturate(0.94) brightness(0.92)` 필터로 다크 신과 톤 정합. `prefers-reduced-motion`이면 첫 장 고정, `document.hidden`이면 인터벌 정지. 텍스트 변형 금지 원칙(7원칙 §3)은 텍스트에만 적용 — 이미지 레이어 rotateY는 허용.
- easing: `--ease: cubic-bezier(0.22,1,0.36,1)`, `--ease-out-expo: cubic-bezier(0.16,1,0.3,1)`.
- 로딩 신은 도시/건축 라인이 아니라 패션 작업 언어(옷걸이 가먼트 라인업) 선형 애니메이션.
- 스케일되는 stroked SVG는 `vector-effect: non-scaling-stroke`로 선 굵기 일정 유지.

## 모바일 반응형

- 브레이크포인트: `@media (max-width: 768px)` + `(max-width: 480px)`.
- `drawer-bag`은 우측 슬라이드 → **하단 바텀시트**(`translateY`)로 전환.
- carousel slide-meta는 가먼트 아래로 stack, refine chips는 가로 스크롤.
- Explore/Saved/curated 그리드는 2열(480 이하 1열). footer-grid는 단일 컬럼.
- 약관 모달은 모바일에서 풀스크린.

## 정적 룩 이미지 파이프라인 (v0.8 신규)

- 원본(고해상 PNG, 얼굴 없는 마네킹 전신 룩) → `node scripts/build-look-images.mjs [원본폴더]` →
  `public/looks/<slug>.webp` (**840px 너비, WebP q80**, 장당 ~20-40KB). 변환 결과물을 git에 커밋한다.
- 목록·메타데이터는 `src/lib/hero-looks.ts` (`HERO_LOOKS`: src/alt/label). 소비는 `next/image`
  (`fill` + `sizes`, 첫 장만 `priority` — LCP), 장식 레이어는 컨테이너 `aria-hidden`.
- 품질 기준은 CLAUDE.md AI 룩 기준과 동일: 전신 착장 가시성, 한국 20-30대 여성 데일리 패션.
  사람 얼굴·피부 마커가 보이는 원본은 쓰지 않는다 (ADR-006).

## 안티패턴 — 하지 마라

| 금지 사항 | 이유 |
|-----------|------|
| italic으로 단어 강조하기 | weight·color·size로만 강조한다 (v0.7 7원칙 §1·§3) |
| `transform: scaleX/rotate`로 폰트·요소 인위 변형 | 폰트 자체 비율 존중. loiseau 영향. |
| 포인트 컬러를 페이지당 3회 이상 사용 | 절제될수록 강조가 살아난다. accent ≤ 2회 강제. |
| 따뜻한 베이지·rose·sage·wine 톤이 배경에 깔리는 것 | v0.7에서 중성 오프화이트·중성 회색·다크 카멜로 통일. |
| 워밍 브라운·에스프레소 톤이 다시 등장하는 것 (rgba 180,140,88·17,15,13·76,60,46·#776f66·#7b746b 등) | v0.7.2~v0.8에서 페이지 전체 UI 크롬을 **accent 단일 톤(현 Ink Violet #49476e)**으로 통일. accent·CTA·dock·다크 신·강조 워드가 모두 차분한 한 톤. (룩 카드의 tone-date/sport 가먼트 콘텐츠는 무드 표현이므로 예외.) |
| weight 500·700 사용 | weight 3단(400/600/800)만 허용. |
| 일반 쇼핑몰처럼 상품 그리드가 먼저 보이는 구조 | IF는 룩 보드가 먼저 보여야 함 |
| 범용 AI 챗봇처럼 채팅창만 강조되는 구조 | 스타일 디렉터에게 요청하는 느낌이어야 함 |
| 카드가 과도하게 많은 SaaS 랜딩 페이지 | 브랜드 감성이 죽음 (PRD §9.1 — How it works는 카드 그리드 X) |
| 베이지/핑크 계열만 반복되는 단조로운 패션몰 느낌 | 톤이 진부해짐 |
| 감성 이미지는 좋은데 상품 연결이 약해 보이는 결과 화면 | I.F의 승부처는 룩→상품 연결 |
| 너무 많은 필터로 첫 사용을 무겁게 만드는 구조 | 탐색 피로 가중 |
| 결과 카드에 텍스트가 패션 이미지보다 강하게 보이는 것 | 타이틀·카운터 비중 축소 유지 |
| 상반신 클로즈업·하의 잘림·런웨이/코스튬풍 룩 이미지 | 상품 매칭 불가 = 실패 결과 |
| 사람 사진·인종/지역 마커가 드러나는 이미지 | ADR-006 — 얼굴 없는 마네킹 실사(v0.8 히어로)는 허용, 사람 얼굴·피부 마커는 금지 |
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

## Variant B 랜딩 (다크+코랄, `/` · `/studio`)

PR #30에서 Variant B를 메인으로 승격, 이후 리디자인으로 키네틱 에디토리얼 방향 확립(trionn·magnific 레퍼런스, `디자인/explorations/reference-analysis.md`). A·baseline(라이트, `/a`·`/baseline`)과 토큰·구조가 분리된 포크다.

- **토큰**: `b-ink #040508`(base) · `b-surface #11131a`(카드) · `b-cream #e6e4e2` · `b-accent #f66950`(코랄, 단일 액센트) · `b-light #d8d8d8`(텍스트) · `b-line rgba(216,216,216,.14)`(divider).
- **히어로**: 이미지 없는 텍스트 전용(ADR-018 개정). 헤드라인=RevealWords 단어 스태거 + CoralUnderline. 1화면 핏(축소 clamp + 패딩 축소).
- **히어로 인트로(HeroLogoIntro)**: 베벨 다이아몬드(45° 회전 사각형 외곽선을 상단 꼭지점에서 **시계방향 두꺼운 선으로 드로우** + 3D facet 광/명암 + 가운데 큰 IF)를 **히어로 우측 절반 중앙**에서 먼저 재생(~1s) 후 좌측 헤드라인 공개. 전체화면 오버레이(구 BrandIntro)는 폐기 — 세션 게이트 없이 매 진입 인라인 재생, `prefers-reduced-motion`이면 즉시 정적. 좌측 컬럼은 항상 마운트(opacity gate)로 SSR/aria 보존.
- **ServiceIntro**: 핀 고정(`h-[260vh]`+`sticky`) + 코랄 라인 성장 + 3블록 **누적 리빌**(progress 0.6에 완료·이후 또렷이 유지, 끝에 상상하면/만들어지고/입을 수 있다 모두). 우측 절반 중앙에 스크롤 동기 **PromptSketchCard**(텍스트 직후 프롬프트 타이핑 → 가먼트 stroke 드로우 → 상품 칩). reduced-motion=정적 스택 + 카드 최종 상태.
- **Curated("Pick a look to begin")**: magnific식 균일 3×2 이미지 그리드(가로 스크롤 폐기) + trionn "+" 코너 + 호버 코랄 라인 + whileInView 스태거. 아이브로우 코랄 "Start here", 스튜디오 링크는 항상 보이는 코랄 글래스 칩.
- **로그인(AuthOverlay dark)**: 스포트라이트 배경(`.bg-b-auth`) + 글래스 카드(`.b-auth-glass`). Kakao `#FEE500`·Naver `#03C75A` 브랜드색 락. light 톤(A·baseline) 불변.
- **텍스트 모션**: RevealWords(헤드라인) + fadeUp/whileInView(본문·아이브로우) + CoralUnderline(핵심 헤딩 1회). 전부 `reducedMotion="user"`(MotionProvider) 존중.

### 액센트 예산(원칙1)의 B 적용
"accent ≤ 2/page"는 **코랄 텍스트 단어 강조** 기준이다(스모크 테스트가 `.text-accent` 단어 카운트, 구조적 액센트 제외 관례 동일 적용). B에서:
- **코랄 단어 = 2**: 히어로 아이브로우(`Intelligent Fashion`) + CuratedRail 아이브로우(`Start here`). 히어로 "imagine" 코랄 단어는 폐기(CoralUnderline 모티프로 대체)해 예산 유지.
- **구조/모티프 코랄(단어 아님 — 예산 밖, 절제 사용)**: CTA fill, ServiceIntro 코랄 라인, CoralUnderline(히어로 1회), "+" 코너 글리프, 로그인 글로우, 히어로 인트로 IF 로고/코너, **스튜디오 nav 칩**.
- B 페이지엔 `.text-b-accent` 개수 자동 가드를 두지 않는다("+" 장식 글리프가 카운트를 왜곡). 필요 시 헤딩 한정 스코프로만.
