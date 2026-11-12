import HomeClient from "@/components/HomeClient";
import EnterpriseMarquee from "@/components/EnterpriseMarquee";
import AboutSection from "@/components/AboutSection";
import MissionSection from "@/components/MissionSection";
import CaseStudiesSection from "@/components/CaseStudiesSection";

// Server component: the static sections are rendered here and handed to the
// interactive shell, so they ship as HTML without client-side JavaScript.
export default function Home() {
  return (
    <HomeClient
      marquee={<EnterpriseMarquee />}
      about={<AboutSection />}
      mission={<MissionSection />}
      cases={<CaseStudiesSection />}
    />
  );
}
