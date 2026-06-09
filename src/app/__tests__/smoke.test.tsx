import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Home from "../page";

describe("Home (landing) smoke", () => {
  it("hero 헤드라인과 어필리에이트 고지를 렌더한다", () => {
    render(<Home />);
    expect(
      screen.getByRole("heading", { name: "Style your Imagination." }),
    ).toBeInTheDocument();
    expect(screen.getByText(/무신사/)).toBeInTheDocument();
  });

  it("accent 워드 강조는 라우트당 2개 이하 (Typography 원칙1)", () => {
    const { container } = render(<Home />);
    expect(
      container.querySelectorAll(".text-accent").length,
    ).toBeLessThanOrEqual(2);
  });
});
