import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { SiteFooter } from "../SiteFooter";

describe("SiteFooter", () => {
  it("어필리에이트 고지(무신사·29CM 등)를 노출한다", () => {
    render(<SiteFooter />);
    expect(screen.getByText(/무신사/)).toBeInTheDocument();
    expect(screen.getByText(/29CM/)).toBeInTheDocument();
  });

  it("이용약관/개인정보 트리거가 콜백을 호출한다", () => {
    const onTerms = vi.fn();
    const onPrivacy = vi.fn();
    render(<SiteFooter onOpenTerms={onTerms} onOpenPrivacy={onPrivacy} />);
    fireEvent.click(screen.getByRole("button", { name: "이용약관" }));
    fireEvent.click(screen.getByRole("button", { name: "개인정보처리방침" }));
    expect(onTerms).toHaveBeenCalledOnce();
    expect(onPrivacy).toHaveBeenCalledOnce();
  });
});
