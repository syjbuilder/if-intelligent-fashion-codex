# look_products.csv ↔ docs/DATA_MODEL.md §15.4 매핑

룩 ↔ 상품 매핑. 로컬 ID로 조인하고, 시드 시 실제 uuid FK로 변환한다. DB-생성 컬럼(`id`/`created_at`)은 CSV에 두지 않는다.

| CSV 헤더 | look_products 컬럼 | 타입/제약 | 규약 |
|---|---|---|---|
| `look_local_id` | `look_id` (FK→looks) | uuid(시드 시), NOT NULL | `looks.csv`의 `look_local_id` 참조 |
| `product_local_id` | `product_id` (FK→products) | uuid(시드 시), NOT NULL | `products.csv`의 `product_local_id` 참조 |
| `item_role` | `item_role` | text, NOT NULL | main_top / main_bottom / main_outer / similar / related |
| `recommendation_type` | `recommendation_type` | text, NOT NULL | main_combo / similar / related |
| `sort_order` | `sort_order` | int, NOT NULL default 0 | UI 표시 순서 |

제약: **UNIQUE(look_id, product_id, item_role)** — 같은 룩에 같은 상품을 같은 role로 중복 금지. CSV에서 (`look_local_id`, `product_local_id`, `item_role`) 조합이 유일해야 한다.
