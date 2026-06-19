import { createClient } from "@/lib/supabase-server";
import { getEvents } from "@/lib/supabase-queries";
import { BottomNav } from "@/components/bottom-nav";
import { DesktopSidebar } from "@/components/desktop-sidebar";
import { TopBar } from "@/components/top-bar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, MapPin, TicketCheck } from "lucide-react";
import Link from "next/link";

export default async function EventsPage() {
  const supabase = await createClient();
  const events = await getEvents(supabase, { upcoming: true });

  return (
    <>
      <TopBar />
      <div className="mx-auto flex max-w-7xl gap-5 px-4 py-5 lg:px-6">
        <DesktopSidebar />
        <main className="min-w-0 flex-1 space-y-4 pb-28 lg:pb-10">
          <Card>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-600">Event lokal</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Acara nyata, check-in nyata.</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Event mendukung RSVP, check-in, rekap peserta, dokumentasi, dan ringkasan AI setelah acara.
            </p>
          </Card>

          <div className="flex gap-2">
            <Link href="/event/new">
              <Button>Buat Event</Button>
            </Link>
          </div>

          {events.length === 0 ? (
            <Card className="text-center">
              <p className="text-sm text-slate-500">Belum ada event mendatang.</p>
              <Link href="/event/new" className="mt-4 inline-block"><Button variant="secondary">Buat Event</Button></Link>
            </Card>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <Link key={event.id} href={`/event/${event.id}`}>
                  <Card className="space-y-4 transition hover:-translate-y-0.5 hover:shadow-xl">
                    <div className="flex items-start gap-3">
                      <div className="grid size-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
                        <CalendarDays className="size-6" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h2 className="text-xl font-black tracking-tight text-slate-950">{event.title}</h2>
                        <p className="text-sm font-semibold text-slate-500">
                          {new Date(event.starts_at).toLocaleDateString("id-ID", {
                            dateStyle: "long",
                            timeStyle: "short",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {event.location_name && (
                        <div className="rounded-3xl border border-slate-100 bg-white p-3 text-sm font-bold text-slate-600">
                          <MapPin className="mb-2 size-4 text-slate-400" />
                          {event.location_name}
                        </div>
                      )}
                      <div className="rounded-3xl border border-slate-100 bg-white p-3 text-sm font-bold text-slate-600">
                        <TicketCheck className="mb-2 size-4 text-emerald-600" />
                        {event.attendee_count} orang akan hadir
                      </div>
                    </div>
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
