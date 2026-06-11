import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { SectionHeader } from "../SectionHeader";

describe("SectionHeader", () => {
  it("eyebrow(t7)·제목(h2 t2)·서브카피(t4)를 렌더한다", () => {
    render(
      <SectionHeader
        eyebrow="How it works"
        title="From intention to wearable."
        sub="설명 문장."
      />,
    );
    const eyebrow = screen.getByText("How it works");
    expect(eyebrow.className).toContain("text-t7");
    const heading = screen.getByRole("heading", {
      level: 2,
      name: "From intention to wearable.",
    });
    expect(heading.className).toContain("text-t2");
    const sub = screen.getByText("설명 문장.");
    expect(sub.className).toContain("text-t4");
    expect(sub.className).toContain("text-left");
  });

  it("as=h1이면 h1으로 렌더한다", () => {
    render(<SectionHeader eyebrow="Atelier" title="Saved Looks" as="h1" />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Saved Looks" }),
    ).toBeInTheDocument();
  });

  it("size=compact는 t3 제목을 쓴다", () => {
    render(<SectionHeader eyebrow="Atelier" title="Saved Looks" size="compact" />);
    expect(
      screen.getByRole("heading", { name: "Saved Looks" }).className,
    ).toContain("text-t3");
  });

  it("titleLabel은 ReactNode 제목의 aria-label로 노출된다", () => {
    render(
      <SectionHeader
        eyebrow="Curated"
        title={<span>꾸민 제목</span>}
        titleLabel="Today's curated looks."
      />,
    );
    expect(
      screen.getByRole("heading", { name: "Today's curated looks." }),
    ).toBeInTheDocument();
  });

  it("sub가 없으면 서브카피 p를 렌더하지 않는다", () => {
    const { container } = render(
      <SectionHeader eyebrow="Curated" title="제목" />,
    );
    expect(container.querySelectorAll("p")).toHaveLength(1);
  });

  it("tone=dark는 밝은 텍스트 톤을 쓴다", () => {
    render(
      <SectionHeader eyebrow="Studio" title="제목" sub="서브" tone="dark" />,
    );
    expect(screen.getByText("Studio").className).toContain("text-white-soft");
    expect(screen.getByText("서브").className).toContain("text-white-soft");
  });
});
