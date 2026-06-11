import { describe, it, expect } from "vitest";
import { HERO_LOOKS, HERO_ROTATE_MS } from "../hero-looks";

describe("hero-looks (히어로 로테이션 픽스처)", () => {
  it("마네킹 룩 이미지 7장", () => {
    expect(HERO_LOOKS).toHaveLength(7);
  });

  it("각 룩은 public/looks WebP 경로·alt·label을 갖는다", () => {
    for (const look of HERO_LOOKS) {
      expect(look.src).toMatch(/^\/looks\/[\w-]+\.webp$/);
      expect(look.alt).toBeTruthy();
      expect(look.label).toBeTruthy();
    }
  });

  it("src는 유일하다", () => {
    const srcs = HERO_LOOKS.map((l) => l.src);
    expect(new Set(srcs).size).toBe(srcs.length);
  });

  it("회전 주기는 약 2초(크로스페이드 여유 포함 2000~3000ms)", () => {
    expect(HERO_ROTATE_MS).toBeGreaterThanOrEqual(2000);
    expect(HERO_ROTATE_MS).toBeLessThanOrEqual(3000);
  });
});
