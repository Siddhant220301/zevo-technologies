import ServicePage, { serviceMetadata } from "@/components/ServicePage";

// Custom ERP & Operations Software: content in lib/services.js
const SLUG = "custom-erp-software";

export const metadata = serviceMetadata(SLUG);

export default function Page() {
  return <ServicePage slug={SLUG} />;
}
