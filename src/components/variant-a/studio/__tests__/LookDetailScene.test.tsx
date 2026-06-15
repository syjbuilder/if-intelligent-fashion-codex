import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RESULT_LOOKS, PRODUCTS_BY_LOOK } from "@/lib/looks-fixtures";
import { LookDetailScene } from "../LookDetailScene";

const props = {
  look: RESULT_LOOKS[0],
  products: PRODUCTS_BY_LOOK["r-1"],
};

describe("variant-a LookDetailScene (한 화면: 룩 좌 + 상품 우 즉시)", () => {
  it("룩 실사와 상품 링크를 진입 즉시 함께 렌더한다", () => {
    render(<LookDetailScene {...props} />);
    expect(screen.getAllByRole("img").length).toBeGreaterThan(0);
    // 상품이 클릭 없이 바로 보인다(외부 링크 존재)
    expect(screen.getAllByRole("link").length).toBeGreaterThan(0);
  });

  it("'상품 보기' 토글 버튼이 없다(depth 축소)", () => {
    render(<LookDetailScene {...props} />);
    expect(
      screen.queryByRole("button", { name: /상품 보기/ }),
    ).toBeNull();
  });

  it("mini-action 가이드(다시 생성)를 렌더한다", () => {
    render(<LookDetailScene {...props} />);
    expect(
      screen.getByRole("button", { name: /다시 생성/ }),
    ).toBeInTheDocument();
  });
});
