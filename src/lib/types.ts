export type PostType = "local" | "work" | "event" | "opportunity" | "question";

export type TrustBadge = {
  label: string;
  tone: "blue" | "green" | "amber" | "slate";
};

export type Author = {
  name: string;
  username: string;
  avatar: string;
  role: string;
  location: string;
  trustScore: number;
  badges: TrustBadge[];
};

export type FeedPost = {
  id: string;
  type: PostType;
  title: string;
  body: string;
  author: Author;
  location: string;
  community: string;
  createdAt: string;
  stats: {
    likes: number;
    comments: number;
    saves: number;
  };
  proof: string;
  image?: string;
};

export type Community = {
  id: string;
  name: string;
  category: string;
  members: number;
  location: string;
  description: string;
  activity: string;
};

export type EventItem = {
  id: string;
  title: string;
  date: string;
  location: string;
  attendees: number;
  category: string;
};
