import HomeClient from "@/components/HomeClient";
import EnterpriseMarquee from "@/components/EnterpriseMarquee";
import AboutSection from "@/components/AboutSection";
import MissionSection from "@/components/MissionSection";
import CaseStudiesSection from "@/components/CaseStudiesSection";
import JsonLd from "@/components/JsonLd";
import { FAQS } from "@/lib/faq";

export const metadata = {
  alternates: { canonical: "/" },
};

// The questions on this page, for search engines
const faqData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: { "@type": "Answer", text: faq.a },
  })),
};

// Server component: the static sections are rendered here and handed to the
// interactive shell, so they ship as HTML without client-side JavaScript.
export default function Home() {
  // True once a mail service key is set for the deployment: the enquiry form
  // then sends by itself. Without it the form hands the finished brief to
  // WhatsApp or to an email app instead (see ContactSection).
  const canSendFromSite = Boolean(process.env.RESEND_API_KEY);

  return (
    <>
      <JsonLd data={faqData} />
      <HomeClient
        canSendFromSite={canSendFromSite}
        marquee={<EnterpriseMarquee />}
        about={<AboutSection />}
        mission={<MissionSection />}
        cases={<CaseStudiesSection />}
      />
    </>
  );
}
