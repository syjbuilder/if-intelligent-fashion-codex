import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PRODUCTS_BY_LOOK } from "@/lib/looks-fixtures";
import type { ProductMock } from "@/types/ui";
import { ProductPanel } from "../ProductPanel";

describe("variant-b ProductPanel (인라인)", () => {
  it("상품을 외부링크(target=_blank rel=noopener)로 렌더", () => {
    render(<ProductPanel products={PRODUCTS_BY_LOOK["r-1"]} />);
    const links = screen.getAllByRole("link");
    expect(links.length).toBeGreaterThan(0);
    expect(links[0]).toHaveAttribute("target", "_blank");
    expect(links[0].getAttribute("rel") ?? "").toContain("noopener");
  });
  it("이미지 없는 상품도 폴백 렌더", () => {
    const p: ProductMock[] = [
      { id: "z", category: "top", name: "노이미지 상품", brand: "B", price: 1000, platform: "P" },
    ];
    render(<ProductPanel products={p} />);
    expect(screen.getByText("노이미지 상품")).toBeInTheDocument();
  });
});
