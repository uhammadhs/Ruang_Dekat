import { createClient } from "@/lib/supabase-server";
import { BottomNav } from "@/components/bottom-nav";
import { DesktopSidebar } from "@/components/desktop-sidebar";
import { TopBar } from "@/components/top-bar";
import { Card } from "@/components/ui/card";
import { Bell, Inbox } from "lucide-react";

export default async function NotificationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let notifications: Array<{ id: string; title: string; body: string; is_read: boolean; created_at: string }> = [];

  if (user) {
    const { data } = await supabase
      .from("notifications")
      .select("id, type, message, is_read, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20);

    if (data) {
      notifications = data.map((n) => {
        let title = "Notifikasi";
        if (n.type === "like") title = "Suka Baru";
        else if (n.type === "comment") title = "Komentar Baru";
        else if (n.type === "follow") title = "Pengikut Baru";
        else if (n.type === "join") title = "Gabung Komunitas";
        else if (n.type === "event") title = "Event Baru";

        return {
          id: n.id,
          title,
          body: n.message,
          is_read: n.is_read,
          created_at: n.created_at,
        };
      });
    }
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
                <Bell className="size-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-slate-950">Notifikasi</h1>
                <p className="text-sm text-slate-500">
                  {user ? "Aktivitas terbaru" : "Login untuk melihat notifikasi"}
                </p>
              </div>
            </div>
          </Card>

          {!user && (
            <Card>
              <p className="text-center text-sm text-slate-500">Login untuk melihat notifikasi kamu.</p>
            </Card>
          )}

          {user && notifications.length === 0 && (
            <Card>
              <div className="flex flex-col items-center gap-3 py-6 text-center">
                <Inbox className="size-10 text-slate-300" />
                <p className="text-sm text-slate-500">Belum ada notifikasi.</p>
              </div>
            </Card>
          )}

          {notifications.length > 0 && (
            <div className="space-y-3">
              {notifications.map((n) => (
                <Card key={n.id} className={`${!n.is_read ? "border-blue-200 bg-blue-50/50" : ""}`}>
                  <p className="font-black text-sm text-slate-950">{n.title}</p>
                  {n.body && <p className="mt-1 text-sm text-slate-600">{n.body}</p>}
                  <p className="mt-1 text-xs text-slate-400">
                    {new Date(n.created_at).toLocaleDateString("id-ID")}
                  </p>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
      <BottomNav />
    </>
  );
}
