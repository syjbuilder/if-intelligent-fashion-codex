import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PRODUCTS_BY_LOOK } from "@/lib/looks-fixtures";
import type { ProductMock } from "@/types/ui";
import { ProductPanel } from "../ProductPanel";

describe("variant-a ProductPanel (우측 슬라이드 패널)", () => {
  it("open이면 상품을 외부링크(target=_blank rel=noopener)로 렌더한다", () => {
    render(
      <ProductPanel open products={PRODUCTS_BY_LOOK["r-1"]} onClose={() => {}} />,
    );
    const links = screen.getAllByRole("link");
    expect(links.length).toBeGreaterThan(0);
    expect(links[0]).toHaveAttribute("target", "_blank");
    expect(links[0].getAttribute("rel") ?? "").toContain("noopener");
  });

  it("닫히면 상품을 렌더하지 않는다", () => {
    render(
      <ProductPanel
        open={false}
        products={PRODUCTS_BY_LOOK["r-1"]}
        onClose={() => {}}
      />,
    );
    expect(screen.queryByRole("link")).toBeNull();
  });

  it("이미지 없는 상품도 폴백으로 깨지지 않게 렌더한다", () => {
    const p: ProductMock[] = [
      { id: "z", category: "top", name: "노이미지 상품", brand: "B", price: 1000, platform: "P" },
    ];
    render(<ProductPanel open products={p} onClose={() => {}} />);
    expect(screen.getByText("노이미지 상품")).toBeInTheDocument();
  });
});
