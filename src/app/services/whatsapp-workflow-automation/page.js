import ServicePage, { serviceMetadata } from "@/components/ServicePage";

// WhatsApp & Workflow Automation: content in lib/services.js
const SLUG = "whatsapp-workflow-automation";

export const metadata = serviceMetadata(SLUG);

export default function Page() {
  return <ServicePage slug={SLUG} />;
}
