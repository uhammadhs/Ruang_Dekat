import { Bell, Search, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

export function TopBar() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-slate-50/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 lg:px-6">
        <Logo />
        <div className="hidden w-full max-w-xl items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm md:flex">
          <Search className="size-4 text-slate-400" />
          <input
            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            placeholder="Cari orang, komunitas, event, karya, atau jasa lokal..."
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" className="hidden md:inline-flex">
            <ShieldCheck className="size-4" /> Trust Score
          </Button>
          <button className="focus-ring grid size-11 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50">
            <Bell className="size-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
