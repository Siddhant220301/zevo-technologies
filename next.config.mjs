/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // Only the site's own photos are resized and compressed (src/lib/photos.js)
    localPatterns: [{ pathname: "/photos/**", search: "" }],
    formats: ["image/avif", "image/webp"],
    qualities: [75],
  },
};

export default nextConfig;
