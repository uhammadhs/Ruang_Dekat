import { BottomNav } from "@/components/bottom-nav";
import { DesktopSidebar } from "@/components/desktop-sidebar";
import { TopBar } from "@/components/top-bar";
import { Card } from "@/components/ui/card";
import { AlertTriangle, Bot, Flag, ShieldCheck, TrendingUp, UsersRound } from "lucide-react";

const stats = [
  { label: "User aktif", value: "12.480", icon: UsersRound, tone: "text-blue-600" },
  { label: "Post hari ini", value: "1.284", icon: TrendingUp, tone: "text-emerald-600" },
  { label: "Butuh review", value: "38", icon: Flag, tone: "text-amber-600" },
  { label: "Spam tinggi", value: "6", icon: AlertTriangle, tone: "text-rose-600" }
];

const queues = [
  "Akun baru mengirim 17 komentar dalam 4 menit",
  "Posting peluang tanpa detail pembayaran",
  "Konten promosi duplikat di 5 komunitas",
  "Link eksternal belum punya reputasi"
];

export default function AdminPage() {
  return (
    <>
      <TopBar />
      <div className="mx-auto flex max-w-7xl gap-5 px-4 py-5 lg:px-6">
        <DesktopSidebar />
        <main className="min-w-0 flex-1 space-y-4 pb-28 lg:pb-10">
          <Card>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">Admin</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Moderasi dan trust center.</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Dashboard admin dirancang untuk audit konten, laporan akun, AI moderation, dan kesehatan komunitas.
            </p>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
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

          <div className="grid gap-4 xl:grid-cols-[1fr_0.8fr]">
            <Card>
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-5 text-emerald-600" />
                <h2 className="font-black text-slate-950">Review Queue</h2>
              </div>
              <div className="mt-4 space-y-3">
                {queues.map((item) => (
                  <div key={item} className="rounded-3xl border border-slate-100 bg-white p-4">
                    <p className="text-sm font-bold text-slate-800">{item}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">Aksi tersedia: allow, review manual, limit akun, atau block.</p>
                  </div>
                ))}
              </div>
            </Card>
            <Card>
              <div className="flex items-center gap-2">
                <Bot className="size-5 text-blue-600" />
                <h2 className="font-black text-slate-950">AI moderation policy</h2>
              </div>
              <div className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                <p>Gemini 2.5 Flash hanya membantu klasifikasi risiko. Keputusan final untuk konten sensitif tetap lewat aturan sistem dan admin.</p>
                <p className="rounded-3xl bg-slate-950 p-4 font-medium text-white">
                  Prinsip: anti-spam, anti-scam, proof-first, rate limit akun baru, audit log semua keputusan.
                </p>
              </div>
            </Card>
          </div>
        </main>
      </div>
      <BottomNav />
    </>
  );
}
