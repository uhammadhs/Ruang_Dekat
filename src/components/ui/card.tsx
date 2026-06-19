import { cn } from "@/lib/utils";

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <section className={cn("glass-card rounded-[2rem] p-4 sm:p-5", className)}>{children}</section>;
}
