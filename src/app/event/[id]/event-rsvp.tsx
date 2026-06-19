"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

export function EventRSVP({ eventId, initialStatus }: { eventId: string; initialStatus: string | null }) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);

  async function handleRSVP(newStatus: string) {
    setLoading(true);
    const supabase = getSupabaseBrowserClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (newStatus === status) {
      await supabase.from("event_attendees").delete().eq("event_id", eventId).eq("user_id", user.id);
      setStatus(null);
    } else {
      const { data: existing } = await supabase
        .from("event_attendees")
        .select("*")
        .eq("event_id", eventId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (existing) {
        await supabase.from("event_attendees").update({ status: newStatus }).eq("event_id", eventId).eq("user_id", user.id);
      } else {
        await supabase.from("event_attendees").insert({ event_id: eventId, user_id: user.id, status: newStatus });
      }
      setStatus(newStatus);
    }

    setLoading(false);
    router.refresh();
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button onClick={() => handleRSVP("going")} disabled={loading} variant={status === "going" ? "primary" : "secondary"}>
        {status === "going" ? "✔ Hadir" : "Hadir"}
      </Button>
      <Button onClick={() => handleRSVP("interested")} disabled={loading} variant={status === "interested" ? "primary" : "secondary"}>
        {status === "interested" ? "✔ Tertarik" : "Tertarik"}
      </Button>
      {status && (
        <Button onClick={() => handleRSVP("cancelled")} disabled={loading} variant="secondary">
          Batal
        </Button>
      )}
    </div>
  );
}
