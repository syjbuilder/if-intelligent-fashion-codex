import { MotionProvider } from "@/components/motion/MotionProvider";

// Variant B 셸 — framer-motion 루트 + 테마 스코프 클래스(theme-b).
// B는 다크 베이스로 재설계 예정 → body 배경 누수는 Phase 5에서 globals.css의
// `body:has(.theme-b)` 규칙으로 처리(루트 layout/body 하드코딩 우회).
export default function VariantBLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MotionProvider>
      <div className="theme-b">{children}</div>
    </MotionProvider>
  );
}
