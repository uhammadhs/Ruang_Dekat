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

export default function NewCommunityPage() {
  const router = useRouter();
  const { user } = useSession();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [locationCity, setLocationCity] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) { router.push("/login"); return; }
    if (!name.trim() || !category.trim()) {
      setError("Nama dan kategori wajib diisi.");
      return;
    }

    setLoading(true);
    setError("");
    const supabase = getSupabaseBrowserClient();

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);

    const { data, error: createError } = await supabase.from("communities").insert({
      owner_id: user.id,
      name: name.trim(),
      slug,
      description: description.trim() || null,
      category: category.trim(),
      location_city: locationCity || null,
    }).select().single();

    if (createError || !data) {
      setError(createError?.message || "Gagal membuat komunitas.");
      setLoading(false);
      return;
    }

    // Auto join as owner
    await supabase.from("community_members").insert({ community_id: data.id, user_id: user.id, role: "owner" });

    router.push(`/community/${data.slug}`);
    router.refresh();
  }

  return (
    <>
      <TopBar />
      <main className="mx-auto max-w-3xl px-4 py-5 pb-28 lg:px-6">
        <form onSubmit={handleSubmit}>
          <Card className="space-y-5">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">Komunitas</p>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Buat Komunitas Baru</h1>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700">Nama Komunitas</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="focus-ring mt-1 block w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none"
                placeholder="Nama komunitas"
                maxLength={80}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700">Kategori</label>
              <input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="focus-ring mt-1 block w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none"
                placeholder="UMKM, Teknologi, Edukasi, ..."
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700">Deskripsi</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="focus-ring mt-1 block w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none"
                rows={3}
                maxLength={600}
                placeholder="Deskripsi komunitas..."
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700">Kota</label>
              <input
                value={locationCity}
                onChange={(e) => setLocationCity(e.target.value)}
                className="focus-ring mt-1 block w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none"
                placeholder="Kota (opsional)"
              />
            </div>

            {error && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</div>
            )}

            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="size-4 animate-spin" />}
              {loading ? "Menyimpan..." : "Buat Komunitas"}
            </Button>
          </Card>
        </form>
      </main>
      <BottomNav />
    </>
  );
}
