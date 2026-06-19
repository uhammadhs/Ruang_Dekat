"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/components/session-provider";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

export function CommunityAction({ communityId, isMember: initial }: { communityId: string; isMember: boolean }) {
  const { user } = useSession();
  const router = useRouter();
  const [isMember, setIsMember] = useState(initial);
  const [loading, setLoading] = useState(false);

  async function handleJoin() {
    if (!user) { router.push("/login"); return; }
    setLoading(true);
    const supabase = getSupabaseBrowserClient();
    if (isMember) {
      const { error } = await supabase.from("community_members").delete().eq("community_id", communityId).eq("user_id", user.id);
      if (!error) setIsMember(false);
    } else {
      const { error } = await supabase.from("community_members").insert({ community_id: communityId, user_id: user.id });
      if (!error) {
        await supabase.rpc("increment_community_member_count", { community_id: communityId });
        setIsMember(true);
      }
    }
    setLoading(false);
    router.refresh();
  }

  return (
    <Button onClick={handleJoin} disabled={loading} variant={isMember ? "secondary" : "primary"}>
      {loading ? "Memproses..." : isMember ? "Keluar" : "Gabung Komunitas"}
    </Button>
  );
}
