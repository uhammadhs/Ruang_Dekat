"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export function EventRSVP({ eventId, initialStatus }: { eventId: string; initialStatus: string | null }) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  async function handleRSVP(newStatus: string) {
    if (newStatus === "cancelled") { setShowCancelConfirm(true); return; }
    await doRSVP(newStatus);
  }

  async function doRSVP(newStatus: string) {
    setLoading(true);
    setError("");
    try {
      const supabase = getSupabaseBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (newStatus === status) {
        const { error: delErr } = await supabase.from("event_attendees").delete().eq("event_id", eventId).eq("user_id", user.id);
        if (delErr) throw delErr;
        await supabase.rpc("decrement_event_attendee_count", { event_id: eventId });
        setStatus(null);
      } else {
        const { data: existing } = await supabase
          .from("event_attendees")
          .select("*")
          .eq("event_id", eventId)
          .eq("user_id", user.id)
          .maybeSingle();

        if (existing) {
          if (status === null) {
            await supabase.rpc("increment_event_attendee_count", { event_id: eventId });
          }
          const { error: updErr } = await supabase.from("event_attendees").update({ status: newStatus }).eq("event_id", eventId).eq("user_id", user.id);
          if (updErr) throw updErr;
        } else {
          const { error: insErr } = await supabase.from("event_attendees").insert({ event_id: eventId, user_id: user.id, status: newStatus });
          if (insErr) throw insErr;
          await supabase.rpc("increment_event_attendee_count", { event_id: eventId });
        }
        setStatus(newStatus);
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal mengubah status");
    }
    setLoading(false);
    setShowCancelConfirm(false);
  }

  return (
    <div className="space-y-2">
      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</div>
      )}
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => handleRSVP("going")} disabled={loading} variant={status === "going" ? "primary" : "secondary"}>
          {status === "going" ? "Hadir" : "Hadir"}
        </Button>
        <Button onClick={() => handleRSVP("interested")} disabled={loading} variant={status === "interested" ? "primary" : "secondary"}>
          {status === "interested" ? "Tertarik" : "Tertarik"}
        </Button>
        {status && (
          <Button onClick={() => handleRSVP("cancelled")} disabled={loading} variant="secondary">
            Batal
          </Button>
        )}
      </div>
      <ConfirmDialog
        open={showCancelConfirm}
        title="Batalkan RSVP?"
        message="Kamu bisa mendaftar lagi kapan saja."
        confirmLabel="Batalkan"
        onConfirm={() => doRSVP("cancelled")}
        onCancel={() => setShowCancelConfirm(false)}
        variant="dark"
      />
    </div>
  );
}
