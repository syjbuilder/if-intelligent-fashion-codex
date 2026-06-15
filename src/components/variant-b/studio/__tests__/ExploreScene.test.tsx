import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ExploreScene } from "../ExploreScene";

describe("variant-b ExploreScene", () => {
  it("실사 룩 카드를 다수 렌더한다", () => {
    const { container } = render(<ExploreScene onRefill={() => {}} />);
    expect(container.querySelectorAll("img").length).toBeGreaterThan(0);
  });
  it("룩 카드 클릭 시 onRefill(prompt)", () => {
    const onRefill = vi.fn();
    render(<ExploreScene onRefill={onRefill} />);
    fireEvent.click(screen.getByText("OFFICE 03").closest("button")!);
    expect(onRefill).toHaveBeenCalledWith("톤온톤 베이지 오피스룩");
  });
  it("시즌 칩 클릭 시 onRefill", () => {
    const onRefill = vi.fn();
    render(<ExploreScene onRefill={onRefill} />);
    fireEvent.click(screen.getByText("출근룩, 뉴트럴 톤 셋업"));
    expect(onRefill).toHaveBeenCalledWith("출근룩, 뉴트럴 톤 셋업");
  });
});
