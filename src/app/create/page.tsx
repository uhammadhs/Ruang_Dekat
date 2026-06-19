"use client";

import { ChangeEvent, useState } from "react";
import { BottomNav } from "@/components/bottom-nav";
import { TopBar } from "@/components/top-bar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ImagePlus, Loader2, Sparkles, UploadCloud } from "lucide-react";

export default function CreatePage() {
  const [content, setContent] = useState("Saya ingin membagikan karya/proyek/event lokal dengan bukti yang jelas.");
  const [aiText, setAiText] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");
  const [isBusy, setIsBusy] = useState(false);

  async function handleAi() {
    setIsBusy(true);
    setAiText("");
    try {
      const response = await fetch("/api/ai/assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "caption", input: content })
      });
      const data = (await response.json()) as { ok: boolean; output?: string; error?: string };
      setAiText(data.ok ? data.output || "" : data.error || "AI belum dikonfigurasi.");
    } catch {
      setAiText("AI belum aktif. Isi GEMINI_API_KEY terlebih dahulu.");
    } finally {
      setIsBusy(false);
    }
  }

  async function handleUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadStatus("Mengupload gambar...");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/media/upload", { method: "POST", body: formData });
      const data = (await response.json()) as { ok: boolean; media?: { url: string }; error?: string };
      setUploadStatus(data.ok ? `Berhasil upload: ${data.media?.url}` : data.error || "Upload gagal.");
    } catch {
      setUploadStatus("Upload gagal. Pastikan env Cloudinary sudah benar.");
    }
  }

  return (
    <>
      <TopBar />
      <main className="mx-auto max-w-3xl px-4 py-5 pb-28 lg:px-6">
        <Card className="space-y-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">Buat posting</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Posting yang punya konteks dan bukti.</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              MVP ini menyiapkan flow posting profesional: konten, label bukti, media Cloudinary, dan AI caption Gemini 2.5 Flash.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge tone="blue">Karya</Badge>
            <Badge tone="green">UMKM</Badge>
            <Badge tone="amber">Event</Badge>
            <Badge tone="slate">Peluang</Badge>
          </div>

          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            className="focus-ring min-h-40 w-full rounded-3xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-700 outline-none"
            placeholder="Tulis isi posting..."
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <Button onClick={handleAi} disabled={isBusy}>
              {isBusy ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
              Bantu Caption
            </Button>
            <label className="focus-ring inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-900 transition hover:bg-slate-50">
              <ImagePlus className="size-4" /> Upload Cloudinary
              <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
            </label>
          </div>

          {aiText ? <div className="rounded-3xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-950">{aiText}</div> : null}
          {uploadStatus ? (
            <div className="flex items-start gap-2 rounded-3xl border border-emerald-100 bg-emerald-50 p-4 text-sm leading-6 text-emerald-950">
              <UploadCloud className="mt-0.5 size-4 shrink-0" /> <span className="break-all">{uploadStatus}</span>
            </div>
          ) : null}
        </Card>
      </main>
      <BottomNav />
    </>
  );
}
