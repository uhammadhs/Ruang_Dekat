import { Bookmark, CheckCircle2, Heart, MapPin, MessageCircle, ShieldCheck } from "lucide-react";
import type { FeedPost } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatCompactNumber } from "@/lib/utils";

export function FeedCard({ post }: { post: FeedPost }) {
  return (
    <Card className="space-y-4 transition hover:-translate-y-0.5 hover:shadow-[0_28px_80px_rgba(15,23,42,0.10)]">
      <div className="flex items-start gap-3">
        <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-slate-950 text-sm font-black text-white">
          {post.author.avatar}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-sm font-black text-slate-950">{post.author.name}</h3>
            <CheckCircle2 className="size-4 text-blue-600" />
            <span className="text-xs font-medium text-slate-400">{post.createdAt}</span>
          </div>
          <p className="truncate text-xs font-medium text-slate-500">{post.author.role} · {post.author.username}</p>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-black text-emerald-700">
          {post.author.trustScore}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {post.author.badges.map((badge) => (
          <Badge key={badge.label} tone={badge.tone}>{badge.label}</Badge>
        ))}
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
          <span>{post.type}</span>
          <span className="h-1 w-1 rounded-full bg-blue-300" />
          <span>{post.community}</span>
        </div>
        <h2 className="text-xl font-black leading-tight tracking-tight text-slate-950">{post.title}</h2>
        <p className="text-sm leading-6 text-slate-600">{post.body}</p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-3">
        <div className="flex items-start gap-2">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-600" />
          <div>
            <p className="text-xs font-black text-slate-950">Proof post</p>
            <p className="text-xs leading-5 text-slate-500">{post.proof}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <MapPin className="size-4 text-slate-400" />
        <span>{post.location}</span>
      </div>

      <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-3">
        <button className="focus-ring flex items-center justify-center gap-2 rounded-2xl py-2 text-sm font-bold text-slate-500 transition hover:bg-rose-50 hover:text-rose-600">
          <Heart className="size-4" /> {formatCompactNumber(post.stats.likes)}
        </button>
        <button className="focus-ring flex items-center justify-center gap-2 rounded-2xl py-2 text-sm font-bold text-slate-500 transition hover:bg-blue-50 hover:text-blue-600">
          <MessageCircle className="size-4" /> {formatCompactNumber(post.stats.comments)}
        </button>
        <button className="focus-ring flex items-center justify-center gap-2 rounded-2xl py-2 text-sm font-bold text-slate-500 transition hover:bg-amber-50 hover:text-amber-600">
          <Bookmark className="size-4" /> {formatCompactNumber(post.stats.saves)}
        </button>
      </div>
    </Card>
  );
}
