import ServicePage, { serviceMetadata } from "@/components/ServicePage";

// Interactive Web & Product Showcases: content in lib/services.js
const SLUG = "interactive-web-experiences";

export const metadata = serviceMetadata(SLUG);

export default function Page() {
  return <ServicePage slug={SLUG} />;
}
