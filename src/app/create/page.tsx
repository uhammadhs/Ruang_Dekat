"use client";

import { useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { BottomNav } from "@/components/bottom-nav";
import { TopBar } from "@/components/top-bar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useSession } from "@/components/session-provider";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { ImagePlus, Loader2, Sparkles, X } from "lucide-react";

const postTypes = [
  { value: "local", label: "Umum" },
  { value: "work", label: "Karya" },
  { value: "question", label: "Tanya" },
  { value: "opportunity", label: "Peluang" },
  { value: "event", label: "Event" },
];

export default function CreatePage() {
  const router = useRouter();
  const { user } = useSession();

  const [type, setType] = useState("local");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [proof, setProof] = useState("");
  const [locationCity, setLocationCity] = useState("");
  const [locationDistrict, setLocationDistrict] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [aiText, setAiText] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleAi() {
    if (!content.trim()) return;
    setAiLoading(true);
    setAiText("");
    try {
      const res = await fetch("/api/ai/assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "caption", input: content }),
      });
      const data = await res.json();
      if (data.ok) {
        setAiText(data.output);
      } else {
        setAiText(data.error || "Gagal memanggil AI.");
      }
    } catch {
      setAiText("AI tidak tersedia.");
    } finally {
      setAiLoading(false);
    }
  }

  function handleFiles(e: ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files || []);
    const validFiles = selected.filter(
      (f) => f.type.startsWith("image/") && f.size <= 10 * 1024 * 1024
    );
    setFiles((prev) => [...prev, ...validFiles].slice(0, 5));
    validFiles.forEach((f) => {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviews((prev) => [...prev, reader.result as string].slice(0, 5));
      };
      reader.readAsDataURL(f);
    });
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) {
      router.push("/login");
      return;
    }
    if (!content.trim()) {
      setError("Content wajib diisi.");
      return;
    }

    setLoading(true);
    setError("");

    const supabase = getSupabaseBrowserClient();

    // Upload media to Cloudinary first
    const uploadedMedia: Array<{ url: string; width: number; height: number }> = [];
    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/media/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.ok) {
        uploadedMedia.push(data.media);
      }
    }

    // Create post
    const { data: post, error: postError } = await supabase
      .from("posts")
      .insert({
        user_id: user.id,
        type,
        title: title || "Untitled",
        content,
        proof: proof || null,
        location_city: locationCity || null,
        location_district: locationDistrict || null,
        ai_assisted: !!aiText,
        visibility: "public",
      })
      .select()
      .single();

    if (postError || !post) {
      setError(postError?.message || "Gagal membuat posting.");
      setLoading(false);
      return;
    }

    // Save media to post_media
    if (uploadedMedia.length > 0) {
      await supabase.from("post_media").insert(
        uploadedMedia.map((m, i) => ({
          post_id: post.id,
          url: m.url,
          width: m.width,
          height: m.height,
          sort_order: i,
        }))
      );
    }

    router.push("/");
    router.refresh();
  }

  return (
    <>
      <TopBar />
      <main className="mx-auto max-w-3xl px-4 py-5 pb-28 lg:px-6">
        <form onSubmit={handleSubmit}>
          <Card className="space-y-5">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">Buat posting</p>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Posting yang punya konteks dan bukti.</h1>
            </div>

            {/* Type selector */}
            <div className="flex flex-wrap gap-2">
              {postTypes.map((pt) => (
                <button
                  key={pt.value}
                  type="button"
                  onClick={() => setType(pt.value)}
                  className={`rounded-full border px-4 py-1.5 text-xs font-bold transition ${
                    type === pt.value
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {pt.label}
                </button>
              ))}
            </div>

            {/* Title */}
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="focus-ring block w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none"
              placeholder="Judul (opsional)"
              maxLength={140}
            />

            {/* Content */}
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="focus-ring min-h-40 w-full rounded-3xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-700 outline-none"
              placeholder="Tulis isi posting..."
              required
              maxLength={4000}
            />

            {/* Proof */}
            <input
              value={proof}
              onChange={(e) => setProof(e.target.value)}
              className="focus-ring block w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
              placeholder="Bukti atau referensi (opsional)"
              maxLength={300}
            />

            {/* Location */}
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                value={locationCity}
                onChange={(e) => setLocationCity(e.target.value)}
                className="focus-ring block w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                placeholder="Kota (opsional)"
              />
              <input
                value={locationDistrict}
                onChange={(e) => setLocationDistrict(e.target.value)}
                className="focus-ring block w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                placeholder="Kecamatan (opsional)"
              />
            </div>

            {/* Media preview */}
            {previews.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {previews.map((p, i) => (
                  <div key={i} className="relative">
                    <img src={p} alt="" className="h-24 w-24 rounded-2xl object-cover" />
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="absolute -right-2 -top-2 grid size-6 place-items-center rounded-full bg-rose-500 text-white shadow"
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* AI + Upload + Submit */}
            <div className="grid gap-3 sm:grid-cols-3">
              <Button type="button" onClick={handleAi} disabled={aiLoading || !content.trim()}>
                {aiLoading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
                Bantu AI
              </Button>
              <label className="focus-ring inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-900 transition hover:bg-slate-50">
                <ImagePlus className="size-4" /> Upload
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />
              </label>
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="size-4 animate-spin" /> : null}
                {loading ? "Menyimpan..." : "Posting"}
              </Button>
            </div>

            {/* AI result */}
            {aiText && (
              <div className="rounded-3xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-950">
                {aiText}
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="rounded-3xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                {error}
              </div>
            )}
          </Card>
        </form>
      </main>
      <BottomNav />
    </>
  );
}
