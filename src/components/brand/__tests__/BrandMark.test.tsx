import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { BrandMark } from "../BrandMark";

describe("BrandMark", () => {
  it("IF 로고와 풀네임을 렌더한다", () => {
    render(<BrandMark />);
    expect(screen.getByText("IF")).toBeInTheDocument();
    expect(screen.getByText("INTELLIGENT FASHION")).toBeInTheDocument();
  });
});
