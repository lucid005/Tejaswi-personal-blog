import { NextResponse } from "next/server";
import { searchPosts } from "@/lib/posts";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim() ?? "";

  if (!query) {
    return NextResponse.json({ posts: [] });
  }

  const posts = await searchPosts(query, 6);

  return NextResponse.json({
    posts: posts.map((post) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      shortDescription: post.shortDescription,
      category: post.category.name,
      publishedAt: post.publishedAt,
    })),
  });
}
