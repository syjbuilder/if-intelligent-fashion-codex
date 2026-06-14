import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { LookCardData } from "@/types/ui";
import { LookCard } from "../LookCard";

const look: LookCardData = {
  id: "x1",
  tone: "office",
  variant: "a",
  tag: "OFFICE 01",
  caption: "뉴트럴 셋업",
  prompt: "출근룩 뉴트럴 톤",
  imageSrc: "/looks/01-minimal-office.webp",
};

describe("variant-a LookCard", () => {
  it("imageSrc가 있으면 실사 이미지(img 태그)를 렌더한다", () => {
    const { container } = render(<LookCard look={look} />);
    expect(container.querySelector("img")).toBeInTheDocument();
  });

  it("imageSrc가 없으면 SVG 폴백을 렌더한다(img 태그 없음)", () => {
    const { container } = render(
      <LookCard look={{ ...look, id: "x2", imageSrc: undefined }} />,
    );
    expect(container.querySelector("img")).toBeNull();
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("클릭 시 onClick(look)을 호출한다", () => {
    const fn = vi.fn();
    render(<LookCard look={look} onClick={fn} />);
    fireEvent.click(screen.getByRole("button"));
    expect(fn).toHaveBeenCalledWith(look);
  });
});
