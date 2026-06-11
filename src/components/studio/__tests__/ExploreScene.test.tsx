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

  it("프롬프트 도크는 헤딩 직하 760px 블록 — sticky는 도크만, 시즌 칩은 non-sticky", () => {
    const { container } = render(<ExploreScene onGenerate={() => {}} />);
    const sticky = container.querySelector(".sticky");
    expect(sticky).toBeTruthy();
    expect(sticky?.className).toContain("max-w-[760px]");
    // 칩은 sticky 래퍼 바깥에 있다
    expect(sticky?.textContent).not.toContain(SEASON_PROMPTS[0]);
    // 구 풀블리드 스트립(bg-paper/80) 제거
    expect(sticky?.className).not.toContain("bg-paper/80");
  });

  it("헤더는 공용 SectionHeader 패턴(h1 + eyebrow)을 쓴다", () => {
    render(<ExploreScene onGenerate={() => {}} />);
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Begin with a place, mood, and constraint.",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Style Studio").className).toContain("text-t7");
  });
});
