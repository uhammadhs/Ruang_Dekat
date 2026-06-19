import { v2 as cloudinary } from "cloudinary";
import { getEnv } from "@/lib/utils";

export function isCloudinaryConfigured() {
  return Boolean(
    getEnv("CLOUDINARY_CLOUD_NAME") && getEnv("CLOUDINARY_API_KEY") && getEnv("CLOUDINARY_API_SECRET")
  );
}

export function getCloudinary() {
  const cloudName = getEnv("CLOUDINARY_CLOUD_NAME");
  const apiKey = getEnv("CLOUDINARY_API_KEY");
  const apiSecret = getEnv("CLOUDINARY_API_SECRET");

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary belum dikonfigurasi. Isi CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, dan CLOUDINARY_API_SECRET.");
  }

  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret, secure: true });
  return cloudinary;
}

export async function uploadToCloudinary(file: File) {
  if (!file.type.startsWith("image/")) {
    throw new Error("Hanya file gambar yang diizinkan untuk MVP ini.");
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Ukuran gambar maksimal 5MB.");
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;
  const folder = getEnv("CLOUDINARY_FOLDER") || "ruangdekat";

  const result = await getCloudinary().uploader.upload(base64, {
    folder,
    resource_type: "image",
    overwrite: false,
    transformation: [
      { width: 1440, crop: "limit" },
      { quality: "auto:good" },
      { fetch_format: "auto" }
    ]
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
    bytes: result.bytes,
    format: result.format
  };
}
