// Business details. Every link, button, page title and search-engine record on
// the site reads them from here, so there is one place to change them.
export const SITE = {
  name: "Zevo Technologies",
  url: "https://www.zevotechnologies.com",
  email: "info@zevotechnologies.com",

  // WhatsApp number in international format: digits only, no "+", no spaces
  // (for example "919876543210"). While this is empty, no WhatsApp button or
  // link is shown anywhere on the site.
  whatsapp: "",

  // Shown in search results and link previews
  title: "Custom Software, ERP & Web App Development",
  description:
    "Zevo Technologies is a custom software studio in Bengaluru and Mumbai. We build ERP systems, web apps, WhatsApp automations and mobile apps that you fully own.",

  // The cities the studio works from
  locations: [
    { city: "Bengaluru", region: "Karnataka" },
    { city: "Mumbai", region: "Maharashtra" },
  ],

  // Public profiles (LinkedIn, Instagram, Clutch ...). Full addresses, one per
  // entry. They are published to search engines as the same business.
  profiles: [],

  // The code Google Search Console gives for the "HTML tag" method (only the
  // content value). While empty, no verification tag is added.
  googleVerification: "",
};
