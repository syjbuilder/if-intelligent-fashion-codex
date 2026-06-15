import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RESULT_LOOKS, PRODUCTS_BY_LOOK } from "@/lib/looks-fixtures";
import { LookDetailScene } from "../LookDetailScene";

const props = { look: RESULT_LOOKS[0], products: PRODUCTS_BY_LOOK["r-1"] };

describe("variant-b LookDetailScene (한 화면: 룩 + 상품 즉시)", () => {
  it("룩 실사와 상품 링크를 진입 즉시 함께 렌더", () => {
    render(<LookDetailScene {...props} />);
    expect(screen.getAllByRole("img").length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link").length).toBeGreaterThan(0);
  });
  it("'상품 보기' 토글 버튼이 없다(depth 축소)", () => {
    render(<LookDetailScene {...props} />);
    expect(screen.queryByRole("button", { name: /상품 보기/ })).toBeNull();
  });
  it("mini-action(다시 생성)", () => {
    render(<LookDetailScene {...props} />);
    expect(screen.getByRole("button", { name: /다시 생성/ })).toBeInTheDocument();
  });
});
