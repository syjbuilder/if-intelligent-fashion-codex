// 가중합 · 지정차원 재정규화 · 0.70 게이트 · 랭킹.
// 설계: data/curated/_matcher-design-stage1.md §0/§4.

import type { Intent } from "@/lib/intent/types";
import type {
  Dimension,
  LookScore,
  MatchHit,
  MatchOptions,
  MatchResult,
  MatchableLook,
  ScoredDim,
  Weights,
} from "./types";
import {
  categorySimilarity,
  colorSimilarity,
  fitSimilarity,
  moodSimilarity,
  priceSimilarity,
  seasonSituationSimilarity,
} from "./similarity";

/** §0 화해안: §4에서 mood↔fit 1스왑. 합 1.0. eval-tunable(ADR-021이 박제). */
export const DEFAULT_WEIGHTS: Weights = {
  category: 0.25,
  color: 0.2,
  fit: 0.2,
  mood: 0.15,
  price: 0.1,
  season_situation: 0.1,
};
export const MATCH_THRESHOLD = 0.7;

const EPS = 1e-9;
const OBJECTIVE_DIMS = new Set<Dimension>(["category", "color", "fit"]);

/** intent가 실제로 지정한 차원만. 미지정 dim은 분자·분모 어디에도 안 들어간다. */
export function specifiedDims(intent: Intent): Dimension[] {
  const s: Dimension[] = [];
  if (intent.items.length > 0) s.push("category");
  if (intent.colorGroups.length > 0) s.push("color");
  if (intent.fits.length > 0) s.push("fit");
  if (intent.moods.length > 0) s.push("mood");
  if (intent.budgetMaxKrw != null) s.push("price");
  if (intent.seasons.length > 0 || intent.situations.length > 0) s.push("season_situation");
  return s;
}

function dimSimilarity(dim: Dimension, intent: Intent, look: MatchableLook) {
  switch (dim) {
    case "category":
      return categorySimilarity(intent.items, look);
    case "color":
      return colorSimilarity(intent.colorGroups, look.colors);
    case "fit":
      return fitSimilarity(intent.fits, look.fits);
    case "mood":
      return moodSimilarity(intent.moods, look.moods);
    case "price":
      return priceSimilarity(intent.budgetMaxKrw as number, look.prices);
    case "season_situation":
      return seasonSituationSimilarity(intent.seasons, intent.situations, look);
  }
}

export function scoreLook(intent: Intent, look: MatchableLook, weights: Weights = DEFAULT_WEIGHTS): LookScore {
  const specified = specifiedDims(intent);
  const dims: ScoredDim[] = [];
  let wSum = 0;
  let weighted = 0;
  let objective = 0;
  for (const d of specified) {
    const { similarity, evidence } = dimSimilarity(d, intent, look);
    const w = weights[d];
    wSum += w;
    weighted += w * similarity;
    if (OBJECTIVE_DIMS.has(d)) objective += w * similarity;
    dims.push({ dimension: d, weight: w, similarity, evidence });
  }
  const total = wSum > 0 ? weighted / wSum : 0;
  return { lookId: look.id, total, objectiveSubscore: objective, dims };
}

export function matchLooks(intent: Intent, looks: MatchableLook[], opts: MatchOptions = {}): MatchResult {
  const weights = opts.weights ?? DEFAULT_WEIGHTS;
  const threshold = opts.threshold ?? MATCH_THRESHOLD;
  const maxResults = opts.maxResults ?? 3;

  const specified = specifiedDims(intent);
  if (specified.length === 0) {
    return { hits: [], topScore: 0, noMatch: true, noSignal: true, specified };
  }

  const scored = looks.map((look) => scoreLook(intent, look, weights));
  const topScore = scored.reduce((m, s) => Math.max(m, s.total), 0);

  const hits: MatchHit[] = scored
    .map((s, i) => ({ s, look: looks[i] }))
    .filter(({ s }) => s.total >= threshold - EPS)
    .sort((a, b) => {
      if (Math.abs(b.s.total - a.s.total) > EPS) return b.s.total - a.s.total;
      if (Math.abs(b.s.objectiveSubscore - a.s.objectiveSubscore) > EPS) {
        return b.s.objectiveSubscore - a.s.objectiveSubscore;
      }
      return 0; // 안정 정렬 → seed 입력 순서 유지
    })
    .slice(0, maxResults)
    .map(({ s, look }) => ({ look, score: s.total, dims: s.dims }));

  return { hits, topScore, noMatch: hits.length === 0, noSignal: false, specified };
}
