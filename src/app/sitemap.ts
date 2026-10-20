import type { MetadataRoute } from "next";

const site = process.env.NEXT_PUBLIC_SITE_URL ?? "https://capreacafe.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/packages", "/menu", "/book"].map((path) => ({
    url: `${site}${path}`,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.8,
  }));
}
