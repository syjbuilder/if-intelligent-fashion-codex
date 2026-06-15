import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { ComponentProps } from "react";
import { Hero } from "../Hero";

// jsdom에는 next/image 최적화 런타임이 없다 → 일반 <img>로 대체해 raw src를 검증 (HeroFigure.test 패턴).
vi.mock("next/image", () => ({
  default: (props: ComponentProps<"img"> & { fill?: boolean; priority?: boolean }) => {
    const { fill: _fill, priority: _priority, ...rest } = props;
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...rest} />;
  },
}));

describe("variant-b Hero (다크+코랄 키네틱)", () => {
  it("스튜디오 CTA가 /studio로 연결된다", () => {
    render(<Hero />);
    expect(
      screen.getByRole("link", { name: /스튜디오 시작/ }),
    ).toHaveAttribute("href", "/studio");
  });

  it("히어로 이미지를 렌더한다", () => {
    const { container } = render(<Hero />);
    expect(container.querySelector("img")).toBeInTheDocument();
  });

  it("figure를 bleed+fg 2겹 이미지 + 코랄 scrim으로 배경에 블렌드한다 (컷아웃 방지)", () => {
    const { container } = render(<Hero />);
    expect(container.querySelectorAll("img").length).toBeGreaterThanOrEqual(2);
    expect(container.querySelector(".b-hero-fg")).not.toBeNull();
    expect(container.querySelector(".b-hero-scrim")).not.toBeNull();
  });

  it("히어로 콘텐츠가 고정 Topbar(~80px)를 비우도록 상하 패딩을 둔다", () => {
    const { container } = render(<Hero />);
    const section = container.querySelector("section");
    expect(section?.className).toContain("py-[clamp(104px,14vh,176px)]");
    expect(section?.className).toContain("items-center");
  });

  it("데일리 룩(06-feminine-smart-casual)을 렌더하고 이브닝 룩은 쓰지 않는다", () => {
    const { container } = render(<Hero />);
    const srcs = [...container.querySelectorAll("img")].map(
      (img) => img.getAttribute("src") ?? "",
    );
    expect(srcs.some((s) => s.includes("06-feminine-smart-casual"))).toBe(true);
    expect(srcs.some((s) => s.includes("04-elegant-evening"))).toBe(false);
  });
});
