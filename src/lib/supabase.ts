import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getEnv } from "@/lib/utils";

let browserClient: SupabaseClient | null = null;

export function isSupabaseConfigured() {
  return Boolean(getEnv("NEXT_PUBLIC_SUPABASE_URL") && getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"));
}

export function getSupabaseBrowserClient() {
  const url = getEnv("NEXT_PUBLIC_SUPABASE_URL");
  const anonKey = getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  if (!url || !anonKey) {
    throw new Error(
      "Supabase belum dikonfigurasi. Untuk development: buat .env.local dari .env.example. Untuk Vercel: set NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY di Dashboard > Project Settings > Environment Variables, lalu redeploy."
    );
  }

  if (!browserClient) {
    browserClient = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });
  }

  return browserClient;
}

export function getSupabaseAdminClient() {
  const url = getEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRole = getEnv("SUPABASE_SERVICE_ROLE_KEY");

  if (!url || !serviceRole) {
    throw new Error(
      "Supabase admin belum dikonfigurasi. Untuk Vercel: set SUPABASE_SERVICE_ROLE_KEY di Dashboard > Project Settings > Environment Variables."
    );
  }

  return createClient(url, serviceRole, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}
