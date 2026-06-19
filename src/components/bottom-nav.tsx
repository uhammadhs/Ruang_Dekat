"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Plus, UsersRound, UserRound, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "Home", icon: Home },
  { href: "/communities", label: "Komunitas", icon: UsersRound },
  { href: "/create", label: "Buat", icon: Plus, primary: true },
  { href: "/events", label: "Event", icon: Calendar },
  { href: "/profile", label: "Profil", icon: UserRound }
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="safe-bottom fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/90 px-3 py-2 shadow-[0_-12px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl lg:hidden">
      <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-bold transition",
                active ? "text-blue-700" : "text-slate-500",
                item.primary && "-mt-7"
              )}
            >
              <span
                className={cn(
                  "grid place-items-center rounded-2xl transition",
                  item.primary
                    ? "size-14 bg-blue-600 text-white shadow-xl shadow-blue-600/30"
                    : "size-8",
                  active && !item.primary && "bg-blue-50"
                )}
              >
                <Icon className="size-5" />
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
