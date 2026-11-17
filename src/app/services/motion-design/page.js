import ServicePage, { serviceMetadata } from "@/components/ServicePage";

// Motion Design & Visual Assets: content in lib/services.js
const SLUG = "motion-design";

export const metadata = serviceMetadata(SLUG);

export default function Page() {
  return <ServicePage slug={SLUG} />;
}
