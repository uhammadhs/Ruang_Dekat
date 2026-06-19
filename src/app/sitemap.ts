import type { MetadataRoute } from "next";
import { getSupabaseAdminClient } from "@/lib/supabase";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://ruangdekat.vercel.app";

  const staticRoutes = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "hourly" as const, priority: 1.0 },
    { url: `${baseUrl}/login`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.3 },
    { url: `${baseUrl}/register`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.3 },
    { url: `${baseUrl}/communities`, lastModified: new Date(), changeFrequency: "hourly" as const, priority: 0.8 },
    { url: `${baseUrl}/events`, lastModified: new Date(), changeFrequency: "hourly" as const, priority: 0.8 },
  ];

  try {
    const supabase = getSupabaseAdminClient();

    // Fetch dynamic content in parallel
    const [posts, communities, events, profiles] = await Promise.all([
      supabase.from("posts").select("id, updated_at").eq("is_deleted", false).eq("visibility", "public").limit(100),
      supabase.from("communities").select("slug, updated_at").eq("visibility", "public").limit(100),
      supabase.from("events").select("id, updated_at").limit(100),
      supabase.from("profiles").select("id, updated_at").limit(100),
    ]);

    const dynamicRoutes: MetadataRoute.Sitemap = [];

    posts.data?.forEach((post) => {
      dynamicRoutes.push({
        url: `${baseUrl}/post/${post.id}`,
        lastModified: new Date(post.updated_at),
        changeFrequency: "daily" as const,
        priority: 0.6,
      });
    });

    communities.data?.forEach((c) => {
      dynamicRoutes.push({
        url: `${baseUrl}/community/${c.slug}`,
        lastModified: new Date(c.updated_at),
        changeFrequency: "daily" as const,
        priority: 0.7,
      });
    });

    events.data?.forEach((e) => {
      dynamicRoutes.push({
        url: `${baseUrl}/event/${e.id}`,
        lastModified: new Date(e.updated_at),
        changeFrequency: "daily" as const,
        priority: 0.7,
      });
    });

    profiles.data?.forEach((p) => {
      dynamicRoutes.push({
        url: `${baseUrl}/profile/${p.id}`,
        lastModified: new Date(p.updated_at),
        changeFrequency: "weekly" as const,
        priority: 0.5,
      });
    });

    return [...staticRoutes, ...dynamicRoutes];
  } catch (error) {
    console.error("Failed to generate dynamic sitemap:", error);
    return staticRoutes;
  }
}
