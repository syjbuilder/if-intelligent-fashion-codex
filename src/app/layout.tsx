import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// 시안 v0.7 우선: Playfair+Manrope 폐기 → Inter(영문/숫자) + Pretendard(한글, <link> CDN).
// weight는 디자인 규칙 3단(400/600/800)만 로드.
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600", "800"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "I.F — Wear what you imagine.",
  description:
    "텍스트로 상상한 패션을 AI 룩으로 시각화하고 국내 상품으로 연결하는 AI 패션 탐색 서비스.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={inter.variable}>
      <head>
        {/* Pretendard Variable (한글) — @import 순서 이슈·OneDrive 빌드 영향 회피 위해 <link>로 로드 */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="font-body antialiased bg-paper text-ink">{children}</body>
    </html>
  );
}
