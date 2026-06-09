import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { HistoryOverlay } from "../HistoryOverlay";
import { CURATED_LOOKS } from "@/lib/looks-fixtures";

describe("HistoryOverlay", () => {
  it("비로그인 시 가입 유도 gate(로그인 CTA)를 보여준다", () => {
    render(<HistoryOverlay open onClose={() => {}} isLoggedIn={false} />);
    expect(
      screen.getByRole("button", { name: /로그인하고/ }),
    ).toBeInTheDocument();
  });

  it("로그인+저장0이면 빈 상태 안내를 보여준다", () => {
    render(
      <HistoryOverlay open onClose={() => {}} isLoggedIn savedLooks={[]} />,
    );
    expect(screen.getByText(/첫 룩을 저장/)).toBeInTheDocument();
  });

  it("로그인+저장>0이면 saved-grid(룩 카드)를 보여준다", () => {
    const { container } = render(
      <HistoryOverlay
        open
        onClose={() => {}}
        isLoggedIn
        savedLooks={CURATED_LOOKS.slice(0, 3)}
      />,
    );
    expect(container.querySelectorAll(".rounded-card")).toHaveLength(3);
  });

  it("open=false면 렌더하지 않는다", () => {
    const { container } = render(
      <HistoryOverlay open={false} onClose={() => {}} isLoggedIn={false} />,
    );
    expect(container.firstChild).toBeNull();
  });
});
