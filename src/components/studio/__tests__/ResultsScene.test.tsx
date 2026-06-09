import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ResultsScene, RESULT_SLIDES } from "../ResultsScene";

describe("ResultsScene", () => {
  it("첫 슬라이드를 보여주고 '다음 룩'으로 넘긴다", () => {
    render(<ResultsScene />);
    expect(screen.getByText(RESULT_SLIDES[0].title)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "다음 룩" }));
    expect(screen.getByText(RESULT_SLIDES[1].title)).toBeInTheDocument();
  });

  it("mini-action(다시 생성/이런 스타일 더)과 상품 보기를 노출한다", () => {
    const onOpenDrawer = vi.fn();
    const onRegenerate = vi.fn();
    render(
      <ResultsScene onOpenDrawer={onOpenDrawer} onRegenerate={onRegenerate} />,
    );
    expect(
      screen.getByRole("button", { name: "다시 생성" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "이런 스타일 더" }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "다시 생성" }));
    expect(onRegenerate).toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "상품 보기" }));
    expect(onOpenDrawer).toHaveBeenCalled();
  });
});
