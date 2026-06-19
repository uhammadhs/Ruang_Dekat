export type PostType = "local" | "work" | "event" | "opportunity" | "question";
export type VisibilityType = "public" | "community" | "private";
export type MemberRole = "owner" | "admin" | "moderator" | "member";
export type ReportStatus = "open" | "reviewing" | "resolved" | "rejected";
export type EventAttendeeStatus = "going" | "interested" | "cancelled";
export type NotificationType = "like" | "comment" | "follow" | "community_join" | "event_rsvp" | "report_status";

export type Profile = {
  id: string;
  username: string;
  display_name: string;
  bio: string | null;
  avatar_url: string | null;
  location_city: string | null;
  location_district: string | null;
  skills: string[];
  interests: string[];
  trust_score: number;
  is_verified: boolean;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
};

export type Community = {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  description: string | null;
  category: string;
  location_city: string | null;
  location_district: string | null;
  visibility: VisibilityType;
  member_count: number;
  created_at: string;
  updated_at: string;
};

export type CommunityMember = {
  id: string;
  community_id: string;
  user_id: string;
  role: MemberRole;
  created_at: string;
};

export type Post = {
  id: string;
  user_id: string;
  community_id: string | null;
  type: PostType;
  title: string;
  content: string;
  proof: string | null;
  visibility: VisibilityType;
  location_city: string | null;
  location_district: string | null;
  ai_assisted: boolean;
  trust_level: number;
  is_pinned: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
};

export type PostWithDetails = Post & {
  author: Pick<Profile, "id" | "username" | "display_name" | "avatar_url" | "trust_score">;
  media: Array<Pick<PostMedia, "id" | "url" | "width" | "height">>;
  likes_count: number;
  comments_count: number;
  saves_count: number;
  is_liked: boolean;
  is_saved: boolean;
};

export type PostMedia = {
  id: string;
  post_id: string;
  url: string;
  cloudinary_public_id: string | null;
  media_type: string;
  width: number | null;
  height: number | null;
  sort_order: number;
  created_at: string;
};

export type Comment = {
  id: string;
  post_id: string;
  user_id: string;
  parent_id: string | null;
  content: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
};

export type CommentWithAuthor = Comment & {
  author: Pick<Profile, "id" | "username" | "display_name" | "avatar_url">;
};

export type Event = {
  id: string;
  host_id: string;
  community_id: string | null;
  title: string;
  description: string | null;
  starts_at: string;
  ends_at: string | null;
  location_name: string | null;
  location_city: string | null;
  location_district: string | null;
  attendee_count: number;
  created_at: string;
  updated_at: string;
};

export type EventWithDetails = Event & {
  host: Pick<Profile, "id" | "username" | "display_name" | "avatar_url">;
  is_attending: boolean;
  attendance_status: EventAttendeeStatus | null;
};

export type Notification = {
  id: string;
  user_id: string;
  type: NotificationType;
  actor_id: string | null;
  post_id: string | null;
  community_id: string | null;
  event_id: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
};

export type Badge = {
  id: string;
  name: string;
  description: string | null;
  icon_url: string | null;
  criteria: string | null;
  created_at: string;
};

export type UserBadge = Badge & {
  awarded_at: string;
};

export type BusinessPage = {
  id: string;
  owner_id: string;
  business_name: string;
  slug: string;
  description: string | null;
  category: string | null;
  address: string | null;
  location_city: string | null;
  location_district: string | null;
  phone: string | null;
  whatsapp: string | null;
  website: string | null;
  logo_url: string | null;
  cover_url: string | null;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
};

export type Report = {
  id: string;
  reporter_id: string;
  post_id: string | null;
  comment_id: string | null;
  reported_user_id: string | null;
  reason: string;
  status: ReportStatus;
  created_at: string;
  resolved_at: string | null;
};
