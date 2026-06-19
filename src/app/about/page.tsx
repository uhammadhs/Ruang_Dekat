import type { Metadata } from "next";
import { BottomNav } from "@/components/bottom-nav";
import { TopBar } from "@/components/top-bar";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Tentang — RuangDekat",
};

export default function AboutPage() {
  return (
    <>
      <TopBar />
      <main className="mx-auto max-w-3xl space-y-4 px-4 py-5 pb-28 lg:px-6">
        <Card>
          <h1 className="text-3xl font-black tracking-tight text-slate-950">Tentang RuangDekat</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            RuangDekat adalah platform sosial mobile-first untuk komunitas lokal. Kami menghubungkan orang-orang
            melalui karya nyata, event, UMKM, peluang, dan reputasi pengguna yang terverifikasi.
          </p>
        </Card>
        <Card>
          <h2 className="font-black text-slate-950">Visi</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Menjadi ruang digital terpercaya untuk interaksi komunitas yang autentik, produktif, dan berdampak nyata.
          </p>
        </Card>
        <Card>
          <h2 className="font-black text-slate-950">Fitur Utama</h2>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm leading-6 text-slate-600">
            <li>Feed berbasis kedekatan dan reputasi</li>
            <li>Komunitas lokal dengan diskusi terarah</li>
            <li>Event nyata dengan RSVP dan check-in</li>
            <li>UMKM dan portofolio karya</li>
            <li>Sistem trust score untuk kredibilitas</li>
            <li>Moderasi AI dengan Gemini 2.5 Flash</li>
          </ul>
        </Card>
      </main>
      <BottomNav />
    </>
  );
}
