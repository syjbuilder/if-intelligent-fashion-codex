import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import type { ComponentProps } from "react";
import { Hero } from "../Hero";
import { HERO_LOOKS } from "@/lib/hero-looks";

// HeroFigure가 쓰는 next/image를 일반 <img>로 대체 (jsdom).
vi.mock("next/image", () => ({
  default: (props: ComponentProps<"img"> & { fill?: boolean; priority?: boolean }) => {
    const { fill: _fill, priority: _priority, ...rest } = props;
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...rest} />;
  },
}));

describe("Hero", () => {
  it("헤드라인과 Get Started CTA(/studio)를 렌더한다", () => {
    render(<Hero />);
    expect(
      screen.getByRole("heading", { name: "Style your Imagination." }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Get Started" })).toHaveAttribute(
      "href",
      "/studio",
    );
  });

  it("좌측 마네킹 룩 레이어·스크림·scroll 큐(선)를 렌더한다", () => {
    const { container } = render(<Hero />);
    expect(container.querySelector(".hero-figure")).toBeTruthy();
    expect(container.querySelectorAll(".hero-figure-img")).toHaveLength(
      HERO_LOOKS.length,
    );
    expect(container.querySelector(".hero-scrim")).toBeTruthy();
    expect(container.querySelector(".scroll-cue .scroll-line")).toBeTruthy();
  });

  it("구 글래스 룩 패널은 더 이상 렌더하지 않는다", () => {
    const { container } = render(<Hero />);
    expect(container.querySelector(".hero-lookbook")).toBeNull();
    expect(container.querySelectorAll(".hero-panel")).toHaveLength(0);
  });
});
