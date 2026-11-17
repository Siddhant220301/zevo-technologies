import { SITE } from "@/lib/site";

// Install details for phones ("Add to Home Screen") and browsers
export default function manifest() {
  return {
    name: SITE.name,
    short_name: "Zevo",
    description: SITE.description,
    start_url: "/",
    display: "standalone",
    background_color: "#F4F2ED",
    theme_color: "#F4F2ED",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
