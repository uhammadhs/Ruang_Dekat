import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { checkRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.headers.get("cookie")?.split("; ").map(c => {
            const idx = c.indexOf("=");
            return { name: c.slice(0, idx), value: c.slice(idx + 1) };
          }) ?? [];
        },
        setAll() {},
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ ok: false, error: "Harus login untuk upload." }, { status: 401 });
  }

  const ip = request.headers.get("x-forwarded-for") || "unknown";
  const rl = checkRateLimit(`upload:${user.id}:${ip}`, 10, 60000);
  if (!rl.allowed) {
    return NextResponse.json({ ok: false, error: "Terlalu banyak upload. Coba lagi nanti." }, { status: 429 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ ok: false, error: "Field file wajib diisi." }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ ok: false, error: "Ukuran file maksimal 10MB." }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ ok: false, error: "Hanya file gambar yang diizinkan." }, { status: 400 });
    }

    const media = await uploadToCloudinary(file);
    return NextResponse.json({ ok: true, media });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload gagal.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
