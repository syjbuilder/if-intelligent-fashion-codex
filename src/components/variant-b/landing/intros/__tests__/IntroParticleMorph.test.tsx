import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { IntroParticleMorph } from "../IntroParticleMorph";

describe("IntroParticleMorph (코스모스 점-구체 ↔ 룩 모핑)", () => {
  it("루트와 캔버스를 렌더하고 텍스트는 없다", () => {
    const { container } = render(<IntroParticleMorph />);
    const root = container.querySelector("[data-intro-particle]");
    expect(root).not.toBeNull();
    expect(root?.querySelector("canvas")).not.toBeNull();
    expect(container.textContent?.trim()).toBe("");
  });

  it("reduced여도 루트와 캔버스를 렌더한다", () => {
    const { container } = render(<IntroParticleMorph reduced />);
    expect(container.querySelector("[data-intro-particle] canvas")).not.toBeNull();
  });
});
