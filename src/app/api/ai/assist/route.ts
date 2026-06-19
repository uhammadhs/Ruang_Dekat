import { NextResponse } from "next/server";
import { aiAssistSchema, runGeminiAssist } from "@/lib/gemini";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = aiAssistSchema.parse(body);
    const output = await runGeminiAssist(payload);

    return NextResponse.json({ ok: true, output });
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI assist gagal.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
