import type { SupabaseClient } from "@supabase/supabase-js";
import type { PostWithDetails, Profile, Community, EventWithDetails, CommentWithAuthor } from "@/lib/types";

// ──────── Profiles ────────

export async function getProfile(client: SupabaseClient, userId: string) {
  const { data } = await client
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  return data;
}

export async function getProfileByUsername(client: SupabaseClient, username: string) {
  const { data } = await client
    .from("profiles")
    .select("*")
    .eq("username", username)
    .maybeSingle();
  return data;
}

export async function updateProfile(client: SupabaseClient, userId: string, updates: Partial<Profile>) {
  const { data } = await client
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .maybeSingle();
  return data;
}

// ──────── Posts / Feed ────────

export async function getFeedPosts(
  client: SupabaseClient,
  options: {
    userId?: string;
    filterByUserId?: string;
    communityId?: string;
    type?: string;
    limit?: number;
    offset?: number;
  } = {}
) {
  const { userId, filterByUserId, communityId, type, limit = 10, offset = 0 } = options;

  let query = client
    .from("posts")
    .select(`
      *,
      author:profiles!user_id(id, username, display_name, avatar_url, trust_score),
      media:post_media(id, url, width, height),
      likes_count:post_likes(count),
      comments_count:comments(count),
      saves_count:post_saves(count)
    `)
    .eq("is_deleted", false)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (type && type !== "all") {
    query = query.eq("type", type);
  }

  if (filterByUserId) {
    query = query.eq("user_id", filterByUserId);
  }

  if (communityId) {
    query = query.eq("community_id", communityId);
  }

  const { data } = await query;
  const posts = (data || []) as unknown as PostWithDetails[];

  if (userId) {
    const postIds = posts.map((p) => p.id);
    if (postIds.length > 0) {
      const [likes, saves] = await Promise.all([
        client.from("post_likes").select("post_id").in("post_id", postIds).eq("user_id", userId),
        client.from("post_saves").select("post_id").in("post_id", postIds).eq("user_id", userId),
      ]);
      const likedSet = new Set(likes.data?.map((l) => l.post_id));
      const savedSet = new Set(saves.data?.map((s) => s.post_id));
      for (const post of posts) {
        post.is_liked = likedSet.has(post.id);
        post.is_saved = savedSet.has(post.id);
      }
    }
  }

  return posts;
}

export async function getPostById(client: SupabaseClient, postId: string, userId?: string) {
  const { data } = await client
    .from("posts")
    .select(`
      *,
      author:profiles!user_id(id, username, display_name, avatar_url, trust_score),
      media:post_media(id, url, width, height),
      likes_count:post_likes(count),
      comments_count:comments(count),
      saves_count:post_saves(count)
    `)
    .eq("id", postId)
    .eq("is_deleted", false)
    .maybeSingle();

  if (!data) return null;

  const post = data as unknown as PostWithDetails;

  if (userId) {
    const [like, save] = await Promise.all([
      client.from("post_likes").select("*").eq("post_id", postId).eq("user_id", userId).maybeSingle(),
      client.from("post_saves").select("*").eq("post_id", postId).eq("user_id", userId).maybeSingle(),
    ]);
    post.is_liked = !!like.data;
    post.is_saved = !!save.data;
  }

  return post;
}

export async function createPost(
  client: SupabaseClient,
  post: {
    user_id: string;
    type: string;
    title: string;
    content: string;
    proof?: string;
    community_id?: string;
    location_city?: string;
    location_district?: string;
    visibility?: string;
    ai_assisted?: boolean;
  }
) {
  const { data } = await client.from("posts").insert(post).select().maybeSingle();
  return data;
}

export async function toggleLike(client: SupabaseClient, postId: string, userId: string) {
  const { data: existing } = await client
    .from("post_likes")
    .select("*")
    .eq("post_id", postId)
    .eq("user_id", userId)
    .maybeSingle();

  if (existing) {
    await client.from("post_likes").delete().eq("post_id", postId).eq("user_id", userId);
    return { liked: false };
  }

  await client.from("post_likes").insert({ post_id: postId, user_id: userId });
  return { liked: true };
}

export async function toggleSave(client: SupabaseClient, postId: string, userId: string) {
  const { data: existing } = await client
    .from("post_saves")
    .select("*")
    .eq("post_id", postId)
    .eq("user_id", userId)
    .maybeSingle();

  if (existing) {
    await client.from("post_saves").delete().eq("post_id", postId).eq("user_id", userId);
    return { saved: false };
  }

  await client.from("post_saves").insert({ post_id: postId, user_id: userId });
  return { saved: true };
}

// ──────── Comments ────────

export async function getComments(client: SupabaseClient, postId: string) {
  const { data } = await client
    .from("comments")
    .select(`
      *,
      author:profiles!user_id(id, username, display_name, avatar_url)
    `)
    .eq("post_id", postId)
    .eq("is_deleted", false)
    .order("created_at", { ascending: true });

  return (data || []) as unknown as CommentWithAuthor[];
}

export async function createComment(
  client: SupabaseClient,
  comment: { post_id: string; user_id: string; content: string; parent_id?: string }
) {
  const { data } = await client.from("comments").insert(comment).select().maybeSingle();
  return data;
}

export async function deleteComment(client: SupabaseClient, commentId: string, userId: string) {
  const { error } = await client
    .from("comments")
    .update({ is_deleted: true })
    .eq("id", commentId)
    .eq("user_id", userId);
  return !error;
}

// ──────── Communities ────────

export async function getCommunities(client: SupabaseClient) {
  const { data } = await client
    .from("communities")
    .select("*")
    .eq("visibility", "public")
    .order("member_count", { ascending: false });

  return (data || []) as Community[];
}

export async function getCommunityBySlug(client: SupabaseClient, slug: string) {
  const { data } = await client
    .from("communities")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  return data;
}

export async function createCommunity(
  client: SupabaseClient,
  community: { owner_id: string; name: string; slug: string; description?: string; category: string; location_city?: string; location_district?: string }
) {
  const { data } = await client.from("communities").insert(community).select().maybeSingle();
  return data;
}

export async function joinCommunity(client: SupabaseClient, communityId: string, userId: string) {
  const { error } = await client.from("community_members").insert({ community_id: communityId, user_id: userId });
  if (!error) {
    await client.rpc("increment_community_member_count", { community_id: communityId });
  }
  return !error;
}

export async function leaveCommunity(client: SupabaseClient, communityId: string, userId: string) {
  const { error } = await client
    .from("community_members")
    .delete()
    .eq("community_id", communityId)
    .eq("user_id", userId);
  return !error;
}

export async function isCommunityMember(client: SupabaseClient, communityId: string, userId: string) {
  const { data } = await client
    .from("community_members")
    .select("id")
    .eq("community_id", communityId)
    .eq("user_id", userId)
    .maybeSingle();

  return !!data;
}

// ──────── Events ────────

export async function getEvents(client: SupabaseClient, options: { upcoming?: boolean; limit?: number; offset?: number } = {}) {
  const { upcoming = true, limit = 10, offset = 0 } = options;

  let query = client
    .from("events")
    .select(`
      *,
      host:profiles!host_id(id, username, display_name, avatar_url)
    `)
    .order("starts_at", { ascending: upcoming })
    .range(offset, offset + limit - 1);

  if (upcoming) {
    query = query.gte("starts_at", new Date().toISOString());
  }

  const { data } = await query;
  return (data || []) as unknown as EventWithDetails[];
}

export async function getEventById(client: SupabaseClient, eventId: string, userId?: string) {
  const { data } = await client
    .from("events")
    .select(`
      *,
      host:profiles!host_id(id, username, display_name, avatar_url)
    `)
    .eq("id", eventId)
    .maybeSingle();

  if (!data) return null;

  const event = data as unknown as EventWithDetails;

  if (userId) {
    const { data: attend } = await client
      .from("event_attendees")
      .select("status")
      .eq("event_id", eventId)
      .eq("user_id", userId)
      .maybeSingle();
    event.is_attending = !!attend;
    event.attendance_status = attend?.status || null;
  }

  return event;
}

export async function createEvent(
  client: SupabaseClient,
  event: {
    host_id: string;
    title: string;
    description?: string;
    starts_at: string;
    ends_at?: string;
    location_name?: string;
    location_city?: string;
    community_id?: string;
  }
) {
  const { data } = await client.from("events").insert(event).select().maybeSingle();
  return data;
}

export async function rsvpEvent(client: SupabaseClient, eventId: string, userId: string, status: string) {
  const { data: existing } = await client
    .from("event_attendees")
    .select("*")
    .eq("event_id", eventId)
    .eq("user_id", userId)
    .maybeSingle();

  if (existing) {
    if (status === "cancelled") {
      await client.from("event_attendees").delete().eq("event_id", eventId).eq("user_id", userId);
    } else {
      await client.from("event_attendees").update({ status }).eq("event_id", eventId).eq("user_id", userId);
    }
  } else if (status !== "cancelled") {
    await client.from("event_attendees").insert({ event_id: eventId, user_id: userId, status });
  }

  return true;
}

// ──────── Follows ────────

export async function toggleFollow(client: SupabaseClient, followerId: string, followingId: string) {
  const { data: existing } = await client
    .from("follows")
    .select("*")
    .eq("follower_id", followerId)
    .eq("following_id", followingId)
    .maybeSingle();

  if (existing) {
    await client.from("follows").delete().eq("follower_id", followerId).eq("following_id", followingId);
    return { following: false };
  }

  await client.from("follows").insert({ follower_id: followerId, following_id: followingId });
  return { following: true };
}

export async function isFollowing(client: SupabaseClient, followerId: string, followingId: string) {
  const { data } = await client
    .from("follows")
    .select("*")
    .eq("follower_id", followerId)
    .eq("following_id", followingId)
    .maybeSingle();

  return !!data;
}

// ──────── Reports ────────

export async function createReport(
  client: SupabaseClient,
  report: {
    reporter_id: string;
    post_id?: string;
    comment_id?: string;
    reported_user_id?: string;
    reason: string;
  }
) {
  const { data } = await client.from("reports").insert(report).select().maybeSingle();
  return data;
}

export async function getReports(client: SupabaseClient) {
  const { data } = await client
    .from("reports")
    .select("*")
    .order("created_at", { ascending: false });

  return data || [];
}

export async function updateReportStatus(client: SupabaseClient, reportId: string, status: string) {
  const { data } = await client
    .from("reports")
    .update({ status, resolved_at: status === "resolved" ? new Date().toISOString() : undefined })
    .eq("id", reportId)
    .select()
    .maybeSingle();

  return data;
}

// ──────── Notifications ────────

export async function getNotifications(client: SupabaseClient, userId: string) {
  const { data } = await client
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(20);

  return data || [];
}

export async function markNotificationRead(client: SupabaseClient, notificationId: string, userId: string) {
  await client
    .from("notifications")
    .update({ is_read: true })
    .eq("id", notificationId)
    .eq("user_id", userId);
}

// ──────── Business Pages ────────

export async function getBusinessPages(client: SupabaseClient, ownerId: string) {
  const { data } = await client
    .from("business_pages")
    .select("*")
    .eq("owner_id", ownerId);

  return data || [];
}
