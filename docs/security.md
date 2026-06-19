# Security Notes

## Wajib sebelum production

- Aktifkan email verification Supabase.
- MFA untuk admin.
- RLS wajib aktif semua tabel publik.
- Jangan simpan secret di client.
- Validasi upload di server.
- Rate limit endpoint AI dan upload.
- Moderation queue untuk akun baru.
- Audit log semua aksi admin.
- Backup database berkala.
- Tambahkan Content Security Policy.
- Tambahkan Cloudflare WAF/Turnstile jika public.

## Risiko utama

1. Spam posting dan komentar.
2. Upload media berlebihan.
3. Prompt abuse pada AI endpoint.
4. Akun palsu / impersonation.
5. Link scam.
6. Kebocoran service role key jika salah konfigurasi.

## Mitigasi

- Batas posting akun baru.
- Limit upload ukuran dan tipe file.
- AI moderation hanya sebagai filter awal, bukan keputusan mutlak.
- Trust score tidak boleh mudah dimanipulasi.
- Log hash input AI, bukan menyimpan data sensitif mentah.
