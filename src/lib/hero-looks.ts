// 랜딩 히어로 좌측 로테이션에 쓰는 마네킹 룩 이미지 목록.
// 원본 → WebP 변환은 scripts/build-look-images.mjs (840px, q80).
export type HeroLook = {
  src: string;
  alt: string;
  label: string;
};

export const HERO_LOOKS: HeroLook[] = [
  { src: "/looks/01-minimal-office.webp", alt: "미니멀 오피스 룩 마네킹", label: "Minimal Office" },
  { src: "/looks/02-elevated-streetwear.webp", alt: "엘리베이티드 스트릿웨어 룩 마네킹", label: "Elevated Streetwear" },
  { src: "/looks/03-refined-athleisure.webp", alt: "리파인드 애슬레저 룩 마네킹", label: "Refined Athleisure" },
  { src: "/looks/04-elegant-evening.webp", alt: "엘레강트 이브닝 룩 마네킹", label: "Elegant Evening" },
  { src: "/looks/05-outdoor-techwear.webp", alt: "아웃도어 테크웨어 룩 마네킹", label: "Outdoor Techwear" },
  { src: "/looks/06-feminine-smart-casual.webp", alt: "페미닌 스마트 캐주얼 룩 마네킹", label: "Feminine Smart Casual" },
  { src: "/looks/07-feminine-resort.webp", alt: "페미닌 리조트 룩 마네킹", label: "Feminine Resort" },
];

// 사용자 요구 "2초마다" — 크로스페이드(~0.9s)와 겹치지 않게 2400ms로 운용.
export const HERO_ROTATE_MS = 2400;
