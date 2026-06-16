import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { SiteFooterB } from "../SiteFooterB";

describe("SiteFooterB (B 톤 푸터)", () => {
  it("약관·개인정보·문의·어필리에이트·회사·저작권을 렌더한다", () => {
    const { container } = render(<SiteFooterB />);
    expect(screen.getByText("이용약관")).toBeInTheDocument();
    expect(screen.getByText("개인정보처리방침")).toBeInTheDocument();
    expect(screen.getByText("문의")).toBeInTheDocument();
    expect(screen.getByText(/무신사|제휴/)).toBeInTheDocument();
    expect(screen.getByText(/사업자번호/)).toBeInTheDocument();
    expect(screen.getByText(/© 2026/)).toBeInTheDocument();
    expect(container.querySelector("footer")?.className).toContain("bg-b-ink");
  });

  it("약관 버튼 클릭 시 콜백을 호출한다", () => {
    const onOpenTerms = vi.fn();
    render(<SiteFooterB onOpenTerms={onOpenTerms} />);
    fireEvent.click(screen.getByText("이용약관"));
    expect(onOpenTerms).toHaveBeenCalled();
  });
});
