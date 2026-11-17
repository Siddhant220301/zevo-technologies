import { SITE } from "@/lib/site";

// What the studio builds, as the enquiry form offers it. `face` is the matching
// face of the 3D die (the same order as the capability list).
export const SERVICES = [
  { id: "erp", label: "Custom ERP", face: 0 },
  { id: "interactive", label: "Interactive Web", face: 1 },
  { id: "automation", label: "WhatsApp Automation", face: 2 },
  { id: "motion", label: "Motion Design", face: 3 },
  { id: "webapp", label: "Web App", face: 4 },
  { id: "mobile", label: "Mobile App", face: 5 },
];

export const LIMITS = { name: 120, contact: 160, brief: 4000 };

const EMAIL_PATTERN = /^[^\s@,;<>()]+@[^\s@,;<>()]+\.[^\s@,;<>()]{2,}$/;
const EMAIL_IN_TEXT = /[^\s@,;<>()]+@[^\s@,;<>()]+\.[^\s@,;<>()]{2,}/;

// The email address inside what the visitor typed, if there is one. The field
// takes "email or phone", and people often give both.
export function findEmail(text) {
  const match = typeof text === "string" ? text.match(EMAIL_IN_TEXT) : null;
  if (!match) return null;
  const email = match[0].replace(/[.]+$/, "");
  return EMAIL_PATTERN.test(email) ? email : null;
}

// A phone number is in there when 7 to 15 digits remain once everything else is set aside
export function hasPhone(text) {
  const digits = (typeof text === "string" ? text : "").replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15;
}

const CONTROL_CHARACTERS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

const oneLine = (value, max) =>
  (typeof value === "string" ? value : "")
    .replace(CONTROL_CHARACTERS, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);

// Cleans what was typed and says what still needs fixing. The form runs it
// before sending; the server runs it again and trusts only its own result.
export function checkEnquiry(input) {
  const source = input && typeof input === "object" ? input : {};
  const chosen = Array.isArray(source.services) ? source.services : [];
  const values = {
    name: oneLine(source.name, LIMITS.name),
    contact: oneLine(source.contact, LIMITS.contact),
    brief: (typeof source.brief === "string" ? source.brief : "")
      .replace(/\r\n?/g, "\n")
      .replace(CONTROL_CHARACTERS, "")
      .trim()
      .slice(0, LIMITS.brief),
    services: SERVICES.filter((service) => chosen.includes(service.id)).map((service) => service.id),
  };

  const errors = {};
  if (values.name.length < 2) errors.name = "Please tell us your name.";
  if (!values.contact) {
    errors.contact = "Please add an email address or a phone number.";
  } else if (!findEmail(values.contact) && !hasPhone(values.contact)) {
    errors.contact = "That does not look like an email address or a phone number.";
  }
  return { values, errors };
}

// The enquiry as plain lines of text (expects values that checkEnquiry cleaned)
export function enquiryLines(values) {
  const wanted = SERVICES.filter((service) => values.services.includes(service.id)).map(
    (service) => service.label
  );
  const lines = [`Name: ${values.name}`, `Contact: ${values.contact}`];
  if (wanted.length) lines.push(`Looking for: ${wanted.join(", ")}`);
  if (values.brief) lines.push("", values.brief);
  return lines;
}

// The message a visitor sends directly, pre-filled in WhatsApp or their email app
export function composeEnquiry(values) {
  return [`Hi ${SITE.name}, I would like to discuss a project.`, "", ...enquiryLines(values)].join("\n");
}

export const enquirySubject = (values) => `Project enquiry: ${values.name}`;

// null while no WhatsApp number is set
export function whatsappLink(text) {
  return SITE.whatsapp ? `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}` : null;
}

export function mailtoLink(subject, body) {
  return `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
