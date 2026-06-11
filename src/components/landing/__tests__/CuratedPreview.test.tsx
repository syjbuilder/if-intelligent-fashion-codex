import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { CuratedPreview } from "../CuratedPreview";

describe("CuratedPreview", () => {
  it("헤드라인과 curated 룩 카드 6장을 렌더한다", () => {
    render(<CuratedPreview />);
    expect(
      screen.getByRole("heading", { name: "Six directions to begin." }),
    ).toBeInTheDocument();
    // LookCard는 button으로 렌더 → 6장
    expect(screen.getAllByRole("button")).toHaveLength(6);
  });

  it("Start the studio CTA(/studio)를 렌더한다", () => {
    render(<CuratedPreview />);
    expect(
      screen.getByRole("link", { name: "Start the studio" }),
    ).toHaveAttribute("href", "/studio");
  });

  it("룩 6장은 세로 그리드가 아닌 가로 룩북 레일(스냅 스크롤)이다", () => {
    const { container } = render(<CuratedPreview />);
    const rail = container.querySelector(".overflow-x-auto");
    expect(rail).toBeTruthy();
    const track = rail?.querySelector(".snap-x");
    expect(track).toBeTruthy();
    expect(track?.children).toHaveLength(6);
  });

  it("한 화면 리듬: 섹션이 min-h-[100svh] 플렉스 센터링을 쓴다", () => {
    const { container } = render(<CuratedPreview />);
    const section = container.querySelector("section");
    expect(section?.className).toContain("min-h-[100svh]");
    expect(section?.className).toContain("justify-center");
  });
});
