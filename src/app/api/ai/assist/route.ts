import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { aiAssistSchema, runGeminiAssist } from "@/lib/gemini";
import { checkRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ ok: false, error: "Harus login untuk menggunakan AI." }, { status: 401 });
  }

  const ip = request.headers.get("x-forwarded-for") || "unknown";
  const rl = checkRateLimit(`ai:${user.id}:${ip}`, 20, 60000);
  if (!rl.allowed) {
    return NextResponse.json({ ok: false, error: "Terlalu banyak permintaan AI. Coba lagi nanti." }, { status: 429 });
  }

  try {
    const body = await request.json();
    const payload = aiAssistSchema.parse(body);
    const output = await runGeminiAssist(payload);

    // Log to ai_logs
    await supabase.from("ai_logs").insert({
      user_id: user.id,
      mode: payload.mode,
      input_hash: await sha256(payload.input),
      output_preview: output.slice(0, 200),
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
    });

    return NextResponse.json({ ok: true, output });
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI assist gagal.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}

async function sha256(text: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, "0")).join("");
}
