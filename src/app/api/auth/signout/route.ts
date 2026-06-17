import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/serverClient";

/**
 * 로그아웃 — 서버에서 signOut()으로 세션 쿠키를 제거하고 홈으로 보낸다.
 * Topbar의 `<form method="post">`가 호출하므로 303(See Other)로 GET 재요청을 유도한다.
 */
export async function POST(request: Request) {
  const { origin } = new URL(request.url);
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  return NextResponse.redirect(`${origin}/`, 303);
}
