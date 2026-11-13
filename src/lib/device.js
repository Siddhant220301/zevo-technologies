import { getMotionMode } from "@/lib/motion";

// Capability tiers decide how much visual work a device is asked to do.
// 3 high · 2 mid · 1 low · 0 static (no WebGL / reduced motion)
let cached = null;

export function getDeviceProfile() {
  if (cached) return cached;
  if (typeof window === "undefined") {
    return { tier: 2, coarse: false, reducedMotion: false, maxDpr: 1.5 };
  }

  const coarse = window.matchMedia("(pointer: coarse)").matches;
  // "calm" = the visitor switched to lighter motion (see lib/motion.js)
  const reducedMotion = getMotionMode() === "calm";
  const saveData = Boolean(navigator.connection && navigator.connection.saveData);
  const memory = navigator.deviceMemory || 8;
  const cores = navigator.hardwareConcurrency || 8;

  let webgl = false;
  try {
    const probe = document.createElement("canvas");
    webgl = Boolean(probe.getContext("webgl2") || probe.getContext("webgl"));
  } catch {
    webgl = false;
  }

  let tier = 3;
  if (coarse || memory <= 8 || cores <= 6) tier = 2;
  if (memory <= 4 || cores <= 4 || saveData) tier = 1;
  if (!webgl) tier = 0;

  // QA override: ?quality=0..3
  const forced = new URLSearchParams(window.location.search).get("quality");
  if (forced !== null && /^[0-3]$/.test(forced)) tier = Number(forced);

  const maxDpr = tier >= 3 ? 2 : tier === 2 ? 1.5 : 1;
  cached = { tier, coarse, reducedMotion, maxDpr };
  return cached;
}
