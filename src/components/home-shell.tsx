"use client";

import { useMemo, useState } from "react";
import { MapPin, Search } from "lucide-react";
import { FeedCard } from "@/components/feed-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { PostWithDetails, PostType } from "@/lib/types";
import Link from "next/link";
import { useSession } from "@/components/session-provider";

const tabs: Array<{ label: string; value: "all" | PostType }> = [
  { label: "Semua", value: "all" },
  { label: "Karya", value: "work" },
  { label: "Event", value: "event" },
  { label: "Peluang", value: "opportunity" },
  { label: "Tanya", value: "question" },
];

export function HomeShell({
  initialPosts,
  userId: serverUserId,
}: {
  initialPosts: PostWithDetails[];
  userId?: string;
}) {
  const { user } = useSession();
  const uid = user?.id || serverUserId;
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]["value"]>("all");

  const filteredPosts = useMemo(() => {
    if (activeTab === "all") return initialPosts;
    return initialPosts.filter((post) => post.type === activeTab);
  }, [activeTab, initialPosts]);

  return (
    <main className="min-w-0 flex-1 space-y-4 pb-28 lg:pb-10">
      <Card className="overflow-hidden p-0">
        <div className="relative p-5 sm:p-7">
          <div className="absolute right-0 top-0 h-44 w-44 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-black text-blue-700">
              <MapPin className="size-3.5" /> Mobile-first social community
            </div>
            <h1 className="mt-4 max-w-2xl text-3xl font-black tracking-[-0.04em] text-slate-950 sm:text-5xl">
              Sosmed komunitas nyata untuk karya, event, UMKM, dan peluang lokal.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Feed tidak hanya mengejar viral. Ranking mengutamakan kedekatan, manfaat, reputasi, dan bukti nyata.
            </p>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <Link href="/create"><Button>Mulai Jelajah</Button></Link>
              <Link href="/communities"><Button variant="secondary">Lihat Komunitas</Button></Link>
            </div>
          </div>
        </div>
      </Card>

      <div className="md:hidden">
        <div className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <Search className="size-4 text-slate-400" />
          <input className="w-full bg-transparent text-sm outline-none" placeholder="Cari komunitas, event, karya..." />
        </div>
      </div>

      <div className="no-scrollbar flex gap-2 overflow-x-auto py-1">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={cn(
              "focus-ring shrink-0 rounded-2xl border px-4 py-2.5 text-sm font-black transition",
              activeTab === tab.value
                ? "border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {filteredPosts.length === 0 ? (
        <Card className="text-center">
          <p className="text-sm text-slate-500">
            {activeTab === "all"
              ? "Belum ada posting. Jadilah yang pertama!"
              : `Belum ada posting dengan kategori ${activeTab}.`}
          </p>
          {user && (
            <Link href="/create" className="mt-4 inline-block">
              <Button variant="secondary">Buat Posting</Button>
            </Link>
          )}
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <FeedCard key={post.id} post={post} userId={uid} />
          ))}
        </div>
      )}
    </main>
  );
}
