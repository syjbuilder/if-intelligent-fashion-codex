import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { AuthOverlay } from "../AuthOverlay";

describe("AuthOverlay", () => {
  it("소셜 3버튼을 Google→Kakao→Naver 순서로 렌더한다", () => {
    const { container } = render(<AuthOverlay open onClose={() => {}} />);
    const providers = Array.from(
      container.querySelectorAll("[data-provider]"),
    ).map((b) => b.getAttribute("data-provider"));
    expect(providers).toEqual(["google", "kakao", "naver"]);
  });

  it("버튼은 콜백 호출 후 서버 로그인 라우트로 네비게이트한다 (fetch/OAuth 0 — 시크릿 노출 방지)", () => {
    const original = window.location;
    const assign = vi.fn();
    Object.defineProperty(window, "location", {
      configurable: true,
      writable: true,
      value: { assign, pathname: "/studio", origin: "http://localhost:3000" },
    });
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);

    const onSelect = vi.fn();
    render(<AuthOverlay open onClose={() => {}} onSelectProvider={onSelect} />);
    fireEvent.click(screen.getByRole("button", { name: /Google/ }));

    expect(onSelect).toHaveBeenCalledWith("google");
    expect(assign).toHaveBeenCalledTimes(1);
    expect(assign.mock.calls[0][0]).toMatch(/^\/api\/auth\/signin\/google/);
    // Supabase/OAuth를 클라에서 직접 부르지 않는다(시크릿 가드 유지).
    expect(fetchSpy).not.toHaveBeenCalled();

    Object.defineProperty(window, "location", {
      configurable: true,
      writable: true,
      value: original,
    });
    vi.unstubAllGlobals();
  });

  it("open=false면 렌더하지 않는다", () => {
    const { container } = render(
      <AuthOverlay open={false} onClose={() => {}} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('tone="dark"면 루트에 Variant B 다크 토큰(bg-b-ink)을 적용한다', () => {
    const { container } = render(
      <AuthOverlay open tone="dark" onClose={() => {}} />,
    );
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain("bg-b-ink");
    expect(root.className).not.toContain("bg-slate-scene");
  });

  it("기본(light)에서는 B 다크 토큰을 적용하지 않는다", () => {
    const { container } = render(<AuthOverlay open onClose={() => {}} />);
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain("bg-slate-scene");
    expect(root.className).not.toContain("bg-b-ink");
  });

  it('tone="dark"에서도 Kakao/Naver 브랜드색은 유지한다', () => {
    const { container } = render(
      <AuthOverlay open tone="dark" onClose={() => {}} />,
    );
    const html = container.innerHTML;
    expect(html).toContain("#FEE500");
    expect(html).toContain("#03C75A");
  });

  it('tone="dark"면 스포트라이트 배경(.bg-b-auth)과 글래스 카드(.b-auth-glass)를 렌더한다', () => {
    const { container } = render(
      <AuthOverlay open tone="dark" onClose={() => {}} />,
    );
    expect(container.querySelector(".bg-b-auth")).not.toBeNull();
    expect(container.querySelector(".b-auth-glass")).not.toBeNull();
  });

  it("기본(light)에서는 스포트라이트·글래스를 적용하지 않는다", () => {
    const { container } = render(<AuthOverlay open onClose={() => {}} />);
    expect(container.querySelector(".bg-b-auth")).toBeNull();
    expect(container.querySelector(".b-auth-glass")).toBeNull();
  });

  it("로그인 헤딩이 오버플로 방지로 text-t3 + balance를 쓴다", () => {
    render(<AuthOverlay open tone="dark" onClose={() => {}} />);
    const h2 = screen.getByRole("heading", { name: "Style your Imagination." });
    expect(h2.className).toContain("text-t3");
    expect(h2.className).not.toContain("text-t2");
    expect(h2.className).toContain("[text-wrap:balance]");
  });

  it("글래스 카드 폭이 460/92vw로 넓어진다", () => {
    const { container } = render(
      <AuthOverlay open tone="dark" onClose={() => {}} />,
    );
    const card = container.querySelector(".b-auth-glass") as HTMLElement;
    expect(card.className).toContain("w-[min(460px,92vw)]");
  });
});
