import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MenuTray } from "../MenuTray";

const items = [
  { label: "Explore", n: "01", href: "/studio" },
  { label: "Recent prompts", n: "02", onClick: () => {} },
  { label: "Saved Looks", n: "03", onClick: () => {} },
  { label: "New Prompt", n: "04", href: "/studio" },
];

describe("MenuTray", () => {
  it("open이면 4개 항목(Recent prompts 포함)을 노출한다", () => {
    render(<MenuTray open onClose={() => {}} items={items} />);
    expect(screen.getByRole("link", { name: /Explore/ })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Recent prompts/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Saved Looks/ }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /New Prompt/ })).toBeInTheDocument();
  });

  it("onClick 항목 클릭 시 콜백 + onClose를 호출한다", () => {
    const onRecent = vi.fn();
    const onClose = vi.fn();
    render(
      <MenuTray
        open
        onClose={onClose}
        items={[{ label: "Recent prompts", n: "02", onClick: onRecent }]}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: /Recent prompts/ }));
    expect(onRecent).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });
});
