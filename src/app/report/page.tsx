"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BottomNav } from "@/components/bottom-nav";
import { TopBar } from "@/components/top-bar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSession } from "@/components/session-provider";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { Loader2, Flag } from "lucide-react";

const reasons = [
  { value: "spam", label: "Spam" },
  { value: "scam", label: "Penipuan" },
  { value: "hate speech", label: "Ujaran Kebencian" },
  { value: "harassment", label: "Pelecehan" },
  { value: "fake content", label: "Konten Palsu" },
  { value: "adult content", label: "Konten Dewasa" },
  { value: "violence", label: "Kekerasan" },
  { value: "other", label: "Lainnya" },
];

function ReportForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useSession();

  const postId = searchParams.get("post");
  const commentId = searchParams.get("comment");
  const reportUserId = searchParams.get("user");

  const [reason, setReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) { router.push("/login"); return; }
    if (!postId && !commentId && !reportUserId) {
      setError("Target laporan tidak valid atau tidak ditemukan.");
      return;
    }
    if (!reason && !customReason.trim()) {
      setError("Pilih atau tulis alasan.");
      return;
    }

    setLoading(true);
    setError("");
    const supabase = getSupabaseBrowserClient();

    const { error: reportError } = await supabase.from("reports").insert({
      reporter_id: user.id,
      post_id: postId || null,
      comment_id: commentId || null,
      reported_user_id: reportUserId || null,
      reason: customReason.trim() || reason,
    });

    if (reportError) {
      setError(reportError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <>
        <TopBar />
        <main className="mx-auto max-w-3xl px-4 py-5 pb-28 lg:px-6">
          <Card className="text-center">
            <Flag className="mx-auto size-12 text-emerald-600" />
            <h1 className="mt-4 text-2xl font-black text-slate-950">Laporan Terkirim</h1>
            <p className="mt-2 text-sm text-slate-500">Terima kasih, laporan kamu akan kami review.</p>
            <Button className="mt-4" onClick={() => router.push("/")}>Kembali ke Feed</Button>
          </Card>
        </main>
        <BottomNav />
      </>
    );
  }

  return (
    <>
      <TopBar />
      <main className="mx-auto max-w-3xl px-4 py-5 pb-28 lg:px-6">
        <form onSubmit={handleSubmit}>
          <Card className="space-y-5">
            <div>
              <Flag className="size-6 text-amber-600" />
              <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-950">Laporkan Konten</h1>
              <p className="mt-1 text-sm text-slate-500">Laporan akan direview oleh tim moderasi.</p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">Alasan</label>
              <div className="flex flex-wrap gap-2">
                {reasons.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => { setReason(r.value); setCustomReason(""); }}
                    className={`rounded-full border px-4 py-1.5 text-xs font-bold transition ${
                      reason === r.value
                        ? "border-amber-600 bg-amber-600 text-white"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700">Atau tulis sendiri</label>
              <textarea
                value={customReason}
                onChange={(e) => { setCustomReason(e.target.value); setReason(""); }}
                className="focus-ring mt-1 block w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none"
                rows={3}
                maxLength={300}
                placeholder="Jelaskan alasan laporan..."
              />
            </div>

            {!postId && !commentId && !reportUserId && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
                ⚠️ Halaman laporan tidak valid. Silakan laporkan langsung melalui tombol "Laporkan" pada postingan, komentar, atau profil yang bersangkutan.
              </div>
            )}

            {error && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</div>
            )}

            <Button type="submit" disabled={loading || (!reason && !customReason.trim()) || (!postId && !commentId && !reportUserId)}>
              {loading && <Loader2 className="size-4 animate-spin" />}
              {loading ? "Mengirim..." : "Kirim Laporan"}
            </Button>
          </Card>
        </form>
      </main>
      <BottomNav />
    </>
  );
}

export default function ReportPage() {
  return (
    <Suspense fallback={<div className="flex min-h-dvh items-center justify-center"><Loader2 className="size-6 animate-spin" /></div>}>
      <ReportForm />
    </Suspense>
  );
}
