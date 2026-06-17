import type { SocialProvider } from "@/types/ui";

/**
 * 오픈 리다이렉트 가드: 같은 사이트 내부 절대경로("/...")만 허용한다.
 * 외부 URL·프로토콜상대(`//`)·역슬래시 트릭·상대경로·빈값은 모두 "/"로 떨군다.
 */
export function safeNext(next?: string | null): string {
  if (!next) return "/";
  if (next[0] !== "/" || next[1] === "/" || next[1] === "\\") return "/";
  return next;
}

/**
 * AuthOverlay 버튼이 네비게이트할 서버 로그인 라우트 경로를 만든다.
 * 클라이언트는 Supabase를 직접 호출하지 않고 이 같은-오리진 라우트로만 이동한다
 * (CLAUDE.md CRITICAL: 외부 API 호출은 서버 영역만).
 */
export function buildSignInPath(provider: SocialProvider, next?: string): string {
  const safe = safeNext(next);
  const qs = safe === "/" ? "" : `?next=${encodeURIComponent(safe)}`;
  return `/api/auth/signin/${provider}${qs}`;
}
