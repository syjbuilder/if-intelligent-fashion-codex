import type { LookTone } from "@/types/ui";

// 가먼트 라인 일러스트 path d — 사람/얼굴/인종 마커 없음(ADR-006).
// 단일 출처: GarmentSvg(카드 렌더)와 PromptSketchCard(스크롤 stroke 드로우)가 공유한다.
export const GARMENT_PATHS: Record<LookTone, string[]> = {
  // 테일러드 자켓 (오피스)
  office: [
    "M38 30 L50 40 L62 30",
    "M38 30 L26 44 L30 104 L50 110 L70 104 L74 44 L62 30",
    "M50 40 L50 110",
    "M38 30 L44 58 M62 30 L56 58",
    "M26 44 L18 74 M74 44 L82 74",
  ],
  // 슬립/미디 원피스 (데이트) — 끈은 바디 옆선과 동일 기울기로 직선 연장(좌우 대칭).
  date: [
    "M40 28 Q50 34 60 28",
    "M40 28 L36 52 L30 118 L50 124 L70 118 L64 52 L60 28",
    "M36 52 Q50 60 64 52",
    "M40 28 L42 16 M60 28 L58 16",
  ],
  // 후디 + 조거 (스포츠)
  sport: [
    "M40 30 Q50 22 60 30",
    "M40 30 L28 42 L32 84 L68 84 L72 42 L60 30",
    "M28 42 L20 70 M72 42 L80 70",
    "M45 44 L45 60 M55 44 L55 60",
    "M32 84 L34 120 L48 120 L50 92 L52 120 L66 120 L68 84",
  ],
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
      {GARMENT_PATHS[tone].map((d, i) => (
        <path key={i} d={d} vectorEffect="non-scaling-stroke" />
      ))}
    </svg>
  );
}
