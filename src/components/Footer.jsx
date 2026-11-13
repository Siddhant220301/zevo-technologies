"use client";

import { useEffect, useState } from "react";
import ZevoLogoReveal from "@/components/ZevoLogoReveal";
import { setMotionMode, useMotionChoice } from "@/lib/motion";

export default function Footer() {
  const [timeStr, setTimeStr] = useState("00:00:00");
  // "full" | "calm" once the page is running (null while rendering on the server)
  const motion = useMotionChoice();

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
      <div className="footer-inner">
        <ZevoLogoReveal className="footer-logo" />
        <div className="footer-meta">
          <div>© 2026 ZEVO TECHNOLOGIES. INDEPENDENT DIGITAL STUDIO. 100% CLIENT IP OWNED.</div>
          <div id="utcClock">STUDIO TIME // {timeStr} IST (BENGALURU &amp; MUMBAI)</div>
          {/* Full motion is the default; anyone who prefers less can switch it here */}
          {motion && (
            <button
              type="button"
              className="motion-toggle-link"
              aria-pressed={motion === "full"}
              title={motion === "full" ? "Switch to lighter motion" : "Switch to full motion"}
              onClick={() => setMotionMode(motion === "full" ? "calm" : "full")}
            >
              {motion === "full" ? "MOTION: FULL" : "MOTION: LITE"}
            </button>
          )}
        </div>
      </div>
    </footer>
  );
}
