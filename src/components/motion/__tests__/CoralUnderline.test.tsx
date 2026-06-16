import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { CoralUnderline } from "../CoralUnderline";

describe("CoralUnderline", () => {
  it("코랄 라인 span을 aria-hidden·origin-left·bg-b-accent로 렌더한다", () => {
    const { container } = render(<CoralUnderline />);
    const el = container.firstChild as HTMLElement;
    expect(el.tagName).toBe("SPAN");
    expect(el.getAttribute("aria-hidden")).toBe("true");
    expect(el.className).toContain("bg-b-accent");
    expect(el.className).toContain("origin-left");
  });

  it("전달된 className을 병합한다", () => {
    const { container } = render(<CoralUnderline className="w-10 mt-3" />);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain("w-10");
    expect(el.className).toContain("mt-3");
  });
});
