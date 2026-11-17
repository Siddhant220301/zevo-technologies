"use client";

import { useEffect, useRef, useState, useSyncExternalStore, useTransition } from "react";
import { submitEnquiry } from "@/app/actions/enquiry";
import { SITE } from "@/lib/site";
import {
  SERVICES,
  LIMITS,
  checkEnquiry,
  composeEnquiry,
  enquirySubject,
  whatsappLink,
  mailtoLink,
} from "@/lib/enquiry";

const EMPTY = { name: "", contact: "", brief: "" };

// A service page links to the form with ?need=<chip>, so that chip arrives
// picked. The address is read once the page runs in the browser.
const subscribeToNothing = () => () => {};
const readNeed = () => new URLSearchParams(window.location.search).get("need");
const noNeed = () => null;

// Follows a link the way a click on it would: a new tab for WhatsApp, the
// visitor's own email app for a mailto address
function followLink(href, newTab) {
  const link = document.createElement("a");
  link.href = href;
  if (newTab) {
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  }
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

// The enquiry form. `canSendFromSite` is true once a mail service is connected
// to the deployment: the form then sends the enquiry itself. Until then, and
// whenever sending fails, it hands the finished brief to WhatsApp or to the
// visitor's email app. It never says an enquiry was sent when it was not.
export default function ContactSection({ onSelectFace, canSendFromSite = false }) {
  const [values, setValues] = useState(EMPTY);
  const need = useSyncExternalStore(subscribeToNothing, readNeed, noNeed);
  // null until the visitor touches a chip; until then the address decides
  const [picked, setPicked] = useState(null);
  const services = picked || (SERVICES.some((service) => service.id === need) ? [need] : []);
  const [errors, setErrors] = useState({});
  // null, or { kind: "ok" | "error" | "info", text, links } where `links` are
  // the direct-send buttons for a finished brief
  const [notice, setNotice] = useState(null);
  const [pending, startTransition] = useTransition();
  const nameRef = useRef(null);
  const contactRef = useRef(null);
  const trapRef = useRef(null);
  const openedAtRef = useRef(0);

  useEffect(() => {
    openedAtRef.current = Date.now();
  }, []);

  const quickChat = whatsappLink(`Hi ${SITE.name}, we want to discuss a project.`);

  const setField = (key) => (e) => {
    const value = e.target.value;
    setValues((current) => ({ ...current, [key]: value }));
    if (errors[key]) {
      setErrors((current) => {
        const next = { ...current };
        delete next[key];
        return next;
      });
    }
    if (notice) setNotice(null);
  };

  const toggleService = (service) => {
    const turningOn = !services.includes(service.id);
    setPicked(turningOn ? [...services, service.id] : services.filter((id) => id !== service.id));
    if (notice) setNotice(null);
    // The die turns to the face of whatever was just picked
    if (turningOn && onSelectFace) onSelectFace(service.face);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pending) return;

    const input = {
      ...values,
      services,
      website: trapRef.current ? trapRef.current.value : "",
      startedAt: openedAtRef.current,
    };
    const checked = checkEnquiry(input);
    if (Object.keys(checked.errors).length > 0) {
      setErrors(checked.errors);
      setNotice(null);
      const firstInvalid = checked.errors.name ? nameRef.current : contactRef.current;
      if (firstInvalid) firstInvalid.focus();
      return;
    }
    setErrors({});

    const brief = composeEnquiry(checked.values);
    const links = {
      whatsapp: whatsappLink(brief),
      email: mailtoLink(enquirySubject(checked.values), brief),
    };

    if (!canSendFromSite) {
      // No mail service is connected: the finished brief goes to WhatsApp, or
      // to the visitor's own email app
      if (links.whatsapp) followLink(links.whatsapp, true);
      else followLink(links.email, false);
      setNotice({
        kind: "info",
        text: links.whatsapp
          ? "WhatsApp is opening with your brief. Press send there and we will reply within 24 hours."
          : `Your email app is opening with your brief. Press send there and we will reply within 24 hours. Nothing opened? Write to ${SITE.email}.`,
        links,
      });
      return;
    }

    startTransition(async () => {
      let result = null;
      try {
        result = await submitEnquiry(input);
      } catch {
        // Offline, or this page is older than the live site: treated as not sent
        result = null;
      }
      if (result && result.ok) {
        setValues(EMPTY);
        setPicked([]);
        setNotice({ kind: "ok", text: "Your inquiry is with us. We reply within 24 hours." });
      } else if (result && result.code === "invalid") {
        setErrors(result.errors || {});
        setNotice(null);
      } else {
        setNotice({
          kind: "error",
          text: "We could not send this from the site just now. Your brief is ready: send it to us directly.",
          links,
        });
      }
    });
  };

  const sent = notice !== null && notice.kind === "ok";
  let buttonLabel = "SUBMIT INQUIRY";
  if (!canSendFromSite) buttonLabel = quickChat ? "SEND ON WHATSAPP" : "SEND BY EMAIL";
  else if (pending) buttonLabel = "DISPATCHING BRIEF...";
  else if (sent) buttonLabel = "✔ INQUIRY TRANSMITTED // TALK SOON";

  return (
    <section className="section-wrap content-grid" id="contact">
      <div className="contact-info-col">
        <span className="section-tag">{"// 08 — GET IN TOUCH"}</span>
        <h2 className="section-title">
          Let&apos;s discuss your <em>project</em>.
        </h2>
        <p className="section-subtext">
          When you get in touch, you talk directly with the engineers and product designers who will
          architect and build your product. We share an initial scope breakdown and milestone estimate
          within 24 hours.
        </p>
        <div className="contact-meta">
          <div>
            <strong>STUDIO LOCATIONS:</strong>
          </div>
          <div className="muted">• BENGALURU // Karnataka</div>
          <div className="muted">• MUMBAI // Maharashtra</div>
          <div className="contact-email-row">
            DIRECT EMAIL: <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
          </div>
        </div>

        {quickChat && (
          <a
            href={quickChat}
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-quick-btn"
            data-cursor="WHATSAPP"
          >
            <span>💬 QUICK CHAT ON WHATSAPP</span>
            <span>→</span>
          </a>
        )}
      </div>

      <div className="contact-form-col interactive-zone tilt-card">
        <form id="zevoIntakeForm" onSubmit={handleSubmit} noValidate>
          <fieldset className="service-field">
            <legend>01 // WHAT DO YOU NEED?</legend>
            <div className="service-chips">
              {SERVICES.map((service) => {
                const on = services.includes(service.id);
                return (
                  <label
                    key={service.id}
                    className={`service-chip ${on ? "is-on" : ""}`}
                    data-cursor="SELECT"
                  >
                    <input
                      type="checkbox"
                      name="services"
                      value={service.id}
                      checked={on}
                      onChange={() => toggleService(service)}
                    />
                    <span>{service.label}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div className="form-group">
            <label htmlFor="fName">02 // YOUR NAME &amp; ORGANIZATION *</label>
            <input
              ref={nameRef}
              type="text"
              id="fName"
              name="name"
              className="form-input"
              required
              maxLength={LIMITS.name}
              autoComplete="name"
              placeholder="Rohan Sharma — Founder / Operations"
              value={values.name}
              onChange={setField("name")}
              aria-invalid={errors.name ? "true" : undefined}
              aria-describedby={errors.name ? "fNameError" : undefined}
            />
            {errors.name && (
              <span className="form-field-error" id="fNameError">
                {errors.name}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="fEmail">03 // WORK EMAIL OR PHONE *</label>
            <input
              ref={contactRef}
              type="text"
              id="fEmail"
              name="contact"
              className="form-input"
              required
              maxLength={LIMITS.contact}
              autoComplete="email"
              autoCapitalize="none"
              spellCheck={false}
              placeholder="rohan@company.com or +91 98200 ..."
              value={values.contact}
              onChange={setField("contact")}
              aria-invalid={errors.contact ? "true" : undefined}
              aria-describedby={errors.contact ? "fEmailError" : undefined}
            />
            {errors.contact && (
              <span className="form-field-error" id="fEmailError">
                {errors.contact}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="fScope">04 // PROJECT SCOPE OR BRIEF (OPTIONAL)</label>
            <textarea
              id="fScope"
              name="brief"
              rows={3}
              className="form-input"
              maxLength={LIMITS.brief}
              placeholder="Tell us what you'd like to build or replace (e.g. Custom Operations Tool, Interactive Web Application, WhatsApp Workflow)..."
              value={values.brief}
              onChange={setField("brief")}
            />
          </div>

          {/* Left empty by people (it is off screen); automated senders fill it in */}
          <div className="hp-field" aria-hidden="true">
            <label htmlFor="fRefCode">Leave this field empty</label>
            <input
              ref={trapRef}
              type="text"
              id="fRefCode"
              name="ref_code"
              tabIndex={-1}
              autoComplete="off"
              defaultValue=""
            />
          </div>

          <button
            type="submit"
            className="btn-action-primary"
            style={{
              width: "100%",
              justifyContent: "space-between",
              background: sent ? "#10B981" : "",
            }}
            data-cursor="TRANSMIT"
            disabled={pending}
          >
            <span id="submitBtnText">{buttonLabel}</span>
            <span>↗</span>
          </button>

          <div aria-live="polite">
            {notice && (
              <p className="form-status" data-kind={notice.kind}>
                {notice.text}
              </p>
            )}
            {notice && notice.links && (
              <div className="form-fallback-row">
                {notice.links.whatsapp && (
                  <a
                    href={notice.links.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="whatsapp-quick-btn"
                  >
                    <span>SEND ON WHATSAPP</span>
                    <span>→</span>
                  </a>
                )}
                <a href={notice.links.email} className="btn-action-secondary">
                  <span>SEND BY EMAIL</span>
                </a>
              </div>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
