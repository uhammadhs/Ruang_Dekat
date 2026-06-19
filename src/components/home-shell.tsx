"use client";

import { useMemo, useState } from "react";
import { MapPin, Search, Sparkles } from "lucide-react";
import { feedPosts } from "@/data/mock";
import { FeedCard } from "@/components/feed-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { PostType } from "@/lib/types";
import { cn } from "@/lib/utils";

const tabs: Array<{ label: string; value: "all" | PostType }> = [
  { label: "Sekitar", value: "all" },
  { label: "Karya", value: "work" },
  { label: "Event", value: "event" },
  { label: "Peluang", value: "opportunity" },
  { label: "Tanya", value: "question" }
];

export function HomeShell() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]["value"]>("all");
  const [idea, setIdea] = useState("Saya punya produk lokal dan ingin promosi dengan gaya profesional.");
  const [aiOutput, setAiOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const filteredPosts = useMemo(() => {
    if (activeTab === "all") return feedPosts;
    return feedPosts.filter((post) => post.type === activeTab);
  }, [activeTab]);

  async function generateCaption() {
    setIsGenerating(true);
    setAiOutput("");
    try {
      const response = await fetch("/api/ai/assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "caption", input: idea })
      });
      const data = (await response.json()) as { ok: boolean; output?: string; error?: string };
      setAiOutput(data.ok ? data.output || "" : data.error || "AI belum aktif.");
    } catch {
      setAiOutput("AI belum aktif. Isi GEMINI_API_KEY untuk memakai Gemini 2.5 Flash.");
    } finally {
      setIsGenerating(false);
    }
  }

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
              <Button>Mulai Jelajah</Button>
              <Button variant="secondary">Lihat Komunitas</Button>
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

      <Card>
        <div className="flex items-center gap-2">
          <Sparkles className="size-5 text-blue-600" />
          <div>
            <h2 className="font-black text-slate-950">AI Caption Assistant</h2>
            <p className="text-xs text-slate-500">Pakai Gemini 2.5 Flash jika env sudah diisi.</p>
          </div>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto]">
          <textarea
            value={idea}
            onChange={(event) => setIdea(event.target.value)}
            className="focus-ring min-h-24 rounded-3xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-700 outline-none"
            placeholder="Tulis ide posting..."
          />
          <Button onClick={generateCaption} disabled={isGenerating} className="md:self-end">
            {isGenerating ? "Membuat..." : "Buat Caption"}
          </Button>
        </div>
        {aiOutput ? (
          <div className="mt-3 rounded-3xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-950">
            {aiOutput}
          </div>
        ) : null}
      </Card>

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

      <div className="space-y-4">
        {filteredPosts.map((post) => <FeedCard key={post.id} post={post} />)}
      </div>
    </main>
  );
}
