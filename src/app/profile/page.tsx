import { BottomNav } from "@/components/bottom-nav";
import { TopBar } from "@/components/top-bar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, BarChart3, BriefcaseBusiness, MapPin, ShieldCheck } from "lucide-react";

export default function ProfilePage() {
  return (
    <>
      <TopBar />
      <main className="mx-auto max-w-4xl px-4 py-5 pb-28 lg:px-6">
        <Card className="overflow-hidden p-0">
          <div className="h-32 bg-gradient-to-br from-slate-950 via-blue-900 to-emerald-700" />
          <div className="p-5 sm:p-7">
            <div className="-mt-16 grid size-24 place-items-center rounded-[2rem] border-4 border-white bg-slate-950 text-2xl font-black text-white shadow-xl">
              GS
            </div>
            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="text-3xl font-black tracking-tight text-slate-950">Gus Studio</h1>
                <p className="mt-1 text-sm font-semibold text-slate-500">@gusstudio · Developer & UMKM Builder</p>
                <p className="mt-3 flex items-center gap-2 text-sm font-medium text-slate-600">
                  <MapPin className="size-4" /> Mungkid, Magelang
                </p>
              </div>
              <Button>Edit Profil</Button>
            </div>
            <p className="mt-5 max-w-2xl text-sm leading-6 text-slate-600">
              Membantu UMKM dan komunitas lokal membuat website, katalog digital, landing page, dan sistem sederhana yang realistis untuk bisnis.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Badge tone="blue">Kreator Asli</Badge>
              <Badge tone="green">Terverifikasi</Badge>
              <Badge tone="amber">Respon Cepat</Badge>
            </div>
          </div>
        </Card>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <Card>
            <ShieldCheck className="size-5 text-emerald-600" />
            <p className="mt-3 text-3xl font-black text-slate-950">92</p>
            <p className="text-sm font-semibold text-slate-500">Trust Score</p>
          </Card>
          <Card>
            <BriefcaseBusiness className="size-5 text-blue-600" />
            <p className="mt-3 text-3xl font-black text-slate-950">18</p>
            <p className="text-sm font-semibold text-slate-500">Proof Project</p>
          </Card>
          <Card>
            <Award className="size-5 text-amber-600" />
            <p className="mt-3 text-3xl font-black text-slate-950">7</p>
            <p className="text-sm font-semibold text-slate-500">Badge</p>
          </Card>
        </div>

        <Card className="mt-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="size-5 text-blue-600" />
            <h2 className="font-black text-slate-950">Portofolio Ringkas</h2>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {["Landing page UMKM telur asin", "Dashboard katalog warga", "Website organisasi lokal", "Prompt agent coding"].map((item) => (
              <div key={item} className="rounded-3xl border border-slate-100 bg-white p-4">
                <p className="font-black text-slate-950">{item}</p>
                <p className="mt-1 text-sm leading-6 text-slate-500">Proof post, screenshot, link, dan catatan hasil.</p>
              </div>
            ))}
          </div>
        </Card>
      </main>
      <BottomNav />
    </>
  );
}
