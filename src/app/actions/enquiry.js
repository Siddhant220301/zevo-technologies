"use server";

import { SITE } from "@/lib/site";
import { checkEnquiry, enquiryLines, enquirySubject, findEmail } from "@/lib/enquiry";

// A person needs longer than this between the page opening and pressing send
const MIN_FILL_MS = 3000;
const SEND_TIMEOUT_MS = 8000;

// Until the sending domain is verified with the mail service, only its own
// test sender may be used. Set ENQUIRY_FROM once the domain is verified.
const DEFAULT_FROM = "Zevo Enquiries <onboarding@resend.dev>";

// Sends an enquiry from the contact form to the studio inbox.
//
// Anyone can POST to a server action, so nothing from the browser is trusted:
// every field is cleaned and checked again here, and the reply only ever says
// what the form needs to show.
//   { ok: true }                              the email was accepted for delivery
//   { ok: false, code: "invalid", errors }    a field needs fixing
//   { ok: false, code: "unavailable" }        not sent: the form then offers
//                                             WhatsApp and email instead
// It never reports success for something that was not sent.
export async function submitEnquiry(input) {
  const data = input && typeof input === "object" ? input : {};

  // Automated senders fill the hidden field, or submit the instant the page
  // loads. They are turned away like any other failure, so a real visitor who
  // somehow trips this still gets the direct WhatsApp and email options.
  if (typeof data.website === "string" && data.website.trim() !== "") {
    return { ok: false, code: "unavailable" };
  }
  const startedAt = Number(data.startedAt);
  if (Number.isFinite(startedAt) && startedAt > 0 && Date.now() - startedAt < MIN_FILL_MS) {
    return { ok: false, code: "unavailable" };
  }

  const { values, errors } = checkEnquiry(data);
  if (Object.keys(errors).length > 0) return { ok: false, code: "invalid", errors };

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, code: "unavailable" };

  const message = {
    from: process.env.ENQUIRY_FROM || DEFAULT_FROM,
    to: [process.env.ENQUIRY_TO || SITE.email],
    subject: enquirySubject(values),
    text: [
      "New enquiry from the website form.",
      "",
      ...enquiryLines(values),
      "",
      "--",
      "Sent from the enquiry form on zevotechnologies.com",
    ].join("\n"),
  };
  // Replying to the notification then goes straight to the visitor
  const replyTo = findEmail(values.contact);
  if (replyTo) message.reply_to = replyTo;

  try {
    const response = await fetch(process.env.RESEND_API_URL || "https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify(message),
      signal: AbortSignal.timeout(SEND_TIMEOUT_MS),
    });
    if (!response.ok) {
      // Logged for the site owner (hosting logs). Visitor details are not logged.
      const detail = (await response.text()).slice(0, 300);
      console.error(`[enquiry] mail service refused the message: ${response.status} ${detail}`);
      return { ok: false, code: "unavailable" };
    }
    return { ok: true };
  } catch (error) {
    console.error(`[enquiry] could not reach the mail service: ${error && error.name ? error.name : "error"}`);
    return { ok: false, code: "unavailable" };
  }
}
