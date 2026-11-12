const ITEMS = [
  "CUSTOM OPERATIONS TOOLS",
  "INTERACTIVE DIGITAL EXPERIENCES",
  "FAST NEXT.JS WEB APPLICATIONS",
  "WHATSAPP & WORKFLOW AUTOMATIONS",
  "GST INVOICING & E-WAY BILLS",
  "100% CLIENT SOURCE CODE OWNERSHIP",
  "ZERO RECURRING SEAT FEES",
];

// Seamless ticker: the full list is rendered twice, so the -50% shift in the
// marquee-drift keyframes lands exactly on the seam and the loop never jumps.
export default function EnterpriseMarquee() {
  return (
    <div className="enterprise-marquee-wrap">
      <div className="marquee-track">
        {[0, 1].map((copy) =>
          ITEMS.map((item) => (
            <span key={`${copy}-${item}`} className="marquee-item" aria-hidden={copy === 1}>
              <span>{item}</span>
              <span className="bullet">{"///"}</span>
            </span>
          ))
        )}
      </div>
    </div>
  );
}
