import { SERVICES, SERVICES_UPDATED } from "@/lib/services";
import { SITE } from "@/lib/site";

// Every page of the site, for search engines. Service pages are listed from
// lib/services.js, so a new service appears here by itself.
export default function sitemap() {
  const page = (path, priority) => ({
    url: `${SITE.url}${path}`,
    lastModified: SERVICES_UPDATED,
    changeFrequency: "monthly",
    priority,
  });
  return [
    page("", 1),
    page("/services", 0.8),
    ...SERVICES.map((service) => page(`/services/${service.slug}`, 0.8)),
  ];
}
