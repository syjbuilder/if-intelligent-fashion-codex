import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/serverClient";
import { AUTH_PROVIDERS, type AuthProvider } from "@/types/db";
import { safeNext } from "@/lib/auth/signInPath";
import type { Provider } from "@supabase/supabase-js";

// provider별 요청 scope. kakao는 account_email(카카오 비즈앱 전환·심사 필요)을 빼고 닉네임만
// 요청한다 — 일반 앱은 이메일 동의항목을 쓸 수 없어 account_email 요청 시 KOE205로 실패한다.
// google/naver는 미지정(Supabase 기본 scope, 이메일 포함). (ADR-019)
const PROVIDER_SCOPES: Partial<Record<AuthProvider, string>> = {
  kakao: "profile_nickname",
};

/**
 * 서버 개시 OAuth — 클라이언트는 Supabase를 직접 호출하지 않고 이 라우트로 네비게이트만 한다
 * (CLAUDE.md CRITICAL: 외부 API는 서버 영역만). signInWithOAuth가 PKCE code-verifier 쿠키를
 * 굽고 provider 인증 url을 돌려주면 그곳으로 redirect → 콜백에서 같은 쿠키로 교환을 마친다.
 */
export async function GET(
  request: Request,
  ctx: { params: Promise<{ provider: string }> },
) {
  const { provider } = await ctx.params;
  const { origin, searchParams } = new URL(request.url);
  const next = safeNext(searchParams.get("next"));

  if (!AUTH_PROVIDERS.includes(provider as AuthProvider)) {
    return NextResponse.redirect(`${origin}/?auth_error=provider`);
  }

  const supabase = await createServerSupabaseClient();
  const scopes = PROVIDER_SCOPES[provider as AuthProvider];
  const { data, error } = await supabase.auth.signInWithOAuth({
    // Supabase 내장 Provider 유니온에는 naver가 없다(google·kakao만 네이티브). google·kakao는
    // 실연동이며, naver 호출 시 Supabase가 에러를 돌려주면 auth_error=signin으로 안전하게
    // 떨어진다. (Naver는 추후 커스텀 OIDC로 별도 구현 — 버튼은 유지.)
    provider: provider as Provider,
    options: {
      redirectTo: `${origin}/api/auth/callback?next=${encodeURIComponent(next)}`,
      ...(scopes ? { scopes } : {}),
    },
  });

  if (error || !data?.url) {
    return NextResponse.redirect(`${origin}/?auth_error=signin`);
  }
  return NextResponse.redirect(data.url);
}
