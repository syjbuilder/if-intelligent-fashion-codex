import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ResultsScene } from "../ResultsScene";

describe("variant-b ResultsScene", () => {
  it("결과 3 플레이트 실사 이미지", () => {
    render(<ResultsScene onDetail={() => {}} />);
    expect(screen.getAllByRole("img").length).toBeGreaterThanOrEqual(3);
  });
  it("'자세히보기' 룩마다, 클릭 시 onDetail(lookId)", () => {
    const onDetail = vi.fn();
    render(<ResultsScene onDetail={onDetail} />);
    const btns = screen.getAllByRole("button", { name: /자세히보기/ });
    expect(btns).toHaveLength(3);
    fireEvent.click(btns[0]);
    expect(onDetail).toHaveBeenCalledWith("r-1");
  });
  it("mini-action(다시 생성)", () => {
    render(<ResultsScene onDetail={() => {}} onRegenerate={() => {}} />);
    expect(screen.getByRole("button", { name: /다시 생성/ })).toBeInTheDocument();
  });
});
