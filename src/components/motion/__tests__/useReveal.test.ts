import { renderHook } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useReveal, splitWords } from "../useReveal";

describe("splitWords", () => {
  it("문장을 단어 배열로 분해한다", () => {
    expect(splitWords("Style your Imagination")).toEqual([
      "Style",
      "your",
      "Imagination",
    ]);
  });
});

describe("useReveal", () => {
  it("ref와 visible을 반환한다", () => {
    const { result } = renderHook(() => useReveal());
    expect(result.current).toHaveProperty("ref");
    expect(result.current).toHaveProperty("visible");
  });

  it("prefers-reduced-motion 시 즉시 visible=true", () => {
    window.matchMedia = ((q: string) => ({
      matches: true,
      media: q,
      onchange: null,
      addListener() {},
      removeListener() {},
      addEventListener() {},
      removeEventListener() {},
      dispatchEvent() {
        return false;
      },
    })) as unknown as typeof window.matchMedia;
    const { result } = renderHook(() => useReveal());
    expect(result.current.visible).toBe(true);
  });
});
