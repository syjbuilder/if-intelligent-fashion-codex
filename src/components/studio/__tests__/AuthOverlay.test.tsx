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

  it("버튼은 콜백만 호출한다 (OAuth/fetch 0 — 시크릿 노출 방지)", () => {
    const onSelect = vi.fn();
    render(<AuthOverlay open onClose={() => {}} onSelectProvider={onSelect} />);
    fireEvent.click(screen.getByRole("button", { name: /Google/ }));
    expect(onSelect).toHaveBeenCalledWith("google");
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
});
