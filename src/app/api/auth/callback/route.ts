import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/serverClient";
import { safeNext } from "@/lib/auth/signInPath";

/**
 * OAuth 콜백 — provider→Supabase→앱으로 돌아온 `code`를 세션으로 교환(PKCE)하고
 * 세션 쿠키를 굽는다. 성공 시 next(내부 경로)로, 실패/누락 시 홈+에러 플래그로 redirect.
 */
export async function GET(request: Request) {
  const { origin, searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = safeNext(searchParams.get("next"));

  if (code) {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }
  return NextResponse.redirect(`${origin}/?auth_error=callback`);
}
