# looks.csv ↔ docs/DATA_MODEL.md §15.2 매핑

DB-생성 컬럼(`id`/`created_at`/`updated_at`)과 curated에서 null인 `created_by`는 CSV에 두지 않는다.

| CSV 헤더 | looks 컬럼 | 타입/제약 | 규약 |
|---|---|---|---|
| `look_local_id` | (로컬 조인 키) | 문자열, 유일 | `look_products.csv`와 연결. 시드 시 `id`(uuid) 부여 |
| `title` | `title` | text, nullable | 룩 이름 |
| `base_prompt` | `base_prompt` | text, **NOT NULL** | 대표 프롬프트 (검색 매칭용 역프롬프트 흡수, §9-4) |
| `generated_image_url` | `generated_image_url` | text, **NOT NULL** | 사전 단계: `pending_storage:looks/<look_local_id>.png`. 시드 시 Storage 경로로 치환. **OpenAI 24h URL 금지** |
| `season` | `season` | text, nullable | spring / summer / fall / winter / all |
| `situation_tags` | `situation_tags` | text[], default `{}` | 파이프 구분, 안정 화이트리스트 |
| `mood_tags` | `mood_tags` | text[], default `{}` | 파이프 구분 |
| `color_tags` | `color_tags` | text[], default `{}` | 파이프 구분 |
| `fit_tags` | `fit_tags` | text[], default `{}` | 파이프 구분 |
| `target_user_tags` | `target_user_tags` | text[], default `{}` | 파이프 구분, 예: `20s\|30s` |
| `visibility` | `visibility` | text, NOT NULL default 'private' | curated 공개룩은 'public' |
| `is_curated` | `is_curated` | boolean, NOT NULL default false | curated는 **true** |

- `created_by`는 curated 룩에서 null(운영자 어드민 등록)이라 CSV에서 생략한다.
- 배열·콤마·화이트리스트 규약은 `products.columns.md`와 동일.
