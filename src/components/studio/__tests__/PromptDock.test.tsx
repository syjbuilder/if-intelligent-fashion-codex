import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { PromptDock } from "../PromptDock";

describe("PromptDock", () => {
  it("controlled input — 입력 시 onChange 호출", () => {
    const onChange = vi.fn();
    render(<PromptDock value="" onChange={onChange} onSubmit={() => {}} />);
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "출근룩" },
    });
    expect(onChange).toHaveBeenCalledWith("출근룩");
  });

  it("생성 버튼 클릭 시 onSubmit(value) 호출", () => {
    const onSubmit = vi.fn();
    render(
      <PromptDock value="출근룩 미니멀" onChange={() => {}} onSubmit={onSubmit} />,
    );
    fireEvent.click(screen.getByRole("button", { name: "룩 생성" }));
    expect(onSubmit).toHaveBeenCalledWith("출근룩 미니멀");
  });

  it("tokensInsufficient면 생성 비활성 + 안내(카운터/변동표시 없음)", () => {
    const onSubmit = vi.fn();
    render(
      <PromptDock
        value="출근룩"
        onChange={() => {}}
        onSubmit={onSubmit}
        tokensInsufficient
      />,
    );
    const gen = screen.getByRole("button", { name: "룩 생성" });
    expect(gen).toBeDisabled();
    fireEvent.click(gen);
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("size=lg는 입력/버튼이 h-14, 기본(md)은 h-12", () => {
    const { rerender } = render(
      <PromptDock value="" onChange={() => {}} onSubmit={() => {}} size="lg" />,
    );
    expect(screen.getByRole("textbox").className).toContain("h-14");
    expect(
      screen.getByRole("button", { name: "룩 생성" }).className,
    ).toContain("h-14");
    rerender(<PromptDock value="" onChange={() => {}} onSubmit={() => {}} />);
    expect(screen.getByRole("textbox").className).toContain("h-12");
  });

  it("variant=search는 glass-search 셸을 쓴다 (페이지와 같은 글래스 어휘)", () => {
    const { container } = render(
      <PromptDock
        value=""
        onChange={() => {}}
        onSubmit={() => {}}
        variant="search"
      />,
    );
    expect(container.querySelector("form")?.className).toContain(
      "glass-search",
    );
  });
});
