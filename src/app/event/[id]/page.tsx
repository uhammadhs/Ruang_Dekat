import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { getEventById } from "@/lib/supabase-queries";
import { BottomNav } from "@/components/bottom-nav";
import { TopBar } from "@/components/top-bar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, MapPin, TicketCheck, UserRound } from "lucide-react";
import { EventRSVP } from "./event-rsvp";
import Link from "next/link";

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const event = await getEventById(supabase, id, user?.id);
  if (!event) notFound();

  return (
    <>
      <TopBar />
      <main className="mx-auto max-w-4xl px-4 py-5 pb-28 lg:px-6">
        <Card className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="grid size-16 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
              <CalendarDays className="size-8" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-black tracking-tight text-slate-950">{event.title}</h1>
              <p className="mt-1 text-sm font-semibold text-slate-500">
                {new Date(event.starts_at).toLocaleDateString("id-ID", {
                  weekday: "long",
                  dateStyle: "long",
                  timeStyle: "short",
                })}
              </p>
            </div>
          </div>

          {event.description && (
            <p className="text-sm leading-6 text-slate-600">{event.description}</p>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            {event.location_name && (
              <div className="rounded-3xl border border-slate-100 bg-white p-3 text-sm font-bold text-slate-600">
                <MapPin className="mb-2 size-4 text-slate-400" />
                {event.location_name}
                {event.location_city && <span className="block text-xs font-medium text-slate-400">{event.location_city}</span>}
              </div>
            )}
            <div className="rounded-3xl border border-slate-100 bg-white p-3 text-sm font-bold text-slate-600">
              <TicketCheck className="mb-2 size-4 text-emerald-600" />
              {event.attendee_count} orang akan hadir
            </div>
          </div>

          <div className="flex items-center gap-3 border-t border-slate-100 pt-3">
            <Link href={`/profile/${event.host.id}`} className="flex items-center gap-2 text-sm font-bold text-slate-600">
              <UserRound className="size-4" /> {event.host.display_name}
            </Link>
          </div>

          {user && (
            <EventRSVP eventId={event.id} initialStatus={event.attendance_status} />
          )}
        </Card>
      </main>
      <BottomNav />
    </>
  );
}
