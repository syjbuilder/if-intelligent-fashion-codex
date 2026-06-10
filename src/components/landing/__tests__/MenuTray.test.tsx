import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MenuTray } from "../MenuTray";

describe("MenuTray", () => {
  it("open이면 메뉴 항목(Explore/Saved Looks/New Prompt)을 노출한다", () => {
    render(<MenuTray open onClose={() => {}} />);
    expect(screen.getByRole("link", { name: /Explore/ })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Saved Looks/ }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /New Prompt/ })).toBeInTheDocument();
  });

  it("항목 클릭 시 onClose를 호출한다", () => {
    const onClose = vi.fn();
    render(<MenuTray open onClose={onClose} />);
    fireEvent.click(screen.getByRole("link", { name: /New Prompt/ }));
    expect(onClose).toHaveBeenCalled();
  });
});
