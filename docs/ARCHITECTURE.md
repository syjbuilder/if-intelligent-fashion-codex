# 아키텍처

> 전체 상세: `기술/I.F V0 TRD.md` 참조. 본 문서는 harness 워크플로우가 runtime guardrail로
> 읽기 위한 압축본이다.

## 디렉토리 구조

V0는 단일 Next.js 앱으로 시작하되, 책임을 분리해 향후 모노레포/앱 전환을 막지 않는다.

```
src/
├── app/               # 페이지 + API 라우트 (라우트 핸들러 / Server Actions)
│   ├── api/           # 모든 외부 API 호출은 여기서만 (OpenAI, Supabase)
│   └── admin/         # 운영자 어드민 route (관리자 계정만 접근)
├── components/        # UI 컴포넌트
├── types/             # TypeScript 타입 정의
├── lib/               # Supabase 클라이언트, 유틸리티, 헬퍼
└── services/          # 외부 API 래퍼 (프롬프트 해석, 이미지 생성, 상품 매칭)
```

향후 확장 경로 (TRD 8장): AI 파이프라인이 커지면 `apps/web` + `apps/api`(FastAPI) +
`packages/{ui,shared,db,ai}` 모노레포로 분리. V0에서는 과도한 모노레포 복잡도를 피한다.

## 패턴

- Server Components 기본. 인터랙션이 필요한 곳만 Client Component.
- API-first: 로그인, 프롬프트 처리, AI 룩 생성, 상품 추천, 저장, 토큰 차감은 특정 웹 화면에
  종속되지 않는 API 중심 기능으로 분리한다 (React Native/Expo 전환 가능성 유지). 토큰 차감 정책은 ADR-012(1회 검색=10토큰=룩 3개 일률) — `token_transactions.amount`는 generation spend 시 항상 -10.
- 환경 분리: local / staging / production. production DB 직접 쿼리 금지, migration은
  local·staging 검증 후 반영.

## 데이터 흐름

```
사용자 프롬프트
  → Client Component
  → /api/prompts/interpret  (LLM + JSON schema + 한국어 패션 taxonomy)
  → /api/looks/generate     (OpenAI GPT Image 2 실시간 생성 또는 사전 검수 룩 조회)
  → curated look DB / 상품 DB 매칭
  → /api/looks/:id/products (상품 추천 결과)
  → Supabase 저장 (looks, saved_looks, generation_history, token_transactions)
  → UI 업데이트
```

AI 파이프라인: 데모/인기 프롬프트는 사전 생성·검수 이미지, 자유 프롬프트는 실시간 생성.
생성 실패 시 curated look fallback 또는 wearable version 재생성.

## 상태 관리

- 서버 상태: Server Components + Supabase 쿼리
- 클라이언트 상태: useState / useReducer
- 외부 상태 라이브러리는 V0에서 도입하지 않는다 (MVP 속도 우선, 필요해지면 ADR로 추가).

## 핵심 데이터 테이블

`users`, `looks`, `products`, `look_products`, `saved_looks`, `generation_history`,
`prompt_intents`, `token_transactions`, `plans`, `payments`. 사용자별 저장 룩·히스토리는
Supabase RLS로 본인만 접근. 상세 스키마는 TRD 15장.

## 인증

Supabase Auth 기반, Google → Kakao → Naver 순 구현. OAuth callback URL / redirect URI /
deep link 전략은 향후 앱 전환을 고려해 provider 설정 시 별도 확인.

## 관련 ADR (거버넌스)

코드·데이터 구조 외 운영·협업 결정:

- **ADR-010** (비개발자 commander × AI 에이전트 협업 모델): 자동 가드 4종
  (`main-branch-guard`, `secret-guard`, `tdd-guard`, `sync-warn`) + 3 step 이상 작업은
  Harness 워크플로우(`phases/`, `scripts/execute.py`)로 분해.
- **ADR-011** (문서 거버넌스): `docs/` 영문 7개 정본 + 한국어 원본(`기획/`, `기술/`) 이중
  유지. 신원·sync 짝꿍 단일 지도는 `docs/DOC_MAP.md`. drift 감지는
  `.githooks/sync-pairs.tsv` + `sync-warn.sh`. UI_GUIDE는 단일 운영 디자인 스펙,
  `디자인/I.F 디자인 계획 v0.0.md`는 archive로 역할 분리.

세부 결정·이유·트레이드오프는 `docs/ADR.md` 참조.
