"use client";

import { useState } from "react";

// An accordion of questions. Every answer is in the page for search engines
// and screen readers; a closed one is only folded away.
export default function FaqList({ items, idPrefix = "faq" }) {
  // Index of the open question (-1 = all closed)
  const [open, setOpen] = useState(0);

  return (
    <div className="faq-list interactive-zone">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q} className={`faq-item ${isOpen ? "is-open" : ""}`}>
            <h3 className="faq-heading">
              <button
                type="button"
                className="faq-question"
                id={`${idPrefix}-q-${i}`}
                aria-expanded={isOpen}
                aria-controls={`${idPrefix}-a-${i}`}
                data-cursor={isOpen ? "CLOSE" : "OPEN"}
                onClick={() => setOpen(isOpen ? -1 : i)}
              >
                <span className="faq-index">{String(i + 1).padStart(2, "0")}</span>
                <span className="faq-text">{item.q}</span>
                <span className="faq-toggle" aria-hidden="true" />
              </button>
            </h3>
            <div
              className="faq-answer"
              id={`${idPrefix}-a-${i}`}
              role="region"
              aria-labelledby={`${idPrefix}-q-${i}`}
            >
              <div>
                <p>{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
