import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Chip } from "../Chip";

describe("Chip", () => {
  it("라벨을 렌더하고 클릭 콜백을 호출한다", () => {
    const onClick = vi.fn();
    render(<Chip onClick={onClick}>봄 데이트룩</Chip>);
    fireEvent.click(screen.getByRole("button", { name: "봄 데이트룩" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("season variant는 솔리드(흰) 스타일 클래스를 갖는다", () => {
    render(<Chip variant="season">출근룩</Chip>);
    expect(screen.getByRole("button", { name: "출근룩" }).className).toMatch(
      /bg-white\b/,
    );
  });
});
