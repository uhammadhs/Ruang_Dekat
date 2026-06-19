"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Bot, Flag, ShieldCheck, TrendingUp, UsersRound, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import type { Report } from "@/lib/types";

export function AdminContent({
  stats,
  reports: initialReports,
}: {
  stats: { totalUsers: number; totalPosts: number; openReports: number };
  reports: Report[];
}) {
  const router = useRouter();
  const [reports, setReports] = useState(initialReports);
  const [loading, setLoading] = useState<string | null>(null);

  async function handleResolve(reportId: string) {
    setLoading(reportId);
    const supabase = getSupabaseBrowserClient();
    await supabase.from("reports").update({ status: "resolved", resolved_at: new Date().toISOString() }).eq("id", reportId);

    await supabase.from("moderation_logs").insert({
      target_type: "report",
      target_id: reportId,
      action: "resolve",
    });

    setReports((prev) => prev.filter((r) => r.id !== reportId));
    setLoading(null);
    router.refresh();
  }

  async function handleHidePost(postId: string | null) {
    if (!postId) return;
    setLoading(postId);
    const supabase = getSupabaseBrowserClient();
    await supabase.from("posts").update({ is_deleted: true }).eq("id", postId);

    await supabase.from("moderation_logs").insert({
      target_type: "post",
      target_id: postId,
      action: "hide",
    });

    setLoading(null);
    router.refresh();
  }

  async function handleRestorePost(postId: string | null) {
    if (!postId) return;
    setLoading(postId);
    const supabase = getSupabaseBrowserClient();
    await supabase.from("posts").update({ is_deleted: false }).eq("id", postId);

    await supabase.from("moderation_logs").insert({
      target_type: "post",
      target_id: postId,
      action: "restore",
    });

    setLoading(null);
    router.refresh();
  }

  const statCards = [
    { label: "User terdaftar", value: stats.totalUsers.toLocaleString("id-ID"), icon: UsersRound, tone: "text-blue-600" },
    { label: "Post aktif", value: stats.totalPosts.toLocaleString("id-ID"), icon: TrendingUp, tone: "text-emerald-600" },
    { label: "Laporan terbuka", value: stats.openReports.toString(), icon: Flag, tone: "text-amber-600" },
  ];

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-3">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <Icon className={`size-5 ${stat.tone}`} />
              <p className="mt-4 text-3xl font-black text-slate-950">{stat.value}</p>
              <p className="text-sm font-semibold text-slate-500">{stat.label}</p>
            </Card>
          );
        })}
      </div>

      <Card>
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-5 text-emerald-600" />
          <h2 className="font-black text-slate-950">Laporan Masuk</h2>
        </div>

        {reports.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">Tidak ada laporan terbuka.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {reports.map((report) => (
              <div key={report.id} className="rounded-3xl border border-slate-100 bg-white p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase tracking-wide text-slate-400">{report.status}</span>
                      <span className="text-xs text-slate-300">|</span>
                      <span className="text-xs text-slate-500">
                        {report.created_at && new Date(report.created_at).toLocaleDateString("id-ID")}
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-bold text-slate-900">{report.reason}</p>
                    {report.post_id && <p className="mt-1 text-xs text-slate-500">Post ID: {report.post_id.slice(0, 8)}...</p>}
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => handleHidePost(report.post_id)}
                      disabled={loading === report.post_id || !report.post_id}
                      className="text-xs"
                    >
                      <EyeOff className="size-3.5" /> Sembunyikan
                    </Button>
                    <Button
                      onClick={() => handleResolve(report.id)}
                      disabled={loading === report.id}
                      className="text-xs"
                    >
                      <CheckCircle2 className="size-3.5" /> Selesai
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card>
        <div className="flex items-center gap-2">
          <Bot className="size-5 text-blue-600" />
          <h2 className="font-black text-slate-950">AI Moderation</h2>
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Gemini 2.5 Flash membantu klasifikasi risiko konten. Keputusan final tetap lewat aturan sistem dan admin.
        </p>
      </Card>
    </>
  );
}
