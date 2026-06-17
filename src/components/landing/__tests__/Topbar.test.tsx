import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Topbar } from "../Topbar";
import { AuthProvider } from "@/lib/auth/AuthProvider";

const items = [{ label: "Explore", n: "01", href: "/studio" }];

describe("Topbar", () => {
  it("브랜드와 Login 버튼을 렌더하고 클릭 시 onLogin을 호출한다", () => {
    const onLogin = vi.fn();
    render(<Topbar menuItems={items} onLogin={onLogin} />);
    expect(screen.getByText("IF")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Login" }));
    expect(onLogin).toHaveBeenCalled();
  });

  it("로그인 상태면 로그아웃 form(POST /api/auth/signout)을 렌더하고 Login은 사라진다", () => {
    render(
      <AuthProvider initialUser={{ id: "u1", email: "a@b.com" }}>
        <Topbar menuItems={items} onLogin={() => {}} />
      </AuthProvider>,
    );
    expect(screen.queryByRole("button", { name: "Login" })).toBeNull();
    const logout = screen.getByRole("button", { name: "Logout" });
    const form = logout.closest("form");
    expect(form).not.toBeNull();
    expect(form?.getAttribute("action")).toBe("/api/auth/signout");
    expect(form?.getAttribute("method")).toBe("post");
  });

  it("Menu 버튼 클릭 시 트레이(항목)가 열린다", () => {
    render(<Topbar menuItems={items} onLogin={() => {}} />);
    expect(screen.queryByRole("link", { name: /Explore/ })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "메뉴" }));
    expect(screen.getByRole("link", { name: /Explore/ })).toBeInTheDocument();
  });
});
