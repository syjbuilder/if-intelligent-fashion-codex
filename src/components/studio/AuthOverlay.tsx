"use client";

import type { SocialProvider } from "@/types/ui";

// 소셜 3버튼 — 표시 순서 Google → Kakao → Naver. 버튼은 콜백만(OAuth 호출 절대 0 — 시크릿 클라 번들 유입 차단).
const SOCIALS: { provider: SocialProvider; label: string; cls: string }[] = [
  {
    provider: "google",
    label: "Google로 계속하기",
    cls: "bg-white text-ink border border-line hover:bg-[#e8eaf0]",
  },
  {
    provider: "kakao",
    label: "카카오로 계속하기",
    cls: "bg-[#FEE500] text-[#191919] hover:bg-[#ffd900]",
  },
  {
    provider: "naver",
    label: "네이버로 계속하기",
    cls: "bg-[#03C75A] text-white hover:bg-[#02b350]",
  },
];

export function AuthOverlay({
  open,
  onClose,
  onSelectProvider,
}: {
  open: boolean;
  onClose: () => void;
  onSelectProvider?: (p: SocialProvider) => void;
}) {
  if (!open) return null;
  return (
    <div className="bg-slate-scene fixed inset-0 z-[150] flex items-center justify-center px-6 text-white-soft">
      <button
        type="button"
        aria-label="닫기"
        onClick={onClose}
        className="absolute right-6 top-6 z-10 grid h-10 w-10 place-items-center rounded-full border border-white/20"
      >
        ✕
      </button>
      <div className="relative z-10 w-[min(420px,90vw)] text-center">
        <p className="text-t7 font-extrabold uppercase tracking-[0.18em] text-white-soft/55">
          Sign in to IF
        </p>
        <h2 className="mt-3 text-t2 font-extrabold">Style your Imagination.</h2>
        <p className="mt-3 text-t5 text-white-soft/70">
          로그인하고 마음에 드는 룩을 저장·공유하세요.
        </p>
        <div className="mt-8 flex flex-col gap-3">
          {SOCIALS.map((s) => (
            <button
              key={s.provider}
              type="button"
              data-provider={s.provider}
              onClick={() => onSelectProvider?.(s.provider)}
              className={`flex min-h-[52px] items-center justify-center rounded-full text-t6 font-semibold transition-colors ${s.cls}`}
            >
              {s.label}
            </button>
          ))}
        </div>
        <p className="mt-6 text-t8 leading-relaxed text-white-soft/45">
          계속 진행하면 이용약관과 개인정보처리방침에 동의하는 것으로 간주됩니다.
        </p>
      </div>
    </div>
  );
}
