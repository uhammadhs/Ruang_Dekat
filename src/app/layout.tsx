import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SessionProvider } from "@/components/session-provider";
import { ErrorBoundary } from "@/components/error-boundary";

export const metadata: Metadata = {
  title: "RuangDekat — Komunitas Lokal, Karya Nyata, Event, dan Peluang",
  description:
    "Platform sosial mobile-first untuk komunitas lokal, karya nyata, event, UMKM, peluang, dan reputasi pengguna.",
  applicationName: "RuangDekat",
  manifest: "/manifest.webmanifest",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://ruangdekat.vercel.app"),
  openGraph: {
    title: "RuangDekat",
    description: "Sosmed komunitas nyata untuk karya, event, UMKM, dan peluang lokal.",
    type: "website",
    siteName: "RuangDekat",
    locale: "id_ID",
  },
};

export const viewport: Viewport = {
  themeColor: "#f8fafc",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[999] focus:rounded-2xl focus:bg-slate-950 focus:px-4 focus:py-3 focus:text-sm focus:font-bold focus:text-white">
          Langsung ke konten utama
        </a>
        <ErrorBoundary>
          <SessionProvider>
            <div id="main-content">{children}</div>
          </SessionProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
