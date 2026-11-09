import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { getPath } from "@/utils/getPath";
import getSortedPosts from "@/utils/getSortedPosts";
import { SITE } from "@/config";

export async function GET() {
  const posts = getSortedPosts(
    await getCollection("blog", ({ data }) => data.type === "til")
  );

  return rss({
    title: `Today I Learned | ${SITE.title}`,
    description:
      "Short notes, useful discoveries, and things I learn while building.",
    site: SITE.website,
    items: posts.map(({ data, id, filePath }) => ({
      link: getPath(id, filePath, true, data.type),
      title: data.title,
      description: data.description,
      pubDate: new Date(data.modDatetime ?? data.pubDatetime),
    })),
  });
}
