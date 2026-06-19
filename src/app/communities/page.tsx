import { createClient } from "@/lib/supabase-server";
import { getCommunities } from "@/lib/supabase-queries";
import { BottomNav } from "@/components/bottom-nav";
import { DesktopSidebar } from "@/components/desktop-sidebar";
import { TopBar } from "@/components/top-bar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, UsersRound } from "lucide-react";
import Link from "next/link";

export default async function CommunitiesPage() {
  const supabase = await createClient();
  const communities = await getCommunities(supabase);

  return (
    <>
      <TopBar />
      <div className="mx-auto flex max-w-7xl gap-5 px-4 py-5 lg:px-6">
        <DesktopSidebar />
        <main className="min-w-0 flex-1 space-y-4 pb-28 lg:pb-10">
          <Card>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">Komunitas</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Temukan ruang yang relevan.</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Komunitas diurutkan berdasarkan aktivitas, reputasi admin, lokasi, dan manfaat diskusi.
            </p>
          </Card>

          <div className="flex gap-2">
            <Link href="/community/new">
              <Button>Buat Komunitas</Button>
            </Link>
          </div>

          {communities.length === 0 ? (
            <Card className="text-center">
              <p className="text-sm text-slate-500">Belum ada komunitas. Jadilah yang pertama membuat!</p>
              <Link href="/community/new" className="mt-4 inline-block"><Button variant="secondary">Buat Komunitas</Button></Link>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {communities.map((community) => (
                <Link key={community.id} href={`/community/${community.slug}`}>
                  <Card className="space-y-4 transition hover:-translate-y-0.5 hover:shadow-xl">
                    <div className="flex items-start gap-3">
                      <div className="grid size-12 place-items-center rounded-2xl bg-blue-50 text-blue-700">
                        <UsersRound className="size-6" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h2 className="text-lg font-black text-slate-950">{community.name}</h2>
                        <p className="text-sm font-medium text-slate-500">{community.category} · {community.member_count} member</p>
                      </div>
                    </div>
                    <p className="text-sm leading-6 text-slate-600">{community.description}</p>
                    {community.location_city && (
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                        <MapPin className="size-4" /> {community.location_city}
                      </div>
                    )}
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
      <BottomNav />
    </>
  );
}
