import FaqList from "@/components/FaqList";
import { FAQS } from "@/lib/faq";

// Questions and answers before the enquiry form
export default function FaqSection() {
  return (
    <section className="section-wrap content-grid" id="faq">
      <div className="section-header-left">
        <span className="section-tag">{"// 07 — QUESTIONS"}</span>
        <h2 className="section-title">
          Questions, <em>answered</em>.
        </h2>
        <p className="section-subtext">
          What most teams want to know before starting a custom software project with us.
        </p>
      </div>

      <FaqList items={FAQS} />
    </section>
  );
}
