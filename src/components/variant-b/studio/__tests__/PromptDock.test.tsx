import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PromptDock } from "../PromptDock";

describe("variant-b PromptDock", () => {
  it("value 표시", () => {
    render(<PromptDock value="출근룩" onChange={() => {}} onSubmit={() => {}} />);
    expect(screen.getByRole("textbox")).toHaveValue("출근룩");
  });
  it("제출 시 onSubmit(value)", () => {
    const onSubmit = vi.fn();
    render(<PromptDock value="데이트룩" onChange={() => {}} onSubmit={onSubmit} />);
    fireEvent.submit(screen.getByRole("textbox").closest("form")!);
    expect(onSubmit).toHaveBeenCalledWith("데이트룩");
  });
});
