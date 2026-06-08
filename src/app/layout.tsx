import type { Metadata } from "next";
import { Playfair_Display, Manrope } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "I.F — Wear what you imagine.",
  description: "텍스트로 상상한 패션을 AI 룩으로 시각화하고 국내 상품으로 연결하는 AI 패션 탐색 서비스.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={`${playfair.variable} ${manrope.variable}`}>
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
