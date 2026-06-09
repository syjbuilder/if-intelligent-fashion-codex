import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { GarmentSvg } from "../GarmentSvg";

describe("GarmentSvg", () => {
  it("tone에 대한 가먼트 일러스트(svg)를 렌더한다", () => {
    render(<GarmentSvg tone="office" />);
    const img = screen.getByRole("img", { name: /office/i });
    expect(img.tagName.toLowerCase()).toBe("svg");
  });

  it("stroke=currentColor(카드 색 상속)이고 사람 비트맵 이미지가 없다 (ADR-006)", () => {
    const { container } = render(<GarmentSvg tone="date" />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("stroke")).toBe("currentColor");
    expect(container.querySelector("image")).toBeNull();
  });
});
