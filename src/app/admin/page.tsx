import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { getReports } from "@/lib/supabase-queries";
import { BottomNav } from "@/components/bottom-nav";
import { DesktopSidebar } from "@/components/desktop-sidebar";
import { TopBar } from "@/components/top-bar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdminContent } from "./admin-content";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) redirect("/");

  const reports = await getReports(supabase);

  // Stats
  const { count: totalPosts } = await supabase
    .from("posts")
    .select("*", { count: "exact", head: true })
    .eq("is_deleted", false);

  const { count: totalUsers } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  const { count: openReports } = await supabase
    .from("reports")
    .select("*", { count: "exact", head: true })
    .eq("status", "open");

  return (
    <>
      <TopBar />
      <div className="mx-auto flex max-w-7xl gap-5 px-4 py-5 lg:px-6">
        <DesktopSidebar />
        <main className="min-w-0 flex-1 space-y-4 pb-28 lg:pb-10">
          <Card>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">Admin</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Moderasi dan trust center.</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Dashboard admin untuk audit konten, laporan akun, dan kesehatan komunitas.
            </p>
          </Card>

          <AdminContent
            stats={{ totalUsers: totalUsers || 0, totalPosts: totalPosts || 0, openReports: openReports || 0 }}
            reports={reports}
          />
        </main>
      </div>
      <BottomNav />
    </>
  );
}
