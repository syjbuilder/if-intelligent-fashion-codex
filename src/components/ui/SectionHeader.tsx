import type { ReactNode } from "react";

type Size = "section" | "compact";
type Tone = "light" | "dark";

const TITLE_SIZE: Record<Size, string> = {
  section: "mt-4 text-t2",
  compact: "mt-1 text-t3",
};

const EYEBROW_TONE: Record<Tone, string> = {
  light: "text-muted",
  dark: "text-white-soft/60",
};

const SUB_TONE: Record<Tone, string> = {
  light: "text-ink-soft",
  dark: "text-white-soft/70",
};

/**
 * 단일 섹션 헤더 패턴: eyebrow(t7 대문자) + 제목(t2/t3 extrabold) + 서브카피(t4 좌측정렬).
 * 랜딩 섹션·ExploreScene·HistoryOverlay가 공유한다 (UI_GUIDE 타이포 7원칙 §4).
 * RevealWords 등 모션은 호출부에서 title로 합성하고 titleLabel로 접근성 라벨을 준다.
 */
export function SectionHeader({
  eyebrow,
  title,
  titleLabel,
  sub,
  as = "h2",
  size = "section",
  tone = "light",
  className = "",
}: {
  eyebrow: string;
  title: ReactNode;
  titleLabel?: string;
  sub?: string;
  as?: "h1" | "h2";
  size?: Size;
  tone?: Tone;
  className?: string;
}) {
  const Heading = as;
  return (
    <header className={className}>
      <p
        className={`text-t7 font-extrabold uppercase tracking-[0.18em] ${EYEBROW_TONE[tone]}`}
      >
        {eyebrow}
      </p>
      <Heading
        aria-label={titleLabel}
        className={`${TITLE_SIZE[size]} font-extrabold`}
      >
        {title}
      </Heading>
      {sub ? (
        <p className={`mt-6 max-w-[46ch] text-left text-t4 ${SUB_TONE[tone]}`}>
          {sub}
        </p>
      ) : null}
    </header>
  );
}
