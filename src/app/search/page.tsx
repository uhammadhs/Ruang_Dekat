import { createClient } from "@/lib/supabase-server";
import { getCommunities } from "@/lib/supabase-queries";
import { BottomNav } from "@/components/bottom-nav";
import { DesktopSidebar } from "@/components/desktop-sidebar";
import { TopBar } from "@/components/top-bar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UsersRound, Search as SearchIcon } from "lucide-react";
import Link from "next/link";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const supabase = await createClient();

  let communities: { id: string; name: string; slug: string; member_count: number }[] = [];

  if (q?.trim()) {
    const { data } = await supabase
      .from("communities")
      .select("id, name, slug, member_count")
      .ilike("name", `%${q.trim()}%`)
      .limit(10);
    communities = data || [];
  }

  return (
    <>
      <TopBar />
      <div className="mx-auto flex max-w-7xl gap-5 px-4 py-5 lg:px-6">
        <DesktopSidebar />
        <main className="min-w-0 flex-1 space-y-4 pb-28 lg:pb-10">
          <Card>
            <div className="flex items-center gap-3">
              <div className="grid size-12 place-items-center rounded-2xl bg-blue-50">
                <SearchIcon className="size-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-slate-950">Pencarian</h1>
                <p className="text-sm text-slate-500">
                  {q ? `Hasil untuk "${q}"` : "Cari komunitas, event, atau pengguna"}
                </p>
              </div>
            </div>
          </Card>

          <form action="/search" method="GET" className="flex gap-2 md:hidden">
            <input
              name="q"
              defaultValue={q}
              className="focus-ring flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none"
              placeholder="Cari komunitas..."
            />
            <Button type="submit">Cari</Button>
          </form>

          {q && communities.length === 0 && (
            <Card>
              <p className="text-center text-sm text-slate-500">
                Tidak ditemukan komunitas untuk &quot;{q}&quot;.
              </p>
            </Card>
          )}

          {communities.length > 0 && (
            <div className="space-y-3">
              <h2 className="font-black text-slate-950">Komunitas</h2>
              {communities.map((c) => (
                <Link key={c.id} href={`/community/${c.slug}`}>
                  <Card className="flex items-center gap-3 transition hover:-translate-y-0.5">
                    <UsersRound className="size-5 shrink-0 text-blue-600" />
                    <div>
                      <p className="font-black text-slate-950">{c.name}</p>
                      <p className="text-xs text-slate-500">{c.member_count} member</p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          {!q && (
            <Card>
              <p className="text-center text-sm text-slate-500">
                Ketik kata kunci di atas untuk mencari komunitas.
              </p>
            </Card>
          )}
        </main>
      </div>
      <BottomNav />
    </>
  );
}
