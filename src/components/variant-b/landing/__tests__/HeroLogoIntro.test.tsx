import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { HeroLogoIntro } from "../HeroLogoIntro";

describe("HeroLogoIntro (히어로 우측 로고 인트로)", () => {
  it("IF 마크 + INTELLIGENT FASHION + 코랄 '+' 코너 4개를 렌더한다", () => {
    const { container } = render(<HeroLogoIntro />);
    expect(screen.getByText("IF")).toBeInTheDocument();
    expect(screen.getByText("INTELLIGENT FASHION")).toBeInTheDocument();
    expect(screen.getAllByText("+").length).toBe(4);
    expect(container.querySelector("[data-hero-logo]")).not.toBeNull();
  });

  it("reduced면 최종 상태로 즉시 렌더한다", () => {
    const { container } = render(<HeroLogoIntro reduced />);
    expect(screen.getByText("IF")).toBeInTheDocument();
    expect(container.querySelector("[data-hero-logo]")).not.toBeNull();
  });
});
