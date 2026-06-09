import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import StudioPage from "../page";
import { SEASON_PROMPTS } from "@/lib/looks-fixtures";

describe("StudioPage (/studio)", () => {
  it("초기 scene은 explore — 시즌 데모 프롬프트가 노출된다", () => {
    render(<StudioPage />);
    expect(screen.getByText(SEASON_PROMPTS[0])).toBeInTheDocument();
  });

  it("Login 버튼이 Auth 오버레이를 연다 (소셜 버튼 노출)", () => {
    render(<StudioPage />);
    // 초기엔 소셜 버튼 없음
    expect(screen.queryByRole("button", { name: /Google/ })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Login" }));
    expect(
      screen.getByRole("button", { name: /Google/ }),
    ).toBeInTheDocument();
  });
});
