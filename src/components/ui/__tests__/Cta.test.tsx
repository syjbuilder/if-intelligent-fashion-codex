import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Cta } from "../Cta";

describe("Cta", () => {
  it("button으로 렌더되고 클릭 시 onClick 호출", () => {
    const onClick = vi.fn();
    render(<Cta onClick={onClick}>Get Started</Cta>);
    fireEvent.click(screen.getByRole("button", { name: "Get Started" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("href가 있으면 링크로 렌더한다", () => {
    render(<Cta href="/studio">Start the studio</Cta>);
    expect(
      screen.getByRole("link", { name: "Start the studio" }),
    ).toHaveAttribute("href", "/studio");
  });

  it("variant accent는 cta-accent 클래스를 갖는다", () => {
    render(<Cta variant="accent">Go</Cta>);
    expect(screen.getByRole("button", { name: "Go" }).className).toContain(
      "cta-accent",
    );
  });

  it("disabled면 클릭이 무시된다", () => {
    const onClick = vi.fn();
    render(
      <Cta onClick={onClick} disabled>
        Nope
      </Cta>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Nope" }));
    expect(onClick).not.toHaveBeenCalled();
  });
});
