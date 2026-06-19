-- RuangDekat Social 2026 — Seed Data
-- Jalankan setelah schema.sql di Supabase SQL Editor
-- Membutuhkan trigger handle_new_user() sudah aktif

-- 1. Buat user demo di auth.users (hanya untuk dev)
-- Catatan: Di production, user daftar lewat UI. Ini untuk development.
-- Password: demo123456

-- Sample profiles (akan terbuat otomatis via trigger saat signup)
-- Tapi kita insert langsung untuk seed:
insert into public.profiles (id, username, display_name, bio, location_city, location_district, skills, interests, trust_score, is_verified, is_admin) values
  ('00000000-0000-0000-0000-000000000001', 'gusstudio', 'Gus Studio', 'Developer & UMKM Builder. Membantu UMKM dan komunitas lokal membuat website, katalog digital, dan landing page.', 'Magelang', 'Mungkid', array['Web Development', 'UI Design', 'Digital Marketing'], array['Technology', 'UMKM', 'Education'], 92, true, true),
  ('00000000-0000-0000-0000-000000000002', 'ruangwarga', 'Ruang Warga', 'Komunitas lokal yang aktif mengadakan kelas digital dan diskusi warga.', 'Magelang', 'Mungkid', array['Community Organizing', 'Event Planning'], array['Education', 'Community'], 87, true, false),
  ('00000000-0000-0000-0000-000000000003', 'ipnuippnu.ambartawang', 'IPNU IPPNU Ambartawang', 'Organisasi pelajar aktif di Ambartawang.', 'Magelang', 'Mungkid', array['Organization', 'Design'], array['Education', 'Social'], 81, true, false),
  ('00000000-0000-0000-0000-000000000004', 'najibtech', 'Najib Tech', 'Tech Enthusiast. Suka ngoprek ThinkPad dan gadget.', 'Magelang', 'Magelang', array['Hardware Repair', 'IT Support'], array['Technology', 'Gadget'], 78, false, false)
on conflict (id) do nothing;

-- 2. Badges
insert into public.badges (name, description, criteria) values
  ('Kreator Asli', 'Untuk pengguna yang aktif membagikan karya orisinal', 'Membuat 10+ post dengan tipe work'),
  ('Terverifikasi', 'Akun telah diverifikasi oleh tim RuangDekat', 'Verifikasi manual oleh admin'),
  ('Respon Cepat', 'Membalas komentar dalam waktu singkat', 'Balas 20+ komentar dalam 1 jam'),
  ('Event Organizer', 'Aktif membuat event komunitas', 'Membuat 5+ event'),
  ('Komunitas Aktif', 'Anggota aktif dalam komunitas', 'Bergabung di 5+ komunitas'),
  ('Kontributor Lokal', 'Posting konten bermanfaat untuk komunitas lokal', 'Mendapatkan 50+ likes total'),
  ('UMKM Digital', 'Pelaku UMKM yang go-digital', 'Membuat 1+ business page')
on conflict (name) do nothing;

-- 3. Badges untuk user demo
insert into public.user_badges (user_id, badge_id)
select p.id, b.id
from public.profiles p, public.badges b
where p.username = 'gusstudio' and b.name in ('Kreator Asli', 'Terverifikasi', 'Respon Cepat')
on conflict do nothing;

insert into public.user_badges (user_id, badge_id)
select p.id, b.id
from public.profiles p, public.badges b
where p.username = 'ruangwarga' and b.name in ('Event Organizer', 'Terverifikasi')
on conflict do nothing;

insert into public.user_badges (user_id, badge_id)
select p.id, b.id
from public.profiles p, public.badges b
where p.username = 'ipnuippnu.ambartawang' and b.name in ('Komunitas Aktif', 'Terverifikasi')
on conflict do nothing;

-- 4. Komunitas
insert into public.communities (id, owner_id, name, slug, description, category, location_city, location_district) values
  ('c0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'UMKM Digital Magelang', 'umkm-digital-magelang', 'Tempat berbagi katalog, promosi sehat, foto produk, dan strategi jualan lokal.', 'UMKM', 'Magelang', 'Mungkid'),
  ('c0000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Developer Lokal Jateng', 'developer-lokal-jateng', 'Diskusi coding, freelance, produk digital, deploy, dan peluang remote.', 'Teknologi', 'Jawa Tengah', null),
  ('c0000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', 'Kelas Digital Desa', 'kelas-digital-desa', 'Belajar desain, web sederhana, administrasi digital, dan AI praktis untuk warga.', 'Edukasi', 'Magelang', 'Mungkid')
on conflict (id) do nothing;

-- Update member_count
update public.communities set member_count = (select count(*) from public.community_members where community_id = id);

-- 5. Community members (owner otomatis member)
insert into public.community_members (community_id, user_id, role)
  select id, owner_id, 'owner' from public.communities
on conflict (community_id, user_id) do nothing;

-- 6. Postingan demo
insert into public.posts (id, user_id, type, title, content, proof, location_city, location_district, trust_level) values
  ('p0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'work', 'Landing page UMKM telur asin selesai dan siap dipakai', 'Desain mobile-first, SEO lokal, tombol WhatsApp, katalog produk, dan lokasi usaha. Cocok untuk UMKM yang ingin mulai terlihat di pencarian lokal.', 'Portofolio + link website + testimoni klien', 'Magelang', 'Mungkid', 85),
  ('p0000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'event', 'Kelas gratis: bikin katalog digital untuk jualan lokal', 'Sesi praktis 90 menit. Peserta membawa HP dan daftar produk. Output akhir: katalog sederhana siap share ke WhatsApp dan sosial media.', 'Event check-in QR + dokumentasi', 'Magelang', 'Mungkid', 80),
  ('p0000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003', 'opportunity', 'Butuh freelance desain poster kegiatan organisasi', 'Deadline 2 hari. Gaya desain rapi, tidak norak, siap upload Instagram. Lampirkan contoh desain atau portofolio singkat.', 'Brief kerja + pembayaran jelas', 'Magelang', 'Mungkid', 75),
  ('p0000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000004', 'question', 'Rekomendasi tukang servis laptop ThinkPad sekitar Magelang?', 'Cari yang paham ThinkPad, bisa cek thermal, baterai, keyboard, dan engsel. Lebih baik yang bisa transparan soal part dan biaya.', 'Diskusi komunitas + rekomendasi member', 'Magelang', 'Magelang', 70)
on conflict (id) do nothing;

-- 7. Event demo
insert into public.events (id, host_id, title, description, starts_at, ends_at, location_name, location_city) values
  ('e0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Workshop Katalog Digital UMKM', 'Workshop intensif membuat katalog produk digital untuk UMKM lokal.', now() + interval '2 days', now() + interval '2 days' + interval '3 hours', 'Balai Desa Ambartawang', 'Magelang'),
  ('e0000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Kopdar Developer Lokal', 'Kumpul santai developer lokal Jateng. Diskusi tren teknologi, freelance, dan proyek.', now() + interval '8 days', now() + interval '8 days' + interval '4 hours', 'Magelang Kota', 'Magelang'),
  ('e0000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', 'Bazar Produk Warga', 'Bazar tahunan produk-produk unggulan warga Mungkid dan sekitarnya.', now() + interval '9 days', now() + interval '9 days' + interval '8 hours', 'Lapangan Mungkid', 'Magelang')
on conflict (id) do nothing;

-- 8. Event attendees
insert into public.event_attendees (event_id, user_id, status)
  select e.id, p.id, 'going'
  from public.events e, public.profiles p
  where e.title = 'Workshop Katalog Digital UMKM' and p.username = 'gusstudio'
on conflict (event_id, user_id) do nothing;

-- 9. Follows
insert into public.follows (follower_id, following_id)
  select fp.id, tp.id
  from public.profiles fp, public.profiles tp
  where fp.username = 'gusstudio' and tp.username = 'ruangwarga'
on conflict (follower_id, following_id) do nothing;
