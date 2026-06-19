"use client";

import { useState } from "react";
import Link from "next/link";
import { Bookmark, Heart, MapPin, MessageCircle } from "lucide-react";
import type { PostWithDetails } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { formatCompactNumber } from "@/lib/utils";
import { getSupabaseBrowserClient } from "@/lib/supabase";

export function FeedCard({ post, userId }: { post: PostWithDetails; userId?: string }) {
  const [liked, setLiked] = useState(post.is_liked);
  const [saved, setSaved] = useState(post.is_saved);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [savesCount, setSavesCount] = useState(post.saves_count);

  async function handleLike() {
    if (!userId) return;
    const supabase = getSupabaseBrowserClient();
    const res = await supabase.rpc("toggle_post_like", { p_post_id: post.id, p_user_id: userId });
    if (!res.error) {
      setLiked(!liked);
      setLikesCount((c) => (liked ? c - 1 : c + 1));
    }
  }

  async function handleSave() {
    if (!userId) return;
    const supabase = getSupabaseBrowserClient();
    const res = await supabase.rpc("toggle_post_save", { p_post_id: post.id, p_user_id: userId });
    if (!res.error) {
      setSaved(!saved);
      setSavesCount((c) => (saved ? c - 1 : c + 1));
    }
  }

  const authorInitial = (post.author.display_name || post.author.username)[0]?.toUpperCase() || "?";

  return (
    <Card className="space-y-4 transition hover:-translate-y-0.5 hover:shadow-[0_28px_80px_rgba(15,23,42,0.10)]">
      <Link href={`/post/${post.id}`} className="block space-y-4">
        <div className="flex items-start gap-3">
          <Link href={`/profile/${post.author.id}`} className="grid size-12 shrink-0 place-items-center rounded-2xl bg-slate-950 text-sm font-black text-white">
            {post.author.avatar_url ? (
              <img src={post.author.avatar_url} alt="" className="size-full rounded-2xl object-cover" />
            ) : (
              authorInitial
            )}
          </Link>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate text-sm font-black text-slate-950">{post.author.display_name}</h3>
              <span className="text-xs font-medium text-slate-400">
                {new Date(post.created_at).toLocaleDateString("id-ID", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
            <p className="truncate text-xs font-medium text-slate-500">@{post.author.username}</p>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-black text-emerald-700">
            {post.author.trust_score}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
            <span>{post.type}</span>
            {post.community_id && <><span className="h-1 w-1 rounded-full bg-blue-300" /><span>Komunitas</span></>}
          </div>
          <h2 className="text-xl font-black leading-tight tracking-tight text-slate-950">{post.title}</h2>
          <p className="text-sm leading-6 text-slate-600">{post.content}</p>
        </div>

        {post.proof && (
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-black text-slate-950">Bukti</p>
            <p className="text-xs leading-5 text-slate-500">{post.proof}</p>
          </div>
        )}

        {post.media && post.media.length > 0 && (
          <div className="flex gap-3 overflow-x-auto">
            {post.media.map((m) => (
              <img key={m.id} src={m.url} alt="" className="h-48 w-full max-w-sm rounded-2xl object-cover" />
            ))}
          </div>
        )}

        {(post.location_city || post.location_district) && (
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <MapPin className="size-4 text-slate-400" />
            <span>{[post.location_city, post.location_district].filter(Boolean).join(", ")}</span>
          </div>
        )}
      </Link>

      <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-3">
        <button
          onClick={handleLike}
          className={`focus-ring flex items-center justify-center gap-2 rounded-2xl py-2 text-sm font-bold transition hover:bg-rose-50 ${
            liked ? "text-rose-600" : "text-slate-500"
          }`}
        >
          <Heart className={`size-4 ${liked ? "fill-rose-600" : ""}`} />
          {formatCompactNumber(likesCount)}
        </button>
        <Link
          href={`/post/${post.id}`}
          className="focus-ring flex items-center justify-center gap-2 rounded-2xl py-2 text-sm font-bold text-slate-500 transition hover:bg-blue-50 hover:text-blue-600"
        >
          <MessageCircle className="size-4" />
          {formatCompactNumber(post.comments_count)}
        </Link>
        <button
          onClick={handleSave}
          className={`focus-ring flex items-center justify-center gap-2 rounded-2xl py-2 text-sm font-bold transition hover:bg-amber-50 ${
            saved ? "text-amber-600" : "text-slate-500"
          }`}
        >
          <Bookmark className={`size-4 ${saved ? "fill-amber-600" : ""}`} />
          {formatCompactNumber(savesCount)}
        </button>
      </div>
    </Card>
  );
}
