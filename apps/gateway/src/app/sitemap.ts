import type { MetadataRoute } from "next";

const getBaseUrl = (): string => {
  const url = process.env.NEXT_PUBLIC_FLEX_GATEWAY_BASE_URL;
  if (!url) {
    throw new Error("NEXT_PUBLIC_FLEX_GATEWAY_BASE_URL is not defined");
  }
  return url.replace(/\/$/, "");
};

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl();
  const now = new Date();

  const routes: Array<{
    path: string;
    priority: number;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  }> = [
    { path: "/", priority: 1.0, changeFrequency: "weekly" },
    { path: "/home", priority: 0.9, changeFrequency: "weekly" },
    { path: "/about", priority: 0.8, changeFrequency: "monthly" },
    { path: "/adhesion", priority: 0.8, changeFrequency: "monthly" },
    { path: "/cagnotte", priority: 0.8, changeFrequency: "weekly" },
    { path: "/decouverte-des-metiers", priority: 0.8, changeFrequency: "monthly" },
    { path: "/games", priority: 0.7, changeFrequency: "monthly" },
    { path: "/newsletter", priority: 0.7, changeFrequency: "monthly" },
    { path: "/planning", priority: 0.7, changeFrequency: "weekly" },
    { path: "/sondage", priority: 0.6, changeFrequency: "monthly" },
    { path: "/privacy_policy", priority: 0.3, changeFrequency: "yearly" },
    { path: "/terms_of_service", priority: 0.3, changeFrequency: "yearly" },
  ];

  return routes.map(({ path, priority, changeFrequency }) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));
}
