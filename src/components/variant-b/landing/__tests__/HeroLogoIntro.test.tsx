import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { HeroLogoIntro } from "../HeroLogoIntro";

describe("HeroLogoIntro (베벨 다이아몬드 인트로)", () => {
  it("다이아몬드 외곽선(svg path)과 큰 IF를 렌더한다", () => {
    const { container } = render(<HeroLogoIntro />);
    expect(screen.getByText("IF")).toBeInTheDocument();
    expect(container.querySelector("svg path")).not.toBeNull();
    expect(container.querySelector("[data-hero-logo]")).not.toBeNull();
  });

  it("reduced면 최종 상태로 즉시 렌더한다", () => {
    const { container } = render(<HeroLogoIntro reduced />);
    expect(screen.getByText("IF")).toBeInTheDocument();
    expect(container.querySelector("[data-hero-logo]")).not.toBeNull();
  });
});
