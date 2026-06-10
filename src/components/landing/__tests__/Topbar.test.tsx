import { render, screen, fireEvent } from "@testing-library/react";
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

  it("Menu 버튼 클릭 시 트레이(메뉴 항목)가 열린다", () => {
    render(<Topbar />);
    expect(screen.queryByRole("link", { name: /Explore/ })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "메뉴" }));
    expect(screen.getByRole("link", { name: /Explore/ })).toBeInTheDocument();
  });
});
