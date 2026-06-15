import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CuratedRail } from "../CuratedRail";

describe("variant-b CuratedRail (가로 룩 레일)", () => {
  it("실사 룩 카드 6장 이상을 렌더한다", () => {
    const { container } = render(<CuratedRail />);
    expect(container.querySelectorAll("img").length).toBeGreaterThanOrEqual(6);
  });

  it("스튜디오로 가는 링크가 있다", () => {
    render(<CuratedRail />);
    const links = screen.getAllByRole("link");
    expect(links.some((l) => l.getAttribute("href") === "/b/studio")).toBe(true);
  });
});
