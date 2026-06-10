import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { RevealWords } from "../RevealWords";

describe("RevealWords", () => {
  it("텍스트를 단어 단위 span으로 분해해 렌더한다", () => {
    render(<RevealWords text="Style your Imagination" />);
    expect(screen.getByText("Style")).toBeInTheDocument();
    expect(screen.getByText("your")).toBeInTheDocument();
    expect(screen.getByText("Imagination")).toBeInTheDocument();
  });

  it("reveal-words 래퍼 클래스를 갖는다", () => {
    const { container } = render(<RevealWords text="hello world" />);
    expect(container.querySelector(".reveal-words")).toBeTruthy();
    expect(container.querySelectorAll(".rw-word")).toHaveLength(2);
  });
});
