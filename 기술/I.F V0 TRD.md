# I.F V0 TRD

## 1. Document Overview

문서 목적:

본 문서는 I.F. V0의 기술 요구사항과 초기 시스템 구조를 정의한다. PRD가 "무엇을 만들지"를 정의한다면, TRD는 "어떻게 만들지"를 정의한다.

기준 문서:

- `기획/Read_history.md`
- `기획/If discovery summary.md`
- `기획/I.F V0 PRD.md`
- `기술/TRD_사전_질문사항.txt`

작성 기준:

- 1인 창업자와 AI 에이전트 기반 개발을 고려한다.
- V0는 웹 MVP로 빠르게 검증하되, 향후 모바일 앱 전환 가능성을 막지 않는다.
- 국내 패션 소비의 모바일 중심성을 고려해 모바일 웹 핵심 플로우를 V0 검증 범위에 포함한다.
- 확장성은 고려하되, 초기 구현 복잡도를 과도하게 키우지 않는다.

## 2. Technical Summary

I.F. V0는 Next.js 기반 웹 MVP로 시작한다. 데이터베이스, 인증, 스토리지는 Supabase를 우선 사용한다. AI 프롬프트 해석, 이미지 생성, 상품 매칭 로직은 초기에는 Next.js 서버 영역 또는 별도 모듈로 시작할 수 있으나, 장기적으로 FastAPI 기반 AI API 서버로 분리 가능한 구조를 전제로 설계한다.

핵심 방향:

- Frontend: Next.js
- DB/Auth/Storage: Supabase
- Deployment: Vercel + Supabase
- AI API: V0에서는 Next.js 서버 영역 중심으로 시작하고, 필요 시 FastAPI로 분리
- App strategy: 웹 MVP 우선, React Native/Expo 전환 가능성 유지
- Data strategy: curated look DB 500개를 사람이 선별하고 어드민에서 관리
- AI strategy: 사전 생성/검수 룩 + 실시간 생성의 하이브리드 방식

## 2.1 Confirmed Decisions

현재 확정된 결정:

- V0는 웹 MVP로 시작한다.
- 모바일 웹을 핵심 사용 환경으로 본다.
- 앱은 V0에서 바로 만들지 않고, React Native/Expo 전환 가능성을 열어둔다.
- 프론트엔드는 Next.js를 사용한다.
- DB/Auth/Storage는 Supabase를 사용한다.
- 배포는 Vercel + Supabase 조합을 우선한다.
- FastAPI는 V0부터 분리하지 않고, AI 파이프라인 복잡도가 커질 때 나중에 붙인다.
- 결제는 V0 Core가 아니라 V0 Extended로 둔다.
- 로그인은 Google을 먼저 구현하고, 이후 Kakao, Naver 순서로 구현한다.
- AI 이미지 생성 모델은 OpenAI GPT Image 2를 우선 테스트한다.
- AI 이미지는 사전 생성/검수 룩과 실시간 생성을 함께 사용하는 하이브리드 방식으로 시작한다.
- 프롬프트 해석은 LLM + JSON schema + taxonomy 방식으로 설계한다.
- AI 룩 생성은 한국 20-30대 여성 데일리 패션, 전체 착장 가시성, 국내 상품 매칭 가능성을 핵심 품질 기준으로 둔다.
- 기본 생성 결과는 한국 또는 동아시아권 모델, 서울/국내 일상 배경, 국내 패션 커머스 맥락을 우선한다.
- 저장/히스토리는 V0 필수 기능으로 확정한다.
- 공개 룩 탐색 피드는 V0에서 제외한다.
- curated look DB 500개는 사람이 선별하고 어드민으로 관리한다.
- 상품 링크는 V0에서 수동 입력/제휴/API 우선으로 가고, 크롤링은 후순위로 둔다.

주의:

- OpenAI GPT Image 2의 실제 API 모델명, 가격, 사용 조건은 구현 직전 공식 문서 기준으로 확인한다.

## 3. Critical Rules

- 프로덕션 DB에 직접 쿼리하지 않는다.
- 데이터 변경 또는 조회 테스트는 local 또는 staging 환경에서 먼저 검증한다.
- `.env`, API key, OAuth secret, 결제 secret, DB 접속 정보는 커밋하지 않는다.
- `main` 브랜치에 직접 push하지 않는다.
- 핵심 기능은 API-first 구조로 설계한다.
- 로그인, 프롬프트 처리, AI 룩 생성, 상품 추천, 저장, 토큰 차감은 특정 웹 화면에 종속되지 않도록 분리한다.
- 이미지 업로드, 얼굴 합성, 가상 피팅, 셀럽/인플루언서 이미지 기반 생성은 V0 범위 밖으로 둔다.
- 크롤링은 법적/운영 리스크가 있으므로 V0 핵심 의존성으로 두지 않는다.

## 4. Scope Split

V0에 모든 기능을 한 번에 완성하려 하면 개발 범위가 커진다. 따라서 V0를 Core와 Extended로 나눈다.

### 4.1 V0 Core

V0 Core는 실제 MVP 검증에 반드시 필요한 범위다.

- 랜딩 페이지
- 로그인
- 메인 프롬프트 입력 화면
- 데모/초기 프롬프트 기반 사전 생성 룩 표시
- 자유 프롬프트 기반 AI 룩 생성
- AI 룩 결과 화면
- 룩 선택 시 상품 패널 표시
- curated look DB 기반 상품 추천
- 저장/히스토리
- 운영자용 최소 어드민
- 토큰 구조 설계
- 무료 생성 횟수 제한

### 4.2 V0 Extended

V0 Extended는 V0에서 설계하거나 일부 구현할 수 있지만, Core 완성 이후 우선순위를 판단한다.

- 실제 결제 오픈
- Kakao/Naver 로그인 구현 및 안정화
- 고급 어드민
- 실시간 생성 품질 고도화
- 상품 API/제휴 연동
- 고급 필터
- 공개/비공개 저장 UI

### 4.3 V0 Excluded

V0에서 제외한다.

- 공개 룩 탐색 피드
- 자체 결제 기반 상품 구매
- 물류, 배송, 환불, CS
- 사용자 이미지 업로드
- 얼굴 합성
- 가상 피팅
- 셀럽/인플루언서 이미지 기반 생성
- 전체 쇼핑몰 자동 크롤링

## 5. Platform Strategy

### 5.1 Web MVP First

V0는 웹 기반 MVP로 시작한다.

이유:

- 개발 속도가 빠르다.
- 랜딩, 로그인, 프롬프트, 룩 결과, 상품 링크 연결을 빠르게 검증할 수 있다.
- Vercel + Supabase 조합으로 배포와 운영 부담을 줄일 수 있다.

### 5.2 Mobile-Ready Web

국내 의류 소비는 모바일 중심이므로, V0는 단순 데스크톱 우선 웹이 아니라 모바일 웹 핵심 플로우를 반드시 고려한다.

모바일 핵심 플로우:

- 모바일 랜딩
- 로그인
- 프롬프트 입력
- AI 룩 결과 세로 탐색
- 상품 패널 바텀시트
- 저장/공유
- 히스토리 접근

### 5.3 Future App Path

앱은 V0에서 바로 개발하지 않는다. 다만 다음 확장을 막지 않는 구조로 설계한다.

후보 경로:

1. Next.js 웹 MVP
2. 모바일 웹 UX 고도화
3. 앱 래퍼 또는 React Native/Expo 검토
4. 네이티브 앱 고도화

TRD 결정:

```text
I.F. V0는 웹 MVP로 시작하되, React Native/Expo 전환 가능성을 고려해 API-first 구조를 채택한다.
```

## 6. Recommended Tech Stack

### 6.1 Frontend

권장:

- Next.js
- TypeScript
- App Router

역할:

- 랜딩 페이지
- 로그인 화면
- 메인 워크스페이스
- AI 룩 결과
- 상품 패널
- 저장/히스토리
- 토큰/플랜 화면
- 어드민 화면

### 6.2 Backend

초기 권장:

- Next.js server actions 또는 API routes
- Supabase client/server SDK

AI 기능이 커질 경우:

- FastAPI 별도 서버

권장 판단:

- V0 Core에서는 Next.js와 Supabase 중심으로 단순하게 시작한다.
- AI 프롬프트 해석, 이미지 생성, 상품 매칭이 복잡해지면 FastAPI로 분리한다.
- FastAPI는 Python 기반 AI 로직을 다루기 좋지만, 처음부터 분리하면 배포와 운영 복잡도가 올라간다.

### 6.3 Database / Auth / Storage

권장:

- Supabase PostgreSQL
- Supabase Auth
- Supabase Storage

역할:

- 사용자 계정
- 룩 데이터
- 상품 데이터
- 저장/히스토리
- 토큰 거래 기록
- AI 생성 이미지 저장
- 운영자용 curated look DB 관리

### 6.4 Deployment

권장:

- Web: Vercel
- DB/Auth/Storage: Supabase
- AI API 분리 시: Railway, Render, Fly.io, Google Cloud Run 중 검토

V0 기본 배포:

```text
Next.js Web -> Vercel
Supabase DB/Auth/Storage -> Supabase
AI Provider -> 외부 이미지 생성 API
```

FastAPI 분리 후:

```text
Next.js Web -> Vercel
FastAPI AI API -> Railway/Render/Cloud Run
Supabase -> DB/Auth/Storage
```

## 7. Environment Strategy

환경은 최소 세 가지로 나눈다.

```text
local      = 개발자 컴퓨터
staging    = 실제 서비스와 비슷한 테스트 서버
production = 실제 사용자가 쓰는 서비스
```

### 7.1 Local

용도:

- 기능 개발
- UI 확인
- DB migration 테스트
- API 테스트

### 7.2 Staging

용도:

- 배포 전 검증
- OAuth callback 테스트
- 결제 테스트
- AI 생성 비용/속도 테스트
- 운영자 어드민 테스트

권장:

- Vercel preview deployment
- Supabase staging project

### 7.3 Production

용도:

- 실제 사용자 서비스

규칙:

- production DB에 직접 쿼리하지 않는다.
- migration은 local/staging 검증 후 반영한다.
- 시크릿은 환경변수로만 관리한다.

## 8. Architecture Candidate

초기에는 단일 Next.js 앱으로 시작하되, 책임을 분리한 구조를 사용한다.

```text
if-product/
  apps/
    web/
      # 사용자 웹과 초기 어드민

  packages/
    ui/
      # 공통 UI 컴포넌트

    shared/
      # 공통 타입, 상수, 유틸리티

    db/
      # DB schema, migration, seed

    ai/
      # 프롬프트 해석, 이미지 생성, 상품 매칭 로직

  docs/
    prd/
    trd/
    adr/
    design/

  scripts/
    # 데이터 seed, import/export, batch 작업
```

향후 확장 구조:

```text
if-product/
  apps/
    web/
    admin/
    api/
    mobile/

  packages/
    ui/
    shared/
    db/
    ai/
```

설계 원칙:

- V0에서는 과도한 모노레포 복잡도를 피한다.
- 다만 파일과 모듈은 앱 전환과 API 분리에 맞게 정리한다.
- 어드민은 처음에는 `apps/web` 내부 admin route로 시작할 수 있다.
- FastAPI가 필요해지면 `apps/api` 또는 별도 repo로 분리한다.

## 9. Authentication

V0 목표:

- Google
- Kakao
- Naver

구현 우선순위:

1. Google
2. Kakao
3. Naver

이유:

- Google은 구현과 테스트가 상대적으로 단순하다.
- Kakao/Naver는 국내 사용자에게 중요하지만 설정과 검수가 더 필요할 수 있다.

로그인 없이 가능한 범위:

- 랜딩 페이지 탐색
- 서비스 설명 확인
- 데모 결과 미리보기

로그인이 필요한 범위:

- 데모 프롬프트 실행
- 자유 프롬프트 생성
- 룩 저장
- 히스토리 확인
- 토큰 사용
- 결제

앱 전환 고려사항:

- OAuth callback URL
- redirect URI
- deep link
- mobile redirect handling

위 항목은 개발 전 OAuth provider 설정 시 별도 확인한다.

## 10. AI Pipeline

### 10.1 Pipeline Overview

```text
사용자 프롬프트
-> 프롬프트 의도 분석
-> 구조화 JSON 생성
-> 이미지 생성 프롬프트 변환
-> AI 룩 이미지 생성 또는 사전 생성 룩 조회
-> curated look DB/상품 DB 매칭
-> 상품 추천 결과 생성
-> 결과 저장
```

### 10.2 Demo / Initial Prompt

데모 및 초기 인기 프롬프트는 사전 생성/검수된 이미지를 사용한다.

이유:

- 이미지 품질을 통제할 수 있다.
- 생성 비용을 줄일 수 있다.
- 첫 경험의 실패율을 낮출 수 있다.
- 계절/트렌드 프롬프트를 미리 준비할 수 있다.

### 10.3 Free Prompt Generation

로그인 사용자의 자유 프롬프트는 실시간 AI 룩 생성을 지원한다.

단, 다음 예외를 둔다.

- 동일하거나 유사한 인기 프롬프트는 기존 검수 룩을 재사용할 수 있다.
- 생성 결과가 실패하면 사전 생성 룩 또는 유사 룩을 fallback으로 제공할 수 있다.

### 10.4 Image Generation Model

후보:

- OpenAI GPT Image 2
- Nano Banana
- 기타 이미지 생성 모델

TRD 초기 결정:

```text
V0에서는 OpenAI GPT Image 2를 우선 테스트한다. Nano Banana는 비교 후보로 유지한다.
```

모델 선택 기준:

- 의류 표현 품질
- 전신 또는 전신에 가까운 착장 표현
- 상의/하의 또는 원피스/아우터 등 전체 룩 구성이 명확히 보이는 정도
- 한국 패션 무드 반영
- 한국 또는 동아시아권 모델과 국내 일상 배경 표현 안정성
- 국내 온라인몰 상품과 매칭 가능한 wearable daily look 표현
- 생성 속도
- 생성 비용
- API 안정성
- 상업적 사용 조건

### 10.4.1 AI Image Generation Guardrails

AI 룩 생성 프롬프트와 후처리 QA는 다음 기준을 기본값으로 한다.

기본 생성 프롬프트에 포함할 방향:

- Korean daily fashion
- Korean or East Asian female model
- Seoul or Korean urban daily context
- full outfit visible
- visible top and bottom, or clearly visible dress/outerwear structure
- wearable outfit available from Korean online fashion malls
- realistic styling, product-matchable items

지양할 결과:

- 상반신 클로즈업 또는 얼굴 중심 이미지
- 하의가 잘리거나 전체 착장 구성이 보이지 않는 이미지
- 의류 디테일이 불명확해 상품 매칭이 어려운 이미지
- 과도한 런웨이, 코스튬, 판타지, 무대의상 스타일
- 국내 데일리 패션과 거리가 큰 해외 컬렉션/리조트/파티룩 중심 결과
- 사용자가 명시하지 않았는데 한국 패션 서비스 맥락과 동떨어진 모델/배경이 기본값이 되는 결과

실패 처리:

- 전체 착장 가시성이 부족하면 regenerate 대상으로 본다.
- 상품 매칭이 어려운 이미지가 생성되면 curated look fallback 또는 wearable version 재생성을 적용한다.
- 데모/초기 프롬프트 이미지는 위 기준을 통과한 사전 검수 이미지만 사용한다.

QA 체크:

- outfit_visibility: 상의/하의 또는 원피스/아우터 구성이 명확한가?
- korean_daily_wear_fit: 한국 20-30대 여성 데일리 패션으로 자연스러운가?
- model_context_localization: 기본 모델/배경이 한국 패션 커머스 맥락에 맞는가?
- product_matchability: 실제 국내 상품 링크와 연결 가능한 아이템 구조인가?
- prompt_alignment: 사용자의 계절/상황/무드 의도를 반영했는가?

### 10.5 Prompt Interpretation

프롬프트 해석은 LLM 기반으로 한다. 단, 완전 자유형 응답이 아니라 고정 JSON schema로 제한한다.

예상 구조:

```json
{
  "season": "summer",
  "situation": ["date"],
  "mood": ["casual", "clean", "lovely"],
  "colors": ["white", "light_blue"],
  "fit": ["semi_overfit"],
  "budget": "under_100000",
  "item_candidates": ["linen_shirt", "wide_denim"],
  "avoid_styles": [],
  "user_constraints": {
    "height": null,
    "body_concern": null,
    "preferred_fit": null
  }
}
```

필요 요소:

- JSON schema validation
- 한국어 패션 표현 taxonomy
- fallback rule
- unsafe or unsupported prompt handling
- 특수/과감한 프롬프트를 국내 상품 매칭 가능한 wearable version으로 완화하는 rule

## 11. Product / Look Data Strategy

### 11.1 Curated Look DB

V0는 curated look DB 500개로 시작한다.

운영 방식:

- 사람이 직접 룩을 선별한다.
- AI 생성 이미지와 실제 상품 링크를 함께 관리한다.
- 시즌, 상황, 무드, 색상, 핏, 아이템 태그를 구조화한다.
- 운영자 어드민에서 등록/수정/비공개 처리한다.

### 11.1.1 Curated Look DB Work Plan

curated look DB 500개는 개발 시작 전에 모두 완성할 필요는 없다. 다만 MVP 개발과 테스트를 위해 단계별로 준비한다.

권장 단계:

```text
기획/디자인 단계:
  - 룩 taxonomy 초안 작성
  - 시즌, 상황, 무드, 핏, 색상, 아이템 기준 정리
  - 대표 프롬프트 30-50개 작성

개발 초기:
  - 테스트용 curated look 20-30개 준비
  - 각 룩별 이미지, 태그, 상품 링크 최소 1-3개 입력
  - 어드민 입력/수정/조회 기능 테스트

MVP 내부 테스트:
  - curated look 100개 수준으로 확장
  - 데모 프롬프트와 인기 프롬프트 중심으로 품질 검수
  - 상품 패널과 저장/히스토리 플로우 검증

베타/출시 전:
  - curated look 300-500개로 확장
  - 계절/상황/무드별 빈 구간 보완
  - 링크 유효성, 가격, 상품 이미지 품질 점검
```

사용자가 해야 할 일:

- I.F.가 먼저 커버할 시즌/상황/무드 조합을 정한다.
- 대표 프롬프트를 모은다.
- 각 프롬프트에 맞는 룩 이미지 후보를 만든다.
- 실제 연결 가능한 상품 링크를 찾는다.
- 상품별 카테고리, 색상, 핏, 무드 태그를 붙인다.
- 어드민이 준비되기 전에는 스프레드시트로 임시 관리할 수 있다.

### 11.2 Product Links

V0는 수동 입력과 제휴/API 가능한 상품 링크를 우선한다.

크롤링은 V0 핵심 의존성으로 두지 않는다.

이유:

- 쇼핑몰별 약관 리스크가 있다.
- 상품 가격/재고가 자주 변한다.
- 크롤링 유지보수 비용이 크다.
- 1인 개발 MVP 범위를 초과할 수 있다.

권장 단계:

```text
V0: 수동 입력 + 제휴/API 가능 링크
V1: 일부 쇼핑몰/어필리에이트 API 연동
V2: 정책 검토 후 자동 수집 확장
```

### 11.2.1 Product Link Work Plan

상품 링크는 V0에서 완전 자동화하지 않는다. 처음에는 사람이 직접 검수한 링크로 시작한다.

권장 단계:

```text
개발 전:
  - 우선 연결할 쇼핑몰/브랜드 후보 목록 작성
  - 링크 사용 가능 여부와 어필리에이트 가능성 확인
  - 상품 카드에 필요한 최소 필드 확정

개발 초기:
  - 테스트 상품 링크 50-100개 준비
  - 상품명, 브랜드, 가격, 이미지 URL, 판매처, 카테고리 입력
  - 어드민에서 상품 링크 등록/수정 가능하게 테스트

MVP 내부 테스트:
  - 룩별 메인 추천 상품 조합 구성
  - 유사 상품 링크 추가
  - 품절/링크 오류 점검 방식 정리

베타/출시 전:
  - 상품 링크 500개 이상 확보 검토
  - 어필리에이트 표시 문구 정리
  - 제휴/API 연동 후보 우선순위 결정
```

사용자가 해야 할 일:

- I.F.와 잘 맞는 국내 쇼핑몰/브랜드 후보를 정리한다.
- 데모 룩에 연결할 실제 상품 링크를 직접 모은다.
- 링크가 사용자를 속이거나 과장 추천처럼 보이지 않도록 추천 기준을 기록한다.
- 어필리에이트 링크를 쓸 경우 표시 정책을 별도 문서로 정리한다.

## 12. Admin Requirements

V0에는 최소 어드민이 필요하다.

필수 기능:

- 룩 등록
- 룩 수정
- 룩 공개/비공개
- 이미지 업로드 또는 이미지 URL 등록
- 상품 링크 등록
- 상품 링크 수정
- 태그 관리
- 생성 결과 확인

최소 구현 우선순위:

1. 룩 등록
2. 이미지 업로드 또는 이미지 URL 등록
3. 상품 링크 등록
4. 태그 수정
5. 공개/비공개 변경
6. 룩 수정
7. 상품 링크 수정

V0에서 제외 가능한 어드민 기능:

- 복잡한 권한 관리
- 대량 workflow approval
- 고급 analytics dashboard
- 자동 크롤링 관리

초기 구현 방식:

- Next.js 내부 `/admin` route
- 관리자 계정만 접근
- Supabase role 또는 allowlist 기반 접근 제한

## 13. Payment / Token Strategy

V0는 토큰 구조와 결제 구조를 설계한다. 실제 결제 오픈은 Core 기능 검증 후 적용하는 것을 권장한다.

### 13.1 Token

무료 사용자:

- AI 룩 생성 3회 제공

무료 3회는 초기 기준으로 적절하다.

이유:

- AI 이미지 생성 비용을 통제할 수 있다.
- 사용자가 핵심 경험을 이해하기에 충분한 최소 횟수다.
- 결제 전환 유도에 유리하다.

### 13.2 Payment

결제는 V0 Extended로 분류한다.

권장 순서:

1. 토큰 DB 구조 설계
2. 무료 생성 횟수 제한 구현
3. 테스트 결제 연동
4. 실제 결제 오픈

결제 provider는 추후 결정한다.

검토 후보:

- Toss Payments
- PortOne
- Stripe

국내 서비스 기준으로는 Toss Payments 또는 PortOne을 우선 검토한다.

## 14. Save / History / Visibility

저장과 히스토리는 V0 Core에 포함한다.

이유:

- 생성한 룩을 다시 볼 수 있어야 사용자 가치가 유지된다.
- 저장 데이터는 이후 추천 품질 개선과 개인화의 기반이 된다.
- 저장/히스토리는 유료 전환과 재방문에 영향을 준다.

V0 범위:

- 비공개 저장
- 생성 히스토리
- 저장한 룩 다시 보기

공개/비공개:

- DB 필드에는 `visibility`를 포함한다.
- V0 UI에서는 기본 비공개로 시작한다.
- 공개 룩 탐색 피드는 V0에서 제외한다.

## 15. Initial Data Schema

초기 핵심 테이블:

```text
users
looks
products
look_products
saved_looks
generation_history
prompt_intents
token_transactions
plans
payments
```

### 15.1 users

- id
- auth_provider
- email
- nickname
- plan_type
- token_balance
- created_at
- updated_at

### 15.2 looks

- id
- title
- base_prompt
- generated_image_url
- season
- situation_tags
- mood_tags
- color_tags
- fit_tags
- target_user_tags
- visibility
- is_curated
- created_at
- updated_at

### 15.3 products

- id
- product_name
- brand_name
- source_platform
- product_url
- image_url
- price
- category
- subcategory
- color
- fit
- material
- mood_tags
- season_tags
- situation_tags
- created_at
- updated_at

### 15.4 look_products

- id
- look_id
- product_id
- item_role
- recommendation_type
- sort_order
- created_at

### 15.5 saved_looks

- id
- user_id
- look_id
- visibility
- created_at

### 15.6 generation_history

- id
- user_id
- prompt
- interpreted_prompt_id
- generated_look_id
- status
- created_at

### 15.7 prompt_intents

- id
- user_id
- raw_prompt
- parsed_json
- season
- situation_tags
- mood_tags
- budget
- created_at

### 15.8 token_transactions

- id
- user_id
- transaction_type
- amount
- reason
- related_generation_id
- created_at

## 16. Initial API Spec

초기 API 후보:

```text
GET  /api/me
POST /api/auth/callback

POST /api/prompts/interpret
POST /api/looks/generate
GET  /api/looks/:id
GET  /api/looks/:id/products

POST /api/saved-looks
GET  /api/saved-looks
DELETE /api/saved-looks/:id

GET  /api/history

GET  /api/tokens/balance
POST /api/tokens/use

GET  /api/admin/looks
POST /api/admin/looks
PATCH /api/admin/looks/:id

GET  /api/admin/products
POST /api/admin/products
PATCH /api/admin/products/:id
```

V0에서는 API route 이름과 payload를 개발 전 별도 API spec 문서에서 확정한다.

## 17. Main Screens

V0 필수 화면:

- 랜딩
- 로그인
- 메인 프롬프트 화면
- AI 룩 결과
- 상품 패널
- 저장/히스토리
- 토큰/플랜
- 어드민

모바일 필수 패턴:

- 하단 바텀시트 상품 패널
- 세로 룩 탐색
- 명확한 저장 버튼
- 생성 중 상태
- 토큰 부족 상태

## 18. Observability / Logging

V0에서 최소한 기록해야 할 이벤트:

- landing_view
- get_started_click
- login_success
- prompt_submit
- prompt_interpret_success
- look_generation_start
- look_generation_success
- look_generation_failed
- look_click
- product_link_click
- save_look
- token_used
- payment_success
- payment_failed

초기에는 Supabase 테이블 또는 간단한 analytics 도구로 시작한다.

## 19. Security / Privacy

개인정보 최소 수집 원칙:

- 이메일
- 닉네임
- 로그인 provider
- 저장 룩
- 생성 히스토리
- 선택 입력값

신체 관련 입력:

- 키, 몸무게, 피부톤, 선호 핏 등은 선택 입력으로 둔다.
- V0에서는 얼굴 이미지나 신체 이미지를 수집하지 않는다.

보안 원칙:

- 시크릿은 환경변수로 관리한다.
- RLS 정책을 적용한다.
- 사용자별 저장 룩과 히스토리는 본인만 접근 가능해야 한다.
- 어드민 route는 관리자만 접근 가능해야 한다.

## 20. Open Questions

TRD 이후 개발 전 확정해야 할 질문:

1. OpenAI GPT Image 2의 실제 API 모델명, 가격, 사용 조건은 구현 시점 공식 문서 기준으로 무엇인가?
2. Nano Banana는 어떤 품질/비용 차이가 있으며, V0 비교 후보로 유지할 가치가 있는가?
3. 결제 provider는 Toss Payments, PortOne, Stripe 중 무엇을 우선할 것인가?
4. Supabase Auth로 Kakao/Naver 구현이 충분한가, 별도 OAuth 처리가 필요한가?
5. curated look DB 500개의 초기 입력 방식은 어드민 직접 입력과 CSV import 중 무엇을 우선할 것인가?
6. 상품 링크의 어필리에이트 표시 정책은 어떻게 할 것인가?
7. staging 도메인과 production 도메인은 어떻게 나눌 것인가?

## 21. ADR Candidates

초기 ADR 후보:

- ADR-001: V0는 웹 기반 MVP로 시작하되 앱 전환 가능성을 고려한다.
- ADR-002: V0의 핵심 입력은 텍스트 프롬프트로 한다.
- ADR-003: 초기 데이터는 curated look DB 500개로 시작한다.
- ADR-004: V0에서는 자체 결제를 통한 상품 구매를 제공하지 않는다.
- ADR-005: 추천 단위는 개별 상품보다 전체 룩 중심으로 한다.
- ADR-006: 이미지 업로드, 얼굴 합성, 가상 피팅은 V0에서 제외한다.
- ADR-007: AI 이미지는 사전 생성/검수 룩과 실시간 생성을 함께 사용하는 하이브리드 방식으로 시작한다.
- ADR-008: V0는 Next.js + Supabase + Vercel 조합으로 시작한다.
- ADR-009: FastAPI는 V0 Core에서 분리하지 않고, AI 파이프라인 복잡도가 커질 때 도입한다.
- ADR-010: 결제는 V0 Core가 아니라 V0 Extended로 분리한다.

## 22. Development Readiness Criteria

실제 개발 착수 전 완료 기준:

- TRD 초안 완료
- UX Flow 완료
- 핵심 화면 와이어프레임 완료
- 데이터 스키마 초안 완료
- API Spec 초안 완료
- AI 파이프라인 초안 완료
- 초기 ADR 작성 완료
- MVP 백로그 작성 완료
- 개발 환경 세팅 방향 확정
