import type { Config } from "tailwindcss";

// 디자인 기준선: 디자인/if-homepage-v0.7.html (Typography 7원칙).
// 색은 정확한 hex로 박제(Tailwind 기본 팔레트로 치환 금지). weight는 400/600/800만 사용.
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1a1a1a", // 주 텍스트 / 다크 단색 배경
        "ink-soft": "#4a4a48", // 보조 텍스트
        muted: "#8a8a86", // 캡션·eyebrow·placeholder
        paper: "#f5f5f3", // 라이트 페이지 배경
        "paper-alt": "#f3f3f1", // 섹션 톤 리듬용(미세하게 어두운 페이퍼)
        cream: "#eaeae6", // 라이트 면 카드 / chip hover
        "white-soft": "#fbfbfa", // 다크 위 텍스트 (Tailwind 기본 white와 구분)
        accent: "#3d4f6b", // Muted Slate (v0.7.2) — 페이지당 ≤2회
        line: "rgba(26,26,26,0.10)", // 구분선
        "slate-body": "#5a5f68", // gate-sub/results-copy/panel-copy 본문 회색
      },
      fontFamily: {
        // display = body 동일 매핑(단일 산세리프 통일). Inter(latin) + Pretendard(한글).
        display: [
          "var(--font-inter)",
          "Pretendard Variable",
          "Pretendard",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
        body: [
          "var(--font-inter)",
          "Pretendard Variable",
          "Pretendard",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
      },
      fontSize: {
        t1: ["clamp(48px, 7vw, 96px)", { lineHeight: "1.02", letterSpacing: "-0.02em" }],
        t2: ["clamp(40px, 5.4vw, 72px)", { lineHeight: "1.05", letterSpacing: "-0.015em" }],
        t3: ["clamp(24px, 2.4vw, 32px)", { lineHeight: "1.15" }],
        t4: ["18px", { lineHeight: "1.5" }],
        t5: ["16px", { lineHeight: "1.6" }],
        t6: ["13px", { lineHeight: "1.4" }],
        t7: ["12px", { lineHeight: "1.4" }],
        t8: ["11px", { lineHeight: "1.4" }],
      },
      letterSpacing: {
        tightest: "-0.04em", // brand lockup
        brand: "0.24em", // INTELLIGENT FASHION
      },
      borderRadius: {
        card: "4px", // 룩 카드 (pill 액션은 기본 rounded-full = 999px)
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.22,1,0.36,1)",
        expo: "cubic-bezier(0.16,1,0.3,1)",
      },
    },
  },
  plugins: [],
};

export default config;
