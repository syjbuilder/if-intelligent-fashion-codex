import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { LoadingScene } from "../LoadingScene";

describe("LoadingScene", () => {
  it("로딩 타이틀과 진행 텍스트를 노출한다 (빈 화면 금지)", () => {
    render(<LoadingScene promptLabel="출근룩" />);
    expect(screen.getByText(/Reading the silhouette/i)).toBeInTheDocument();
    expect(screen.getByText(/룩을 그리고 있어요/)).toBeInTheDocument();
  });
});
