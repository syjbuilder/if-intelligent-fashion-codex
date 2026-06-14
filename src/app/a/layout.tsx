import { MotionProvider } from "@/components/motion/MotionProvider";

// Variant A 셸 — framer-motion 루트 + 테마 스코프 클래스(theme-a).
// A는 I.F 베이스라인 팔레트(Ink Violet/페이퍼)를 유지하므로 body 배경 누수 이슈 없음.
export default function VariantALayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MotionProvider>
      <div className="theme-a">{children}</div>
    </MotionProvider>
  );
}
