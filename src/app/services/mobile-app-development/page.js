import ServicePage, { serviceMetadata } from "@/components/ServicePage";

// Mobile App Development (iOS & Android): content in lib/services.js
const SLUG = "mobile-app-development";

export const metadata = serviceMetadata(SLUG);

export default function Page() {
  return <ServicePage slug={SLUG} />;
}
