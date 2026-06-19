import { NextResponse } from "next/server";
import { uploadToCloudinary } from "@/lib/cloudinary";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ ok: false, error: "Field file wajib diisi." }, { status: 400 });
    }

    const media = await uploadToCloudinary(file);
    return NextResponse.json({ ok: true, media });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload gagal.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
