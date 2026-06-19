import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCompactNumber(value: number) {
  return new Intl.NumberFormat("id-ID", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

export function getEnv(name: string) {
  const value = process.env[name];
  if (!value || value.includes("your-")) return null;
  return value;
}
