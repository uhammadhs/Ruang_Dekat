"use client";

import { useState } from "react";
import Link from "next/link";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Loader2, MailCheck } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
    const supabase = getSupabaseBrowserClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${appUrl}/auth/callback`,
    });

    if (resetError) {
      setError(resetError.message);
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  }

  if (sent) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-6 text-center">
          <MailCheck className="mx-auto size-12 text-emerald-600" />
          <h1 className="text-2xl font-black tracking-tight text-slate-950">Cek Email Kamu</h1>
          <p className="text-sm text-slate-500">
            Kami sudah kirim link reset password ke <strong className="text-slate-700">{email}</strong>.
          </p>
          <Link href="/login" className="inline-block text-sm font-bold text-blue-600 hover:text-blue-700">
            Kembali ke Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <Logo />
          <h1 className="mt-4 text-2xl font-black tracking-tight text-slate-950">Lupa Password</h1>
          <p className="mt-1 text-sm text-slate-500">Masukkan email untuk menerima link reset.</p>
        </div>

        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-bold text-slate-700">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="focus-ring mt-1 block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
              placeholder="nama@email.com"
            />
          </div>

          {error && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
              {error}
            </div>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading && <Loader2 className="size-4 animate-spin" />}
            {loading ? "Mengirim..." : "Kirim Link Reset"}
          </Button>
        </form>

        <p className="text-center text-sm text-slate-500">
          <Link href="/login" className="font-bold text-blue-600 hover:text-blue-700">
            Kembali ke Login
          </Link>
        </p>
      </div>
    </div>
  );
}
