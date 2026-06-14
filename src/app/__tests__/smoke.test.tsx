import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
// 현행 랜딩은 /baseline로 이동(루트 /는 비교 허브). 스모크는 현행 랜딩을 계속 검사.
import Home from "../baseline/page";

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
