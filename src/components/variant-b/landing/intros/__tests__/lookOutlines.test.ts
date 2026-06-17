import { describe, it, expect } from "vitest";
import {
  LOOK_OUTLINES,
  flattenPath,
  samplePoints,
  sampleLook,
} from "../lookOutlines";

describe("lookOutlines", () => {
  it("3개 룩(name/prompt/viewBox/paths)을 제공한다", () => {
    expect(LOOK_OUTLINES.length).toBe(3);
    for (const l of LOOK_OUTLINES) {
      expect(typeof l.name).toBe("string");
      expect(typeof l.prompt).toBe("string");
      expect(l.viewBox).toBe("0 0 200 280");
      expect(l.paths.length).toBeGreaterThanOrEqual(12);
    }
  });

  it("flattenPath가 M/L/Q/C/Z를 폴리라인으로 평탄화한다", () => {
    const polys = flattenPath("M0 0 L10 0 Q15 5 10 10 Z");
    expect(polys.length).toBe(1);
    const pts = polys[0];
    expect(pts.length).toBeGreaterThan(3);
    expect(pts[0]).toEqual([0, 0]);
    // Z → 시작점 복귀
    expect(pts[pts.length - 1]).toEqual([0, 0]);
  });

  it("flattenPath가 여러 서브패스(M ... M ...)를 분리한다", () => {
    const polys = flattenPath("M0 0 L10 0 M50 50 L60 60");
    expect(polys.length).toBe(2);
  });

  it("samplePoints가 정확히 N개 유한 점을 반환한다", () => {
    const polys = flattenPath("M0 0 L100 0 L100 100");
    const pts = samplePoints(polys, 50);
    expect(pts.length).toBe(50);
    for (const [x, y] of pts) {
      expect(Number.isFinite(x)).toBe(true);
      expect(Number.isFinite(y)).toBe(true);
    }
  });

  it("sampleLook가 룩 전체 외곽에서 N개 타깃을 샘플한다", () => {
    const pts = sampleLook(LOOK_OUTLINES[0], 120);
    expect(pts.length).toBe(120);
  });
});
