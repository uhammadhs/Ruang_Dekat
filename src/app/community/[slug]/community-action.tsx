"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/components/session-provider";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export function CommunityAction({ communityId, isMember: initial }: { communityId: string; isMember: boolean }) {
  const { user } = useSession();
  const router = useRouter();
  const [isMember, setIsMember] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  async function handleJoin() {
    if (!user) { router.push("/login"); return; }
    if (isMember) { setShowConfirm(true); return; }
    await doJoin();
  }

  async function doJoin() {
    if (!user) return;
    setLoading(true);
    setError("");
    try {
      const supabase = getSupabaseBrowserClient();
      const { error: err } = await supabase.from("community_members").insert({ community_id: communityId, user_id: user.id });
      if (err) throw err;
      await supabase.rpc("increment_community_member_count", { community_id: communityId });
      setIsMember(true);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal memproses");
    }
    setLoading(false);
  }

  async function doLeave() {
    if (!user) return;
    setLoading(true);
    setError("");
    try {
      const supabase = getSupabaseBrowserClient();
      const { error: err } = await supabase.from("community_members").delete().eq("community_id", communityId).eq("user_id", user.id);
      if (err) throw err;
      await supabase.rpc("decrement_community_member_count", { community_id: communityId });
      setIsMember(false);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal memproses");
    }
    setLoading(false);
    setShowConfirm(false);
  }

  return (
    <div className="space-y-2">
      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</div>
      )}
      <Button onClick={handleJoin} disabled={loading} variant={isMember ? "secondary" : "primary"}>
        {loading ? "Memproses..." : isMember ? "Keluar" : "Gabung Komunitas"}
      </Button>
      <ConfirmDialog
        open={showConfirm}
        title="Keluar dari komunitas?"
        message="Kamu bisa gabung lagi kapan saja."
        confirmLabel="Keluar"
        onConfirm={doLeave}
        onCancel={() => setShowConfirm(false)}
        variant="dark"
      />
    </div>
  );
}
