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
});
