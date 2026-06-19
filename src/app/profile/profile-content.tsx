"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/components/session-provider";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Profile, PostWithDetails, BusinessPage } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { Award, BarChart3, BriefcaseBusiness, MapPin, LogOut, Camera, Loader2, UserRound } from "lucide-react";

export function ProfileContent({
  profile,
  posts,
  businesses,
  isOwn,
  followerCount = 0,
  followingCount = 0,
}: {
  profile: Profile;
  posts: PostWithDetails[];
  businesses: BusinessPage[];
  isOwn?: boolean;
  followerCount?: number;
  followingCount?: number;
}) {
  const { signOut, user } = useSession();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [displayName, setDisplayName] = useState(profile.display_name);
  const [bio, setBio] = useState(profile.bio || "");
  const [locationCity, setLocationCity] = useState(profile.location_city || "");
  const [locationDistrict, setLocationDistrict] = useState(profile.location_district || "");
  const [saving, setSaving] = useState(false);

  const initial = profile.display_name?.[0]?.toUpperCase() || profile.username?.[0]?.toUpperCase() || "?";

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/media/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.ok) {
        const supabase = getSupabaseBrowserClient();
        await supabase.from("profiles").update({ avatar_url: data.media.url }).eq("id", profile.id);
        profile.avatar_url = data.media.url;
        router.refresh();
      }
    } finally {
      setUploading(false);
    }
  }

  async function handleSaveProfile() {
    setSaving(true);
    const supabase = getSupabaseBrowserClient();
    await supabase.from("profiles").update({
      display_name: displayName,
      bio,
      location_city: locationCity || null,
      location_district: locationDistrict || null,
    }).eq("id", profile.id);
    setSaving(false);
    setEditing(false);
    router.refresh();
  }

  async function handleSignOut() {
    await signOut();
    router.push("/login");
  }

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden p-0">
        <div className="h-32 bg-gradient-to-br from-slate-950 via-blue-900 to-emerald-700" />
        <div className="p-5 sm:p-7">
          <div className="relative -mt-16">
            <div className="grid size-24 place-items-center rounded-[2rem] border-4 border-white bg-slate-950 text-2xl font-black text-white shadow-xl overflow-hidden">
              {profile.avatar_url ? (
                <Image src={profile.avatar_url} alt={`Avatar ${profile.display_name}`} width={96} height={96} className="size-full object-cover" />
              ) : (
                initial
              )}
            </div>
            {isOwn && (
              <label className="absolute -bottom-1 left-16 grid size-8 cursor-pointer place-items-center rounded-full border-2 border-white bg-blue-600 text-white shadow hover:bg-blue-700">
                {uploading ? <Loader2 className="size-4 animate-spin" /> : <Camera className="size-4" />}
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
              </label>
            )}
          </div>

          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1">
              {editing ? (
                <div className="space-y-3">
                  <input
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="focus-ring block w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-lg font-black outline-none"
                    maxLength={80}
                  />
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="focus-ring block w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm outline-none"
                    rows={3}
                    maxLength={300}
                  />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input
                      value={locationCity}
                      onChange={(e) => setLocationCity(e.target.value)}
                      placeholder="Kota"
                      className="focus-ring block w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm outline-none"
                    />
                    <input
                      value={locationDistrict}
                      onChange={(e) => setLocationDistrict(e.target.value)}
                      placeholder="Kecamatan"
                      className="focus-ring block w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm outline-none"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSaveProfile} disabled={saving}>
                      {saving ? "Menyimpan..." : "Simpan"}
                    </Button>
                    <Button variant="secondary" onClick={() => setEditing(false)}>Batal</Button>
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-3xl font-black tracking-tight text-slate-950">{profile.display_name}</h1>
                  <p className="mt-1 text-sm font-semibold text-slate-500">@{profile.username}</p>
                  {profile.bio && (
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">{profile.bio}</p>
                  )}
                  <div className="mt-3 flex gap-4 text-sm">
                    <span className="font-bold text-slate-950">{followerCount} <span className="font-medium text-slate-500">pengikut</span></span>
                    <span className="font-bold text-slate-950">{followingCount} <span className="font-medium text-slate-500">mengikuti</span></span>
                  </div>
                  {(profile.location_city || profile.location_district) && (
                    <p className="mt-3 flex items-center gap-2 text-sm font-medium text-slate-600">
                      <MapPin className="size-4" />
                      {[profile.location_city, profile.location_district].filter(Boolean).join(", ")}
                    </p>
                  )}
                </>
              )}
            </div>
            <div className="flex gap-2">
              {isOwn && !editing && (
                <Button onClick={() => setEditing(true)}>Edit Profil</Button>
              )}
              {isOwn && (
                <button
                  onClick={handleSignOut}
                  className="grid size-11 place-items-center rounded-2xl border border-slate-200 text-slate-500 hover:bg-rose-50 hover:text-rose-600"
                >
                  <LogOut className="size-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <UserRound className="size-5 text-emerald-600" />
          <p className="mt-3 text-3xl font-black text-slate-950">{profile.trust_score}</p>
          <p className="text-sm font-semibold text-slate-500">Trust Score</p>
        </Card>
        <Card>
          <BriefcaseBusiness className="size-5 text-blue-600" />
          <p className="mt-3 text-3xl font-black text-slate-950">{posts.length}</p>
          <p className="text-sm font-semibold text-slate-500">Posting</p>
        </Card>
        <Card>
          <Award className="size-5 text-amber-600" />
          <p className="mt-3 text-3xl font-black text-slate-950">{businesses.length}</p>
          <p className="text-sm font-semibold text-slate-500">UMKM</p>
        </Card>
      </div>

      {posts.length > 0 && (
        <Card>
          <div className="flex items-center gap-2">
            <BarChart3 className="size-5 text-blue-600" />
            <h2 className="font-black text-slate-950">Posting Terbaru</h2>
          </div>
          <div className="mt-4 space-y-3">
            {posts.slice(0, 5).map((post) => (
              <Link key={post.id} href={`/post/${post.id}`}>
                <div className="rounded-3xl border border-slate-100 bg-white p-4 transition hover:bg-slate-50">
                  <p className="font-black text-slate-950">{post.title}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">{post.content.slice(0, 120)}...</p>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      )}

      {businesses.length > 0 && (
        <Card>
          <h2 className="font-black text-slate-950">UMKM</h2>
          <div className="mt-4 space-y-3">
            {businesses.map((b) => (
              <div key={b.id} className="rounded-3xl border border-slate-100 bg-white p-4">
                <p className="font-black text-slate-950">{b.business_name}</p>
                <p className="mt-1 text-xs text-slate-500">{b.description}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
