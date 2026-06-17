import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AuthProvider, useAuth } from "../AuthProvider";

function Probe() {
  const { user, isLoggedIn } = useAuth();
  return (
    <div>
      <span data-testid="logged">{isLoggedIn ? "yes" : "no"}</span>
      <span data-testid="email">{user?.email ?? "none"}</span>
    </div>
  );
}

describe("AuthProvider / useAuth", () => {
  it("initialUser가 있으면 로그인 상태로 노출한다", () => {
    render(
      <AuthProvider initialUser={{ id: "u1", email: "a@b.com" }}>
        <Probe />
      </AuthProvider>,
    );
    expect(screen.getByTestId("logged").textContent).toBe("yes");
    expect(screen.getByTestId("email").textContent).toBe("a@b.com");
  });

  it("initialUser가 null이면 비로그인", () => {
    render(
      <AuthProvider initialUser={null}>
        <Probe />
      </AuthProvider>,
    );
    expect(screen.getByTestId("logged").textContent).toBe("no");
    expect(screen.getByTestId("email").textContent).toBe("none");
  });

  it("provider 없이 useAuth는 throw하지 않고 기본값(비로그인)을 반환한다", () => {
    // 기존 무-provider 페이지 테스트(studio/page, smoke)를 깨지 않기 위한 핵심 제약.
    render(<Probe />);
    expect(screen.getByTestId("logged").textContent).toBe("no");
    expect(screen.getByTestId("email").textContent).toBe("none");
  });
});
