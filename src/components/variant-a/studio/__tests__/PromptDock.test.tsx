import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PromptDock } from "../PromptDock";

describe("variant-a PromptDock (하단 글래스 도크)", () => {
  it("value를 입력칸에 표시한다", () => {
    render(<PromptDock value="출근룩" onChange={() => {}} onSubmit={() => {}} />);
    expect(screen.getByRole("textbox")).toHaveValue("출근룩");
  });

  it("제출 시 onSubmit(value)을 호출한다", () => {
    const onSubmit = vi.fn();
    render(
      <PromptDock value="데이트룩" onChange={() => {}} onSubmit={onSubmit} />,
    );
    fireEvent.submit(screen.getByRole("textbox").closest("form")!);
    expect(onSubmit).toHaveBeenCalledWith("데이트룩");
  });

  it("입력 변경 시 onChange를 호출한다", () => {
    const onChange = vi.fn();
    render(<PromptDock value="" onChange={onChange} onSubmit={() => {}} />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "봄" } });
    expect(onChange).toHaveBeenCalledWith("봄");
  });
});
