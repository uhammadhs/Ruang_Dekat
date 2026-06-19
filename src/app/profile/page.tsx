import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { getProfile, getBusinessPages } from "@/lib/supabase-queries";
import { getFeedPosts } from "@/lib/supabase-queries";
import { BottomNav } from "@/components/bottom-nav";
import { TopBar } from "@/components/top-bar";
import { ProfileContent } from "./profile-content";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const profile = await getProfile(supabase, user.id);
  if (!profile) {
    redirect("/login");
  }

  const [posts, businesses] = await Promise.all([
    getFeedPosts(supabase, { userId: user.id }),
    getBusinessPages(supabase, user.id),
  ]);

  return (
    <>
      <TopBar />
      <main className="mx-auto max-w-4xl px-4 py-5 pb-28 lg:px-6">
        <ProfileContent profile={profile} posts={posts} businesses={businesses} isOwn />
      </main>
      <BottomNav />
    </>
  );
}
