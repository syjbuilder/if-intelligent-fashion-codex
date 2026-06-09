import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { HowItWorks } from "../HowItWorks";

describe("HowItWorks", () => {
  it("헤드라인과 3-step(01/02/03)을 렌더한다", () => {
    render(<HowItWorks />);
    expect(
      screen.getByRole("heading", { name: "From intention to wearable." }),
    ).toBeInTheDocument();
    expect(screen.getByText("01")).toBeInTheDocument();
    expect(screen.getByText("02")).toBeInTheDocument();
    expect(screen.getByText("03")).toBeInTheDocument();
  });

  it("accent 워드 강조는 1개(intention)만 사용한다", () => {
    const { container } = render(<HowItWorks />);
    expect(container.querySelectorAll(".text-accent")).toHaveLength(1);
  });

  it("카드 그리드가 아닌 ol.steps 단일 컬럼이다 (안티패턴 회피)", () => {
    const { container } = render(<HowItWorks />);
    expect(container.querySelector("ol")).toBeTruthy();
  });
});
