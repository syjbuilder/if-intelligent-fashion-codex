# I.F Design Plan v0.0

작성일: 2026-05-02
기준 문서: `../기획/I.F V0 PRD.md`

> **이 문서는 디자인 탐색·의사결정 기록(archive)이다.** v0.0~v0.6 시안이 어떻게
> 발전해 왔는지, 무엇을 왜 결정했는지를 narrative로 남긴다.
> **현행 운영 디자인 기준은 `docs/UI_GUIDE.md`다** — 디자인이 바뀌면 UI_GUIDE를 갱신하고,
> 이 문서에는 버전 히스토리(17장)와 해당 버전 섹션만 추가한다. 운영 값(토큰·컴포넌트 수치)의
> 단일 출처는 UI_GUIDE이며, 이 문서와 충돌하면 UI_GUIDE가 우선한다.

## 1. 문서 목적

이 문서는 I.F V0 웹 MVP의 초기 디자인 방향을 정의한다.

v0.0은 확정안이 아니라 첫 디자인 가설이다. 이후 피드백을 반영해 v0.1, v0.2 방식으로 업데이트한다.

## 2. 제품 디자인 핵심 방향

I.F는 단순 쇼핑몰이나 AI 이미지 생성기가 아니라, 사용자가 상상한 패션 스타일을 시각화하고 실제 구매 가능한 상품으로 연결하는 AI 패션 탐색 서비스다.

따라서 디자인은 다음 균형을 목표로 한다.

- AI 도구의 명확함
- 패션 브랜드의 감성
- 쇼핑 전환에 필요한 실용성
- 모바일 웹 중심의 빠른 탐색 경험

핵심 인상:

> 패션 에디터의 작업실 같은 AI 스타일 디렉터

지향점:

- AI 챗봇보다 감각적
- 일반 쇼핑몰보다 덜 복잡함
- Pinterest보다 구매에 가까움
- 패션 매거진보다 더 실행 가능함

## 3. 추천 디자인 컨셉

### Editorial AI Studio

I.F의 첫 디자인 컨셉은 `Editorial AI Studio`로 정의한다.

감성적인 패션 룩 이미지와 명확한 작업형 UI를 결합한다. 랜딩은 브랜드 감성을 전달하고, 메인 워크스페이스는 프롬프트 입력, AI 룩 결과, 상품 연결을 빠르게 수행할 수 있도록 구성한다.

필수 디자인 조건:

- 모든 페이지와 결과 화면은 한국의 데일리 패션을 우선 기준으로 설계한다.
- 생성 이미지의 모델은 기본적으로 한국인 또는 동양인으로 설정한다.
- 기본 상황은 한국 도시 생활을 따른다. 예시는 출근, 데이트, 운동, 카페, 주말 외출, 저녁 약속, 한강/성수/강남/홍대/회사 밀집 지역 같은 실제 생활 맥락이다.
- 결과 이미지는 글로벌 패션 화보처럼 보일 수는 있지만, 최종 감각은 "한국에서 바로 입을 수 있는 룩"이어야 한다.
- 결과 이미지는 상의/하의 또는 원피스/아우터 등 전체 착장 구성이 명확히 보여야 한다. 상반신 클로즈업, 얼굴 중심 이미지, 하의가 잘린 이미지는 I.F의 결과 카드 기준에 맞지 않는다.
- 특수하거나 과감한 프롬프트도 V0 시안에서는 국내 온라인몰 상품으로 연결 가능한 wearable daily look으로 해석한다.
- 룩 카드는 예쁜 이미지보다 "이 상품 조합을 실제로 찾을 수 있겠다"는 감각을 우선한다.

## 4. 정보 구조

V0에서 우선 설계할 주요 화면은 다음과 같다.

1. Landing Page
2. Auth Screen
3. Main Workspace
4. Look Result View
5. Product Panel
6. Mobile Web Flow

초기 디자인 시안은 아래 4개 상태를 우선 제작한다.

1. 랜딩 첫 화면
2. 메인 워크스페이스 데스크톱
3. 룩 선택 후 우측 상품 패널이 열린 상태
4. 모바일 룩 결과 및 상품 바텀시트

## 5. Landing Page 계획

목적:

- I.F의 브랜드 감성과 핵심 가치를 첫 화면에서 전달한다.
- 사용자가 5초 안에 무엇을 하는 서비스인지 이해하게 한다.
- `Get Started`를 통해 핵심 경험으로 진입하게 한다.

구성:

- 첫 뷰포트 중심의 패션 영상 또는 AI 룩 이미지 배경
- 브랜드명 `I.F`
- 메인 카피: `Wear what you imagine.`
- 서브 카피: `상상한 스타일을 말하면, AI가 룩으로 보여주고 실제 살 수 있는 옷으로 연결합니다.`
- CTA 버튼: `Get Started`
- 첫 화면 하단에는 다음 섹션 일부가 살짝 보이도록 구성
- 다음 섹션에서 `Prompt -> AI Look -> Product` 흐름을 짧게 보여줌

디자인 메모:

- 일반 SaaS 랜딩처럼 카드 중심 설명 페이지가 되지 않도록 한다.
- 브랜드명과 실제 패션 룩 이미지가 첫 뷰포트에서 강하게 보여야 한다.
- 설명은 짧고, 경험의 이해는 이미지와 흐름으로 만든다.
- 레퍼런스 랜딩에서 참고할 부분은 `상단 바`, `큰 이미지와 여백`, `하단 텍스트/CTA 배치`다.
- 랜딩 첫 화면에는 프롬프트 입력창을 두지 않는다. 프롬프트 입력은 `Get Started` 이후 메인 워크스페이스에서 시작한다.

## 6. Auth Screen 계획

목적:

- 저장, 토큰, 생성 히스토리, 공개/비공개 설정을 위한 계정 생성을 유도한다.

로그인 옵션 우선순위:

1. Google
2. Kakao
3. Naver

디자인 메모:

- 로그인 화면은 가볍고 빠르게 느껴져야 한다.
- 배경은 감성적인 흐림 이미지보다, 실제 생성 룩 썸네일 그리드가 더 신뢰감을 줄 수 있다.
- 로그인 이유는 짧게 설명한다.

## 7. Main Workspace 계획

목적:

- 사용자가 프롬프트를 입력하고 AI 룩 결과를 확인하는 핵심 작업 공간이다.

데스크톱 레이아웃:

```text
┌──────────────┬──────────────────────────────┬────────────────────┐
│ Sidebar      │ Main Workspace                │ Product Panel      │
│              │                              │                    │
│ New Prompt   │ Prompt Input                  │ Selected Look      │
│ History      │ Prompt Builder Chips          │ Look Summary       │
│ Saved Looks  │                              │                    │
│ Tokens       │ AI Look Results 1-3           │ Main Outfit Items  │
│ Plan         │                              │ Similar Products   │
│              │ Follow-up Prompt              │ Save / Share / Buy │
└──────────────┴──────────────────────────────┴────────────────────┘
```

역할:

- 왼쪽 사이드바: 히스토리, 저장 룩, 토큰/플랜 상태
- 중앙 워크스페이스: 프롬프트 입력, 보조 필터, AI 룩 결과
- 오른쪽 패널: 선택한 룩의 실제 상품 추천

디자인 메모:

- 중앙은 대화형 생성 경험에 집중한다.
- 오른쪽은 쇼핑 전환에 필요한 실용 정보에 집중한다.
- 결과 화면에서 사용자가 바로 "입을 수 있겠다"는 감각을 받아야 한다.
- 결과 카드의 인물/착장은 한국 20-30대 여성 데일리 패션 맥락을 기본값으로 하고, 상의/하의 또는 원피스/아우터 구조가 상품 패널과 연결될 만큼 보여야 한다.
- 결과 이미지가 지나치게 해외 컬렉션, 런웨이, 코스튬, 판타지, 파티룩처럼 보이면 I.F의 V0 디자인 기준에서 실패로 본다.
- 메인 워크스페이스는 랜딩과 분리된 화면이다. 사용자는 랜딩의 `Get Started`를 통해 진입한다.
- `레퍼런스_메인페이지.png`는 입력 전 빈 상태의 기준으로 본다. 중앙에는 큰 프롬프트 입력과 보조 칩이 있고, 우측은 `Awaiting Vision` 같은 대기 상태를 보여준다.
- `레퍼런스_메인페이지 2.png`는 프롬프트 입력 후 결과 상태의 기준으로 본다. 중앙에는 3개의 룩 카드, 우측에는 선택 룩 요약과 상품 리스트, 하단 구매 CTA가 고정된다.

## 8. Prompt UX 계획

프롬프트 입력창은 예쁘지만 기능적으로 선명해야 한다.

추천 placeholder:

- `어떤 스타일을 상상하고 있나요?`
- `예: 여름 데이트에 입을 꾸안꾸 룩`
- `예: 키 162cm, 하체 커버되는 출근룩`
- `예: 미니멀한 블랙 데일리룩이지만 부담스럽지 않게`

보조 입력 칩:

- 상황: 데이트, 출근, 여행, 하객룩, 일상, 카페, 피크닉
- 계절: 봄, 여름, 가을, 겨울
- 무드: 캐주얼, 미니멀, 러블리, 스트릿, 시크, 페미닌
- 예산: 5만원 이하, 10만원 이하, 20만원 이하, 제한 없음
- 핏: 슬림핏, 세미오버핏, 오버핏, 하체 커버, 허리 강조

디자인 메모:

- 빈 입력창 앞에서 막히지 않도록 추천 질문과 선택형 보조 입력을 제공한다.
- 프롬프트 입력은 챗봇처럼 보이기보다 스타일 디렉터에게 요청하는 느낌이 좋다.

## 9. Look Result View 계획

목적:

- AI가 생성한 룩 이미지를 중심으로 사용자의 선택을 유도한다.

구성:

- 1-3개의 AI 룩 결과
- 각 룩은 서로 다른 해석을 가질 수 있음
- 룩 카드에는 이미지, 해석 이름, 짧은 태그를 표시

예시:

- `Look A · Minimal Office`
- `Look B · Lovely Casual`
- `Look C · Trendy Street`

태그 예시:

- `summer`
- `clean`
- `semi-wide`
- `under 100k`

디자인 메모:

- 룩 결과는 쇼핑몰 상품 카드처럼 보이면 안 된다.
- 패션 화보처럼 감성적이어야 하지만, 상품 매칭이 가능한 의류 구조가 보여야 한다.
- 이미지의 상황, 배경, 무드가 함께 느껴져야 한다.

## 10. Product Panel 계획

목적:

- 선택한 AI 룩을 실제 구매 가능한 상품으로 연결한다.

구성:

- 룩 요약
- 메인 추천 상품 조합
- 아이템별 상품 카드
- 유사 상품 리스트
- 어울리는 관련 상품
- 외부 구매 링크
- 저장 버튼
- 공유 버튼

상품 카드 필수 정보:

- 상품 이미지
- 상품명
- 브랜드명
- 가격
- 판매처
- 카테고리
- 색상/핏/무드 태그
- 외부 구매 링크

디자인 메모:

- 상품 영역은 감성보다 실용성이 우선이다.
- 가격, 브랜드, 링크가 명확해야 한다.
- 추천 이유를 짧게 표시하면 AI 스타일 디렉터 경험이 강화된다.

추천 이유 예시:

> 린넨 질감과 밝은 톤이 원본 룩의 여름 분위기와 잘 맞아요.

## 11. Mobile Web 계획

모바일 웹은 향후 앱 전환을 고려해 앱처럼 자연스럽게 느껴져야 한다.

기본 구조:

```text
┌────────────────────┐
│ I.F.   Tokens Menu │
├────────────────────┤
│ Prompt Input       │
│ Filter Chips       │
├────────────────────┤
│ Look A             │
│ Look B             │
│ Look C             │
└────────────────────┘
```

룩 선택 시:

```text
┌────────────────────┐
│ Bottom Sheet       │
│ 상품 조합 / 가격 / 링크 │
│ Save / Share / Buy │
└────────────────────┘
```

디자인 메모:

- 데스크톱의 오른쪽 상품 패널은 모바일에서 바텀시트로 전환한다.
- 저장, 공유, 외부 구매 버튼은 바텀시트 하단에 고정한다.
- 히스토리와 저장 룩은 메뉴 또는 별도 탭으로 접근한다.

## 12. Visual System 초안

컬러 방향:

- Base: `#F7F4EF` 또는 `#FAFAF7`
- Text: `#171717`
- Sub Text: `#76716A`
- Accent 후보 1: Deep Rose `#B94A62`
- Accent 후보 2: Lime Yellow `#D7E36A`
- Line: `#E4DED6`
- Product Surface: `#FFFFFF`

타이포그래피 방향:

- 브랜드/헤드라인: `Playfair Display` 우선 적용. 고급 패션 매거진 계열의 대비감이 있고, `scaleX(0.9~0.94)`를 함께 사용하면 레퍼런스처럼 살짝 눌린 비율의 타이틀을 만들 수 있다.
- UI/본문: `Manrope` 우선 적용. 프롬프트, 패널, 상품 정보처럼 반복적으로 읽는 영역은 산세리프가 더 적합하다.
- Playfair Display 웹폰트는 Google Fonts로 적용 가능하다. 단, 오프라인/로컬 파일 실행 환경에서 네트워크가 막히면 Georgia 계열 fallback으로 보이므로 최종 배포 시 폰트 로딩 정책을 별도 확정한다.
- 한국어 본문은 장식성을 줄이고 명확성을 우선한다.

UI 형태:

- 카드 radius는 8px 이하를 기본으로 한다.
- 패션 이미지 영역은 크게, 상품 정보 영역은 밀도 있게 구성한다.
- 버튼은 명확한 동작 중심으로 사용한다.
- 아이콘은 저장, 공유, 외부 링크, 새 프롬프트 등 명확한 액션에 사용한다.

## 13. 피해야 할 방향

- 일반 쇼핑몰처럼 상품 그리드가 먼저 보이는 구조
- 범용 AI 챗봇처럼 채팅창만 강조되는 구조
- 카드가 과도하게 많은 SaaS 랜딩 페이지
- 베이지/핑크 계열만 반복되는 단조로운 패션몰 느낌
- 감성 이미지는 좋은데 상품 연결이 약해 보이는 결과 화면
- 너무 많은 필터로 첫 사용을 무겁게 만드는 구조

## 14. Reference: Brunello Cucinelli Online Boutique AI

레퍼런스:

- `https://shop.brunellocucinelli.com/en-gb/ai`
- 관련 설명: makemepulse의 Callimacus 프로젝트 소개

참고할 핵심:

- AI를 전면에 과시하지 않고, 맥락형 프롬프트 바와 은은한 인터랙션 힌트로 드러낸다.
- 고정된 페이지 탐색보다 사용자의 의도에 따라 경험이 조립되는 느낌을 준다.
- 시각적으로는 frosted glass, soft blur, hand-drawn sketch detail, editorial sensibility를 활용한다.
- 상품을 먼저 밀어붙이기보다, 부티크에서 제안과 영감을 받는 듯한 발견 경험을 만든다.
- AI는 기술 데모가 아니라 브랜드 경험과 큐레이션을 돕는 조용한 레이어로 작동한다.

I.F 적용 방향:

- AI 입력창은 챗봇처럼 보이지 않게, 고급스러운 프롬프트 바로 설계한다.
- 랜딩 히어로에서는 프롬프트 입력창을 직접 노출하지 않고, `Get Started` 버튼을 통해 메인 워크스페이스로 이동시킨다.
- 메인 화면은 상품 그리드보다 룩 보드가 먼저 보이게 한다.
- 상품 패널은 감성적인 룩 경험을 해치지 않도록 조용하고 명확한 우측 패널 또는 모바일 바텀시트로 제공한다.
- AI는 `생성 중`, `분석 중` 같은 기술 문구보다 `상황`, `무드`, `핏`, `예산`을 이해하는 스타일 디렉터처럼 느껴져야 한다.

디자인 원칙:

> AI는 조용하게, 룩은 감각적으로, 상품은 명확하게.

구현 메모:

- Brunello Cucinelli AI의 정확한 브랜드 폰트, 로고, 번들 애니메이션을 그대로 복제하는 것은 권장하지 않는다. 대신 `느린 이미지 스케일`, `blur/fade 텍스트 등장`, `상단 바의 조용한 아이콘`, `패널 슬라이드`, `결과 카드 stagger reveal` 같은 인터랙션 문법을 I.F에 맞게 재해석한다.
- 레퍼런스 폴더의 HTML/이미지 3종은 각각 다른 화면 상태의 기준이다. 하나의 랜딩 화면에 모두 합치지 않는다.
- `레퍼런스_랜딩페이지.png/html`: 랜딩의 상단 바, 큰 이미지 사용, 하단 텍스트, `Get Started` CTA 참고.
- `레퍼런스_메인페이지.png/html`: `Get Started` 이후 진입하는 프롬프트 입력 전 메인 워크스페이스 참고.
- `레퍼런스_메인페이지 2.png/html`: 프롬프트 입력 후 결과/상품 패널이 열린 메인 워크스페이스 참고.
- 잘못 제작한 `if-homepage-v0.4_playfair_brunello.html`은 레퍼런스 이미지를 배경처럼 덮어 사용해 의도와 어긋났으므로 삭제했다.

### 다음 시안 방향

기준 파일:

- `if-homepage-v0.3_brunello_if.html`

수정 방향:

- 랜딩 페이지: 상단 바, 이미지 중심 히어로, 하단 텍스트, `Get Started` 버튼 중심으로 재구성
- 메인 프롬프트 페이지: 별도 HTML 또는 동일 HTML 내 섹션 이동으로 구성. 프롬프트 입력창, 보조 칩, 우측 대기 패널을 배치
- 결과 페이지: 입력 후 중앙 3개 룩 카드와 우측 상품 패널이 나타나는 상태로 구성
- Playfair Display 적용은 유지하되, 레퍼런스 이미지를 배경으로 사용하는 방식은 피한다.

### v0.3.1 Brunello Flow 시안

신규 시안:

- `if-homepage-v0.3.1_brunello_flow.html`

v0.3에서 발전시킨 점:

- 랜딩 화면에서 프롬프트 입력 도크를 제거하고, 레퍼런스 랜딩처럼 `상단 바`, `큰 패션 이미지`, `하단 텍스트`, `Get Started` CTA 중심으로 정리했다.
- I.F의 의미는 `Intelligent Fashion`으로 통일한다. 화면 내 `Imagined Fit` 표기는 사용하지 않는다.
- `Get Started` 클릭 시 메인 워크스페이스로 이동한다.
- 메인 워크스페이스는 `레퍼런스_메인페이지` 기준으로 왼쪽 사이드바, 중앙 프롬프트 입력, 우측 대기 패널을 구성했다.
- 프롬프트 생성 버튼 클릭 시 `레퍼런스_메인페이지 2` 기준으로 중앙 3개 룩 카드와 우측 상품 패널 결과 상태가 나타난다.
- Playfair Display + Manrope 조합은 유지하되, 레퍼런스 이미지를 배경으로 덮지 않고 실제 패션 이미지와 레이아웃 문법만 참고한다.
- v0.3의 Brunello식 고급 풀스크린 감성은 랜딩에 남기고, 서비스의 핵심 사용 흐름은 별도 워크스페이스에서 보여준다.
- 랜딩 상단바는 랜딩 전용으로만 사용한다. 워크스페이스에서는 상단바와 사이드바 메뉴가 중복되지 않도록 상단바를 고정하지 않는다.
- 랜딩의 `Wear what you imagine.` 타이틀은 레퍼런스보다 과하게 커지지 않도록 크기를 낮추고, 하단 정보와 CTA가 함께 보이도록 조정한다.

### v0.3.2 Brunello Atelier 시안

신규 시안:

- `if-homepage-v0.3.2_brunello_atelier.html`

반영한 신규 참고 자료:

- 사용자가 제공한 `prototype.html`
- 사용자가 제공한 `codex_prompts.md`

분석 요약:

- 프로토타입의 장점은 특정 화면 모양보다 `느린 진입`, `풀스크린 신 전환`, `검색 도크`, `인용구/로딩/결과의 의식적인 흐름`, `우측 패널 슬라이드`에 있다.
- 이 문법은 Brunello 레퍼런스의 고급스러움과 잘 맞지만, 그대로 가져오면 I.F의 핵심인 `프롬프트 → 룩 결과 → 상품 연결`이 약해질 수 있다.
- 따라서 v0.3.2에서는 v0.3.1의 랜딩 구조는 유지하고, `Get Started` 이후 메인 경험을 더 인터랙티브한 AI atelier로 재구성했다.

v0.3.2에서 발전시킨 점:

- 랜딩은 `Wear what you imagine.`를 중심 메시지로 유지하고, `From uncertainty to intention.` 문구는 중복 카피로 판단해 제거한다.
- 메인 워크스페이스는 좌우 3분할 대시보드에서 벗어나, 프로토타입처럼 풀스크린 스테이지 + 하단 프롬프트 도크 구조로 구성했다.
- 프롬프트 입력 후 바로 결과가 뜨지 않고 `Understanding the occasion → quote scene → gathering inspiration → curating suggestions → results` 흐름을 거친다.
- 로딩 단계는 도시/건축 라인 드로잉보다 패턴 드래프팅, 원단 스와치, 실루엣 라인처럼 패션 디자이너의 작업 언어가 느껴지는 선형 애니메이션을 우선한다.
- 우상단 아이콘은 각각 History, Saved Looks, Selection 패널로 연결된다. 패널은 Brunello 레퍼런스처럼 우측 슬라이드와 인용구 중심의 빈 상태를 가진다.
- 결과는 오피스, 데이트, 스포츠 3개 룩 카드와 우측 상품 패널로 표현한다. 3개 룩은 한국 데일리 패션 맥락에서 서로 다른 사용 장면을 분명히 보여주되, 쇼핑몰 그리드처럼 보이지 않게 한다.
- 결과 카드 이미지는 전신 또는 최소 3/4 신체 구도를 우선한다. 상하의 구성이 보이지 않는 이미지는 상품 패널과 연결되지 않으므로 다음 시안에서 교체 대상이다.
- 기본 모델과 배경은 한국 또는 동아시아권 모델, 국내 도시/일상 배경에 가까운 로컬 맥락을 유지한다.

v0.3.2 수정 메모:

- 스튜디오 상단바가 랜딩 상단바와 겹쳐 보이던 문제를 줄이기 위해 스튜디오 상단바를 `fixed`가 아니라 스튜디오 섹션 내부 `absolute` 배치로 조정했다.
- History, Saved Looks는 우측 상단에서 제거하고 좌측 `Menu` 트레이 안으로 이동했다. 우측 상단은 `Login`과 Selection 장바구니만 남긴다.
- 좌측 Menu 클릭 시 History, Saved Looks, Restart Atelier, New Prompt 액션이 나오는 구조로 변경했다.
- 프롬프트 입력/칩 클릭 시 스튜디오 위치로 이동한 뒤 `quote → loading → results` 전환이 더 분명하게 보이도록 단계 시간을 늘리고 전환 클래스를 보강했다.

v0.3.2 단일 화면 보정 원칙:

- v0.3.2는 문서 아래에 별도 워크스페이스를 깔아두고 앵커로 이동하는 구조가 아니라, 하나의 viewport 안에서 scene이 전환되는 구조를 기준으로 한다.
- `Get Started`는 스크롤 이동이 아니라 랜딩 카피와 CTA가 사라지고, 같은 화면 중앙에 프롬프트 입력 도크와 예시 프롬프트 버튼이 나타나는 전환으로 처리한다.
- 좌측 메뉴와 우측 Selection 패널은 페이지 위치를 바꾸지 않는 overlay 인터랙션으로 유지한다.
- 좌측 메뉴의 `Restart Atelier`처럼 목적이 불명확하거나 `New Prompt`와 기능이 겹치는 항목은 제거한다.
- 프롬프트 Enter 또는 예시 프롬프트 클릭은 현재 화면에서 바로 `quote → loading → results` 생성 대기 애니메이션을 시작한다.
- `#studio` 앵커 이동, `scrollIntoView()` 등 실제 페이지 스크롤에 의존하는 전환은 v0.3.2 UX 원칙에서 제외한다.

다음 피드백 포인트:

- v0.3.1의 3분할 워크스페이스가 더 서비스형으로 좋은지, v0.3.2의 풀스크린 atelier 흐름이 더 브랜드형으로 좋은지 비교한다.
- v0.3.2는 감성은 강하지만 실제 상품 패널의 정보 밀도는 아직 낮다. 다음 버전에서는 결과 카드 클릭 시 Selection 패널이 실제 상품 추천 상태로 바뀌는 흐름을 보강할 수 있다.
- 현재 이미지들은 외부 Unsplash 임시 이미지이므로, 최종 톤에 맞는 자체 이미지/영상 자산으로 교체해야 한다.

### v0.4.0 Carousel Atelier 시안

신규 시안:

- `if-homepage-v0.4.0b_garment.html` (기준 파일로 채택)
- 로딩 신 SVG 비교용 사본 `if-homepage-v0.4.0a_dressform.html`, `if-homepage-v0.4.0c_drape.html`는 채택 후 삭제

v0.3.2 사용자 피드백 반영:

- 랜딩과 Get Started 클릭 후 페이지의 `Menu`, `Login` 같은 상단 액션이 실제로 동작하지 않거나 클릭이 무시되던 문제를 해결한다. 메뉴 아이콘과 텍스트가 두 개의 버튼으로 나뉘어 있던 어색함도 단일 `menu-trigger` 버튼으로 통합한다.
- `menuTray`를 `.studio` 섹션 내부에서 `body` 직속으로 이동시켜 랜딩에서도 메뉴 트레이가 정상적으로 열리도록 한다.
- `Login` 토스트는 모달로 승격해 사용자가 인지하는 행동 단계로 분명하게 만든다.
- 영상 4초 부근에 등장하는 `Welcome` 타이틀의 블러 페이드 인 + 살짝 줄어드는 스케일 + 자간 호흡 애니메이션을 1.1초 길이로 반영한다. 서브타이틀은 800ms 지연 후 위에서 떠오르는 애니메이션을 추가한다.
- 프롬프트 입력 후 처음 등장하던 `Every moment has a version of you waiting to be worn.` 인용구 신은 흐름이 길어지고 카피가 결과 카드보다 강하게 느껴지는 문제가 있어 제거한다. 흐름은 `Reading daily context → Reading the silhouette → Balancing texture → Curating Korean daily looks`로 단축한다.
- 로딩 신의 SVG는 도시/건축 라인 대신 패션 작업 언어가 더 명확하게 보이도록 a) 드레스폼 + 측정선, b) 옷걸이 + 가먼트 라인업, c) 흐르는 원단 드레이프 세 가지 사본을 만들고 사용자 비교 후 b 옷걸이 라인업을 기준으로 채택한다.
- 결과 페이지는 룩 카드 3개를 그리드로 보여주던 구성을 풀블리드 carousel로 바꾼다. 각 룩이 화면 전체 캔버스를 차지하고, 박스 경계 없이 배경이 룩 무드에 맞게 그라디언트로 변한다 (Office = 베이지·세이지, Date = 로즈·와인, Sport = 세이지·올리브).
- carousel 좌우에 ‹ 01/03 › 페이지네이션과 키보드 ← → 이동을 제공한다. 결과 카드의 넘버링(`01`, `02`, `03`)은 더 분명하게 보이도록 디스플레이 폰트 카운터로 표시한다.
- 결과 페이지 상단 헤딩(`For ..., a Korean daily edit` 및 `Three wearable directions for ...`)은 텍스트 비중을 줄이기 위해 제거한다.
- 우측 상품 패널은 상시 노출이 아니라 슬라이드별 `View products` CTA 클릭 시 우측에서 슬라이드 인 되도록 변경한다. 기존 `drawer-bag`를 확장해 룩별 4개 카테고리(Outer/Top/Bottom 또는 Dress/Outer · Shoes/Bag · Top/Bottom 등)와 ₩ 가격을 동적으로 채운다.
- 프롬프트 복사 버튼을 결과 페이지 우상단에 추가한다. 클릭 시 마지막 입력 프롬프트를 클립보드에 복사하고 토스트로 확인한다.
- 결과 카드 이미지는 인종/지역 마커 이슈를 우회하기 위해 사람이 등장하는 사진이 아니라 가먼트 SVG 실루엣 (재킷·슬립 드레스·운동복)으로 대체한다. 추후 실제 의상 플랫레이/클로즈업 사진이 준비되면 교체한다.

다음 피드백 포인트:

- 가먼트 SVG의 디테일을 더 패션 매거진처럼 다듬을지, 실제 의상 플랫레이 사진으로 교체할지 결정한다.
- 슬라이드 전환 시 가먼트가 좌→우로 슬라이드 인 되는 모션을 추가할지 검토한다.
- 모바일에서 carousel의 가먼트가 충분히 잘 보이도록 한 차례 더 보정이 필요하다.

### v0.4.1 Fashion-first Refinement 시안

신규 시안:

- `if-homepage-v0.4.1.html`

v0.4.0b에 대한 사용자 지적 사항을 반영:

- 랜딩과 인트로 신의 외국 풍경 사진(이탈리아·유럽 분위기)이 한국 데일리 패션의 로컬 맥락과 어긋난다는 피드백이 있었다. 외부 Unsplash 사진을 모두 제거하고, 다크 워밍 톤 CSS 그라디언트(`#0b0908 → #2a2018 → #1b140f`)에 SVG 그레인 텍스처를 8% opacity로 얹어 "아틀리에 인테리어" 분위기로 대체한다.
- 인종이나 지역 마커가 드러나는 사진은 V0 단계에서 모두 배제한다. 추후 한국·동아시아권 모델과 도시 배경의 자체 에디토리얼 사진을 큐레이션해 교체하는 단계가 별도 과제로 남는다.
- 결과창에서 텍스트가 화면 중앙을 너무 크게 차지해 패션 이미지가 약하게 느껴졌다. 슬라이드 타이틀 크기를 `clamp(46~86px) → clamp(32~54px)`로 축소하고 비중을 줄인다. 가먼트 SVG는 절대 위치로 화면 중앙에 배치하고 너비를 420px → 560px(78vw)로 확대한다. 그림자도 70px로 키워 드라마를 살린다.
- Office 슬라이드에서 크림 배경에 크림 가먼트가 거의 보이지 않던 콘트라스트 문제를 발견했다. 룩별 가먼트 fill 컬러를 재정의한다 (Office = `#2a241e` 다크 잉크, Date/Sport = 따뜻한 오프화이트 계열). 슬라이드별 톤이 바뀔 때 `body.look-{office|date|sport}` 클래스가 함께 토글되어 UI 컨트롤(예: 카피 버튼)도 그 톤에 맞춰 반전된다.
- 거대한 디스플레이 카운터(56~110px)는 시각적 무게가 너무 컸다. 좌상단의 작은 small-caps 라벨(`01 / 03`, 11px)로 축소한다.
- carousel 네비게이션은 우하단에 떠 있던 위치에서 하단 중앙(dock 바로 위)으로 이동해 시각 동선을 명확히 한다. 버튼 크기도 42px → 34px로 줄인다.
- 프롬프트 복사 버튼도 사이즈와 위치를 정돈해 우상단 작은 캡슐(높이 32px, 폰트 10px)로 만들고, 밝은 슬라이드(Office)에서는 자동으로 다크 톤으로 반전되도록 한다.

v0.4.1 액션 위치 스왑:

- 사용자 피드백에 따라 `View products`와 `Copy prompt` 버튼의 위치를 맞교환한다.
- 우상단 고정 버튼은 `Copy prompt`에서 **`View products`**로 변경한다. 클릭 시 현재 슬라이드의 룩 상품 패널을 우측 드로어로 연다. 글로벌 어디서나 한 번에 접근 가능한 톱 위치는 룩별 액션이 더 어울린다는 판단이다.
- 각 슬라이드 인라인 CTA는 `View products →`에서 **`Copy prompt`**로 변경한다. 클릭 시 마지막 프롬프트를 클립보드에 복사하고 버튼 라벨이 잠깐 `Copied`로 바뀐 뒤 원상 복귀한다. 글로벌 유틸 액션이 슬라이드 안에서 자연스럽게 만나는 구성이다.

다음 피드백 포인트:

- 가먼트 SVG가 단순 실루엣 수준이라 패션 매거진 톤에 비해 디테일이 약하다. 다음 단계에서 패턴/원단 텍스처/리얼 플랫레이 사진 중 어떤 방향으로 갈지 결정한다.
- 슬라이드 진입 모션(가먼트가 좌→우로 슬라이드 인, 텍스트가 시차로 페이드 인 등)을 추가할지 검토한다.
- 결과 페이지의 chips/예시 프롬프트가 다시 나타나지 않는 동선을 개선할지 결정한다 (현재는 `New Prompt` 액션을 통해서만 chips로 복귀).

### v0.5 Fashion Discovery Layer 시안

신규 시안:

- `if-homepage-v0.5.html`

v0.4.1 freeze 직전 zany-doodling-rainbow 플랜 + V0.5 디자인 브리프(2026-05-17)를 반영해 단일 워크스페이스를 **4-tier routing** 구조로 확장한다. `body[data-page]` 어트리뷰트로 `landing / studio / auth / history` 4개 화면을 토글하고, studio 내부는 기존 scene 시스템(`explore / loading / results`)을 그대로 활용한다.

신규 화면 3개 (필수):

- **로그인/회원가입 화면 (`.auth-screen`)** — 다크 워밍 그라디언트 배경 + 중앙 카드. Google·Kakao·Naver 3개 소셜 버튼, 브랜드 색 정확 적용(Kakao `#FEE500`, Naver `#03C75A`). 모든 Login 버튼·`Save 버튼(비로그인 상태)`·`히스토리 게이트 CTA`가 이 화면으로 합류한다. mock 동작: 클릭 시 `body.is-logged-in` 토글 + studio Explore 진입.
- **히스토리/저장 화면 (`.history-page`)** — 로그인 시 `saved-grid` 6개 룩 카드(썸네일+프롬프트+상대 날짜+hover trash). 비로그인 시 `history-gate`(Daydream 약점 회피: 빈 리스트 X) — "내 룩 컬렉션을 만들려면 로그인" 헤드라인 + sample 룩 3개 흐림 처리 + Sign in CTA. 기존 `drawer-wishlist`는 제거하고 이 페이지로 흡수.
- **모바일 워크스페이스 반응형** — `@media (max-width: 768px)` 와 `(max-width: 480px)` 두 단계. drawer-bag을 우측 슬라이드(translateX)에서 **하단 바텀시트(translateY)**로 전환(grab handle 포함). 카로우셀의 slide-meta는 가먼트 아래로 stack, refinement chips는 horizontal scroll 가능, Explore/Saved 그리드는 2열(480 이하 1열).

Explore 진입 피드 (B1, 신규):

- intro 신을 완전 제거하고 같은 위치에 `scene-explore`를 둔다. 빈 입력창 마비 회피.
- Style Atelier intro의 브랜드 모먼트는 **Explore 헤더 brand-strip**으로 흡수: 작은 `knot` SVG + `STYLE ATELIER` eyebrow(11px small-caps) + "Begin with a place, mood, and constraint." 헤드라인.
- 검색바는 화면 상단 sticky(`.explore-search`, top 76px) — Daydream 패턴 차용.
- 시즌 데모 프롬프트 칩 5개 (2026-05-17 = 봄): "봄 데이트룩", "환절기 출근룩", "한강 피크닉룩", "주말 카페룩", "비 오는 날 데일리".
- 큐레이션 룩 그리드 12개 (`.explore-grid`, 4-2-1 반응형) — 룩별 톤 그라디언트(Office=베이지·세이지 4 변주, Date=로즈·와인 4 변주, Sport=세이지·올리브 4 변주) 위에 가먼트 SVG(v0.4.1 carousel 3종 재활용). 사람 사진 0건(ADR-006 준수).
- 카드/시즌 칩 클릭 시 dockInput에 프롬프트 자동 입력 + `runQuery()` 호출.

워크스페이스 4개 추가 (작은 변경):

- **로딩 카피 polish (C1, 폴리시 단계에서 롤백 후 재정의)** — 초안에서는 `extractLookKeyword(prompt)`로 한국어 키워드를 추출해 "○○○○ 룩을 그리고 있어요" 형태로 삽입했으나, Playfair Display의 한국어 fallback 폰트가 자모를 따로 렌더링해 깨지고("ㅇㄴㅁㅇ" 같은 미조합 입력에서 화면을 가득 채움) 챗봇 톤으로 느껴진다는 피드백을 반영해 **v0.4.1 에디토리얼 영문 카피**("Reading daily context" → "Reading the silhouette" → "Balancing texture" / pill "Curating Korean daily looks")로 회귀. 동시에 `.loading-title` 사이즈를 `clamp(42px, 6.2vw, 96px)` → `clamp(28px, 3.6vw, 48px)`로 축소해 옷걸이 SVG가 주연이 되도록 비중 조정. `extractLookKeyword()` 함수는 dead code 제거.
- **Save 버튼 비로그인 사전 표기 (C2)** — 각 carousel 슬라이드에 Save 버튼 추가. 비로그인 상태에서는 자물쇠 아이콘 + "로그인하고 저장" 라벨로 자동 토글. 클릭 시 auth-screen으로 직행(Daydream "Save 후 모달로 기대 깨짐" 약점 회피).
- **More Like This 버튼 (C3, mini-action #3)** — 각 슬라이드 우하단 frosted 캡슐 + drawer-bag 안 상품 카드별 28px 원형 버튼. 클릭 시 toast "Generating 3 variations..." + carousel 재실행(mock).
- **정제 칩 (C4, mini-action #2)** — 기존 `.chips` element를 dual-purpose로 활용. results scene 한정 노출: "더 캐주얼하게 / 더 포멀하게 / 색 변경 / 가격대 ↓ / 다른 무드" 5개. ADR-009 명세에 맞춰 silent filter가 아닌 **새 conversation turn**으로 처리 — `runQuery(base + " — " + refine)` 호출해 loading scene 재생.

기타 정리:

- `menu-tray`를 4항목으로 갱신 — Explore / Recent prompts / Saved Looks / New Prompt. 하단에 디자인 확인용 "Demo · 로그인 토글" 추가(부트스트랩 단계에서 제거 예정).
- 기존 `#modalLogin` (legacy "Coming soon" 모달) 제거 → auth-screen으로 승격.
- `:root` CSS 변수는 8색 + 2이징 + Playfair Display/Manrope 그대로 유지(새 토큰 0개 추가). 디자인 시스템 안정.
- HTML 상단 주석에 CHANGELOG 블록을 두어 v0.4.1 대비 변경사항을 1줄씩 기록(별도 CHANGELOG.md 파일 신설 안 함).

다음 피드백 포인트:

- Explore 12 그리드의 가먼트 SVG가 3종 반복이라 패턴이 단조롭게 느껴질 수 있다. 다음 단계에서 SVG 변형 5-6종(트라우저·셔츠·코트·니트 등) 추가 또는 실제 플랫레이 사진 큐레이션 결정.
- 정제 칩이 5개로 고정이라 결과 맥락에 무관할 수 있다. V1에서 의도 파싱 결과 기반 컨텍스추얼 칩 생성 검토.
- 모바일 바텀시트에 swipe-down dismiss 제스처가 없다(현재는 close 버튼·오버레이 클릭만). 코드 단계에서 추가 검토.

### v0.6 Landing Long-form 시안

신규 시안:

- `if-homepage-v0.6.html`

V0 freeze 직전 사용자분 질문("PRD에 따라 랜딩 이후 서비스 소개·약관 페이지 필요한가?") 검토 결과, 기획 원본 PRD §9.1(서비스 소개 섹션 명시)·§11.1(서비스 소개 영상 확인)·§16(법적 의무: 개인정보 처리방침·약관·어필리에이트 표시)이 V0 출시 전 충족되어야 함이 확인됨. v0.5는 워크스페이스 중심으로 freeze하고, 별도 시안 v0.6에서 **랜딩 long-form 스크롤 페이지 + 법적 푸터**를 추가한다.

구조 전환:

- v0.5의 `.landing`은 `position: fixed; inset: 0; z-index: 40` 풀스크린 overlay라 스크롤 불가. v0.6에서 `.landing`을 `position: relative; min-height: 100vh` in-flow 섹션으로 전환. html/body는 native scroll(`overflow: auto`)을 가짐.
- `.studio` z-index 10 → 100, 기본 `opacity: 0; visibility: hidden`. `body.atelier-ready` 시 fixed overlay로 landing 위를 덮음. atelier 진입 시 body scroll lock(`body.atelier-ready { overflow: hidden; height: 100% }`).
- 랜딩 topbar는 `.landing > .topbar { position: fixed }`로 viewport 상단 고정. studio topbar(`.topbar.fixed`)는 부모 .studio가 fixed inset 0이므로 absolute 유지.
- 휠 forwarder는 `body.atelier-ready`일 때만 동작. 랜딩에선 native body scroll.

추가된 스크롤 섹션 3개:

- **How it works** — Prompt → AI Look → Product 3-step. 크림 페이퍼 톤. 카드 그리드 X, **세로 풀폭 + 큰 number(01/02/03 in `--rose`) + Playfair 헤딩 + Manrope 본문 + 작은 SVG 아트**로 에디토리얼 톤(PRD "SaaS 카드 안티패턴" 회피). 가먼트·검색바·상품박스 SVG 라인 드로잉.
- **Today's curated** — Explore 그리드 12개 중 처음 6개를 mount해 미리보기. 카드 클릭 시 `enterAtelier` + `runQuery(prompt)`. 하단 "Start the studio" 다크 CTA.
- **Site footer** — 짙은 인크 톤 그라디언트. 브랜드 + 이용약관/개인정보처리방침/문의 링크 + **어필리에이트 고지** ("I.F는 무신사·29CM·지그재그·에이블리·네이버쇼핑 등 외부 쇼핑몰의 어필리에이트 링크를 포함할 수 있으며…") + ©. PRD §16 의무 충족.

스크롤 진입 애니메이션:

- `.reveal` 클래스 + `IntersectionObserver` (threshold 0.12). 뷰포트 진입 시 `.in-view` 추가 → opacity·blur·translateY 동시 전환. `welcomeIn`·`fadeUp` 기존 keyframe 톤과 일관.
- Hero 하단에 `.scroll-hint` (chevron ↓ + "Discover the studio" 라벨, scrollChevron 2.4s 무한 애니메이션) 추가. 클릭 시 `#how-it-works`로 smooth scroll(`html { scroll-behavior: smooth }`).

이용약관·개인정보처리방침 모달:

- 기존 `.modal-overlay` 패턴 + `.modal-doc` 변형. 풀스크린 dim + 페이퍼 톤 카드, max-height 84vh로 내부 스크롤.
- 이용약관 6섹션(제공 서비스 / 계정 / 사용자 콘텐츠 / 외부 링크·어필리에이트 / 책임 한계 / 분쟁 해결).
- 개인정보처리방침 8섹션(수집 항목 / 목적 / 보유 기간 / 제3자 제공 / 처리 위탁 / 권리 / 보안 / 책임자). OpenAI·Supabase·Vercel 처리 위탁 명시.
- 콘텐츠는 V0 베타용 placeholder. 실제 법무 검수는 V0 출시 직전 별도 task.
- `returnHome()`·Escape 키에서 `closeDocModal()` 호출.

기타:

- `:root` 토큰 추가 0개. v0.5와 동일 8색 + 2이징 + Playfair Display/Manrope.
- ADR-006 준수: 사람 사진/외부 풍경 0건. How it works의 step-art SVG와 curated-preview 카드 모두 가먼트·아이콘 라인 드로잉만.
- ADR-009 준수: studio 워크스페이스의 mini-action 3개 변경 없음.
- studio·auth-screen·history-page·drawer·menu-tray·carousel은 v0.5와 동일.

다음 피드백 포인트:

- 어필리에이트 고지 카피가 법적으로 충분한지 V0 출시 직전 법무 검수 필요.
- FAQ 섹션은 V0 출시 후 사용자 피드백 보고 결정. 추가 시 footer 위 별도 섹션 또는 별도 페이지로.
- About 페이지/회사 정보 페이지가 별도 필요한지 V0 출시 직전 결정.
- 이용약관/개인정보 모달이 URL로 공유 안 되는 약점. 부트스트랩(Next.js) 단계에서 `/terms`, `/privacy` 라우트로 승격.

## 15. v0.0 기준 핵심 판단

I.F의 승부처는 랜딩의 화려함보다 `룩 결과 뷰 + 상품 연결 패널`이다.

사용자가 프롬프트를 입력하고 결과를 봤을 때 다음 감각을 받아야 한다.

> 아, 이건 진짜 입을 수 있겠다.

따라서 초기 디자인 검증은 다음 질문에 집중한다.

- 프롬프트 입력이 쉽고 매력적인가?
- AI 룩 결과가 충분히 입고 싶어 보이는가?
- AI 룩 결과에서 전체 착장과 상품화 가능한 아이템 구조가 명확히 보이는가?
- 결과 이미지가 한국 데일리 패션 서비스의 로컬 맥락에 맞는가?
- 상품 패널이 실제 구매 행동으로 이어질 만큼 명확한가?
- 모바일에서도 핵심 흐름이 막히지 않는가?

## 16. 다음 피드백 요청 항목

다음 버전에서 우선 결정하면 좋은 항목:

1. 브랜드 톤이 더 고급스러워야 하는지, 더 친근해야 하는지
2. 랜딩 첫 화면을 영상 중심으로 갈지, AI 룩 이미지 중심으로 갈지
3. 메인 화면을 더 작업 도구처럼 만들지, 더 매거진처럼 만들지
4. 포인트 컬러를 Deep Rose 계열로 갈지, Lime Yellow 계열로 갈지
5. 모바일을 MVP의 최우선 시안으로 둘지, 데스크톱과 병행할지

## 17. Version History

| Version | Date | Notes |
| --- | --- | --- |
| v0.0 | 2026-05-02 | PRD 기반 초기 웹 디자인 방향 제안 |
| v0.1 | 2026-05-04 | Brunello Cucinelli Online Boutique AI 레퍼런스 반영 |
| v0.2 | 2026-05-05 | 레퍼런스 3종의 역할 재정의: 랜딩, 메인 입력 전, 메인 결과 상태를 분리. 잘못 제작한 v0.4 시안 삭제 |
| v0.3 | 2026-05-05 | v0.3 기반 발전안 추가: `if-homepage-v0.3.1_brunello_flow.html` 제작, 랜딩과 메인 워크스페이스 흐름 분리 |
| v0.3.1-fix | 2026-05-05 | I.F 의미를 Intelligent Fashion으로 수정, 랜딩 전용 상단바/워크스페이스 메뉴 중복 제거, 랜딩 타이틀 크기 축소 |
| v0.3.2 | 2026-05-07 | 사용자 제공 프로토타입과 프롬프트 문서를 분석해 풀스크린 AI atelier 흐름, 검색 도크, quote/loading/results 신 전환, 우측 패널 인터랙션을 반영 |
| v0.3.2-fix | 2026-05-07 | `#studio` 앵커/스크롤 기반 전환을 제거하고 단일 viewport scene 전환, Get Started 이후 중앙 프롬프트 UI 등장 원칙으로 보정 |
| v0.3.3 | 2026-05-13 | 핵심 폰트 가이드(Instrument Sans + Inter + SUIT) 적용 비교 시안 제작 후 사용자 검토 결과 채택 보류 (시안·폰트 가이드 모두 삭제, Playfair Display + Manrope 조합 유지) |
| v0.4.0 | 2026-05-13 | Welcome 블러 페이드 인 애니메이션 적용. quote scene 제거로 결과 흐름 단축. 결과 페이지를 풀블리드 carousel + 적응형 그라디언트 배경 + 슬라이드별 가먼트 SVG로 재구성. 우측 상품 패널을 룩별 슬라이드 드로어로 전환. 프롬프트 복사 버튼 추가. 랜딩/스튜디오 Menu 버튼 통합과 menuTray 위치 보정. Login 모달 도입. 로딩 SVG 3종(드레스폼·옷걸이·드레이프) 비교 후 옷걸이(`v0.4.0b_garment.html`) 채택 |
| v0.4.1 | 2026-05-13 | 랜딩·인트로의 외국 풍경 사진을 모두 제거하고 CSS 그라디언트 + 그레인 텍스처로 대체(인종/지역 마커 제거). 결과창 패션 우선 재배치: 가먼트 사이즈 확대, Office 가먼트 콘트라스트 회복(다크 잉크), 카운터·타이틀·CTA 비중 축소, carousel-nav 하단 중앙 이동, copy prompt 우상단 작은 캡슐로 정돈. `View products` ↔ `Copy prompt` 위치 스왑(룩별 액션은 우상단 고정, 글로벌 카피는 슬라이드 인라인) |
| v0.5 | 2026-05-17 | Fashion Discovery Layer — `body[data-page]` 4-tier routing(landing/auth/history/studio). 필수 신규 3화면(auth-screen 소셜 3버튼, history-page 로그인/비로그인 2상태, 모바일 반응형+drawer-bag 바텀시트). Explore 진입 피드(intro 흡수, sticky search, 시즌 칩 5개, 톤 그라디언트+가먼트 SVG 12 그리드). 워크스페이스 mini-action 3개 시각화(Save 자물쇠 변형, More Like This 캡슐, 정제 칩 5종) + 로딩 카피 v0.4.1 에디토리얼 영문 유지 + `.loading-title` 사이즈 축소(clamp 28/3.6vw/48). carousel-nav 상단 중앙 이동·slide-counter 제거. body 레벨 휠 forwarder + overscroll-behavior 추가. `:root` 토큰 변경 없음, ADR-006/009 준수, drawer-wishlist·modalLogin 제거 |
| v0.6 | 2026-05-20 | Landing Long-form — PRD §9.1/§11.1/§16 충족. `.landing` 풀스크린 overlay → in-flow scrollable 페이지 전환(`html/body { overflow: auto }`, `.landing { position: relative; min-height: 100vh }`). studio z-index 10→100 + body.atelier-ready 시 fixed overlay/scroll lock. Hero 하단 scroll-hint(chevron + Discover the studio). 신규 스크롤 섹션 3종: How it works(3-step 에디토리얼, 카드 X), Today's curated(Explore 6 카드 미리보기 + Start the studio CTA), Site footer(이용약관·개인정보 링크 + 어필리에이트 고지 + ©). IntersectionObserver `.reveal`/`.in-view` blur fade-in. 이용약관 6섹션·개인정보처리방침 8섹션 풀스크린 모달(modal-doc 변형). 휠 forwarder는 atelier-ready일 때만 동작, returnHome 시 window.scrollTo(0,0). `:root` 토큰 변경 없음, ADR-006/009 유지 |
| v0.7.3 | 2026-05-27 | v0.7.2 후속 보정 — 사용자 피드백 6건. ① **hero-title 안 보임**: `.hero-title`이 `background-clip:text + color:transparent` 그라데이션이라 `.reveal-words` splitWords가 텍스트를 inner span으로 분해하면서 각 단어가 transparent로 떨어져 완전히 사라진 문제. 그라데이션은 v0.7.1.2에서 이미 매우 옅었기에(#fbfbfa→#e8e8e6) 솔리드 `color: var(--white)`로 전환. 시각 손실 거의 없음. ② **"Six directions to begin." g 잘림**: `.reveal-words .word { overflow: hidden }`이 descender(g·y·p)를 클립. `padding-bottom: 0.18em; margin-bottom: -0.18em`으로 클립 영역을 descender 아래로 확장, 베이스라인 정렬은 negative margin으로 상쇄. ③ **page-fade 영역 과대**: 42vh 수직 그라데이션 zone × 2가 콘텐츠를 멀리 떨어뜨림. 사용자 표현 "그라데이션보다 효과·애니메이션으로 전환". zone 마크업·CSS 완전 제거 → `.section-in` 클래스 + sectionObserver(IntersectionObserver, threshold 0.15, rootMargin 0 0 -10%) 신규. how-it-works·curated-preview·site-footer 자체를 관찰해 진입 시 내부 콘텐츠가 stagger fade+translateY로 등장. ④ **hero kicker 카피 변경**: "AI Lookbook / Seoul Daily Wear" → "Only AI Lookbook / Built for your day" (사용자 3개 옵션 중 첫 번째 선택). 지역(Seoul) 마커 제거, 명시적 차별화(Only) + 개인화(your day) 강조. ⑤ **auth-screen + scene-loading 워밍 브라운 잔존**: 로그인 화면·로딩 화면의 `radial(rgba(180,140,88,...))` + linear(`#0b0908→#1b140f`) 워밍 그라디언트 → `radial(rgba(61,79,107,...))` + linear(`#0a0c12→#0a0c10`) 슬레이트로 교체. 페이지 전체 톤 통일. 부수적으로 워밍 화이트 `rgba(255,250,242,...)` 11곳 → 중성 `rgba(255,255,255,...)` 일괄. social-google hover `#f5f1ea` → `#e8eaf0`. ⑥ **studio 프롬프트창 로즈 잔존**: `.dock` `rgba(17,15,13,0.54)` → `rgba(13,16,22,0.58)` cool slate. `.dock.dim` `rgba(76,60,46,0.42)` → `rgba(40,50,65,0.46)`. `.product-panel` 화이트 0.68 워밍 → 중성. `.panel-copy`·`.product-item small` `#776f66`/`#7b746b`/`#6f685f` 워밍 회색 → `#5a5f68` 슬레이트 회색. `.explore-search` bg도 워밍 → 중성. ADR·구조 변경 없음. |
| v0.7.2 | 2026-05-27 | 스크롤 모션·깊이감·푸른 톤 통합 — 사용자가 patternbreaking-vibe-prototype 레퍼런스를 보고 (a) 평면 검정 hero에 깊이가 부족, (b) 섹션 간 색 교체가 끊겨 보임, (c) IF 토픽바가 페이퍼 영역에서 안 보임, (d) Get Started/intention 에스프레소 브라운을 푸른 톤으로 바꾸고 글래스 마감 추가, (e) How it works 헤드라인·step-num 좌우 분리 정렬 어색 — 5건 피드백. 외부 라이브러리(GSAP/Lenis) 없이 vanilla JS + CSS만으로 이식. ① `--accent #4a2e16` → `#3d4f6b` muted slate (사용자 옵션 4개 중 1번 선택). `--accent-rgb` 신규. ② `.cta.cta-accent`: solid 다크 브라운 → glass(`rgba(var(--accent-rgb),0.55)` + `backdrop-filter: blur(14px) saturate(1.1)`, hover 0.72). `.cta` 기본형 hover도 glass 통일. ③ `.landing` background: `#121211` solid → 3-layer 합성(radial 푸른 글로우 + radial 다크 비네트 + linear `#14161c→#0a0b0e`). grain noise opacity 0.07 → 0.06. hero-panel border/opacity ↑ + `backdrop-filter: blur(8px)`. ④ 신규 `.page-fade-to-paper` / `.page-fade-to-ink` zone × 2 — 42vh 수직 그라데이션으로 다크↔페이퍼 부드러운 전환. 순수 CSS, sticky pin·JS 불필요. *v0.7.3에서 영역 과대로 제거됨, 섹션 stagger로 대체.* ⑤ 랜딩 topbar 위치 이동 — `<section class="landing">` 자식 → `<body>` 직속(`.landing-topbar` 클래스). `.landing`이 `z-index:1`로 격리되면 mix-blend가 형제 섹션 위에서 작동 안 함 → body 직속 + `mix-blend-mode: difference; color: #ffffff`로 다크 영역=흰, 페이퍼 영역=자동 검정. studio/auth/history 진입 시 `display: none`. ⑥ 신규 `.reveal-words` 클래스 + `splitWords()` JS — 텍스트를 단어 단위 span 분해, `<strong class="accent">` 내포 요소는 단어 1개 단위로 보존. `translateY(110%→0)` 60ms stagger. hero-title·how-it-works·curated headlines에 적용. ⑦ `.how-it-works .section-inner` 2-column grid(0.82fr 1.18fr) → block 풀폭 단일 컬럼. 헤드라인·서브카피·steps가 모두 좌측 시작선 정렬. section-sub 14→17px (가독성). step grid `88px \| 1fr \| 200px`. |
| v0.7.1.2 | 2026-05-26 | v0.7.1.1 추가 스크린샷 피드백 재보정 — ① **refine-chip가 여전히 안 보이는 문제**: `.chip` base(line 1786) 정의가 `.refine-chip`(line 1396)을 specificity 충돌로 덮어쓰는 버그(둘 다 0,0,1,0이지만 .chip이 뒤에 옴) → selector를 `.chip.refine-chip`로 강화(0,0,2,0)해서 항상 이김. `backdrop-filter: none` 명시로 .chip base의 blur(10px) 차단, border 통째 재정의로 흐릿한 base border도 차단. season-prompts chip도 동일 처리. ② **Hero descender(y, g) 잘려보임**: 그라데이션 바닥 `#c8c8c5` 진한 회색이 다크 hero 배경에서 너무 묻혀 descender가 사라진 듯 보임 → `#e8e8e6` 아주 옅은 회색으로 변경(거의 흰색 유지). `padding-bottom: 0.12em` 추가로 descender 렌더 여유 확보. ③ **scroll-hint 정렬 여전히 어긋남**: `scrollbar-gutter: stable`이 position:fixed topbar에는 영향 못 미침 + `letter-spacing: 0.16em` trailing space로 라벨 시각 중심 ±1px 시프트 → `position: absolute` + `transform: translateX(-50%)` 방식 폐기, `<div class="scroll-hint-wrap">`로 감싸서 `left:0 right:0 + display:flex justify-content:center`로 변경. 전폭 컨테이너 안에서 flex 중앙 정렬이라 letter-spacing/chip width/scrollbar 등 변수에 무영향. `text-indent: 0.16em`으로 라벨 자체 시각 중심도 보정. |
| v0.7.1.1 | 2026-05-26 | v0.7.1 추가 스크린샷 피드백 3건 보정 — ① **Refine·season chip 가시성**: paper(#f5f5f3) 위에서 chip background `rgba(255,255,255,0.7)` 반투명이 거의 안 보이는 문제 → `#ffffff` 솔리드 + border `rgba(26,26,26,0.25)`로 또렷한 카드 느낌. hover는 `var(--cream)` + `var(--ink)` border. ② **Results scene dock**: dock 변형 `.dim`(다크 갈색 그라데이션) → `.cream`(paper 친화 반투명 흰) — results가 paper 단일 배경이 됐으므로. JS `setMode()` 갱신. ③ **Topbar(IF) vs Scroll·Get Started 정렬**: topbar는 `position: fixed`라 뷰포트 기준 중심, landing 내부 absolute 요소는 body(스크롤바 폭 -15px) 기준 중심이라 가로 라인 불일치. `html { scrollbar-gutter: stable }`로 스크롤바 폭 항상 예약 → 모두 같은 가로 중심선. ④ **Hero title 잘림**: `--t1: clamp(56px, 9vw, 128px)` 큰 모니터에서 128px 두 줄 "Style your Imagination."이 viewport 상단 padding 위로 넘쳐 `overflow: hidden`에 잘리는 문제 → `clamp(48px, 7vw, 96px)`로 conservatively 축소. line-height `0.96 → 1.02`로 wrap 시 라인 간격 확보. |
| v0.7.1 | 2026-05-26 | v0.7 시안 렌더 확인 후 4가지 보정 — ① **`--accent` `#6a6234` 다크 올리브 브라운 → `#4a2e16` 에스프레소 브라운** (사용자: '녹색 기미가 거슬림'). cta-accent hover도 `#321e0c`로 같이 갱신. ② **Hero scroll-hint** 마크업을 `.landing-content` 자식 → `.landing` 직속으로 이동 (landing-content padding 영향 제거 + viewport 가로 기준 명확한 가운데 정렬). 내부 순서 반전 — text "Scroll" → chevron(현재) → chevron(위) + text "Scroll"(아래) 자연스러운 navigation 흐름. 가시성 강화 — font 10→12, color rgba 0.6→0.75, chevron 16→22, bottom 22→36. ③ **Hero 타이틀 문구 교체** — "Wear what you imagine." → **"Style your Imagination."** (사용자 선택, 4개 대안 중 Style+Imagination 결합). auth-headline·footer-tagline도 동일 교체로 슬로건 일원화. ④ **Hero 타이틀 그라데이션 적용** — 전체 타이틀에 미세 수직 그라데이션 `linear-gradient(180deg, #fbfbfa 0%, #c8c8c5 100%)` + `background-clip: text` + `@supports` 폴백. 거대 타이포에 깊이감 부여, 옵션 (b) 채택. 그 외 ADR/구조 변경 없음. |
| v0.7 | 2026-05-26 | Typography 7원칙 재설계 — 사용자분이 outfit.hellohello / loiseau / patternbreak.ing 레퍼런스를 보고 v0.6의 italic·scaleX·따뜻한 베이지 톤이 거슬린다고 판단. **타이포 시스템 박제**: Playfair Display + Manrope → Inter + Pretendard 단일 산세리프 통일, weight 400/600/800 3단 고정(500·700 금지), size 토큰 `--t1`~`--t8` 도입. **italic 0건**: hero/section-headline/auth/gate/brand-strip/loading/slide-title/drawer-quote 모든 `<em>` 평문화. 강조는 weight·color·size 3가지로만. **scaleX(0.94/0.95) + rotate(-3deg/2.4deg/4deg/-5deg) 인위 변형 전부 제거** (loiseau 영향, 폰트 자체 비율 존중). **색상 토큰 전면 중성화**: paper/cream/white/ink/ink-soft/muted 모두 따뜻한 베이지→중성 회색으로 시프트. `--rose` 제거 → `--accent #6a6234` (다크 올리브 브라운, 페이지당 ≤2회). `--sage`/`--stone`/`--quote-a`/`--quote-b` legacy 토큰 unhook. **브랜드 마크 I.F → IF** (5곳 마크업 + body·aria-label·placeholder 전부 점 제거, Playfair 500 30px → Inter 800 24px letter-spacing -0.04em loiseau식 lockup). **Landing hero 재구조화**: bottom-copy 제거 → flex column center로 'kicker + title + Get Started'만 (patternbreak식 한 메시지 hero). `.landing::before` radial 두 개(rose+sage) + heroDrift 22s 키프레임 삭제 → 단색 #121211 + grain noise만. hero-panel-b 와인→다크 카멜·초콜릿. **Date 카드 4종 그라디언트**: 로즈/와인 → 초콜릿/카멜. **Sport 4종**: 세이지/올리브 → 다크 부라운/차콜. **Studio Results 3 슬라이드**: 룩별 톤 토글 폐기 → 모두 `var(--paper)` 통일. `body.look-*` slide-bg·slide-cta·more-like-btn·refine-chip·carousel-nav·copy-prompt-btn 톤 반전 셀렉터 모두 ink로 통일. 가먼트 SVG fill=ink. **Studio Loading**: Auth와 동일 다크 워밍 그라디언트 + grain noise 값 공유 ('잠시 멈춤·기다림'면 한 톤). **knot SVG 3곳 제거** (auth-card·brand-strip·loading-wrap) — Editorial 장식 일관성. **포인트 컬러 1회 적용**: How it works 헤드라인 `intention` + History gate `로그인` 한 단어 `<strong class="accent">` color 강조. step-num 01/02/03 color=accent. **CTA 토큰**: min 166×50 → 200×56 (모바일 터치 친화), backdrop blur 제거, `.cta-accent` 신규. **legacy dead CSS 제거**: `.scene-intro`/`.scene-quote`/`.quote-text`/`.intro-*` 셀렉터 unhook. **좌측 정렬 강제** (7원칙 §2): brand-strip·footer-link·footer-affiliate·multi-line body 모두. **placeholder 한글화**: 'Tell I.F where you are going…' → 'IF에게 어디 가는지, 어떻게 입고 싶은지 말해주세요.'. ADR-006/009 그대로 준수. v0.6은 보존(비교용). |
