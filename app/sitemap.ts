import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://topview0.com", lastModified: new Date() },
    { url: "https://topview0.com/talent", lastModified: new Date() },
    { url: "https://topview0.com/marketing", lastModified: new Date() },
  ];
}
