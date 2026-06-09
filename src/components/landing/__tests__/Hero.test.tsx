import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Hero } from "../Hero";

describe("Hero", () => {
  it("헤드라인과 Get Started CTA(/studio)를 렌더한다", () => {
    render(<Hero />);
    expect(
      screen.getByRole("heading", { name: "Style your Imagination." }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Get Started" })).toHaveAttribute(
      "href",
      "/studio",
    );
  });

  it("글래스 룩 패널 3장과 scroll 큐(선)를 렌더한다", () => {
    const { container } = render(<Hero />);
    expect(container.querySelector(".hero-lookbook")).toBeTruthy();
    expect(container.querySelectorAll(".hero-panel")).toHaveLength(3);
    expect(container.querySelector(".scroll-cue .scroll-line")).toBeTruthy();
  });
});
