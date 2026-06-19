import type { Metadata, Viewport } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "RuangDekat — Komunitas Lokal, Karya Nyata, Event, dan Peluang",
  description:
    "Platform sosial mobile-first untuk komunitas lokal, karya nyata, event, UMKM, peluang, dan reputasi pengguna.",
  applicationName: "RuangDekat",
  manifest: "/manifest.webmanifest",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    title: "RuangDekat",
    description: "Sosmed komunitas nyata untuk karya, event, UMKM, dan peluang lokal.",
    type: "website"
  }
};

export const viewport: Viewport = {
  themeColor: "#f8fafc",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
