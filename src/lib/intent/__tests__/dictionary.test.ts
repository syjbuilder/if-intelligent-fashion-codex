import { describe, it, expect } from "vitest";
import { STAGE1_DICTIONARY, TAXONOMY_KEYS } from "../dictionary";

describe("STAGE1_DICTIONARY", () => {
  it("모든 표면형은 비어있지 않고 유일하다", () => {
    const surfaces = STAGE1_DICTIONARY.map((e) => e.surface);
    for (const s of surfaces) expect(s.length).toBeGreaterThan(0);
    expect(new Set(surfaces).size).toBe(surfaces.length);
  });

  it("폐쇄성: situation/mood/color/fit 방출 키는 전부 TAXONOMY_KEYS에 있다 (§6 화이트리스트)", () => {
    for (const e of STAGE1_DICTIONARY) {
      for (const em of e.emit) {
        if (em.dim === "situation") expect(TAXONOMY_KEYS.situation.has(em.key)).toBe(true);
        if (em.dim === "mood") expect(TAXONOMY_KEYS.mood.has(em.key)).toBe(true);
        if (em.dim === "fit") expect(TAXONOMY_KEYS.fit.has(em.key)).toBe(true);
        if (em.dim === "color") for (const k of em.group) expect(TAXONOMY_KEYS.color.has(k)).toBe(true);
      }
    }
  });

  it("핵심 alias 존재 (데모 + 무매칭 어휘)", () => {
    const find = (s: string) => STAGE1_DICTIONARY.find((e) => e.surface === s);
    expect(find("미니멀")?.emit).toContainEqual({ dim: "mood", key: "minimal" });
    expect(find("피크닉")?.emit).toContainEqual({ dim: "situation", key: "picnic" });
    expect(find("스트릿")?.emit).toContainEqual({ dim: "mood", key: "street" });
    expect(find("봄")?.emit).toContainEqual({ dim: "season", keys: ["spring"] });
  });
});
