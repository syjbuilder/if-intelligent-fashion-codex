import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CuratedRail } from "../CuratedRail";

describe("variant-b CuratedRail (3×2 그리드)", () => {
  it("실사 룩 카드 6장 이상을 렌더한다", () => {
    const { container } = render(<CuratedRail />);
    expect(container.querySelectorAll("img").length).toBeGreaterThanOrEqual(6);
  });

  it("스튜디오로 가는 링크가 있다", () => {
    render(<CuratedRail />);
    const links = screen.getAllByRole("link");
    expect(links.some((l) => l.getAttribute("href") === "/studio")).toBe(true);
  });

  it("가로 스크롤이 아닌 반응형 그리드(1/2/3열)로 배치한다", () => {
    const { container } = render(<CuratedRail />);
    const grid = container.querySelector(".grid");
    expect(grid).not.toBeNull();
    expect(grid?.className).toContain("grid-cols-1");
    expect(grid?.className).toContain("sm:grid-cols-2");
    expect(grid?.className).toContain("lg:grid-cols-3");
  });

  it("카드 6개를 aspect-[3/4]로 렌더하고 코랄 '+' 코너를 유지한다", () => {
    const { container } = render(<CuratedRail />);
    const cards = container.querySelectorAll("article");
    expect(cards.length).toBe(6);
    cards.forEach((c) => expect(c.className).toContain("aspect-[3/4]"));
    expect(screen.getAllByText("+").length).toBeGreaterThanOrEqual(12);
  });

  it('h2를 "Ways to begin" aria-label로 렌더한다', () => {
    render(<CuratedRail />);
    expect(
      screen.getByRole("heading", { name: "Ways to begin" }),
    ).toBeInTheDocument();
  });

  it('아이브로우가 코랄 "How it works"다', () => {
    render(<CuratedRail />);
    const eyebrow = screen.getByText("How it works");
    expect(eyebrow.className).toContain("text-b-accent");
  });

  it("스튜디오 링크가 항상 보이는 코랄 글래스 칩이다", () => {
    render(<CuratedRail />);
    const link = screen.getByRole("link", { name: /스튜디오/ });
    expect(link.className).not.toContain("hidden");
    expect(link.className).toContain("text-b-accent");
    expect(link.className).toContain("rounded-full");
  });
});
