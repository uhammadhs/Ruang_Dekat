import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, displayName } = body;

    if (!email || !password || !displayName) {
      return NextResponse.json(
        { ok: false, error: "Email, password, dan nama tampilan wajib diisi." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { ok: false, error: "Password minimal 6 karakter." },
        { status: 400 }
      );
    }

    const admin = getSupabaseAdminClient();
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { display_name: displayName },
    });

    if (error) {
      if (error.message?.includes("already registered") || error.message === "User already registered") {
        return NextResponse.json(
          { ok: false, error: "Email sudah terdaftar." },
          { status: 409 }
        );
      }
      if (error.message?.toLowerCase().includes("rate limit")) {
        return NextResponse.json(
          { ok: false, error: "Terlalu banyak permintaan. Coba lagi nanti." },
          { status: 429 }
        );
      }
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      ok: true,
      user: { id: data.user.id, email: data.user.email },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Registrasi gagal.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
