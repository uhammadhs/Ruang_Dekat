import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { getProfile, getFeedPosts, getBusinessPages, isFollowing } from "@/lib/supabase-queries";
import { BottomNav } from "@/components/bottom-nav";
import { TopBar } from "@/components/top-bar";
import { ProfileContent } from "../profile-content";

export default async function PublicProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const profile = await getProfile(supabase, id);
  if (!profile) notFound();

  const [posts, businesses, { count: followers }, { count: following }] = await Promise.all([
    getFeedPosts(supabase, { userId: user?.id, filterByUserId: id }),
    getBusinessPages(supabase, id),
    supabase.from("follows").select("*", { count: "exact", head: true }).eq("following_id", id),
    supabase.from("follows").select("*", { count: "exact", head: true }).eq("follower_id", id),
  ]);

  const isOwn = user?.id === id;

  return (
    <>
      <TopBar />
      <main className="mx-auto max-w-4xl px-4 py-5 pb-28 lg:px-6">
        <ProfileContent profile={profile} posts={posts} businesses={businesses} isOwn={isOwn} followerCount={followers ?? 0} followingCount={following ?? 0} />
      </main>
      <BottomNav />
    </>
  );
}
