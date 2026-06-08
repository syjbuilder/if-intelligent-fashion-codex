import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Home from "../page";

describe("Home page (smoke)", () => {
  it("브랜드 메시지를 렌더한다", () => {
    render(<Home />);
    expect(screen.getByText("Wear what you imagine.")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "I.F" })).toBeInTheDocument();
  });
});
