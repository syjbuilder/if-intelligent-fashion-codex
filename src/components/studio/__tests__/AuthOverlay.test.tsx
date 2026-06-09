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
});
