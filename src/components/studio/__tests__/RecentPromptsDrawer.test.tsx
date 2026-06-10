import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { RecentPromptsDrawer } from "../RecentPromptsDrawer";

describe("RecentPromptsDrawer", () => {
  it("open이면 최근 프롬프트와 'Start a new prompt'를 보여준다", () => {
    render(<RecentPromptsDrawer open onClose={() => {}} />);
    expect(
      screen.getByRole("button", { name: /Start a new prompt/i }),
    ).toBeInTheDocument();
    // 최소 한 개의 프롬프트 행
    expect(screen.getByRole("heading", { name: /최근 프롬프트/ })).toBeInTheDocument();
  });

  it("프롬프트 클릭 시 onSelect + onClose", () => {
    const onSelect = vi.fn();
    const onClose = vi.fn();
    render(
      <RecentPromptsDrawer open onClose={onClose} onSelect={onSelect} />,
    );
    // 첫 프롬프트 행 버튼
    const rows = screen.getAllByRole("button", { name: /전$|어제/ });
    fireEvent.click(rows[0]);
    expect(onSelect).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it("닫기 버튼이 onClose를 호출한다", () => {
    const onClose = vi.fn();
    render(<RecentPromptsDrawer open onClose={onClose} />);
    fireEvent.click(screen.getByRole("button", { name: "닫기" }));
    expect(onClose).toHaveBeenCalled();
  });

  it("open=false면 렌더하지 않는다", () => {
    const { container } = render(
      <RecentPromptsDrawer open={false} onClose={() => {}} />,
    );
    expect(container.firstChild).toBeNull();
  });
});
