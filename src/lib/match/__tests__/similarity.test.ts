import { describe, it, expect } from "vitest";
import type { MatchableLook } from "../types";
import type { ColorGroup, ItemGroup } from "@/lib/intent/types";
import {
  categorySimilarity,
  colorSimilarity,
  moodSimilarity,
  fitSimilarity,
  priceSimilarity,
  seasonSituationSimilarity,
} from "../similarity";

function look(partial: Partial<MatchableLook>): MatchableLook {
  return {
    id: "L",
    title: "",
    basePrompt: "",
    coverImageSrc: null,
    categories: [],
    subcategories: [],
    colors: [],
    fits: [],
    season: null,
    situations: [],
    moods: [],
    prices: [],
    products: [],
    ...partial,
  };
}

describe("categorySimilarity", () => {
  const skirt: ItemGroup = { label: "스커트", categories: ["bottom"], subcategories: ["skirt"] };
  const bottomGeneric: ItemGroup = { label: "하의", categories: ["bottom"], subcategories: [] };
  const jacket: ItemGroup = { label: "자켓", categories: ["outer"], subcategories: ["jacket"] };

  it("subcategory 일치 → 1.0", () => {
    expect(categorySimilarity([skirt], look({ categories: ["bottom"], subcategories: ["skirt"] })).similarity).toBe(1);
  });
  it("category만 일치(subcat 미스) → 0.5", () => {
    expect(categorySimilarity([skirt], look({ categories: ["bottom"], subcategories: ["slacks"] })).similarity).toBe(0.5);
  });
  it("category-generic + category 일치 → 1.0", () => {
    expect(categorySimilarity([bottomGeneric], look({ categories: ["bottom"], subcategories: [] })).similarity).toBe(1);
  });
  it("불일치 → 0", () => {
    expect(categorySimilarity([skirt], look({ categories: ["top"], subcategories: ["knit"] })).similarity).toBe(0);
  });
  it("여러 아이템은 평균", () => {
    const l = look({ categories: ["bottom"], subcategories: ["skirt"] });
    expect(categorySimilarity([skirt, jacket], l).similarity).toBe(0.5); // 1.0 + 0 → 0.5
  });
});

describe("colorSimilarity", () => {
  const ivory: ColorGroup = { label: "아이보리", keys: ["ivory"] };
  const pastel: ColorGroup = { label: "파스텔", keys: ["baby_pink", "light_blue", "butter"] };

  it("정확 일치 → 1.0", () => expect(colorSimilarity([ivory], ["ivory"]).similarity).toBe(1));
  it("같은 family(ivory~white) → 0.5", () => expect(colorSimilarity([ivory], ["white"]).similarity).toBe(0.5));
  it("다른 family(ivory~navy) → 0", () => expect(colorSimilarity([ivory], ["navy"]).similarity).toBe(0));
  it("빈 룩 색 → 0", () => expect(colorSimilarity([ivory], []).similarity).toBe(0));
  it("그룹 OR: 키 중 하나만 있어도 1.0", () => expect(colorSimilarity([pastel], ["light_blue"]).similarity).toBe(1));
});

describe("moodSimilarity", () => {
  it("전부 커버 → 1.0", () => expect(moodSimilarity(["minimal"], ["minimal", "casual"]).similarity).toBe(1));
  it("절반 커버 → 0.5", () => expect(moodSimilarity(["minimal", "lovely"], ["minimal"]).similarity).toBe(0.5));
  it("미스 → 0", () => expect(moodSimilarity(["minimal"], ["casual"]).similarity).toBe(0));
});

describe("fitSimilarity", () => {
  it("정확 → 1.0", () => expect(fitSimilarity(["slim"], ["slim"]).similarity).toBe(1));
  it("같은 rung 동의어(slim~fitted) → 1.0", () => expect(fitSimilarity(["slim"], ["fitted"]).similarity).toBe(1));
  it("인접 rung(slim~semi_slim) → 0.5", () => expect(fitSimilarity(["slim"], ["semi_slim"]).similarity).toBe(0.5));
  it("먼 rung(slim~over) → 0", () => expect(fitSimilarity(["slim"], ["over"]).similarity).toBe(0));
  it("ladder-off 키는 정확만", () => {
    expect(fitSimilarity(["puff_sleeve"], ["puff_sleeve"]).similarity).toBe(1);
    expect(fitSimilarity(["puff_sleeve"], ["a_line"]).similarity).toBe(0);
  });
  it("RISE 인접(high_waist~semi_high_waist) → 0.5", () =>
    expect(fitSimilarity(["high_waist"], ["semi_high_waist"]).similarity).toBe(0.5));
  it("요청 여러 개는 각자 max 후 평균", () =>
    expect(fitSimilarity(["slim", "over"], ["over"]).similarity).toBe(0.5)); // 0 + 1 → 0.5
});

describe("priceSimilarity", () => {
  it("budget 이하 비율", () => expect(priceSimilarity(50000, [40000, 60000]).similarity).toBe(0.5));
  it("전부 이하 → 1.0", () => expect(priceSimilarity(50000, [40000, 30000]).similarity).toBe(1));
  it("가격 미상 → 0.5 중립 + evidence", () => {
    const r = priceSimilarity(50000, []);
    expect(r.similarity).toBe(0.5);
    expect(r.evidence).toContain("price_unknown");
  });
});

describe("seasonSituationSimilarity", () => {
  it("둘 다 지정 → 평균", () => {
    const r = seasonSituationSimilarity(["spring"], ["date"], look({ season: "summer", situations: ["date"] }));
    expect(r.similarity).toBeCloseTo(0.65, 5); // (0.3 + 1) / 2
  });
  it("season만 지정", () =>
    expect(seasonSituationSimilarity(["spring"], [], look({ season: "spring" })).similarity).toBe(1));
  it("situation만 지정, 미스 → 0", () =>
    expect(seasonSituationSimilarity([], ["date"], look({ situations: ["cafe"] })).similarity).toBe(0));
  it("season 인접표", () => {
    expect(seasonSituationSimilarity(["spring"], [], look({ season: "fall" })).similarity).toBe(0.7); // 간절기 twins
    expect(seasonSituationSimilarity(["summer"], [], look({ season: "winter" })).similarity).toBe(0); // 대척
    expect(seasonSituationSimilarity(["spring"], [], look({ season: "summer" })).similarity).toBe(0.3); // 달력 인접
    expect(seasonSituationSimilarity(["spring"], [], look({ season: "all" })).similarity).toBe(0.8);
    expect(seasonSituationSimilarity(["spring"], [], look({ season: null })).similarity).toBe(0.5);
  });
});
