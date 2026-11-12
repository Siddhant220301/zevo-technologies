import { Plus_Jakarta_Sans, Instrument_Serif, Space_Mono } from "next/font/google";
import "./globals.css";

const SITE_URL = "https://www.zevotechnologies.com";
const TITLE = "ZEVO TECHNOLOGIES — Digital Product & Engineering Studio";
const DESCRIPTION =
  "Full-service digital product and engineering studio. We build custom business tools, operations portals, interactive web applications, and high-performance digital systems.";

// Self-hosted through next/font: no render-blocking request to Google
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jakarta",
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-instrument",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-space-mono",
});

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "ZEVO TECHNOLOGIES",
    title: TITLE,
    description: DESCRIPTION,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  other: {
    "darkreader-lock": "true",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "light",
  themeColor: "#F4F2ED",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "ZEVO TECHNOLOGIES",
  url: SITE_URL,
  description: DESCRIPTION,
  email: "info@zevotechnologies.com",
  areaServed: "IN",
  address: [
    { "@type": "PostalAddress", addressLocality: "Bengaluru", addressRegion: "Karnataka", addressCountry: "IN" },
    { "@type": "PostalAddress", addressLocality: "Mumbai", addressRegion: "Maharashtra", addressCountry: "IN" },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en-IN"
      className={`${jakarta.variable} ${instrument.variable} ${spaceMono.variable}`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        {/* Runs before first paint: decides the motion mode (URL override, then a
            stored choice, then the system setting) and writes it to <html> so
            CSS and scripts agree. See src/lib/motion.js. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var d=document.documentElement,s=location.search,m=null;if(/[?&]motion=(force|full)(&|$)/.test(s))m='full';else if(/[?&]motion=(calm|lite)(&|$)/.test(s))m='calm';else{try{m=localStorage.getItem('zevo-motion')}catch(e){}}if(m!=='full'&&m!=='calm')m=matchMedia('(prefers-reduced-motion: reduce)').matches?'calm':'full';d.classList.add('motion-ok','motion-'+m)}catch(e){}})()",
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
        {children}
      </body>
    </html>
  );
}
