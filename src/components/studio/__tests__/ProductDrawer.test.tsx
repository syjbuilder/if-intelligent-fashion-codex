import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ProductDrawer } from "../ProductDrawer";
import { PRODUCTS_MOCK } from "@/lib/looks-fixtures";

describe("ProductDrawer", () => {
  it("open이면 상품 리스트와 Buy Full Look(비활성)을 보여준다", () => {
    render(<ProductDrawer open onClose={() => {}} />);
    expect(screen.getByText(PRODUCTS_MOCK[0].name)).toBeInTheDocument();
    const buy = screen.getByRole("button", { name: /Buy Full Look/i });
    expect(buy).toHaveAttribute("aria-disabled", "true");
  });

  it("가격(₩)을 노출한다", () => {
    render(<ProductDrawer open onClose={() => {}} />);
    expect(screen.getAllByText(/₩/).length).toBeGreaterThan(0);
  });

  it("닫기 버튼이 onClose를 호출한다", () => {
    const onClose = vi.fn();
    render(<ProductDrawer open onClose={onClose} />);
    fireEvent.click(screen.getByRole("button", { name: "닫기" }));
    expect(onClose).toHaveBeenCalled();
  });

  it("open=false면 렌더하지 않는다", () => {
    const { container } = render(
      <ProductDrawer open={false} onClose={() => {}} />,
    );
    expect(container.firstChild).toBeNull();
  });
});
