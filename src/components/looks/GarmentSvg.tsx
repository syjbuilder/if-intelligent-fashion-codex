import type { LookTone } from "@/types/ui";

// 가먼트 라인 일러스트 — 사람/얼굴/인종 마커 없음(ADR-006). stroke=currentColor로 카드 톤 색을 상속.
// vector-effect non-scaling-stroke로 hover scale 시 선 굵기 유지.
const PATHS: Record<LookTone, React.ReactNode> = {
  // 테일러드 자켓 (오피스)
  office: (
    <>
      <path d="M38 30 L50 40 L62 30" vectorEffect="non-scaling-stroke" />
      <path d="M38 30 L26 44 L30 104 L50 110 L70 104 L74 44 L62 30" vectorEffect="non-scaling-stroke" />
      <path d="M50 40 L50 110" vectorEffect="non-scaling-stroke" />
      <path d="M38 30 L44 58 M62 30 L56 58" vectorEffect="non-scaling-stroke" />
      <path d="M26 44 L18 74 M74 44 L82 74" vectorEffect="non-scaling-stroke" />
    </>
  ),
  // 슬립/미디 원피스 (데이트)
  date: (
    <>
      <path d="M40 28 Q50 34 60 28" vectorEffect="non-scaling-stroke" />
      <path d="M40 28 L36 52 L30 118 L50 124 L70 118 L64 52 L60 28" vectorEffect="non-scaling-stroke" />
      <path d="M36 52 Q50 60 64 52" vectorEffect="non-scaling-stroke" />
      <path d="M40 28 L42 22 M60 28 L58 22" vectorEffect="non-scaling-stroke" />
    </>
  ),
  // 후디 + 조거 (스포츠)
  sport: (
    <>
      <path d="M40 30 Q50 22 60 30" vectorEffect="non-scaling-stroke" />
      <path d="M40 30 L28 42 L32 84 L68 84 L72 42 L60 30" vectorEffect="non-scaling-stroke" />
      <path d="M28 42 L20 70 M72 42 L80 70" vectorEffect="non-scaling-stroke" />
      <path d="M45 44 L45 60 M55 44 L55 60" vectorEffect="non-scaling-stroke" />
      <path d="M32 84 L34 120 L48 120 L50 92 L52 120 L66 120 L68 84" vectorEffect="non-scaling-stroke" />
    </>
  ),
};

export function GarmentSvg({
  tone,
  className = "",
}: {
  tone: LookTone;
  className?: string;
}) {
  return (
    <svg
      role="img"
      aria-label={`${tone} look illustration`}
      viewBox="0 0 100 140"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {PATHS[tone]}
    </svg>
  );
}
