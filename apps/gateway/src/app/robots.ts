import type { MetadataRoute } from "next";
import { isProductionSandbox } from "@src/lib/deployment";

const getBaseUrl = (): string => {
  const url = process.env.NEXT_PUBLIC_FLEX_GATEWAY_BASE_URL;
  if (!url) {
    throw new Error("NEXT_PUBLIC_FLEX_GATEWAY_BASE_URL is not defined");
  }
  return url.replace(/\/$/, "");
};

export default function robots(): MetadataRoute.Robots {
  // The production-sandbox app mirrors production content — keep it out of every
  // search index so it can't compete with or leak ahead of production.
  if (isProductionSandbox()) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
    };
  }

  const baseUrl = getBaseUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/auth/", "/todo/", "/web-app/", "/sondage-web-app/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
