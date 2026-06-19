"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BottomNav } from "@/components/bottom-nav";
import { TopBar } from "@/components/top-bar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSession } from "@/components/session-provider";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export default function NewEventPage() {
  const router = useRouter();
  const { user } = useSession();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [locationName, setLocationName] = useState("");
  const [locationCity, setLocationCity] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) { router.push("/login"); return; }
    if (!title.trim() || !startsAt) {
      setError("Judul dan waktu mulai wajib diisi.");
      return;
    }

    setLoading(true);
    setError("");
    const supabase = getSupabaseBrowserClient();

    const { data, error: createError } = await supabase.from("events").insert({
      host_id: user.id,
      title: title.trim(),
      description: description.trim() || null,
      starts_at: new Date(startsAt).toISOString(),
      ends_at: endsAt ? new Date(endsAt).toISOString() : null,
      location_name: locationName || null,
      location_city: locationCity || null,
    }).select().single();

    if (createError || !data) {
      setError(createError?.message || "Gagal membuat event.");
      setLoading(false);
      return;
    }

    router.push(`/event/${data.id}`);
    router.refresh();
  }

  // Compute min datetime for inputs (now)
  const nowLocal = new Date().toISOString().slice(0, 16);

  return (
    <>
      <TopBar />
      <main className="mx-auto max-w-3xl px-4 py-5 pb-28 lg:px-6">
        <form onSubmit={handleSubmit}>
          <Card className="space-y-5">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-600">Event</p>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Buat Event Baru</h1>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700">Judul Event</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="focus-ring mt-1 block w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none"
                placeholder="Nama event"
                maxLength={140}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700">Deskripsi</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="focus-ring mt-1 block w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none"
                rows={3}
                maxLength={2000}
                placeholder="Deskripsi event..."
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-bold text-slate-700">Mulai</label>
                <input
                  type="datetime-local"
                  value={startsAt}
                  onChange={(e) => setStartsAt(e.target.value)}
                  required
                  min={nowLocal}
                  className="focus-ring mt-1 block w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700">Selesai (opsional)</label>
                <input
                  type="datetime-local"
                  value={endsAt}
                  onChange={(e) => setEndsAt(e.target.value)}
                  min={startsAt || nowLocal}
                  className="focus-ring mt-1 block w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none"
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-bold text-slate-700">Lokasi</label>
                <input
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  className="focus-ring mt-1 block w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none"
                  placeholder="Nama tempat"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700">Kota</label>
                <input
                  value={locationCity}
                  onChange={(e) => setLocationCity(e.target.value)}
                  className="focus-ring mt-1 block w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none"
                  placeholder="Kota"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</div>
            )}

            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="size-4 animate-spin" />}
              {loading ? "Menyimpan..." : "Buat Event"}
            </Button>
          </Card>
        </form>
      </main>
      <BottomNav />
    </>
  );
}
