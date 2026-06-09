import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Home from "../page";

describe("Home page (smoke)", () => {
  it("hero 헤드라인을 렌더한다", () => {
    render(<Home />);
    expect(
      screen.getByRole("heading", { name: "Style your Imagination." }),
    ).toBeInTheDocument();
  });
});
