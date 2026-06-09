import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ExploreScene } from "../ExploreScene";
import { SEASON_PROMPTS } from "@/lib/looks-fixtures";

describe("ExploreScene", () => {
  it("시즌 데모 프롬프트 5개와 explore 룩 12장을 렌더한다", () => {
    const { container } = render(<ExploreScene onGenerate={() => {}} />);
    for (const p of SEASON_PROMPTS) {
      expect(screen.getByText(p)).toBeInTheDocument();
    }
    // LookCard는 .rounded-card 클래스를 갖는다 → 12장
    expect(container.querySelectorAll(".rounded-card")).toHaveLength(12);
  });

  it("시즌 칩 클릭 시 입력값이 채워진다 (silent filter 아님 — 입력 보정)", () => {
    render(<ExploreScene onGenerate={() => {}} />);
    fireEvent.click(screen.getByRole("button", { name: SEASON_PROMPTS[0] }));
    expect(screen.getByRole("textbox")).toHaveValue(SEASON_PROMPTS[0]);
  });
});
