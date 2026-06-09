import { describe, it, expect } from "vitest";
import {
  CURATED_LOOKS,
  EXPLORE_LOOKS,
  SEASON_PROMPTS,
  PRODUCTS_MOCK,
} from "../looks-fixtures";

describe("looks-fixtures (정적 셸 데이터)", () => {
  it("curated 6장, explore 12장", () => {
    expect(CURATED_LOOKS).toHaveLength(6);
    expect(EXPLORE_LOOKS).toHaveLength(12);
  });

  it("각 룩은 tone/variant/tag/caption/prompt/id를 갖는다", () => {
    for (const look of [...CURATED_LOOKS, ...EXPLORE_LOOKS]) {
      expect(["office", "date", "sport"]).toContain(look.tone);
      expect(["a", "b", "c", "d"]).toContain(look.variant);
      expect(look.id).toBeTruthy();
      expect(look.tag).toBeTruthy();
      expect(look.caption).toBeTruthy();
      expect(look.prompt).toBeTruthy();
    }
  });

  it("룩 id는 유일하다", () => {
    const ids = [...CURATED_LOOKS, ...EXPLORE_LOOKS].map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("시즌 데모 프롬프트 5개", () => {
    expect(SEASON_PROMPTS).toHaveLength(5);
    for (const p of SEASON_PROMPTS) expect(p).toBeTruthy();
  });

  it("상품 mock은 top/bottom 카테고리를 포함하고 가격이 양수", () => {
    const cats = new Set(PRODUCTS_MOCK.map((p) => p.category));
    expect(cats.has("top")).toBe(true);
    expect(cats.has("bottom")).toBe(true);
    expect(PRODUCTS_MOCK.length).toBeGreaterThanOrEqual(4);
    for (const p of PRODUCTS_MOCK) {
      expect(p.price).toBeGreaterThan(0);
      expect(p.platform).toBeTruthy();
    }
  });
});
