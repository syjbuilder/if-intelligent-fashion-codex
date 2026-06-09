import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import StudioPage from "../page";
import { SEASON_PROMPTS } from "@/lib/looks-fixtures";

describe("StudioPage (/studio)", () => {
  it("초기 scene은 explore — 시즌 데모 프롬프트가 노출된다", () => {
    render(<StudioPage />);
    expect(screen.getByText(SEASON_PROMPTS[0])).toBeInTheDocument();
  });
});
