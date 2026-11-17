"use client";

import { useEffect, useState } from "react";
import { getDeviceProfile } from "@/lib/device";
import { getMotionMode } from "@/lib/motion";

// Says when the 3D stage may start. The stage is the heaviest work on a page:
// its code is fetched straight away, and the stage itself starts once the
// headline has risen into place (its last line is 98% home by then), the next
// time the browser is idle. Stays false on devices without WebGL, where the
// page simply shows without the stage.
export function useStageStart() {
  const [stageReady, setStageReady] = useState(false);

  useEffect(() => {
    // CSS reads the device tier to decide between live glass and solid cards
    const { tier } = getDeviceProfile();
    document.documentElement.dataset.tier = String(tier);
    // Tier 0 = no WebGL
    if (tier === 0) return undefined;

    // Download and prepare the 3D code while the page arrives
    import("@/components/WebGLStage").catch(() => {});

    let idleId = 0;
    const start = () => setStageReady(true);
    const startAtMs = getMotionMode() === "calm" ? 300 : 900;
    const timer = window.setTimeout(() => {
      if ("requestIdleCallback" in window) {
        idleId = window.requestIdleCallback(start, { timeout: 200 });
      } else {
        start();
      }
    }, Math.max(0, startAtMs - performance.now()));
    return () => {
      window.clearTimeout(timer);
      if (idleId) window.cancelIdleCallback(idleId);
    };
  }, []);

  return stageReady;
}
