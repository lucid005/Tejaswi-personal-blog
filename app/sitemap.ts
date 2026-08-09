import type { MetadataRoute } from "next";
import {
  getCategoriesWithPosts,
  getPublishedPosts,
  getSeriesList,
  getTagsWithPosts,
} from "@/lib/posts";
import { SITE_URL } from "@/lib/site";

// Prerendered at build time by default, which would freeze the sitemap at
// whatever was published the day you deployed. Refresh it hourly instead.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Everything here comes from the published-posts query, so a draft can never
  // reach the sitemap.
  const [posts, categories, tags, series] = await Promise.all([
    getPublishedPosts(),
    getCategoriesWithPosts(),
    getTagsWithPosts(),
    getSeriesList(),
  ]);

  const staticRoutes = ["", "/blog", "/series", "/about"].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: posts[0]?.updatedAt ?? new Date(),
  }));

  return [
    ...staticRoutes,
    ...posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: post.updatedAt,
    })),
    ...categories.map((category) => ({
      url: `${SITE_URL}/category/${category.slug}`,
    })),
    ...tags.map((tag) => ({
      url: `${SITE_URL}/tag/${tag.slug}`,
    })),
    ...series.map((entry) => ({
      url: `${SITE_URL}/series/${entry.slug}`,
    })),
  ];
}
