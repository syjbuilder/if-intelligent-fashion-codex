# products.csv ↔ docs/DATA_MODEL.md §15.3 매핑

`data/curated/products.csv`의 각 열이 `products` 테이블 컬럼에 어떻게 대응하는지 정의한다. DB-생성 컬럼(`id`/`created_at`/`updated_at`)은 CSV에 두지 않는다(시드 시 DB가 채움).

| CSV 헤더 | products 컬럼 | 타입/제약 | 규약 |
|---|---|---|---|
| `product_local_id` | (없음 — 로컬 조인 키) | 문자열, 파일 내 유일 | `look_products.csv`의 `product_local_id`와 연결. 시드 시 `id`(uuid) 부여 |
| `product_name` | `product_name` | text, **NOT NULL** | 상품명 |
| `brand_name` | `brand_name` | text, nullable | |
| `source_platform` | `source_platform` | text, nullable | '29CM' / 'MUSINSA' / '브랜드자사몰'만 |
| `product_url` | `product_url` | text, **NOT NULL** | 외부 구매 링크 |
| `image_url` | `image_url` | text, **NOT NULL** | 외부 몰 CDN URL 그대로 (사본 저장 금지, §9-1) |
| `price` | `price` | int, nullable | KRW 정수, 콤마 없이 |
| `category` | `category` | text, **NOT NULL** | top / bottom / dress / outer |
| `subcategory` | `subcategory` | text, nullable | shirt, denim, cardigan 등 |
| `color` | `color` | text, nullable | 안정 화이트리스트 color key (단일값) |
| `fit` | `fit` | text, nullable | slim / regular / oversized (단일값) |
| `material` | `material` | text, nullable | cotton, knit, denim 등 |
| `mood_tags` | `mood_tags` | text[], default `{}` | **파이프 구분** `casual\|minimal` |
| `season_tags` | `season_tags` | text[], default `{}` | 파이프 구분, spring/summer/fall/winter |
| `situation_tags` | `situation_tags` | text[], default `{}` | 파이프 구분, 안정 화이트리스트 |
| `caption_simple` | (확장 예정 컬럼) | text | 객관 속성 (AI_PIPELINE §2). 콤마 포함 시 큰따옴표로 감싼다 |
| `caption_searchable` | (확장 예정 컬럼) | text | 상황+무드+색+핏 합성 (§2). 콤마 포함 시 큰따옴표 |

규약:
- 배열 컬럼은 파이프(`|`) 구분, 공백 없이. 빈 배열은 빈 칸.
- 콤마(`,`)를 포함하는 텍스트(캡션 등)는 RFC 4180대로 큰따옴표로 감싼다(Sheets/Excel 자동 처리).
- 태그 값은 AI_PIPELINE §9-2 안정 화이트리스트 key만. 위반은 QA에서 컷.
- `caption_simple`/`caption_searchable`은 현재 DB 스키마에 없다 — 부트스트랩 `002`에서 컬럼 확정(DATA_MODEL §15.3 메모).
