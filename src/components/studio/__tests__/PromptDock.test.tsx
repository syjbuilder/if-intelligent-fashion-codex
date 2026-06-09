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
});
