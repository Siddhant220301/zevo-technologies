export default function manifest() {
  return {
    name: "ZEVO TECHNOLOGIES",
    short_name: "Zevo",
    description: "Digital product and engineering studio.",
    start_url: "/",
    display: "standalone",
    background_color: "#F4F2ED",
    theme_color: "#F4F2ED",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
