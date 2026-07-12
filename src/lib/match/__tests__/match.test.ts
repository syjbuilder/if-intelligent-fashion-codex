import { describe, it, expect } from "vitest";
import type { MatchableLook, Weights } from "../types";
import type { Intent, ItemGroup } from "@/lib/intent/types";
import { scoreLook, matchLooks, DEFAULT_WEIGHTS, MATCH_THRESHOLD } from "../match";

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

function intent(partial: Partial<Intent>): Intent {
  return {
    raw: "",
    seasons: [],
    situations: [],
    moods: [],
    colorGroups: [],
    items: [],
    fits: [],
    budgetMaxKrw: null,
    matchedTerms: [],
    unknownTokens: [],
    ...partial,
  };
}

// §4 원본 가중치 (스왑 전) — soft-veto 대조용
const W_ORIGINAL_S4: Weights = {
  category: 0.25,
  color: 0.2,
  fit: 0.15,
  mood: 0.2,
  price: 0.1,
  season_situation: 0.1,
};

const ivory = { label: "아이보리", keys: ["ivory"] };
const cardigan: ItemGroup = { label: "가디건", categories: ["outer"], subcategories: ["cardigan"] };

describe("DEFAULT_WEIGHTS / MATCH_THRESHOLD", () => {
  it("가중치 합 1.0, 임계값 0.70", () => {
    const sum = Object.values(DEFAULT_WEIGHTS).reduce((a, b) => a + b, 0);
    expect(sum).toBeCloseTo(1.0, 9);
    expect(MATCH_THRESHOLD).toBe(0.7);
  });
});

describe("재정규화 불변식", () => {
  it("안 물어본 차원은 점수에 무영향", () => {
    const i = intent({ colorGroups: [ivory] });
    const bare = look({ colors: ["ivory"] });
    const extra = look({ colors: ["ivory"], moods: ["lovely", "casual"], fits: ["over"], season: "winter" });
    expect(scoreLook(i, bare).total).toBe(scoreLook(i, extra).total);
  });
  it("|S|=1 → 점수 = 그 차원 sim", () => {
    const i = intent({ colorGroups: [ivory] });
    expect(scoreLook(i, look({ colors: ["ivory"] })).total).toBe(1); // color 1.0
    expect(scoreLook(i, look({ colors: ["white"] })).total).toBe(0.5); // family 0.5
  });
  it("지정 전부 완벽 → 1.0 (|S| 무관)", () => {
    const i = intent({
      colorGroups: [ivory],
      moods: ["minimal"],
      items: [{ label: "니트", categories: ["top"], subcategories: ["knit"] }],
    });
    const l = look({ colors: ["ivory"], moods: ["minimal"], categories: ["top"], subcategories: ["knit"] });
    expect(scoreLook(i, l).total).toBeCloseTo(1.0, 9);
  });
});

describe("soft-veto (ADR-021 못박기)", () => {
  // 완벽한 객관(category+color) + mood 미스
  const i = intent({ items: [cardigan], colorGroups: [ivory], moods: ["minimal"] });
  const l = look({ categories: ["outer"], subcategories: ["cardigan"], colors: ["ivory"], moods: ["lovely"] });

  it("권장 가중치: .45/.60 = 0.750 → 통과", () => {
    expect(scoreLook(i, l).total).toBeCloseTo(0.75, 5);
    expect(matchLooks(i, [l]).hits).toHaveLength(1);
  });
  it("§4 원본 가중치: .45/.65 = 0.692 → 탈락 (mood가 완벽 객관을 죽임)", () => {
    expect(scoreLook(i, l, W_ORIGINAL_S4).total).toBeCloseTo(0.6923, 3);
    expect(matchLooks(i, [l], { weights: W_ORIGINAL_S4 }).hits).toHaveLength(0);
  });
});

describe("게이트", () => {
  it("inclusive + EPS 경계", () => {
    const i = intent({ colorGroups: [ivory] });
    const l = look({ id: "X", colors: ["white"] }); // ivory~white family → 0.5
    expect(scoreLook(i, l).total).toBe(0.5);
    expect(matchLooks(i, [l], { threshold: 0.5 }).hits).toHaveLength(1);
    expect(matchLooks(i, [l], { threshold: 0.5 + 1e-6 }).hits).toHaveLength(0);
  });
});

describe("랭킹 / 결과 형태", () => {
  it("동점 시 seed 입력 순서 유지(안정 정렬)", () => {
    const i = intent({ colorGroups: [ivory] });
    const r = matchLooks(i, [look({ id: "L01", colors: ["ivory"] }), look({ id: "L02", colors: ["ivory"] })]);
    expect(r.hits.map((h) => h.look.id)).toEqual(["L01", "L02"]);
  });
  it("objectiveSubscore = 객관 dim 미재정규 가중합", () => {
    const i = intent({ items: [{ label: "스커트", categories: ["bottom"], subcategories: ["skirt"] }], moods: ["minimal"] });
    const l = look({ categories: ["bottom"], subcategories: ["skirt"], moods: [] });
    expect(scoreLook(i, l).objectiveSubscore).toBeCloseTo(0.25, 9); // category 0.25*1 만
  });
  it("maxResults 슬라이싱", () => {
    const i = intent({ colorGroups: [ivory] });
    const looks = ["a", "b", "c", "d"].map((id) => look({ id, colors: ["ivory"] }));
    expect(matchLooks(i, looks, { maxResults: 3 }).hits).toHaveLength(3);
  });
});

describe("무매칭 vs 무신호", () => {
  it("지정 차원 0 → noSignal + noMatch", () => {
    const r = matchLooks(intent({}), [look({ colors: ["ivory"] })]);
    expect(r.noSignal).toBe(true);
    expect(r.noMatch).toBe(true);
    expect(r.hits).toHaveLength(0);
    expect(r.specified).toEqual([]);
  });
  it("지정 있으나 게이트 미달 → noMatch(≠noSignal), topScore 노출", () => {
    const i = intent({ moods: ["street"] });
    const r = matchLooks(i, [look({ moods: ["minimal"] })]);
    expect(r.noSignal).toBe(false);
    expect(r.noMatch).toBe(true);
    expect(r.topScore).toBe(0);
  });
});
