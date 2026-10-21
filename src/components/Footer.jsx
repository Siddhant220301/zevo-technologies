"use client";

import { useEffect, useState } from "react";

export default function Footer() {
  const [timeStr, setTimeStr] = useState("00:00:00");

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const str = now.toLocaleTimeString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour12: false,
      });
      setTimeStr(str);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="interactive-zone">
      <div className="footer-brand">ZEVO TECHNOLOGIES</div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px",
          fontFamily: "var(--font-mono)",
          fontSize: "0.75rem",
          color: "var(--ink-muted)",
        }}
      >
        <div>© 2026 ZEVO TECHNOLOGIES. INDEPENDENT DIGITAL STUDIO. 100% CLIENT IP OWNED.</div>
        <div id="utcClock">STUDIO TIME // {timeStr} IST (BENGALURU &amp; MUMBAI)</div>
      </div>
    </footer>
  );
}
