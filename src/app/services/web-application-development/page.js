import ServicePage, { serviceMetadata } from "@/components/ServicePage";

// Web Application Development: content in lib/services.js
const SLUG = "web-application-development";

export const metadata = serviceMetadata(SLUG);

export default function Page() {
  return <ServicePage slug={SLUG} />;
}
