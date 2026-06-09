import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Topbar } from "../Topbar";

describe("Topbar", () => {
  it("브랜드 락업과 Login 링크(/studio)를 렌더한다", () => {
    render(<Topbar />);
    expect(screen.getByText("IF")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Login" })).toHaveAttribute(
      "href",
      "/studio",
    );
  });
});
