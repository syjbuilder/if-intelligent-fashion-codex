import { describe, it, expect } from "vitest";
import {
  CURATED_LOOKS,
  EXPLORE_LOOKS,
  SEASON_PROMPTS,
  PRODUCTS_MOCK,
  RESULT_LOOKS,
  SAVED_LOOKS,
  PRODUCTS_BY_LOOK,
  LOOK_IMAGES,
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

  it("모든 룩 표면(curated/explore/result/saved)에 실사 imageSrc가 배선된다", () => {
    expect(LOOK_IMAGES).toHaveLength(7);
    for (const look of [...CURATED_LOOKS, ...EXPLORE_LOOKS, ...RESULT_LOOKS, ...SAVED_LOOKS]) {
      expect(look.imageSrc).toMatch(/^\/looks\/.+\.webp$/);
    }
  });

  it("결과 3장, 저장 4장", () => {
    expect(RESULT_LOOKS).toHaveLength(3);
    expect(SAVED_LOOKS).toHaveLength(4);
  });

  it("PRODUCTS_BY_LOOK은 각 결과 룩에 상품 1개 이상 + 이미지·외부링크를 갖는다", () => {
    for (const look of RESULT_LOOKS) {
      const products = PRODUCTS_BY_LOOK[look.id];
      expect(products?.length).toBeGreaterThanOrEqual(1);
      for (const p of products) {
        expect(p.imageSrc).toBeTruthy();
        expect(p.url).toMatch(/^https:\/\//);
        expect(p.lookId).toBe(look.id);
      }
    }
  });
});
