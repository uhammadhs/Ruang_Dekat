import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase-server";
import { getPostById, getComments } from "@/lib/supabase-queries";
import { BottomNav } from "@/components/bottom-nav";
import { TopBar } from "@/components/top-bar";
import { PostDetailContent } from "./post-detail-content";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const post = await getPostById(supabase, id);
  if (!post) return { title: "Post Tidak Ditemukan — RuangDekat" };

  const snippet = post.content.length > 150 ? post.content.slice(0, 150) + "..." : post.content;

  return {
    title: `${post.title} — RuangDekat`,
    description: snippet,
    openGraph: {
      title: post.title,
      description: snippet,
      type: "article",
    },
  };
}

export default async function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const post = await getPostById(supabase, id, user?.id);
  if (!post) notFound();

  const comments = await getComments(supabase, id);

  return (
    <>
      <TopBar />
      <main className="mx-auto max-w-3xl px-4 py-5 pb-28 lg:px-6">
        <PostDetailContent post={post} comments={comments} userId={user?.id} />
      </main>
      <BottomNav />
    </>
  );
}
