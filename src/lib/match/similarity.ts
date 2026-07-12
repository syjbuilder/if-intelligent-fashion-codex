// 차원별 유사도 함수 — 각 [0,1] + evidence. 순수·결정적.
// 설계: data/curated/_matcher-design-stage1.md §3.

import type { Season } from "@/types/db";
import type { ColorGroup, ItemGroup } from "@/lib/intent/types";
import type { DimScore, MatchableLook } from "./types";

const score = (similarity: number, evidence: string[] = []): DimScore => ({ similarity, evidence });

function intersect(a: readonly string[], b: readonly string[]): string[] {
  const bset = new Set(b);
  return a.filter((x) => bset.has(x));
}

// ── §3.1 category (look 레벨 집합소속) ──────────────────────────────────
export function categorySimilarity(items: ItemGroup[], look: MatchableLook): DimScore {
  if (items.length === 0) return score(0);
  const lookCats = new Set<string>(look.categories);
  const lookSubs = new Set<string>(look.subcategories);
  const ev: string[] = [];
  let sum = 0;
  for (const g of items) {
    const subHit = g.subcategories.some((s) => lookSubs.has(s));
    const catHit = g.categories.some((c) => lookCats.has(c));
    if (subHit) {
      sum += 1;
      ev.push(`sub:${g.label}`);
    } else if (g.subcategories.length === 0 && catHit) {
      sum += 1;
      ev.push(`cat:${g.label}`);
    } else if (catHit) {
      sum += 0.5;
      ev.push(`cat~:${g.label}`);
    }
  }
  return score(sum / items.length, ev);
}

// ── §3.2 color (그룹 OR + family 부분점수) ──────────────────────────────
const FAMILY_GROUPS: Record<string, string[]> = {
  whites: ["white", "off_white", "ivory", "cream"],
  beiges: ["beige", "sand_beige", "oatmeal", "greige", "camel", "khaki_beige"],
  grays: ["gray", "light_gray", "charcoal"],
  blues: ["blue", "light_blue", "sky_blue", "powder_blue", "denim_blue", "light_denim"],
  navy: ["navy"],
  pinks: ["baby_pink", "pink", "peach", "salmon_pink"],
  purples: ["lavender", "lilac", "purple"],
  yellows: ["butter", "yellow"],
  greens: ["mint", "green", "olive"],
  reds: ["red", "burgundy"],
  blacks: ["black"],
  browns: ["brown", "chocolate"],
};
const COLOR_FAMILY: Record<string, string> = {};
for (const [fam, keys] of Object.entries(FAMILY_GROUPS)) for (const k of keys) COLOR_FAMILY[k] = fam;

export function colorSimilarity(groups: ColorGroup[], lookColors: string[]): DimScore {
  if (groups.length === 0) return score(0);
  const lookSet = new Set(lookColors);
  const lookFams = new Set(lookColors.map((c) => COLOR_FAMILY[c]).filter(Boolean));
  const ev: string[] = [];
  let sum = 0;
  for (const g of groups) {
    if (g.keys.some((k) => lookSet.has(k))) {
      sum += 1;
      ev.push(`exact:${g.label}`);
    } else if (g.keys.some((k) => COLOR_FAMILY[k] && lookFams.has(COLOR_FAMILY[k]))) {
      sum += 0.5;
      ev.push(`family:${g.label}`);
    }
  }
  return score(sum / groups.length, ev);
}

// ── §3.3 mood (soft, 정확 커버) ─────────────────────────────────────────
export function moodSimilarity(moods: string[], lookMoods: string[]): DimScore {
  if (moods.length === 0) return score(0);
  const matched = intersect(moods, lookMoods);
  return score(matched.length / moods.length, matched);
}

// ── §3.4 fit (3 ladder 인접, ladder-off 정확만) ─────────────────────────
const FIT_LADDERS: string[][][] = [
  // VOLUME
  [
    ["skinny"],
    ["slim", "fitted", "body_fit"],
    ["semi_slim"],
    ["regular", "straight"],
    ["relaxed", "semi_wide"],
    ["wide", "semi_over", "loose", "wide_straight"],
    ["over", "boxy", "baggy"],
  ],
  // RISE
  [["low_rise"], ["mid_rise"], ["semi_high_waist"], ["high_waist"], ["ultra_high_waist"]],
  // LENGTH
  [
    ["mini", "shorts_length"],
    ["bermuda"],
    ["capri", "cropped_pants"],
    ["knee_length"],
    ["midi"],
    ["long", "ankle_length"],
    ["maxi", "full_length"],
  ],
];
const FIT_POS: Record<string, { l: number; r: number }> = {};
FIT_LADDERS.forEach((ladder, li) =>
  ladder.forEach((rung, ri) => rung.forEach((k) => (FIT_POS[k] = { l: li, r: ri }))),
);

function fitKeySim(a: string, b: string): number {
  if (a === b) return 1;
  const pa = FIT_POS[a];
  const pb = FIT_POS[b];
  if (!pa || !pb || pa.l !== pb.l) return 0; // ladder-off → 정확만
  const d = Math.abs(pa.r - pb.r);
  if (d === 0) return 1; // 같은 rung 동의어
  if (d === 1) return 0.5; // 인접 rung
  return 0;
}

export function fitSimilarity(fits: string[], lookFits: string[]): DimScore {
  if (fits.length === 0) return score(0);
  const ev: string[] = [];
  let sum = 0;
  for (const f of fits) {
    let best = 0;
    for (const lf of lookFits) best = Math.max(best, fitKeySim(f, lf));
    if (best > 0) ev.push(`${f}:${best}`);
    sum += best;
  }
  return score(sum / fits.length, ev);
}

// ── §3.5 price (budget 이하 비율, 미상 0.5 중립) ────────────────────────
export function priceSimilarity(budgetMaxKrw: number, prices: number[]): DimScore {
  if (prices.length === 0) return score(0.5, ["price_unknown"]);
  const within = prices.filter((p) => p <= budgetMaxKrw).length;
  return score(within / prices.length, [`${within}/${prices.length}<=${budgetMaxKrw}`]);
}

// ── §3.6 season+situation (soft, 인접도 + 상황 커버) ────────────────────
function seasonAdj(s: Season, look: Season | null): number {
  if (look === null) return 0.5;
  if (s === look) return 1;
  if (s === "all" || look === "all") return 0.8;
  const pair = new Set<string>([s, look]);
  const has = (a: string, b: string) => pair.has(a) && pair.has(b);
  if (has("spring", "fall")) return 0.7; // 간절기 twins
  if (has("summer", "winter")) return 0; // 대척
  return 0.3; // 달력 인접
}

export function seasonSituationSimilarity(
  seasons: Season[],
  situations: string[],
  look: MatchableLook,
): DimScore {
  const seasonSpecified = seasons.length > 0;
  const situationSpecified = situations.length > 0;
  const ev: string[] = [];
  let seasonSim = 0;
  let situationSim = 0;
  if (seasonSpecified) {
    seasonSim = Math.max(...seasons.map((s) => seasonAdj(s, look.season)));
    ev.push(`season:${seasonSim}`);
  }
  if (situationSpecified) {
    const matched = intersect(situations, look.situations);
    situationSim = matched.length / situations.length;
    ev.push(...matched.map((m) => `sit:${m}`));
  }
  let sim = 0;
  if (seasonSpecified && situationSpecified) sim = (seasonSim + situationSim) / 2;
  else if (seasonSpecified) sim = seasonSim;
  else if (situationSpecified) sim = situationSim;
  return score(sim, ev);
}
