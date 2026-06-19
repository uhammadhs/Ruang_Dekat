import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

function getSafeRedirect(origin: string, next: string): string {
  try {
    const url = new URL(next, origin);
    if (url.origin === origin) return url.pathname + url.search;
  } catch {}
  return "/";
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";
  const safeNext = getSafeRedirect(origin, next);

  if (code) {
    const response = NextResponse.redirect(`${origin}${safeNext}`);

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.headers.get("cookie")?.split("; ").map(c => {
              const idx = c.indexOf("=");
              return { name: c.slice(0, idx), value: c.slice(idx + 1) };
            }) ?? [];
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return response;
    }
  }

  return NextResponse.redirect(`${origin}/login?error=Auth+code+exchange+failed`);
}
