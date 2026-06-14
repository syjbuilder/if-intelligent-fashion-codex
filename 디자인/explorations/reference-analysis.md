# 레퍼런스 프론트엔드 심층 분석 — magnific.com · trionn.com

> 목적: Variant B(레퍼런스 주도 재설계)의 기준 문서 + Variant A 차용 항목 근거.
> 방법: PO가 두 사이트를 "웹페이지 전체"로 저장 → 실제 CSS/HTML 직접 추출(추측 아님).
> 저장본: `C:\Users\sjs18\OneDrive\Desktop\{Magnific..., TRIONN...}.html` + `_files\`.
> 작성 2026-06-14. **이 문서는 Variant B 착수 전 PO 검토·승인 게이트다.**

---

## 0. ui-ux-pro-max 스킬 상태

- 현재 세션에 **미설치**(available skills 목록에 없음) → **폴백 모드**: 아래 레퍼런스 CSS 실측값 + I.F 제약으로 진행.
- PO가 `/plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill` 실행 시: B 팔레트를 161 팔레트와 교차검증, 타입 스케일·폰트 페어 후보, 안티패턴 체크리스트를 받아 "skill-derived" 절을 이 문서에 추가하고 채택/기각을 명시한다.

---

## 1. MAGNIFIC (magnific.com) — "정제·다채로운 친근 SaaS 밸런스"

스택: Next.js + Tailwind. PO 호평 포인트 = 폰트/크기/배치/색/스크롤/애니메이션 **밸런스**.

### 1.1 타이포그래피
| 역할 | 토큰 | 폰트 | 비고 |
|---|---|---|---|
| 본문 | `--font-sans` | **Geist** (ss02 on), fallback Inter | 기하학적 그로테스크, 깔끔 |
| 디스플레이 | `--font-alternate` | **Klarheit** (self-hosted @font-face, weight **800/900/950** + `KlarheitPlakatFP` 포스터컷) | ⚠️ 900/950 = I.F 400/600/800 규칙 충돌 → 도입 시 신규 ADR |
| 모노 | — | ui-monospace | |

- 타입 스케일(px 실측): **8 10 12 13 14 15 17 20 24 32 36 40 44 48**.
- line-height: **1.15 / 1.25 / 1.5 / 1.6 / 1.75** (헤드 타이트, 본문 1.5~1.6 여유) — 밸런스의 핵심.

### 1.2 색
- 시그니처 그라디언트(**장식·배경 한정**): **#F38334 오렌지 → #DA2E7D 핑크 → #6B54C6 퍼플**.
- Primary 블루: **#4f69f2** (hover #344ce7 → active #2236d2).
- 중립 14단: #fafafa #f5f5f5 #ececec #e3e3e3 #dbdbdb #bfbfbf #9c9c9c #737373 #616161 #424242 #353535 #2b2b2b #1a1a1a #101010 #000.
- 카테고리 멀티컬러 + **파스텔 틴트 페어**: 코랄 #f66950/#fef0ed · 그린 #17cb8d/#e7f5f0 · 골드 #e7ad16/#fdf8ea · 블루 #90abfa/#edf0fd · 틸 #00cdc6 · 퍼플 #8566dc · 옐로 #ffc904.

### 1.3 레이아웃 토큰
- border-radius: **2 / 3 / 4 / 6 / 8 / 10 / 16 / 24 / 9999(pill)** px.
- 컨테이너 max-width: ~**1096 / 1400 / 1440 / 2060** px.
- 브레이크포인트: 360 / 480 / 640 / 768 / 1024 / 1280 / 1536 / 1920 (**360·480·1920가 커스텀**, 나머지는 Tailwind 기본).
- 그림자: base `0 0 60px rgba(34,34,34,.25)` (넓은 soft glow) · xs `0 1px 2px rgba(55,73,87,.1), 0 2px 5px rgba(55,73,87,.15)`.

### 1.4 모션 테이블 (CSS keyframe 실측)
| 인터랙션 | duration | easing | framer-motion 매핑 |
|---|---|---|---|
| slideup-enter | .4s | ease-out | `whileInView` y:16→0, opacity, ease:"easeOut" |
| fade-in | .2s | ease-out | `animate` opacity |
| overlayShow | .15s | cubic-bezier(.16,1,.3,1) | 모달/패널 진입 |
| accordion-down | .1s | ease-out | 아코디언 height |
| scroll-horizontal | 20s | linear infinite | 마퀴 |
| 공통 트랜지션 | — | cubic-bezier(.4,0,.2,1) | 기본 |
- 캐러셀 = **keen-slider** (Swiper 아님).
- GSAP 같은 스크롤 핀/스크럽은 CSS에 없음 → 해당 영역만 내 판단 재현.

### 1.5 → 차용 매핑
- **A 차용**: 타입 스케일/line-height **리듬** + soft-glow(`0 0 60px`)만. *패밀리(Geist/Klarheit)·멀티컬러는 차용 안 함.*
- **B 골격**: 간격·스케일 시스템 + soft-glow. **단, 카테고리 카드그리드/툴타일 IA는 차용 금지**(I.F 룩 보드 우선 — CLAUDE.md/UI_GUIDE).

---

## 2. TRIONN (trionn.com) — "반전형 따뜻한 듀오톤 + 키네틱 에디토리얼"

스택: Next.js + Turbopack + Tailwind v4. PO 호평 포인트 = 다이나믹 애니메이션 + 눈에 띄는 UI 컴포넌트.

### 2.1 색 — 2계층 (모노크롬 아님, 따뜻한 반전 듀오톤)
- **@theme(Tailwind v4)**: 다크 페이지 base **#040508** · off-black ink `--color-black:#272727` · `--color-cream:#e6e4e2`(크림 페이퍼 섹션) · `--color-light-font:#d8d8d8` · `--color-dark-font:#434343` · `--color-grey-light:#9c9c9c` · `--color-grey-line:#434343` · `--color-cream-line:#d8d8d8`.
- **장식 `--pl-*`**: #000 / #fff / `--pl-panel-gray:#c8c8c8` / `--pl-line-gray:#434343`.
- 핵심: 다크 섹션 ↔ 크림 섹션을 오가며 글자/배경이 **반전**되는 듀오톤. 포인트 컬러는 절제(거의 무채 + 1포인트).

### 2.2 타이포그래피
| 역할 | 토큰 | 폰트 |
|---|---|---|
| 디스플레이 | `--pl-display` | **Bebas Neue** (콘덴스드 대문자) |
| 본문 | `--font-neue` | **neueHaas** (Neue Haas Grotesk) |
| 세리프 악센트 | `--font-ppeditorial` | **PP Editorial New** (Ultralight) |
| 보조 산세 | `--font-familjen` | **Familjen Grotesk** |
| 모노 | `--font-martian` / `--pl-mono` | **Martian Mono** / Space Mono |

- 디스플레이 clamp 스케일(실측): clamp(3.5rem,5.952vw,5.625rem) · clamp(2.5rem,6.283vw,5.938rem) · clamp(3.5rem,6.349vw,6rem) · **최대 clamp(5rem,9.164vw,10rem)**. tracking 음수 clamp(-.06em ~ -.08em) — 큰 글자 타이트.
- ⚠️ Bebas Neue·Space Mono·Martian Mono는 **한글 글리프 없음** → B에서 영문/숫자 런 한정 + Pretendard 폴백 필수.
- 주의: `clamp(10rem,22vw,17.5rem)`는 **프리로더 로고 폭**이지 font-size 아님.

### 2.3 레이아웃·이징 토큰
- `--spacing:.25rem` (4px 베이스). radius `--radius-xs .125 / sm .25 / md .375 / lg .5 rem`.
- 이징: `--ease-in cubic-bezier(.4,0,1,1)` · `--ease-out cubic-bezier(0,0,.2,1)` · `--ease-in-out cubic-bezier(.4,0,.2,1)` · **`--ease-soft cubic-bezier(.22,1,.36,1)`** (= I.F 기존 `--ease`와 동일 — 시너지).
- 컨테이너 clamp(320px,38vh,460px) 등 뷰포트 연동.

### 2.4 모션/컴포넌트
- **GSAP** ScrollTrigger pin/scrub(스크롤 연동 타임라인) + **Swiper** 캐러셀.
- `--pl-corner-plus-offset:calc(-6px - 6.5px)` → **"+" 코너 마커**(블루프린트/기술 도면 모티프).
- "touch the lines" hover 마이크로 인터랙션, keyframe: arrowPulse · shake · successPulse · ts-borderPulse.
- 기본 트랜지션 `.5s cubic-bezier(.16,1,.3,1)` + `--ease-soft`.

### 2.5 → 차용 매핑
- **A 차용(절제)**: "+" 코너 마커 + 라인/테두리 마이크로 인터랙션, hover/tap 반응.
- **B 골격**: 반전 듀오톤 + 콘덴스드 디스플레이 헤드라인 임팩트 + GSAP식 스크롤 타임라인(framer-motion `useScroll`/`whileInView`로 재현).

---

## 3. 모션 "내 판단" 범위 한정
- CSS에 명시된 keyframe·transition·easing은 **위 테이블대로 매핑**(추정 아님).
- 정적 추출 불가 = **GSAP ScrollTrigger pin/scrub 타임라인뿐** → 그 부분만 내 판단으로 재현하고 이터레이션으로 조정.

---

## 4. Variant A 차용 체크리스트 (4-fix-only 방지, I.F 정체성 유지)
제약: accent ≤ 2/page(Ink Violet 유지), weight 400/600/800, **Inter+Pretendard 유지**(디스플레이 패밀리 교체·scaleX 금지).
- [ ] magnific 타입 스케일/line-height **리듬**을 룩 카드·섹션에 적용(여백 호흡 개선).
- [ ] magnific **soft-glow**(`0 0 60px rgba` 톤다운)를 룩 카드·하단 도크에.
- [ ] trionn **"+" 코너 마커** + 라인 마이크로 인터랙션을 포크 LookCard hover에.
- [ ] 2~3 섹션 한정 `whileInView` entrance reveal(기존 CSS reveal과 공존). **useScroll 패럴랙스 금지**(B 전용).

---

## 5. Variant B 정식 디자인 브리프 (PO 승인 대상)

> 레퍼런스를 **골격**으로 삼아 베이스라인을 버린 재해석. 아래는 실측 기반 제안 — PO 승인 후 확정.

### 5.1 재조정 명제
**trionn = 모션 + 구조/헤드라인 골격, magnific = 간격·스케일·line-height 리듬 + soft-glow.** 두 사이트의 대립 색·폰트를 콜라주하지 않고 한 언어로 통합한다.

### 5.2 색 시스템 (accent ≤ 2/page)
- 다크 에디토리얼 base **#040508** ↔ 크림 페이퍼 섹션 **#e6e4e2** 반전 듀오톤(trionn).
- ink #272727, light-font #d8d8d8, dark-font #434343, line #434343/#d8d8d8.
- **단일 B accent 1색**(Ink Violet 아님 — 차별화). 제안: 따뜻한 **앰버/코랄 계열 1색**(예: #f66950 코랄) — reference-analysis 확정 시 hex 1개 고정. `.text-accent` 1곳 + CTA 1곳 = 2회 이내.
- magnific 그라디언트(#F38334→#DA2E7D→#6B54C6)는 **장식/배경 글로우 한정**(절대 텍스트 색 아님).

### 5.3 타이포 (한글 가능 필수)
- 디스플레이: 콘덴스드 그로테스크 임팩트 — 영문/숫자 런은 콘덴스드 캡스(예: Bebas Neue/Anton류), **한글은 Pretendard Black 폴백**. tailwind fontFamily에 Latin 페이스 뒤 Pretendard 유지.
- 본문: Neue Haas류 그로테스크(또는 Geist) + Pretendard.
- 타입 스케일(px 제안): 본문 16 / 메타 13 / 라벨 12 / 헤드 clamp 28·40·64·88. tracking 큰 글자 음수(-0.04~-0.06em, trionn식).
- 검증: 실제 문자열 "다시 생성 · 상품보기 · 자세히보기"로 한글 렌더 확인.

### 5.4 레이아웃·모션
- spacing 4px 베이스, radius 작게(2~8px) — 기술 에디토리얼 톤.
- 풀 framer-motion: `whileInView` stagger + `useScroll` 패럴랙스 + GSAP식 핀/스크럽 재현. ease `cubic-bezier(.22,1,.36,1)`.
- trionn **"+" 코너 마커/라인** 모티프를 카드·섹션 경계에.

### 5.5 섹션 IA (베이스라인과 **달라야 함**)
- 랜딩: 풀블리드 키네틱 히어로(콘덴스드 헤드라인 + 스크롤 핀) → 가로 스크롤 룩 레일(Swiper/keen식) → "How it works"를 **카드 그리드 아님**(에디토리얼 스텝) → CTA. *베이스라인의 세로 100svh 리듬과 구조적으로 다르게.*
- 스튜디오/상세: A와 동일 기능(프롬프트→룩→상세→상품)이되 B 시각 언어로.

### 5.6 하드 게이트 (위반 금지)
- 룩 보드 우선 / 상품 그리드-first 금지(magnific 카드그리드 IA 차용 금지).
- 얼굴/피부 없음(마네킹), 전신 가시성. mini-action 3패턴(풀 채팅 금지). accent ≤ 2. body 다크 누수 `body:has(.theme-b)` 픽스.

---

## 6. 출처 파일
- Magnific CSS: `_files/fa606be45c518f6e.css` (토큰 정본). 그 외 = 스피너 keyframe + keen-slider.
- TRIONN CSS: `_files/15a8wq.9n_.5n.css`(@theme/Tailwind v4 토큰·이징·폰트), `0wf1gwg29cqjw.css`(--pl-* 장식 + Bebas/Space Mono), `0xt8hh0aijjr~.css`(Swiper).
