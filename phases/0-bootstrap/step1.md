# Step 1: core-types

## Files To Read
Baseline: `CLAUDE.md`, `docs/ARCHITECTURE.md`, `docs/ADR.md`
DB schema: `docs/DATA_MODEL.md` §15.1~15.10, §15.3 캡션 메모
Taxonomy: `docs/AI_PIPELINE.md` §1·§9-2(안정 화이트리스트)
Prior: step 0 산출물(`src/` 구조, tsconfig paths `@/*`)

## Task
`src/types/db.ts` — 10테이블 Row 타입 + enum을 DATA_MODEL §15와 1:1로 정의한다 (DB 스키마의 TS 거울).

- 닫힌 enum 유니온: `Category`('top'|'bottom'|'dress'|'outer'), `Season`('spring'|'summer'|'fall'|'winter'|'all'), `Fit`('slim'|'regular'|'oversized'), `ItemRole`('main_top'|'main_bottom'|'main_outer'|'similar'|'related'), `RecommendationType`('main_combo'|'similar'|'related'), `PlanCode`('free'|'pro'|'max'), `Visibility`('private'|'public').
- Row 타입: `UserRow`, `LookRow`, `ProductRow`, `LookProductRow`, `SavedLookRow`, `GenerationHistoryRow`, `PromptIntentRow`, `TokenTransactionRow`, `PlanRow`, `PaymentRow` — 컬럼명·null 허용은 DATA_MODEL 정확히 반영. 배열 태그는 `string[]`(화이트리스트는 서버 검증, 타입 아님). `ProductRow`에 `caption_simple?`/`caption_searchable?`(부트스트랩 002에서 확정, optional, AI_PIPELINE §9).
- 런타임 상수 배열도 export: `CATEGORIES`, `SEASONS`, `FITS`, `ITEM_ROLES`, `RECOMMENDATION_TYPES`, `PLAN_CODES`, `VISIBILITIES` (서버 화이트리스트 검증·테스트용).
- 참고: `src/types/*`는 TDD 가드 면제이지만, enum 정합 회귀 방지로 `src/types/__tests__/db.test.ts`에 상수 멤버십 검증 테스트를 둔다.

불변: 타입만. DB 호출·외부 API 없음. 10테이블 freeze 반영(새 테이블 타입 추가 금지).

## Acceptance Criteria
```bash
npm run lint
npm run build
npm test
```

## Verification
1. 위 통과. `tsc` strict 에러 0.
2. 각 Row 타입이 DATA_MODEL §15 컬럼과 정확히 일치(누락/오타 0). 캡션 컬럼 optional 반영.
3. `phases/0-bootstrap/index.json` step 1 → `completed` + 요약.

## Prohibited
- DATA_MODEL에 없는 컬럼/테이블 추가 금지. 이유: 10테이블 freeze·스키마 정합.
- 화이트리스트(situation/mood/color/fit 값)를 타입에 하드코딩 금지(서버 검증 영역). 기존 테스트 깨지 말 것.
