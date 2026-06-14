import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RESULT_LOOKS, PRODUCTS_BY_LOOK } from "@/lib/looks-fixtures";
import { LookDetailScene } from "../LookDetailScene";

const props = {
  look: RESULT_LOOKS[0],
  products: PRODUCTS_BY_LOOK["r-1"],
};

describe("variant-a LookDetailScene (2단계: 룩 좌측 → 상품 우측)", () => {
  it("룩 실사를 렌더한다", () => {
    render(<LookDetailScene {...props} />);
    expect(screen.getAllByRole("img").length).toBeGreaterThan(0);
  });

  it("'상품 보기' 클릭 전엔 상품 패널(외부링크) 부재, 클릭 후 등장한다", () => {
    render(<LookDetailScene {...props} />);
    expect(screen.queryByRole("link")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: /상품 보기/ }));
    expect(screen.getAllByRole("link").length).toBeGreaterThan(0);
  });

  it("mini-action 가이드(다시 생성)를 렌더한다", () => {
    render(<LookDetailScene {...props} />);
    expect(
      screen.getByRole("button", { name: /다시 생성/ }),
    ).toBeInTheDocument();
  });
});
