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

## AI 생성 실행 모델

`/api/looks/generate`의 실시간 생성(A-path)은 **동기 + `maxDuration` 상향** 모델로 시작한다 (ADR-013).

- **런타임**: Node.js runtime 라우트 핸들러. `maxDuration`을 60초로 상향한다. **Vercel Hobby(무료) 플랜이 `maxDuration` 60초를 허용**하므로 V0는 무료 플랜으로 출시한다(Vercel Pro 불필요, 2026-06-04 확인 — Fluid Compute 시 Hobby도 300초). 상세는 ADR-013.
- **병렬 생성**: 룩 3장은 `Promise.all` 병렬 호출로 OpenAI GPT Image 2(Medium·1024×1024, ADR-003)에 동시 요청해 총 지연을 단축한다. OpenAI 생성 지연은 이미지당 10~30초.
- **재시도 중복 차단**: 멱등성 키(`X-Idempotency-Key`)로 동기 요청 재시도 시 중복 차감·중복 생성을 막는다 (ADR-014, `docs/API_CONTRACTS.md` 멱등성 스펙).
- **all-or-nothing**: 룩 3장 중 일부만 성공하면 실패로 처리하고 차감 토큰을 자동 환불한다 (ADR-014 `refund_tokens()`).

정석은 비동기 작업큐(즉시 응답 + 폴링)지만, 큐·워커·상태폴링 인프라는 V0 Tier 2 볼륨(월 약 3,000 이미지)엔 과하다. V0 케이스는 동기 + `maxDuration`이 가장 단순하다. 재검토 트리거: p95 지연이 함수 한도의 70% 도달 또는 동시 생성 급증 시 비동기 전환 (ADR-013).

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

## 운영 안전장치

AI 생성 비용 runaway(버그·악의로 인한 전체 호출 폭주)를 막는 3중 안전장치 (ADR-015).
per-user 토큰 차감(ADR-012)은 한 사용자만 막으므로, 전역 상한이 따로 필요하다.

1. **OpenAI billing alert** — OpenAI 대시보드 Settings→Limits의 월 예산(Monthly budget) hard cap + email alert. 무료·PO 수작업, Phase 5 진입 전 설정. 초기값 월 $200, 알림 50/80%(2026-06-04). 계정 레벨 최후 백스톱.
2. **전역 일일 spend cap** — 당일 누적 생성 호출 수를 `generation_history`에서 카운트하고, 상한 초과 시 `/api/looks/generate`가 503 안내를 반환한다. 일일 상한 초기값 예시: 정상 일평균(~33 검색/일 = ~100 이미지)의 약 5~6배(예: 일 200 검색 = 600 이미지)로 시작, 실트래픽 데이터로 조정.
3. **수동 kill switch** — 즉시 전체 생성 차단(503).

설정값(일일 상한 수치 + kill switch on/off)은 **env 환경변수**에 둔다 — `app_config` 테이블이 아니다. 일일 cap 카운트는 새 테이블 없이 `generation_history` 당일치 조회로 계산한다 (10테이블 freeze 유지).

정석은 실시간 비용 대시보드지만 V0엔 과하다. env 선택의 트레이드오프: kill switch 토글 시 Vercel 재배포 약 1분이 들지만(비상장치라 드물게 사용) 10테이블 freeze를 유지하고 가장 단순하다. 재검토 트리거: kill switch 잦은 토글 필요 또는 비개발 운영자가 무재배포 토글해야 하면 `app_config` 테이블로 승격 (ADR-015). ADR-003 단가·ADR-012 마진 수치는 건드리지 않는다 — runaway "상한"만 추가한다.

## 환경/마이그레이션 절차

- **환경 분리**: local / staging / production. production DB 직접 쿼리 금지. 마이그레이션은 local·staging 검증 후 반영.
- **마이그레이션 순서**: `001`~`007`을 순서대로 적용한다. `006_rls_policies.sql`(전 테이블 RLS, ADR-016)·`007_token_rpc.sql`(`consume_tokens()`/`refund_tokens()`, ADR-014)을 포함한다. 상세 스키마·정책은 `docs/DATA_MODEL.md` 참조.
- **env 환경변수 목록** (시크릿은 절대 커밋하지 않는다, CLAUDE.md CRITICAL):

| 변수 | 용도 | 비고 |
|---|---|---|
| `OPENAI_API_KEY` | OpenAI GPT Image 2 호출 | 시크릿, Phase 5 진입 게이트에서 발급 |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL | public |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | public (RLS로 보호) |
| `SUPABASE_SERVICE_ROLE_KEY` | 서버 라우트 전용 쓰기 경계 | 시크릿, 서버 영역만 (ADR-016) |
| `DAILY_GENERATION_CAP` | 전역 일일 생성 호출 상한(이미지 수) | 안전장치, ADR-015. 초기값 예: 600 |
| `GENERATION_KILL_SWITCH` | 전체 생성 즉시 차단 on/off | 비상장치, ADR-015. 기본 off |

`DAILY_GENERATION_CAP`·`GENERATION_KILL_SWITCH`는 `app_config` 테이블이 아니라 env에 둔다(ADR-015). 값 변경 시 Vercel 재배포가 반영 경로이며, 일일 카운트 자체는 `generation_history` 조회로 산출한다(새 테이블 없음).

## 관련 ADR (거버넌스)

코드·데이터 구조 외 운영·협업 결정:

- **ADR-010** (비개발자 commander × AI 에이전트 협업 모델): 자동 가드 4종
  (`main-branch-guard`, `secret-guard`, `tdd-guard`, `sync-warn`) + 3 step 이상 작업은
  Harness 워크플로우(`phases/`, `scripts/execute.py`)로 분해.
- **ADR-011** (문서 거버넌스): `docs/` 영문 7개 정본 + 한국어 원본(`기획/`, `기술/`) 이중
  유지. 신원·sync 짝꿍 단일 지도는 `docs/DOC_MAP.md`. drift 감지는
  `.githooks/sync-pairs.tsv` + `sync-warn.sh`. UI_GUIDE는 단일 운영 디자인 스펙,
  `디자인/I.F 디자인 계획 v0.0.md`는 archive로 역할 분리.

백엔드 실행·안전 결정 (본 문서 §AI 생성 실행 모델·§운영 안전장치·§환경/마이그레이션 절차에 반영):

- **ADR-013** (AI 생성 실행 모델): Node runtime + `maxDuration` 동기 처리, 룩 3장 `Promise.all` 병렬.
- **ADR-014** (토큰 차감 정합성): Postgres RPC + 멱등성 + 자동 환불 — 차감 "방식"만 안전화(ADR-012 양·개수 불변).
- **ADR-015** (AI 비용 안전장치): 전역 일일 cap + kill switch + billing alert, 설정값은 env.
- **ADR-016** (보안 경계): 전 테이블 RLS + service_role 쓰기 경계 + 어드민 role + 가입 abuse 방지.

세부 결정·이유·트레이드오프는 `docs/ADR.md` 참조.
