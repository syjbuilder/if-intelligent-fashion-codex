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
});
