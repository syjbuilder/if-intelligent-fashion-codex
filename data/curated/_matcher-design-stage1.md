# Stage 1 매칭 엔진 설계 스펙 (초안)

> **상태: 초안 · 미커밋.** Fable(아키텍트) 설계 → Opus 검토(2026-07-07). **PO 결정 항목(§8) 확정 + ~25 프롬프트 eval 통과 후** 정식화. 정식 반영처 = ADR-021 + AI_PIPELINE §4 갱신.
>
> **⚠️ 데이터 의존 주의:** 알고리즘 자체는 데이터 독립(어떤 seed든 동작). 그러나 아래 **워크드 예제(L04/L10 적중)·데이터 버그(L11 sleeveless, all-summer)는 v1 데이터(`slice-15-tagged.json`·`..._fill_v1_20260625.csv`) 기반** — PO 재검토 CSV가 들어오면 재생성되고 예제 수치는 바뀐다. 구조·공식·모듈 계약만 확정 대상이고, 구체 수치는 새 데이터 + eval로 재확정.
>
> **검토 시 검증된 사실(Opus):** ① 15룩 전부 `season:summer` (워크시트 의도와 불일치 — v1 태깅 아티팩트, 재태깅 QA에서 확인) ② picnic/street 0건(무매칭 데모 성립) ③ 가중치 스왑 veto-math 검산 일치.

범위: 규칙 기반 한국어 의도 파서 + 6차원 룩 매칭기(15룩 in-repo seed) + 0.70 게이트 + top-3 + 정직한 무매칭 + eval-ready 순수 코어. DB X · LLM X · 토큰차감 X.

---

## 0. §4 vs 원칙 §2 긴장 해소 (가장 중요)

**충돌:** AI_PIPELINE §4는 mood 0.20(color와 동률, fit 0.15보다 위). 원칙 §2는 situation/mood는 *약한 soft filter* — 객관(category/color/fit)이 지배해야 하고 soft dim 미스가 단독으로 탈락시키면 안 됨.

**결정 근거는 철학이 아니라 산수.** 지정차원 재정규화 + 0.70 게이트 하에서, 완벽한 객관 매칭 + soft dim 완전 미스인 룩이 살아남는 조건:

```
Σ W_hard(specified) / (Σ W_hard + Σ W_soft(specified)) ≥ 0.70
⟺ W_soft ≤ (3/7)·W_hard
```

`{category, color, mood}` (예: "미니멀 가디건, 아이보리")에서 cat+color 완벽, mood 0:
- **§4 원본** (cat .25, color .20, mood .20): `.45/.65 = 0.692` → **탈락. 완벽한 객관 매칭을 mood 미스가 죽임.** → §4 가중치가 게이트와 만나면 §2를 위반.
- **권장 (mood↔fit 스왑)**: `.45/.60 = 0.750` → 통과.

### 권장 초기 가중치 (§4 구조 유지, 한 쌍만 스왑 — eval-tunable)

| 차원 | §4 원본 | **권장 초기값** |
|---|---|---|
| category | 0.25 | **0.25** |
| color | 0.20 | **0.20** |
| fit | 0.15 | **0.20** ↑ |
| mood | 0.20 | **0.15** ↓ |
| price | 0.10 | **0.10** |
| season+situation | 0.10 | **0.10** |
| 합 | 1.00 | **1.00** |

§4로부터 최소 델타(mood↔fit 1스왑). 6차원 구조·category-first·합·0.70 게이트 전부 보존하면서 §2 보장 복원:
- `{cat,color,mood}` mood 미스: `.45/.60 = 0.750` 통과 (mood 단독 veto 불가)
- 5차원 전부 + 두 soft dim 모두 미스: `.65/.90 = 0.722` 통과 (soft dim 합쳐도 완벽 객관 veto 불가)
- 객관 질량 0.65 vs 주관 0.25(+price 0.10) → "객관은 무겁게" 준수

### soft-filter 시맨틱 (가중합과 특수케이스 없이 합성)
1. **가점만, 감점 없음.** 매칭된 soft dim은 `W_d·sim_d` 가산, 요청됐지만 미매칭인 soft dim은 0 가산. 음수항·곱셈페널티·boolean 사전필터 없음.
2. **미지정 ⇒ 제거.** mood 언급 없으면 mood dim을 분자·분모에서 제거(재정규화). = "미지정 차원 ≠ 탈락"의 intent 측 구현.
3. **룩 측 부재 ≠ 탈락.** 요청 situation이 없는 룩은 그 dim 재정규화 몫만 잃음. 권장 벡터에선 객관 dim ≥2개 지정·매칭이면 0.70 통과.
4. **단, soft만 준 경우는 예외.** 쿼리 전체가 soft면("피크닉 가는 스트릿룩") soft가 재정규화 100%를 지고, 완전 미스는 정직하게 ~0 → 무매칭. **이게 무매칭 데모를 작동시킴.** soft dim은 *객관과 공존할 때* 약할 뿐, 유일 신호면 쿼리 전부.
5. **soft dim은 룩의 큐레이션 의도 태그(`situation_tags`/`mood_tags`)에서만** 읽음(상품 태그 합집합 X). 의도 줄 = PO의 "매칭 과녁/ground truth"(fill 스펙). → eval에서 두 방식 비교(Open #7).

전부 ~25 프롬프트 eval의 튜닝 입력 — 상수 인라인 금지, 주입 파라미터로. 이 해소안이 ADR-021이 박제할 내용.

---

## 1. 데이터 모델

### 1.1 `MatchableLook` (seed 로드 시 LookRow + 멤버 상품에서 파생)
```ts
export interface MatchableLook {
  id: string;                          // "L01".."L15"
  title: string;                       // 표시 전용 — scorer가 절대 안 읽음
  basePrompt: string;                  // 표시 전용
  coverImageSrc: string | null;        // main(판매) 상품 이미지
  categories: ReadonlySet<Category>;   // { p.category }
  subcategories: ReadonlySet<string>;
  colors: ReadonlySet<string>;         // look.color_tags ∪ { p.color }
  fits: ReadonlySet<string>;           // look.fit_tags ∪ { p.fit }  (부록 A fit keys)
  season: Season | null;               // look.season
  situations: ReadonlySet<string>;     // look.situation_tags only (soft)
  moods: ReadonlySet<string>;          // look.mood_tags only (soft)
  prices: readonly number[];
  products: readonly SeedProduct[];    // UI payload용, scoring 아님
}
```

**fit 2단 주의:** db.ts `FITS = slim|regular|oversized`는 *DB products.fit 컬럼 전용*. seed/매칭기는 부록 A 리치 키(`capri`,`puff_sleeve`,`wide`…)로 동작. `toDbFit()` 축약맵은 DB 로딩(Stage 1 이후) 때만 작성. seed를 db.ts `Fit`로 강제 통과시키면 fit 신호 파괴 → 금지.

### 1.2 `Intent` (파서 출력)
```ts
export interface Intent {
  raw: string;
  seasons: ReadonlySet<Season>;        // OR-set: "간절기" → {spring, fall}
  situations: readonly string[];
  moods: readonly string[];
  colorGroups: readonly ColorGroup[];  // 각 그룹 = color 키들의 OR
  items: readonly ItemGroup[];         // category/subcategory 요청
  fits: readonly string[];
  budgetMaxKrw: number | null;
  matchedTerms: readonly MatchedTerm[];// provenance
  unknownTokens: readonly string[];    // eval/telemetry 전용
}
```
모든 방출 키는 사전 빌드 시 taxonomy 화이트리스트로 검증(§6 규칙) — 폐쇄성 테스트로 단언.

---

## 2. 의도 파서 — `src/lib/intent`
파일: `dictionary.ts`(데이터) · `parse.ts`(엔진) · `types.ts`.

**사전:** 한국어 표면형 → 1+ 방출(alias가 여러 차원 히트 가능: 장마철·간절기·셋업). longest-match-first 스캐너로 컴파일.
- `장마철` → season{summer} + situation rainy_day
- `간절기` → season{spring,fall} + situation season_transition
- `셋업` → item{top} + item{bottom}
- `파스텔` → colorGroup PASTEL (멤버십 = Open #3)

**파싱(형태소분석기 없이, 결정적):** ① NFKC 정규화·구두점→공백 ② longest-match 스캔(겹침 없음) ③ 미매칭 한글 청크는 접미사(`룩/스타일/코디/무드/느낌/톤`)·어미(`한/하게/스러운/인`) 1회 strip 후 재시도 ④ 예산 정규식 `(\d+)\s*만원?\s*(이하|이내|미만|까지|대)?` ⑤ 잔여 청크 − 불용어 → unknownTokens(스코어 무영향) ⑥ 차원별 dedupe.

**필수 트레이스:**
- `"봄 데이트룩, 파스텔 미니멀"` → `{seasons:{spring}, situations:[date], moods:[minimal], colorGroups:[PASTEL]}`
- `"피크닉 가는 스트릿룩"` → `{situations:[picnic], moods:[street]}` — **파싱 성공.** 무매칭은 파싱 실패가 아니라 *정직한 below-threshold 점수*여야 함. picnic/street는 §9-2 고정 키라 seed에 없어도 사전엔 항상 존재.

---

## 3. 차원별 유사도 함수 (각 `[0,1]` + evidence)

- **category** `categorySimilarity(items, look)`: ItemGroup g당 credit — subcategory 교집합 있으면 1.0 / category만 일치 0.5 / 없으면 0. `sim = Σc(g)/|items|`. (look 레벨 집합소속)
- **color** `colorSimilarity(colorGroups, look.colors)`: 그룹 키가 look.colors에 있으면 1.0 / 같은 color family면 0.5 / 없으면 0. family 부분점수 = eval-tunable(Open #4).
- **mood** (soft): `|intent.moods ∩ look.moods| / |intent.moods|`. Stage 1은 family 테이블 없음(Open #12).
- **fit** `fitSimilarity`: 요청 키당 look 키들과 max 유사도. 정확 1.0 / 같은 ladder 인접 0.5 / 아니면 0. 3 ladder(VOLUME/RISE/LENGTH, 데이터 테이블·eval-tunable). ladder 밖 키(puff_sleeve,a_line…)는 정확일치만.
- **price** `priceSimilarity(budget, prices)`: `|{p≤budget}|/|known prices|`; prices 비면 0.5 중립. budget 파싱됐을 때만 지정.
- **season+situation** (1 dim, soft): seasonSim = intent seasons와 look.season의 max 인접도(동일1.0 / 봄↔가을 0.7 / 달력인접 0.3 / 여름↔겨울 0 / all 0.8 / null 0.5). situationSim = 교집합/|intent.situations|. 둘 다 지정이면 평균, 하나면 그것.

---

## 4. 가중합 · 재정규화 · 게이트 · 랭킹
```ts
export const DEFAULT_WEIGHTS = { category:0.25, color:0.20, fit:0.20, mood:0.15, price:0.10, season_situation:0.10 };
export const MATCH_THRESHOLD = 0.70;
```
- **지정집합 S:** category⟺items>0, color⟺colorGroups>0, fit⟺fits>0, mood⟺moods>0, price⟺budget≠null, season_situation⟺seasons>0∨situations>0.
- **재정규화 점수:** `total = Σ_{d∈S} w[d]·sim_d / Σ_{d∈S} w[d]` ∈ [0,1]. |S| 무관 비교가능 → **단일 0.70 게이트 균일 적용**(inclusive, EPS 가드).
- **미지정 dim은 분자·분모 어디에도 기여 X** (안 물어본 차원 추가가 점수 못 움직임 — 테스트 불변식).
- **랭킹:** 점수 desc → 타이브레이크1 객관 subscore(cat/color/fit) desc → 타이브레이크2 seed 순서 asc. top-3(게이트 통과분만). 1~2개만 통과하면 1~2개 반환(A-path 없음, padding = Open #8).
- **telemetry:** `topScore`(게이트 미달 포함 전체 최고) → 후에 `generation_history.match_score`. 차원별 분해는 debug payload만(UI 노출 X).
- **순수성:** 시계·로케일·난수 없음; weights/threshold 주입(기본값 export)으로 eval 그리드서치.

---

## 5. 무매칭
- `noMatch` = 게이트 통과 0; `noSignal` = 파서가 아무것도 못 뽑음(UX 분리: "더 구체적으로" vs "딱 맞는 룩 아직 없어요").
- API: `data.matched:[]`, `data.no_match:true` + 파싱된 intent(이해한 것 표시 — 정직 UX 핵심) + `telemetry.top_score`.
- 스튜디오 상태머신에 `no_match` 씬 추가. `NoMatchScene`(3 variant 공유/얇은 스킨): 정직 메시지 + intent echo + seed-커버 어휘 제안칩 + 재입력. 가짜 결과·조용한 최근접 금지.
- **트레이스 "피크닉 가는 스트릿룩":** S={mood .15, season_situation .10}, wSum=.25. 15룩 전부 street∉moods·picnic∉situations → total 0.000 → topScore 0 < 0.70 → 무매칭. 큐레이션이 정직하게 picnic/street를 안 담아서 비켜감(워크시트 의도).

---

## 6. 모듈 경계 · 시그니처
- **`src/lib/seed`** (신규): `getSeedLooks()`·`getSeedProducts()` 메모이즈·순수. 원천 = `slice-15-tagged.json` + `..._fill_v1_...csv`(name/price) + `_tag-input.json`(id↔pid↔이미지, main 플래그)를 pid로 join. 권장: 병합 아티팩트 `src/lib/seed/slice15.data.json` 1회 생성 + 검증 테스트(15룩·룩당 상품≥1·main 정확히 1·태그 화이트리스트·pid join·중복 pid dedupe). **주의 데이터 버그(검증 테스트가 노출):** L11 fit_tags `"sleeveless"`(fit 키 아님), tagged.json `look` 필드에 placeholder id, 일부 non-main 상품 price/url 없음(허용).
- **`src/lib/intent`** (신규): `parseIntent(raw, dict?)` · `STAGE1_DICTIONARY` · `TAXONOMY_KEYS`. LLM 파싱 도입 시 같은 `Intent` 타입 뒤에서 교체.
- **`src/lib/match`** (신규): `scoreLook` · `matchLooks` · `DEFAULT_WEIGHTS` · `MATCH_THRESHOLD`; `similarity.ts`(6함수 개별 테스트) · `eval.ts`(`runEval → hitRate/precisionAt3`).
- **`POST /api/looks/match`** (신규 `src/app/api/looks/match/route.ts`): read-only 검색, **토큰차감·멱등키 없음**, `/api/explore`처럼 비인증(Open #11). Req `{prompt}`, Res `{ok, data:{intent, matched[], no_match, no_signal, telemetry:{top_score, threshold, specified_dimensions}}}`, 400=빈 프롬프트/>200자. 이 라우트 = 후에 `/api/looks/generate`의 B-path step 4; `top_score`↔`match_score`.
- **ResultsScene `looks` prop** (variant 무관): `src/types/ui.ts`에 `MatchedLookView{id,title,caption,prompt,imageSrc?,tone,products:ProductMock[],score?}` 추가. 3 ResultsScene 전부 내부 fixture→prop, `looks.length`(1~3) 렌더, "세 가지 방향" 카피 count-agnostic화. `StudioScene` union +`"no_match"`. `ProductMock.brand` seed 원천 없음 → 상품명/`"지그재그"`로 채움(PO 확인).

---

## 7. 워크드 예제 (v1 데이터 기준 — 새 CSV로 갱신됨)
- **적중 "봄 데이트룩, 파스텔 미니멀":** S={color .20, mood .15, seasit .10}, wSum=.45. L04·L10이 color 1.0(butter/light_blue)+mood 1.0(minimal)+seasit .15 → `.365/.45 = 0.811` 동점 → hits=[L04,L10]. 정직한 2결과(이 seed엔 pastel-date 원피스룩 없음). 계절 미스(spring vs all-summer)는 `.10·.85/.45≈.19`만 손해, 탈락 아님.
- **무매칭 "피크닉 가는 스트릿룩":** §5 트레이스, 전부 0.000 → no_match, intent에 picnic+street 담김(정직 거절 증명).
- **경계 유닛테스트:** `{cat,color,mood}` 객관완벽·mood0 → 권장 .750(통과) vs §4원본 .692(탈락) — ADR-021 결정을 못박는 테스트 쌍.

---

## 8. PO 결정 항목
1. **가중치 스왑 비준** (mood .20→.15, fit .15→.20) = ADR-021, §0 veto-math 근거. 최종 벡터는 25프롬프트 eval 후.
2. **임계값 0.70** — eval 후 유지/이동(라벨 프롬프트별 점수 히스토그램 리포트).
3. **PASTEL/NEUTRAL 멤버십** — cream은 파스텔? light_blue는? (초안: light_blue O, cream X — L14를 §7 결과에서 밀어냄)
4. color-family 0.5 부분점수 on/off(white vs ivory 인접).
5. season 인접 상수(봄↔가을 0.7, 달력인접 0.3, all 0.8).
6. 예산 시맨틱(상품별 vs 룩합; "N만원대" 해석; 감쇠 형태).
7. **soft dim = 룩의도 태그만 vs 상품태그 합집합** — eval 두 방식 비교(union이 L10의 date를 상품에서 끌어와 점수 부풀림).
8. **1~2룩만 통과 시:** 1~2개 반환(권장·정직) vs sub-threshold "비슷한 룩" 라벨 패딩.
9. **`지그재그` 플랫폼:** seed 상품이 `SOURCE_PLATFORMS`(29CM/MUSINSA/브랜드자사몰) 위반 → Stage 1 표시 전용, DB 로드 시 enum 변경(스키마 사안) or 데이터 마이그레이션. **(이번 세션 결정과 정합: 지그재그로 증명·DB enum 미변경.)**
10. **데이터 수정:** L11 sleeveless, look-name placeholder, L14 이름/내용 불일치.
11. `/api/looks/match` 공개(권장, /api/explore처럼).
12. 후보(eval이 필요 보이면만): mood-affinity family; situation 이웃 테이블.

---

## 9. TDD 테스트 플랜 (먼저 작성)
- **파서:** 데모 2 골든 트레이스 deep-equal / longest-match(파스텔블루→powder_blue) / 접미사strip / 멀티방출(장마철→summer+rainy_day) / 예산 / unknown(noSignal) / 결정성 · 사전 폐쇄성(모든 키∈TAXONOMY_KEYS).
- **유사도:** 함수별 정확/부분/미스/빈-룩측/price null중립/season 인접표/fit ladder 인접/item subcat 1.0 vs cat 0.5.
- **스코어 코어:** 재정규화 불변식(미지정 dim 무영향·전부완벽→1.0·단조·|S|=1→그 sim) / 게이트 경계(0.70 inclusive·EPS) / soft-veto 속성(`{cat,color,mood}` .750 vs §4 .692) / 타이브레이크 결정성 / maxResults 슬라이싱.
- **seed:** 15룩·main 정확1·pid join·화이트리스트(**L11 sleeveless로 실패 예상 → 데이터 고치고 테스트 유지**)·dedupe.
- **E2E:** 데모 적중 [L04,L10]≈.811 / 무매칭 topScore 0 + intent picnic+street / API 200/400/점수 UI payload 비노출.
- **eval harness:** ~25 라벨 프롬프트 `{prompt, expected, acceptableLookIds?}`, `runEval` hitRate/precision@3, CI는 리포팅(구조 sanity만 단언) → 가중치 튜닝 = 가시적 diff.

---

## 부록. 크리티컬 파일
- `src/lib/intent/{parse,dictionary,types}.ts`
- `src/lib/match/{match,similarity,types,eval}.ts`
- `src/lib/seed/index.ts`
- `src/app/api/looks/match/route.ts`
- `src/components/studio/ResultsScene.tsx`(+ variant-a/b twins + `src/types/ui.ts`)
