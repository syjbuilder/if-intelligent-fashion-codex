import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MotionProvider } from "../MotionProvider";

describe("MotionProvider", () => {
  it("자식을 그대로 렌더한다", () => {
    render(
      <MotionProvider>
        <span>motion-child</span>
      </MotionProvider>,
    );
    expect(screen.getByText("motion-child")).toBeInTheDocument();
  });
});
