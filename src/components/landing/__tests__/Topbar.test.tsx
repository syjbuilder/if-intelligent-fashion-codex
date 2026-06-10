import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Topbar } from "../Topbar";

const items = [{ label: "Explore", n: "01", href: "/studio" }];

describe("Topbar", () => {
  it("브랜드와 Login 버튼을 렌더하고 클릭 시 onLogin을 호출한다", () => {
    const onLogin = vi.fn();
    render(<Topbar menuItems={items} onLogin={onLogin} />);
    expect(screen.getByText("IF")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Login" }));
    expect(onLogin).toHaveBeenCalled();
  });

  it("Menu 버튼 클릭 시 트레이(항목)가 열린다", () => {
    render(<Topbar menuItems={items} onLogin={() => {}} />);
    expect(screen.queryByRole("link", { name: /Explore/ })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "메뉴" }));
    expect(screen.getByRole("link", { name: /Explore/ })).toBeInTheDocument();
  });
});
