import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCompactNumber(value: number) {
  return new Intl.NumberFormat("id-ID", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

export function getEnv(name: string) {
  const value = process.env[name];
  if (!value || value.trim() === "") return null;
  return value;
}

export function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

const postTypeLabels: Record<string, string> = {
  local: "Umum",
  work: "Karya",
  event: "Event",
  opportunity: "Peluang",
  question: "Tanya",
};

export function getPostTypeLabel(type: string): string {
  return postTypeLabels[type] || type;
}

export function formatRelativeTime(dateStr: string) {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "baru saja";
  if (minutes < 60) return `${minutes} menit lalu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} hari lalu`;
  return formatDate(dateStr);
}
