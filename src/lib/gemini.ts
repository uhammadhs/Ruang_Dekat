import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { getEnv } from "@/lib/utils";

export const aiAssistSchema = z.object({
  mode: z.enum(["caption", "summary", "moderation"]),
  input: z.string().min(3).max(4000)
});

export function isGeminiConfigured() {
  return Boolean(getEnv("GEMINI_API_KEY"));
}

function buildPrompt(mode: "caption" | "summary" | "moderation", input: string) {
  if (mode === "caption") {
    return `Buat caption sosial media bahasa Indonesia untuk platform komunitas lokal. Gaya natural, profesional, tidak lebay, tidak clickbait, dan maksimal 120 kata. Tambahkan ajakan aksi yang sopan. Input:\n${input}`;
  }

  if (mode === "summary") {
    return `Ringkas diskusi komunitas berikut menjadi poin aksi yang jelas, bahasa Indonesia, maksimal 6 bullet. Input:\n${input}`;
  }

  return `Analisis konten berikut untuk moderasi komunitas. Jawab dalam JSON valid dengan properti: riskLevel rendah|sedang|tinggi, reasons array string, action allow|review|block. Konten:\n${input}`;
}

export async function runGeminiAssist(payload: z.infer<typeof aiAssistSchema>) {
  const apiKey = getEnv("GEMINI_API_KEY");
  if (!apiKey) {
    throw new Error("Gemini belum dikonfigurasi. Isi GEMINI_API_KEY di server env.");
  }

  const ai = new GoogleGenAI({ apiKey });
  const model = getEnv("GEMINI_MODEL") || "gemini-2.5-flash";
  const response = await ai.models.generateContent({
    model,
    contents: buildPrompt(payload.mode, payload.input),
    config: {
      temperature: payload.mode === "moderation" ? 0.2 : 0.6,
      maxOutputTokens: payload.mode === "summary" ? 512 : 768
    }
  });

  return response.text ?? "";
}
