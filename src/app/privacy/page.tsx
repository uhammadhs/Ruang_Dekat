import type { Metadata } from "next";
import { BottomNav } from "@/components/bottom-nav";
import { TopBar } from "@/components/top-bar";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Kebijakan Privasi — RuangDekat",
};

export default function PrivacyPage() {
  return (
    <>
      <TopBar />
      <main className="mx-auto max-w-3xl space-y-4 px-4 py-5 pb-28 lg:px-6">
        <Card>
          <h1 className="text-3xl font-black tracking-tight text-slate-950">Kebijakan Privasi</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            RuangDekat menghormati privasi pengguna. Data kamu digunakan untuk menjalankan platform dengan aman dan transparan.
          </p>
        </Card>
        <Card>
          <h2 className="font-black text-slate-950">Data yang Dikumpulkan</h2>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm leading-6 text-slate-600">
            <li>Informasi akun: nama, email, username</li>
            <li>Konten yang kamu posting</li>
            <li>Interaksi: like, komentar, follow, RSVP</li>
            <li>Data lokasi yang kamu berikan secara sukarela</li>
          </ul>
        </Card>
        <Card>
          <h2 className="font-black text-slate-950">Penggunaan Data</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Data digunakan untuk menampilkan feed, mengelola komunitas, moderasi konten, dan meningkatkan pengalaman pengguna.
            Kami tidak menjual data ke pihak ketiga.
          </p>
        </Card>
        <Card>
          <h2 className="font-black text-slate-950">Keamanan</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Semua data dikirim melalui koneksi terenkripsi. Password tidak disimpan dalam bentuk plaintext.
            Kami menggunakan Supabase Auth dan Row Level Security untuk melindungi data.
          </p>
        </Card>
      </main>
      <BottomNav />
    </>
  );
}
