import type { Community, EventItem, FeedPost } from "@/lib/types";

export const feedPosts: FeedPost[] = [
  {
    id: "post-1",
    type: "work",
    title: "Landing page UMKM telur asin selesai dan siap dipakai",
    body:
      "Desain mobile-first, SEO lokal, tombol WhatsApp, katalog produk, dan lokasi usaha. Cocok untuk UMKM yang ingin mulai terlihat di pencarian lokal.",
    author: {
      name: "Gus Studio",
      username: "@gusstudio",
      avatar: "GS",
      role: "Developer & UMKM Builder",
      location: "Mungkid, Magelang",
      trustScore: 92,
      badges: [
        { label: "Kreator Asli", tone: "blue" },
        { label: "Respon Cepat", tone: "green" }
      ]
    },
    location: "Ambartawang, Mungkid",
    community: "UMKM Digital Magelang",
    createdAt: "12 menit lalu",
    stats: { likes: 128, comments: 24, saves: 41 },
    proof: "Portofolio + link website + testimoni klien"
  },
  {
    id: "post-2",
    type: "event",
    title: "Kelas gratis: bikin katalog digital untuk jualan lokal",
    body:
      "Sesi praktis 90 menit. Peserta membawa HP dan daftar produk. Output akhir: katalog sederhana siap share ke WhatsApp dan sosial media.",
    author: {
      name: "Ruang Warga",
      username: "@ruangwarga",
      avatar: "RW",
      role: "Komunitas Lokal",
      location: "Magelang",
      trustScore: 87,
      badges: [
        { label: "Event Organizer", tone: "amber" },
        { label: "Terverifikasi", tone: "green" }
      ]
    },
    location: "Balai Desa Ambartawang",
    community: "Kelas Digital Desa",
    createdAt: "38 menit lalu",
    stats: { likes: 92, comments: 18, saves: 55 },
    proof: "Event check-in QR + dokumentasi"
  },
  {
    id: "post-3",
    type: "opportunity",
    title: "Butuh freelance desain poster kegiatan organisasi",
    body:
      "Deadline 2 hari. Gaya desain rapi, tidak norak, siap upload Instagram. Lampirkan contoh desain atau portofolio singkat.",
    author: {
      name: "IPNU IPPNU Ambartawang",
      username: "@ipnuippnu.ambartawang",
      avatar: "IA",
      role: "Organisasi Pelajar",
      location: "Ambartawang",
      trustScore: 81,
      badges: [
        { label: "Komunitas Aktif", tone: "blue" },
        { label: "Terverifikasi", tone: "green" }
      ]
    },
    location: "Ambartawang, Mungkid",
    community: "Organisasi Lokal",
    createdAt: "1 jam lalu",
    stats: { likes: 66, comments: 12, saves: 29 },
    proof: "Brief kerja + pembayaran jelas"
  },
  {
    id: "post-4",
    type: "question",
    title: "Rekomendasi tukang servis laptop ThinkPad sekitar Magelang?",
    body:
      "Cari yang paham ThinkPad, bisa cek thermal, baterai, keyboard, dan engsel. Lebih baik yang bisa transparan soal part dan biaya.",
    author: {
      name: "Najib Tech",
      username: "@najibtech",
      avatar: "NT",
      role: "Tech Enthusiast",
      location: "Magelang",
      trustScore: 78,
      badges: [{ label: "Kontributor Lokal", tone: "slate" }]
    },
    location: "Magelang",
    community: "Teknisi & Gadget Lokal",
    createdAt: "2 jam lalu",
    stats: { likes: 44, comments: 31, saves: 17 },
    proof: "Diskusi komunitas + rekomendasi member"
  }
];

export const communities: Community[] = [
  {
    id: "com-1",
    name: "UMKM Digital Magelang",
    category: "UMKM",
    members: 1240,
    location: "Kab. Magelang",
    description: "Tempat berbagi katalog, promosi sehat, foto produk, dan strategi jualan lokal.",
    activity: "Aktif hari ini"
  },
  {
    id: "com-2",
    name: "Developer Lokal Jateng",
    category: "Teknologi",
    members: 812,
    location: "Jawa Tengah",
    description: "Diskusi coding, freelance, produk digital, deploy, dan peluang remote.",
    activity: "32 diskusi minggu ini"
  },
  {
    id: "com-3",
    name: "Kelas Digital Desa",
    category: "Edukasi",
    members: 536,
    location: "Mungkid",
    description: "Belajar desain, web sederhana, administrasi digital, dan AI praktis untuk warga.",
    activity: "3 event mendatang"
  }
];

export const events: EventItem[] = [
  {
    id: "event-1",
    title: "Workshop Katalog Digital UMKM",
    date: "Minggu, 21 Juni · 09.00",
    location: "Balai Desa Ambartawang",
    attendees: 76,
    category: "Edukasi"
  },
  {
    id: "event-2",
    title: "Kopdar Developer Lokal",
    date: "Sabtu, 27 Juni · 19.30",
    location: "Magelang Kota",
    attendees: 41,
    category: "Teknologi"
  },
  {
    id: "event-3",
    title: "Bazar Produk Warga",
    date: "Ahad, 28 Juni · 07.00",
    location: "Lapangan Mungkid",
    attendees: 188,
    category: "UMKM"
  }
];
