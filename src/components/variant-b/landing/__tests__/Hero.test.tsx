import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Hero } from "../Hero";

describe("variant-b Hero (텍스트 전용)", () => {
  it("스튜디오 CTA가 /studio로 연결된다", () => {
    render(<Hero />);
    expect(
      screen.getByRole("link", { name: /스튜디오 시작/ }),
    ).toHaveAttribute("href", "/studio");
  });

  it("히어로 헤드라인을 aria-label로 렌더한다", () => {
    render(<Hero />);
    expect(
      screen.getByRole("heading", { name: "Wear what you imagine" }),
    ).toBeInTheDocument();
  });

  it("히어로에 이미지가 없다 (마네킹 제거)", () => {
    const { container } = render(<Hero />);
    expect(container.querySelector("img")).toBeNull();
    expect(container.querySelector(".b-hero-scrim")).toBeNull();
  });

  it("1화면 핏 패딩·중앙 정렬·min-h를 유지한다", () => {
    const { container } = render(<Hero />);
    const section = container.querySelector("section");
    expect(section?.className).toContain("py-[clamp(72px,9vh,112px)]");
    expect(section?.className).toContain("items-center");
    expect(section?.className).toContain("min-h-[100svh]");
  });
});
