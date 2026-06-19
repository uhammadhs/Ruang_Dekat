import { createClient } from "@/lib/supabase-server";
import { getFeedPosts } from "@/lib/supabase-queries";
import { BottomNav } from "@/components/bottom-nav";
import { DesktopSidebar } from "@/components/desktop-sidebar";
import { HomeShell } from "@/components/home-shell";
import { RightPanel } from "@/components/right-panel";
import { TopBar } from "@/components/top-bar";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const posts = await getFeedPosts(supabase, { userId: user?.id });

  return (
    <>
      <TopBar />
      <div className="mx-auto flex max-w-7xl gap-5 px-4 py-5 lg:px-6">
        <DesktopSidebar />
        <HomeShell initialPosts={posts} userId={user?.id} />
        <RightPanel />
      </div>
      <BottomNav />
    </>
  );
}
