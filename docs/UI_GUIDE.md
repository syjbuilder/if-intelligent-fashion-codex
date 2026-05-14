# UI 디자인 가이드

> 출처: `디자인/I.F 디자인 계획 v0.0.md` + 최신 시안 `디자인/if-homepage-v0.4.1.html`.
> 본 문서는 harness 워크플로우가 UI 작업의 기준으로 읽기 위한 압축본이다.
> 값이 충돌하면 v0.4.1 시안의 실제 값이 우선한다.

## 디자인 컨셉 & 원칙

컨셉: **Editorial AI Studio** — 패션 에디터의 작업실 같은 AI 스타일 디렉터.

1. **AI는 조용하게, 룩은 감각적으로, 상품은 명확하게.** AI를 기술 데모로 과시하지 않고
   브랜드 경험을 돕는 조용한 레이어로 둔다.
2. AI 챗봇보다 감각적 / 일반 쇼핑몰보다 덜 복잡 / Pinterest보다 구매에 가까움.
3. 모든 결과 화면은 한국 20-30대 여성 데일리 패션을 기준으로 한다. 룩 카드는 "예쁜 이미지"보다
   "이 조합을 실제로 찾을 수 있겠다"는 감각을 우선한다.

## 안티패턴 — 하지 마라

I.F 고유 기준 (`디자인 계획 v0.0.md` 13장). 면접감 템플릿의 범용 안티슬롭 목록은 그대로
가져오지 않았다 — I.F의 Editorial AI Studio 방향은 Brunello 레퍼런스 기반으로 frosted
glass / soft blur를 의도적으로 사용하므로 "backdrop-filter 금지" 같은 범용 규칙과 충돌한다.

| 금지 사항 | 이유 |
|-----------|------|
| 일반 쇼핑몰처럼 상품 그리드가 먼저 보이는 구조 | I.F는 룩 보드가 먼저 보여야 함 |
| 범용 AI 챗봇처럼 채팅창만 강조되는 구조 | 스타일 디렉터에게 요청하는 느낌이어야 함 |
| 카드가 과도하게 많은 SaaS 랜딩 페이지 | 브랜드 감성이 죽음 |
| 베이지/핑크 계열만 반복되는 단조로운 패션몰 느낌 | 톤이 진부해짐 |
| 감성 이미지는 좋은데 상품 연결이 약해 보이는 결과 화면 | I.F의 승부처는 룩→상품 연결 |
| 너무 많은 필터로 첫 사용을 무겁게 만드는 구조 | 탐색 피로 가중 |
| 결과 카드에 텍스트가 패션 이미지보다 강하게 보이는 것 | v0.4.1에서 타이틀·카운터 비중 축소함 |
| 상반신 클로즈업·하의 잘림·런웨이/코스튬풍 룩 이미지 | 상품 매칭 불가 = 실패 결과 |

## 색상 (v0.4.1 `:root` 실제 값)

| 토큰 | 값 | 용도 |
|------|------|------|
| `--ink` | `#1a1815` | 주 텍스트 |
| `--ink-soft` | `#3b352e` | 보조 텍스트 |
| `--muted` | `#9e978e` | 비활성/캡션 |
| `--paper` | `#f7f3eb` | 페이지 배경 |
| `--cream` | `#ece6d8` | 카드/면 배경 |
| `--white` | `#fffaf2` | 밝은 면, 다크 배경 위 텍스트 |
| `--line` | `rgba(26,24,21,0.12)` | 구분선 |
| `--rose` | `#b94a62` | 포인트 컬러 (Deep Rose) |

- 다크 신 배경: 워밍 그라디언트 `#0b0908 → #2a2018 → #1b140f` + SVG 그레인 텍스처 8% opacity.
- 결과 carousel은 룩별로 배경 톤이 바뀐다 (Office=베이지·세이지, Date=로즈·와인, Sport=세이지·올리브).
  `body.look-{office|date|sport}` 클래스가 토글되어 UI 컨트롤도 그 톤에 맞춰 반전된다.
- Accent 후보 2 Lime Yellow `#D7E36A`는 v0.0 시점 후보. 포인트 컬러 최종 결정은 피드백 대기 항목.

## 타이포그래피

| 용도 | 스타일 |
|------|--------|
| 브랜드/헤드라인 | `Playfair Display` (italic 포함), `transform: scaleX(0.9~0.95)`로 살짝 눌린 비율 |
| UI/본문 | `Manrope` (300~800) |
| 슬라이드 타이틀 | `font-display`, `clamp(32px, 3.6vw, 54px)`, line-height 1.02, scaleX(0.95) |
| 슬라이드 설명 | 13.5px, line-height 1.7, max-width 380px |
| nav 라벨 | 12px, font-weight 800, letter-spacing 0.13em, uppercase |

한국어 본문은 장식성을 줄이고 명확성을 우선한다. Playfair Display는 Google Fonts 로드,
오프라인 fallback은 Georgia 계열.

## 컴포넌트 (v0.4.1 실제 값)

- **CTA 버튼**: `inline-flex`, min 166×50px, `border-radius: 999px`(pill), border 1px,
  hover 시 `translateY(-2px)`.
- **프롬프트 도크 (`.dock`)**: pill 형태(`border-radius: 999px`), `width: min(690px, 86vw)`,
  내부에 48px 원형 `.dock-btn` + `.dock-input`(height 48px, 15px). 슬라이드 톤에 따라
  `.dock.cream` / `.dock.dim` 변형.
- **칩 (`.chip`)**: `padding: 8px 14px`, `border-radius: 999px`, 12px, frosted
  (`backdrop-filter: blur(10px)`).
- **룩 카드 (`.look-card`)**: `min-height: 420px`, 이미지 `object-fit: cover`,
  hover 시 이미지 `scale(1.045)`, 등장은 stagger(`cardIn`, 90ms 간격).
- **결과 carousel**: 풀블리드, 박스 경계 없음. `.carousel-nav`는 하단 중앙(dock 위, bottom 116px),
  버튼 34px. 좌상단 `01 / 03` small-caps 라벨(11px). 키보드 ← → 이동 지원.
- **상품 드로어 (`.drawer`)**: 상시 노출이 아니라 슬라이드별 `View products` CTA(우상단 고정)로
  우측에서 슬라이드 인. 룩별 4개 카테고리 상품 카드 + ₩ 가격. `.drawer-overlay`로 딤 처리.
- **Copy prompt**: 우상단 작은 캡슐(높이 32px, 폰트 10px). 밝은 슬라이드에서 다크 톤 자동 반전.
  (v0.4.1에서 `View products` ↔ `Copy prompt` 위치 스왑: 글로벌 카피는 슬라이드 인라인 CTA로 이동.)

## UI 형태 일반 규칙

- 카드 radius는 8px 이하 기본. 단, pill 형태 액션 요소(CTA, dock, chip)는 `999px`.
- 패션 이미지 영역은 크게, 상품 정보 영역은 밀도 있게.
- 버튼은 명확한 동작 중심. 아이콘은 저장·공유·외부 링크·새 프롬프트 등 명확한 액션에만.

## 애니메이션

- 허용: 느린 이미지 스케일, blur/fade 텍스트 등장(Welcome 1.1초), 패널 슬라이드,
  결과 카드 stagger reveal, scene 전환(`quote → loading → results`).
- easing: `--ease: cubic-bezier(0.22,1,0.36,1)`, `--ease-out-expo: cubic-bezier(0.16,1,0.3,1)`.
- 로딩 신은 도시/건축 라인이 아니라 패션 작업 언어(드레스폼·옷걸이·원단 드레이프) 선형 애니메이션.

## 레퍼런스

- Brunello Cucinelli Online Boutique AI — 맥락형 프롬프트 바, 조용한 인터랙션, 발견 경험.
- 레퍼런스 자산: `디자인/레퍼런스/` (랜딩·메인입력전·메인결과 3종은 각각 다른 화면 상태 기준).
- 시안 진화: v0.3.1(3분할) → v0.3.2(풀스크린 atelier) → v0.4.0(풀블리드 carousel) →
  v0.4.1(패션 우선 재배치, 외국 풍경 사진 제거). 상세는 `디자인/I.F 디자인 계획 v0.0.md` 14·17장.
