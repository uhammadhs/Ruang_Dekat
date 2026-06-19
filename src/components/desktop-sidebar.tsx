"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Home, LayoutDashboard, PlusCircle, UserRound, UsersRound } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Beranda", icon: Home },
  { href: "/communities", label: "Komunitas", icon: UsersRound },
  { href: "/events", label: "Event", icon: CalendarDays },
  { href: "/profile", label: "Profil", icon: UserRound },
  { href: "/admin", label: "Admin", icon: LayoutDashboard },
];

export function DesktopSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-24 hidden h-[calc(100vh-7rem)] w-72 shrink-0 lg:block">
      <Card className="flex h-full flex-col justify-between">
        <div className="space-y-2">
          {links.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition",
                  active
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                )}
              >
                <Icon className={cn("size-5", active && "text-blue-600")} />
                {item.label}
              </Link>
            );
          })}
        </div>
        <div className="rounded-3xl bg-slate-950 p-4 text-white">
          <p className="text-sm font-black">Buat posting berbukti</p>
          <p className="mt-1 text-xs leading-relaxed text-slate-300">Upload karya, event, peluang, atau tanya komunitas dengan konteks jelas.</p>
          <Link href="/create">
            <Button variant="secondary" className="mt-4 w-full">
              <PlusCircle className="size-4" /> Buat Sekarang
            </Button>
          </Link>
        </div>
        <div className="mt-4 flex gap-3 text-xs text-slate-400">
          <Link href="/about" className="hover:text-slate-600">Tentang</Link>
          <Link href="/privacy" className="hover:text-slate-600">Privasi</Link>
        </div>
      </Card>
    </aside>
  );
}
