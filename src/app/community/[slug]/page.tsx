import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { getCommunityBySlug, isCommunityMember, getFeedPosts } from "@/lib/supabase-queries";
import { BottomNav } from "@/components/bottom-nav";
import { TopBar } from "@/components/top-bar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UsersRound, MapPin } from "lucide-react";
import { CommunityAction } from "./community-action";
import Link from "next/link";

export default async function CommunityDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const community = await getCommunityBySlug(supabase, slug);
  if (!community) notFound();

  const isMember = user ? await isCommunityMember(supabase, community.id, user.id) : false;
  const posts = await getFeedPosts(supabase, { userId: user?.id, communityId: community.id });

  return (
    <>
      <TopBar />
      <main className="mx-auto max-w-4xl px-4 py-5 pb-28 lg:px-6">
        <Card className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="grid size-16 place-items-center rounded-2xl bg-blue-50 text-blue-700">
              <UsersRound className="size-8" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-black tracking-tight text-slate-950">{community.name}</h1>
              <p className="text-sm font-medium text-slate-500">{community.category} · {community.member_count} member</p>
              {community.description && (
                <p className="mt-2 text-sm leading-6 text-slate-600">{community.description}</p>
              )}
              {community.location_city && (
                <p className="mt-2 flex items-center gap-1 text-xs font-bold text-slate-500">
                  <MapPin className="size-3.5" /> {community.location_city}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <CommunityAction communityId={community.id} isMember={isMember} />
            {user && (
              <Link href={`/create?community=${community.id}`}>
                <Button variant="secondary">Posting di sini</Button>
              </Link>
            )}
          </div>
        </Card>

        {posts.length === 0 ? (
          <Card className="mt-4">
            <p className="text-center text-sm text-slate-500">Belum ada posting di komunitas ini.</p>
          </Card>
        ) : (
          <div className="mt-4 space-y-4">
            <h2 className="font-black text-slate-950">Posting Terbaru</h2>
            {posts.map((post) => (
              <Link key={post.id} href={`/post/${post.id}`}>
                <Card className="transition hover:-translate-y-0.5">
                  <p className="font-black text-slate-950">{post.title}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{post.content.slice(0, 150)}</p>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
      <BottomNav />
    </>
  );
}
