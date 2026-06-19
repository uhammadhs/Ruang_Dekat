import Link from "next/link";
import { CalendarDays, TrendingUp, UsersRound } from "lucide-react";
import { Card } from "@/components/ui/card";
import { getCommunities } from "@/lib/supabase-queries";
import { getEvents } from "@/lib/supabase-queries";
import { createClient } from "@/lib/supabase-server";

export async function RightPanel() {
  const supabase = await createClient();
  const communities = await getCommunities(supabase);
  const events = await getEvents(supabase, { upcoming: true, limit: 2 });

  return (
    <aside className="sticky top-24 hidden h-fit w-80 shrink-0 space-y-4 xl:block">
      {communities.length > 0 && (
        <Card>
          <div className="flex items-center gap-2">
            <UsersRound className="size-5 text-blue-600" />
            <h2 className="font-black text-slate-950">Komunitas</h2>
          </div>
          <div className="mt-4 space-y-3">
            {communities.slice(0, 5).map((community) => (
              <Link key={community.id} href={`/community/${community.slug}`}>
                <div className="rounded-3xl border border-slate-100 bg-white p-3 transition hover:bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="grid size-10 place-items-center rounded-2xl bg-blue-50 text-sm font-black text-blue-700">
                      <UsersRound className="size-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-black text-slate-950">{community.name}</p>
                      <p className="text-xs font-medium text-slate-500">{community.member_count} member</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      )}

      {events.length > 0 && (
        <Card>
          <div className="flex items-center gap-2">
            <CalendarDays className="size-5 text-emerald-600" />
            <h2 className="font-black text-slate-950">Event terdekat</h2>
          </div>
          <div className="mt-4 space-y-3">
            {events.slice(0, 2).map((event) => (
              <Link key={event.id} href={`/event/${event.id}`}>
                <div className="rounded-3xl border border-slate-100 bg-white p-3 transition hover:bg-slate-50">
                  <p className="text-sm font-black text-slate-950">{event.title}</p>
                  <p className="mt-1 text-xs font-medium text-slate-500">
                    {new Date(event.starts_at).toLocaleDateString("id-ID", { dateStyle: "long" })}
                  </p>
                  <p className="mt-2 flex items-center gap-1 text-xs font-bold text-emerald-700">
                    <TrendingUp className="size-3.5" /> {event.attendee_count} akan hadir
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      )}
    </aside>
  );
}
