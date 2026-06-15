import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Hero } from "../Hero";

describe("variant-b Hero (다크+코랄 키네틱)", () => {
  it("스튜디오 CTA가 /b/studio로 연결된다", () => {
    render(<Hero />);
    expect(
      screen.getByRole("link", { name: /스튜디오 시작/ }),
    ).toHaveAttribute("href", "/studio");
  });

  it("히어로 이미지를 렌더한다", () => {
    const { container } = render(<Hero />);
    expect(container.querySelector("img")).toBeInTheDocument();
  });
});
