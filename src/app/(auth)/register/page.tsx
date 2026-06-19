"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = getSupabaseBrowserClient();
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName },
      },
    });

    if (authError) {
      setError(authError.message === "User already registered"
        ? "Email sudah terdaftar."
        : authError.message
      );
      setLoading(false);
      return;
    }

    router.push("/login?registered=true");
    router.refresh();
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <Logo />
          <h1 className="mt-4 text-2xl font-black tracking-tight text-slate-950">Daftar</h1>
          <p className="mt-1 text-sm text-slate-500">Buat akun baru untuk bergabung.</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label htmlFor="displayName" className="block text-sm font-bold text-slate-700">Nama Tampilan</label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              minLength={2}
              maxLength={80}
              className="focus-ring mt-1 block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
              placeholder="Nama kamu"
            />
          </div>

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

          <div>
            <label htmlFor="password" className="block text-sm font-bold text-slate-700">Password</label>
            <div className="relative mt-1">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="focus-ring block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 pr-11 text-sm outline-none"
                placeholder="Minimal 6 karakter"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              >
                {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
              {error}
            </div>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading && <Loader2 className="size-4 animate-spin" />}
            {loading ? "Memproses..." : "Daftar"}
          </Button>
        </form>

        <p className="text-center text-sm text-slate-500">
          Sudah punya akun?{" "}
          <Link href="/login" className="font-bold text-blue-600 hover:text-blue-700">
            Masuk
          </Link>
        </p>
      </div>
    </div>
  );
}
