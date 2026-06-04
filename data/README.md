# data/ — curated 룩·상품 수집 자산

I.F의 B-path(curated 검색) 핵심 자산인 룩·상품 데이터를 모으는 곳이다. 운영 방식 정본은 [`docs/AI_PIPELINE.md` §9](../docs/AI_PIPELINE.md).

## 상태

앱·DB 부트스트랩 전이라 **실제 테이블에 INSERT하지 않는다.** 수집물은 frozen 스키마(`docs/DATA_MODEL.md` §15.2~15.4)에 1:1 정합되는 **중간 CSV**로 모으고, 부트스트랩 후 시드 스크립트로 주입한다.

현재는 **운영 방식 설계 단계** — `schema/`(컬럼 매핑)·`curated/`(헤더만 있는 빈 템플릿)·`QA_CHECKLIST.md`까지다. 실제 50→500 수집은 부트스트랩과 함께/이후.

## 구조

- `schema/{products,looks,look_products}.columns.md` — CSV 헤더 ↔ DATA_MODEL 컬럼 매핑 + 규약(배열 파이프 구분, 로컬 ID 조인, placeholder).
- `curated/{products,looks,look_products}.csv` — 헤더만 있는 빈 템플릿. PO가 Google Sheets/Excel로 채운다.
- `QA_CHECKLIST.md` — 룩 1건당 통과 게이트.
- `images/looks/` — (부트스트랩 후 생성) 룩 이미지 PNG 임시 보관. 사전 단계엔 placeholder 경로만 CSV에 기입.

## 채울 때 규칙 (요약)

1. 태그는 AI_PIPELINE §9-2 "안정 화이트리스트" 안의 key만 사용한다.
2. 배열 컬럼(`*_tags`)은 파이프 구분: `casual|minimal` (콤마 아님).
3. 조인은 로컬 ID(`look_local_id`/`product_local_id`) — 실제 uuid는 시드 시 부여.
4. 상품 이미지는 외부 `image_url` 링크만, 사본 저장 금지(§9-1).
5. NOT NULL 누락·UNIQUE 위반 0, 캡션 2종 필수 — `QA_CHECKLIST.md` 통과해야 룩 확정.

> 시드 시점 변환(부트스트랩 `002` 단계, Python 스크립트): `pending_storage:looks/<id>.png` → Supabase Storage 경로, 로컬 ID → uuid FK, 파이프 문자열 → `text[]`.
