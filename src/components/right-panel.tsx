import { CalendarDays, Flame, TrendingUp, UsersRound } from "lucide-react";
import { Card } from "@/components/ui/card";
import { communities, events } from "@/data/mock";

export function RightPanel() {
  return (
    <aside className="sticky top-24 hidden h-fit w-80 shrink-0 space-y-4 xl:block">
      <Card>
        <div className="flex items-center gap-2">
          <Flame className="size-5 text-blue-600" />
          <h2 className="font-black text-slate-950">Aktif dekat kamu</h2>
        </div>
        <div className="mt-4 space-y-3">
          {communities.map((community) => (
            <div key={community.id} className="rounded-3xl border border-slate-100 bg-white p-3">
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-2xl bg-blue-50 text-sm font-black text-blue-700">
                  <UsersRound className="size-5" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-black text-slate-950">{community.name}</p>
                  <p className="text-xs font-medium text-slate-500">{community.members.toLocaleString("id-ID")} member</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-2">
          <CalendarDays className="size-5 text-emerald-600" />
          <h2 className="font-black text-slate-950">Event terdekat</h2>
        </div>
        <div className="mt-4 space-y-3">
          {events.slice(0, 2).map((event) => (
            <div key={event.id} className="rounded-3xl border border-slate-100 bg-white p-3">
              <p className="text-sm font-black text-slate-950">{event.title}</p>
              <p className="mt-1 text-xs font-medium text-slate-500">{event.date}</p>
              <p className="mt-2 flex items-center gap-1 text-xs font-bold text-emerald-700">
                <TrendingUp className="size-3.5" /> {event.attendees} akan hadir
              </p>
            </div>
          ))}
        </div>
      </Card>
    </aside>
  );
}
