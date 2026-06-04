# 백엔드 안전 보강 추적표 (Backend Hardening V0)

> **이 문서는 영문 docs/ 트리 안의 영문 단독 문서다(한국어 거울 없음). 설계 추적용 — 코드가 아니라 "무엇이 왜 위험하고 어디서 고쳐지는지"의 한 페이지 지도다.**
> PO가 백엔드 V0-critical 구멍의 위험·해법·구현 위치를 한눈에 보고, 구현 Phase에서 체크리스트로 쓰기 위한 문서.
> 단일 출처 정합: 토큰 양/개수는 ADR-012(1회 검색=10토큰=룩 3개), 단가·마진은 ADR-003($0.053≈74원/이미지)를 그대로 따른다 — 본 문서는 차감 "방식"의 안전성만 다루고 "양"은 건드리지 않는다.

---

## 0. 요약 (PO용 한 문단)

V0 백엔드에는 코드 작성 전에 설계로 메워야 할 구멍이 6개 있다: ① 느린 AI 생성 vs serverless 타임아웃, ② 토큰 차감 정합성(이중차감·음수잔액·환불없음), ③ 비용 runaway(전역 상한 없음), ④ RLS/인증 전수 + 가입 abuse, ⑤ 생성 이미지 영속화(OpenAI URL 24h 만료), ⑥ B-path 매칭 임계값 미정. 각각 ADR 또는 문서 보강으로 해법이 **설계 완료**됐고, 구현은 아래 Phase 매핑대로 진행한다. 신규 인프라(큐·워커·외부 락·새 DB 테이블)는 도입하지 않는다 — Supabase 단독 + Next.js 서버 라우트 + env로 V0를 닫는다.

---

## 1. V0-Critical 구멍 6개 매핑 추적표

| # | 구멍 | 위험 | 권장 해법 | ADR / 문서 | 구현 Phase | 상태 |
|---|---|---|---|---|---|---|
| 1 | **Serverless 타임아웃 vs 느린 AI 생성** | OpenAI 이미지 생성 10~30초인데 serverless 함수 기본 한도(Vercel Hobby 10초 등)에 걸려 타임아웃 → 사용자는 토큰만 잃고 결과 못 받음 | `/api/looks/generate`를 **Node.js runtime + maxDuration 상향(60초 목표, Vercel 플랜 한도 내)** 동기 처리. 룩 3장은 `Promise.all` 병렬 생성으로 지연 단축. 멱등성 키로 재시도 중복 차단. | **ADR-013** / `docs/ARCHITECTURE.md`(§AI 생성 실행 모델), `docs/AI_PIPELINE.md`(A-path) | **Phase 5** | 설계됨 |
| 2 | **토큰 차감 정합성** (이중차감·음수잔액·환불없음) | 더블클릭·동시요청 시 이중 차감, 잔액이 음수로 빠짐, 생성 실패해도 토큰 환불 안 됨 | **단일 Postgres RPC `consume_tokens()`**(`SECURITY DEFINER`, `SELECT … FOR UPDATE` 행잠금 → 잔액확인 → `token_transactions` insert → balance update를 한 트랜잭션) + `CHECK(token_balance >= 0)` backstop + **멱등성 키 필수화**(`X-Idempotency-Key` → `token_transactions.idempotency_key`, `unique(user_id, idempotency_key)`) + 실패/3장 미달 시 `refund_tokens()` 자동 환불(all-or-nothing) | **ADR-014** / `docs/DATA_MODEL.md`(token_transactions·007_token_rpc.sql), `docs/API_CONTRACTS.md`(멱등성·환불) | **Phase 1**(스키마·RPC) + **Phase 6**(환불 연동) | 설계됨 |
| 3 | **비용 runaway** (전역 상한 없음) | per-user 토큰은 한 사용자만 막음 — 버그/악의로 전체 호출 폭주 시 전역 상한이 없어 OpenAI 청구서 적자 | (a) OpenAI 대시보드 billing hard limit + email alert(공짜, PO 수작업), (b) **전역 일일 spend cap**: 당일 누적 생성 호출 수를 `generation_history`에서 카운트, 초과 시 generate가 **503** 안내, (c) **수동 kill switch**: 즉시 전체 생성 차단. 설정값(일일 상한 + kill switch on/off)은 **env 환경변수**(app_config 테이블 아님) | **ADR-015** / `docs/ARCHITECTURE.md`(§운영 안전장치), PO 수작업 체크리스트 | **Phase 5** + PO 수작업(billing은 Phase 5 진입 전) | 설계됨 |
| 4 | **RLS/인증 전수 + 가입 abuse** | RLS 정책이 산문만이고 `006_rls_policies.sql` 미작성, service_role 경계·어드민 모델 모호, 무료토큰 파밍 방지 없음 | `006_rls_policies.sql`에 **전 테이블 RLS enable**(읽기=본인/공개만, 쓰기=전부 service_role) + 어드민 role(`app_metadata.role=admin` JWT → `/api/admin/*` 가드, `users.role` 컬럼) + 가입 grant 멱등(`INSERT … ON CONFLICT DO NOTHING`로 1회만 10토큰) + 기본 rate limit(유저 10/분, IP 30/분, 가입 IP 5/일) | **ADR-016** / `docs/DATA_MODEL.md`(006_rls·users.role), `docs/API_CONTRACTS.md`(rate limit·에러코드) | **Phase 1** | 설계됨 |
| 5 | **생성 이미지 영속화** (OpenAI URL 24h 만료) | OpenAI가 돌려주는 이미지 URL은 약 24시간 후 만료 → 저장한 룩의 이미지가 깨짐 | 생성 즉시 **Supabase Storage에 저장**하고 `looks.generated_image_url`에는 OpenAI URL이 아니라 **Storage 경로/서명 URL**을 저장 | `docs/DATA_MODEL.md`(looks.generated_image_url), `docs/AI_PIPELINE.md`(영속화 한 줄) | **Phase 5** | 설계됨 |
| 6 | **B-path 매칭 임계값 미정** | curated look DB 검색(B-path) 매칭 점수 컷오프가 정의 안 됨 → 부적합 룩이 통과하거나 모두 fallback으로 빠짐 | **임계값 초기값 = 0.70**(초기값, 출시 후 데이터로 튜닝) + B/A 비율·매칭 점수 telemetry 로깅(`generation_history.pipeline_source` 활용) + 프롬프트 파싱 결과를 **한국어 taxonomy enum 화이트리스트**로 검증 | `docs/AI_PIPELINE.md`(임계값·telemetry·enum 검증) | **Phase 5** | 설계됨 |

---

## 2. 구멍별 보조 메모

### 구멍 1 — 동기 + maxDuration (열린 항목 있음)
- 정석은 비동기 작업큐(즉시응답 + 폴링)지만, 큐/워커/상태폴링 인프라는 V0 Tier2 볼륨(월 3,000 이미지)엔 과투자다. V0는 동기 + maxDuration이 가장 단순.
- **열린 항목 → 해결(2026-06-04)**: 검증 결과 Vercel Hobby(무료)가 maxDuration 60초를 허용한다(+Fluid Compute 300초) → **V0는 무료 Hobby로 출시, Vercel Pro 불필요**. 재검토 트리거는 동일(p95 70% 도달·동시 생성 급증 시 Pro/비동기 전환).
- 재검토 트리거: p95 지연이 함수 한도의 70% 도달 또는 동시 생성 급증 시 비동기 전환.

### 구멍 2 — 차감 "방식"만 안전화, "양"은 불변
- ADR-012의 "1회 검색=10토큰=룩 3개", "항상 3개 반환", "max_looks 비노출"은 **변경 없음**. 본 보강은 동시성·중복·환불의 안전성만 추가한다.
- 멱등성 키 위치는 `token_transactions` 테이블로 통일(`generation_history` 아님). `unique(user_id, idempotency_key)`로 같은 키 재요청은 캐시 응답.
- 3장 all-or-nothing: 부분 성공(1~2장)은 실패로 처리하고 전액 환불.

### 구멍 3 — env vs app_config 트레이드오프
- env 선택 이유: 10테이블 freeze 유지 + 가장 단순. 대가는 kill switch 토글 시 Vercel 재배포(~1분) — 비상장치라 드물게 쓰므로 수용.
- 일일 상한 초기값 예시: 정상 일평균(~33 검색/일 = ~100 이미지)의 약 5~6배(예: 일 200 검색 = 600 이미지)로 시작, 실트래픽 데이터로 조정.
- 재검토 트리거: kill switch 잦은 토글 필요 또는 비개발 운영자가 무재배포 토글해야 하면 그때 `app_config` 테이블로 승격.

### 구멍 4 — Supabase RLS로 V0 충분
- 정석은 별도 인증 서비스/WAF지만 Supabase RLS + 라우트 레벨 rate limit로 V0는 충분.
- rate limit 수치는 초기 기본값(운영 데이터로 조정): 유저당 10회/분, IP당 30회/분, 가입 IP당 5개/일.

### 구멍 5 & 6 — 데이터 자산 우선
- 이미지 영속화와 B-path 임계값은 모두 "모델보다 데이터 자산이 먼저"(AI_PIPELINE 데이터 레버) 원칙의 일부. 임계값 0.70은 출시 후 telemetry로 튜닝되는 초기값일 뿐 freeze 값 아님.

---

## 3. 신규/변경 DB 산출물 (10테이블 freeze 유지)

> **새 테이블 추가 절대 금지.** 아래는 모두 기존 10테이블에 대한 컬럼/제약/마이그레이션·RPC 추가다.

| 산출물 | 종류 | 대상 | 관련 |
|---|---|---|---|
| `006_rls_policies.sql` | 마이그레이션 | 전 테이블 RLS enable + 읽기/쓰기 정책(쓰기는 service_role) | ADR-016 |
| `007_token_rpc.sql` | 마이그레이션 | `consume_tokens()` / `refund_tokens()` RPC(행잠금·트랜잭션·환불) | ADR-014 |
| `users.role` | 컬럼 추가 | default `user`, admin 가능 | ADR-016 |
| `users` CHECK(token_balance >= 0) | 제약 추가 | 음수 잔액 backstop | ADR-014 |
| `token_transactions.idempotency_key` | 컬럼 추가 | text + `unique(user_id, idempotency_key)` | ADR-014 |
| `looks.generated_image_url` 의미 변경 | 정책 | OpenAI URL → Supabase Storage 경로/서명 URL | 구멍 5 |
| 일일 cap / kill switch 설정 | env(테이블 아님) | 일일 카운트는 `generation_history` 당일치 조회 | ADR-015 |

마이그레이션 순서: 001~005(기존 스키마) → **006_rls_policies.sql** → **007_token_rpc.sql**. (상세는 `docs/DATA_MODEL.md`·`docs/ARCHITECTURE.md` 마이그레이션 절차 참조.)

---

## 4. 구현 단계 검증 테스트 목록

> 구현 Phase에서 TDD로 먼저 작성할 테스트들. 모두 "방식 안전성" 검증이며 ADR-012 양/개수는 검증 대상이 아니다.

| 테스트 | 검증 내용 | 구멍 / ADR |
|---|---|---|
| **동시 차감(race)** | 같은 유저가 동시에 2건 generate → 행잠금으로 직렬화, 이중 차감 없음, 잔액 정확 | 구멍 2 / ADR-014 |
| **음수 잔액 방지** | 잔액 5토큰에서 10토큰 차감 시도 → 402 잔액부족, `CHECK` 위반 없이 거부 | 구멍 2 / ADR-014 |
| **멱등성** | 동일 `X-Idempotency-Key` 재요청(더블클릭/재시도) → 1회만 차감, 캐시 응답 반환 | 구멍 2 / ADR-014 |
| **자동 환불** | 3장 중 2장만 성공(부분 실패) → all-or-nothing 실패 처리 + `refund_tokens()`로 전액 환불, 잔액 복구 | 구멍 2 / ADR-014 |
| **RLS 경계** | 타인 데이터 직접 읽기/쓰기 시도 차단, 쓰기는 service_role만 통과 | 구멍 4 / ADR-016 |
| **가입 grant 멱등** | 동일 유저 가입 trigger 2회 발화 → `ON CONFLICT DO NOTHING`으로 10토큰 1회만 | 구멍 4 / ADR-016 |
| **rate limit** | 유저 10/분·IP 30/분·가입 IP 5/일 초과 시 429 | 구멍 4 / ADR-016 |
| **타임아웃 내 완료** | 룩 3장 `Promise.all` 병렬 생성이 maxDuration 한도 내 완료(p95 모니터) | 구멍 1 / ADR-013 |
| **일일 cap** | 당일 누적 호출이 env 상한 초과 시 generate가 503 안내 | 구멍 3 / ADR-015 |
| **kill switch** | env 플래그 ON 시 모든 generate 즉시 503 차단 | 구멍 3 / ADR-015 |
| **이미지 영속화** | 생성 이미지가 Supabase Storage에 저장되고 `looks.generated_image_url`이 Storage 경로/서명 URL(OpenAI URL 아님) | 구멍 5 |
| **B-path 임계값** | 매칭 점수 ≥ 0.70만 B-path 통과, 미만은 A-path fallback, pipeline_source telemetry 기록 | 구멍 6 |

---

## 5. 관련 문서

- **ADR**: ADR-013(동기+maxDuration), ADR-014(토큰 RPC·멱등성·환불), ADR-015(비용 안전장치), ADR-016(보안 경계), ADR-017(이미지 build-vs-buy), ADR-003(모델·단가), ADR-012(토큰·마진).
- **설계 문서**: `docs/ARCHITECTURE.md`(실행 모델·안전장치·env/마이그레이션), `docs/DATA_MODEL.md`(006/007·제약·컬럼·Storage), `docs/API_CONTRACTS.md`(멱등성·환불·rate limit·에러코드), `docs/AI_PIPELINE.md`(임계값·telemetry·영속화·enum 검증).
- **거버넌스**: `docs/DOC_MAP.md` §1 정본 표(이 문서는 거울 없는 단독 영문 문서).
