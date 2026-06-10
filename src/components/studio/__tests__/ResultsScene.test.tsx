import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ResultsScene, RESULT_LOOKS } from "../ResultsScene";

describe("ResultsScene", () => {
  it("룩 plate 3장 + 각 카드 위 상품 오버레이(This look)와 Buy the look(비활성)을 렌더한다", () => {
    render(<ResultsScene />);
    for (const l of RESULT_LOOKS) {
      expect(screen.getByText(l.title)).toBeInTheDocument();
    }
    // 카드 위 상품 오버레이 (group-hover CSS → DOM에 존재)
    expect(
      screen.getByText(RESULT_LOOKS[0].products[0].name),
    ).toBeInTheDocument();
    expect(screen.getAllByText(/This look ·/i)).toHaveLength(3);
    const buys = screen.getAllByRole("button", { name: /Buy the look/i });
    expect(buys).toHaveLength(3);
    buys.forEach((b) => expect(b).toHaveAttribute("aria-disabled", "true"));
  });

  it("mini-action(다시 생성/이런 스타일 더)과 상품 보기 콜백을 노출한다", () => {
    const onOpenDrawer = vi.fn();
    const onRegenerate = vi.fn();
    render(
      <ResultsScene onOpenDrawer={onOpenDrawer} onRegenerate={onRegenerate} />,
    );
    fireEvent.click(screen.getByRole("button", { name: "다시 생성" }));
    expect(onRegenerate).toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "상품 보기" }));
    expect(onOpenDrawer).toHaveBeenCalled();
    expect(
      screen.getByRole("button", { name: "이런 스타일 더" }),
    ).toBeInTheDocument();
  });
});
