# curated 룩 QA 체크리스트

룩 1건이 "확정"되려면 아래 전부 통과해야 한다(AI_PIPELINE §9-6). 룩마다 복사해 채운다.

## 룩: __________ (look_local_id)

- [ ] **NOT NULL 누락 0**
  - looks: `base_prompt`, `generated_image_url`(placeholder 허용), `is_curated=true`
  - products(룩에 매핑된 각 상품): `product_name`, `product_url`, `image_url`, `category`
  - look_products: `item_role`, `recommendation_type`
- [ ] **태그 화이트리스트 준수** — 모든 `*_tags`·`color`·`fit`·situation·mood 값이 AI_PIPELINE §9-2 안정 화이트리스트 안. 위반 0.
- [ ] **닫힌 enum 준수** — category ∈ {top, bottom, dress, outer}, season ∈ {spring, summer, fall, winter, all}.
- [ ] **source_platform enum** — ∈ {29CM, MUSINSA, 브랜드자사몰}.
- [ ] **룩 이미지 품질 기준** — 전신 착장(상의+하의 또는 원피스+아우터) 가시. 상반신 클로즈업·하의 잘림·런웨이/코스튬 아님. (사전 단계엔 컨셉·프롬프트 수준으로 점검.)
- [ ] **상품 3~5개** 매핑 + 각 상품 **캡션 2종**(`caption_simple` + `caption_searchable`) 존재.
- [ ] **역할 매핑 유효** — `item_role`/`recommendation_type` 유효값. `main_combo` 최소 1개.
- [ ] **UNIQUE 위반 0** — (`look_local_id`, `product_local_id`, `item_role`) 조합 유일.
- [ ] **이미지 사본 저장 0** — `image_url`은 외부 링크만(§9-1).
- [ ] **배열 파이프 형식** — `*_tags`가 `a|b` 형식(콤마 아님).
