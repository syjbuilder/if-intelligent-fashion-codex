import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CuratedPreview } from "../CuratedPreview";

describe("variant-a CuratedPreview", () => {
  it("실사 룩 카드 6장을 렌더한다", () => {
    const { container } = render(<CuratedPreview />);
    expect(container.querySelectorAll("img").length).toBeGreaterThanOrEqual(6);
  });

  it("스튜디오 CTA가 /a/studio로 연결된다", () => {
    render(<CuratedPreview />);
    expect(
      screen.getByRole("link", { name: /Start the studio/i }),
    ).toHaveAttribute("href", "/a/studio");
  });
});
