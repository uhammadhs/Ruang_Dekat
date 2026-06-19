"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/components/session-provider";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { PostWithDetails, CommentWithAuthor } from "@/lib/types";
import { formatCompactNumber, formatDate } from "@/lib/utils";
import { Bookmark, Heart, Loader2, MapPin, MessageCircle, Send, Flag } from "lucide-react";

export function PostDetailContent({
  post,
  comments: initialComments,
  userId,
}: {
  post: PostWithDetails;
  comments: CommentWithAuthor[];
  userId?: string;
}) {
  const router = useRouter();
  const { user } = useSession();
  const uid = user?.id || userId;

  const [liked, setLiked] = useState(post.is_liked);
  const [saved, setSaved] = useState(post.is_saved);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const authorInitial = post.author.display_name?.[0]?.toUpperCase() || "?";

  async function handleLike() {
    if (!uid) return;
    const supabase = getSupabaseBrowserClient();
    const res = await supabase.rpc("toggle_post_like", { p_post_id: post.id, p_user_id: uid });
    if (!res.error) {
      setLiked(!liked);
      setLikesCount((c) => (liked ? c - 1 : c + 1));
    }
  }

  async function handleSave() {
    if (!uid) return;
    const supabase = getSupabaseBrowserClient();
    const res = await supabase.rpc("toggle_post_save", { p_post_id: post.id, p_user_id: uid });
    if (!res.error) {
      setSaved(!saved);
    }
  }

  async function handleComment(e: React.FormEvent) {
    e.preventDefault();
    if (!newComment.trim() || !uid) return;
    setSubmitting(true);
    const supabase = getSupabaseBrowserClient();
    const { data } = await supabase
      .from("comments")
      .insert({ post_id: post.id, user_id: uid, content: newComment.trim() })
      .select("*, author:profiles!user_id(id, username, display_name, avatar_url)")
      .single();

    if (data) {
      setComments((prev) => [...prev, data as unknown as CommentWithAuthor]);
      setNewComment("");
    }
    setSubmitting(false);
  }

  const formattedDate = formatDate(post.created_at);

  return (
    <div className="space-y-4">
      <Card className="space-y-4">
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
              <span className="text-xs font-medium text-slate-400">{formattedDate}</span>
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
            {post.ai_assisted && <Badge tone="blue">Dibantu AI</Badge>}
          </div>
          <h1 className="text-2xl font-black leading-tight tracking-tight text-slate-950">{post.title}</h1>
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
              <img key={m.id} src={m.url} alt="" className="h-64 w-full max-w-lg rounded-2xl object-cover" />
            ))}
          </div>
        )}

        {(post.location_city || post.location_district) && (
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <MapPin className="size-4 text-slate-400" />
            <span>{[post.location_city, post.location_district].filter(Boolean).join(", ")}</span>
          </div>
        )}

        <div className="flex items-center gap-3 border-t border-slate-100 pt-3">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-bold transition hover:bg-rose-50 ${
              liked ? "text-rose-600" : "text-slate-500"
            }`}
          >
            <Heart className={`size-5 ${liked ? "fill-rose-600" : ""}`} />
            {formatCompactNumber(likesCount)}
          </button>
          <button
            onClick={handleSave}
            className={`flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-bold transition hover:bg-amber-50 ${
              saved ? "text-amber-600" : "text-slate-500"
            }`}
          >
            <Bookmark className={`size-5 ${saved ? "fill-amber-600" : ""}`} />
            {formatCompactNumber(post.saves_count)}
          </button>
          {uid && (
            <Link
              href={`/report?post=${post.id}`}
              className="ml-auto flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-bold text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
            >
              <Flag className="size-4" /> Laporkan
            </Link>
          )}
        </div>
      </Card>

      {/* Comments */}
      <Card>
        <div className="flex items-center gap-2">
          <MessageCircle className="size-5 text-blue-600" />
          <h2 className="font-black text-slate-950">Komentar ({comments.length})</h2>
        </div>

        {uid && (
          <form onSubmit={handleComment} className="mt-4 flex gap-3">
            <input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="focus-ring flex-1 rounded-2xl border border-slate-200 px-4 py-2.5 text-sm outline-none"
              placeholder="Tulis komentar..."
              maxLength={1200}
            />
            <Button type="submit" disabled={!newComment.trim() || submitting}>
              {submitting ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
            </Button>
          </form>
        )}

        <div className="mt-4 space-y-3">
          {comments.length === 0 && (
            <p className="text-sm text-slate-500">Belum ada komentar.</p>
          )}
          {comments.map((comment) => (
            <div key={comment.id} className="rounded-3xl border border-slate-100 bg-white p-4">
              <div className="flex items-start gap-3">
                <div className="grid size-8 shrink-0 place-items-center rounded-xl bg-slate-200 text-xs font-bold text-slate-600">
                  {comment.author.display_name?.[0]?.toUpperCase() || "?"}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-900">{comment.author.display_name}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{comment.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
