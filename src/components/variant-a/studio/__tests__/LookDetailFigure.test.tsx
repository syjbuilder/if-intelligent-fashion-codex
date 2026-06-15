import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RESULT_LOOKS } from "@/lib/looks-fixtures";
import { LookDetailFigure } from "../LookDetailFigure";

describe("variant-a LookDetailFigure", () => {
  it("룩 실사 이미지를 렌더한다(좌측 확대 figure)", () => {
    render(<LookDetailFigure look={RESULT_LOOKS[0]} />);
    expect(screen.getByRole("img")).toBeInTheDocument();
  });
});
