import "./globals.css";

export const metadata = {
  title: "ZEVO TECHNOLOGIES — Independent Web & Product Studio",
  description:
    "Independent 2-person digital product and engineering studio. We build custom business tools, operations portals, interactive 3D web experiences, and high-performance web applications.",
  other: {
    "darkreader-lock": "true",
    "color-scheme": "light",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
