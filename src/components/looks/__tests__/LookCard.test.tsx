import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { LookCard } from "../LookCard";
import type { LookCardData } from "@/types/ui";

const look: LookCardData = {
  id: "test-1",
  tone: "office",
  variant: "b",
  tag: "OFFICE 02",
  caption: "뉴트럴 미니멀 출근룩",
  prompt: "출근룩 뉴트럴 톤 미니멀",
};

describe("LookCard", () => {
  it("tone 클래스와 tag/caption을 렌더한다", () => {
    render(<LookCard look={look} />);
    expect(screen.getByText("OFFICE 02")).toBeInTheDocument();
    expect(screen.getByText("뉴트럴 미니멀 출근룩")).toBeInTheDocument();
    expect(screen.getByRole("button").className).toContain("tone-office");
  });

  it("클릭 시 onClick(look)을 호출한다", () => {
    const onClick = vi.fn();
    render(<LookCard look={look} onClick={onClick} />);
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledWith(look);
  });
});
