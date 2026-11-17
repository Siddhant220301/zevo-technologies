import { Plus_Jakarta_Sans, Instrument_Serif, Space_Mono } from "next/font/google";
import "./globals.css";
import JsonLd from "@/components/JsonLd";
import { SERVICES } from "@/lib/services";
import { SITE } from "@/lib/site";

const TITLE = `${SITE.title} | ${SITE.name}`;
const SHARE_IMAGE = { url: "/og/home.jpg", width: 1200, height: 630, alt: `${SITE.name}: ${SITE.title}` };

// Self-hosted through next/font: no render-blocking request to Google
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jakarta",
});

// Only the italic is used (the accent words), so only the italic is loaded
const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["italic"],
  display: "swap",
  variable: "--font-instrument",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-space-mono",
});

// Defaults for every page. A page that sets its own title gets
// "<its title> | Zevo Technologies"; pages set their own canonical address.
export const metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: TITLE, template: `%s | ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.name,
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE.name,
    title: TITLE,
    description: SITE.description,
    locale: "en_IN",
    images: [SHARE_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: SITE.description,
    images: [SHARE_IMAGE.url],
  },
  ...(SITE.googleVerification ? { verification: { google: SITE.googleVerification } } : {}),
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

// Who the business is, for search engines. The service pages point back to
// this record as their provider.
const organization = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": `${SITE.url}/#organization`,
      name: SITE.name,
      url: SITE.url,
      logo: `${SITE.url}/logo.png`,
      image: `${SITE.url}${SHARE_IMAGE.url}`,
      description: SITE.description,
      email: SITE.email,
      areaServed: { "@type": "Country", name: "India" },
      address: SITE.locations.map((place) => ({
        "@type": "PostalAddress",
        addressLocality: place.city,
        addressRegion: place.region,
        addressCountry: "IN",
      })),
      knowsAbout: SERVICES.map((service) => service.name),
      ...(SITE.whatsapp ? { telephone: `+${SITE.whatsapp}` } : {}),
      ...(SITE.profiles.length ? { sameAs: SITE.profiles } : {}),
    },
    {
      "@type": "WebSite",
      "@id": `${SITE.url}/#website`,
      url: SITE.url,
      name: SITE.name,
      inLanguage: "en-IN",
      publisher: { "@id": `${SITE.url}/#organization` },
    },
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
        {/* Runs before first paint: decides the motion mode (URL override, then
            the visitor's stored choice, then full motion) and writes it to <html>
            so CSS and scripts agree. See src/lib/motion.js. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var d=document.documentElement,s=location.search,m=null;if(/[?&]motion=(force|full)(&|$)/.test(s))m='full';else if(/[?&]motion=(calm|lite)(&|$)/.test(s))m='calm';else{try{m=localStorage.getItem('zevo-motion')}catch(e){}}if(m!=='calm')m='full';d.classList.add('motion-ok','motion-'+m)}catch(e){}})()",
          }}
        />
        <JsonLd data={organization} />
        {children}
      </body>
    </html>
  );
}
