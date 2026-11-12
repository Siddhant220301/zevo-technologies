import { useSyncExternalStore } from "react";

// Motion mode for this visit.
//   "full"  every animation.
//   "calm"  the default when the system asks for reduced motion: entrances are
//           short fades, the page scrolls natively, cards do not tilt and
//           strips that move on their own stand still.
// The inline script in app/layout.js decides the mode before first paint (URL
// override, then a stored choice, then the system setting) and writes it to
// <html> as a class, so CSS and scripts always agree.
const STORAGE_KEY = "zevo-motion";

export function getMotionMode() {
  if (typeof document === "undefined") return "full";
  return document.documentElement.classList.contains("motion-calm") ? "calm" : "full";
}

export function systemPrefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

// The switch is offered only to visitors it concerns: their system asks for
// reduced motion, or they have already chosen a mode here
function motionChoiceAvailable() {
  if (typeof window === "undefined") return false;
  if (systemPrefersReducedMotion()) return true;
  try {
    return window.localStorage.getItem(STORAGE_KEY) !== null;
  } catch {
    return false;
  }
}

// Stores the choice and reloads, so every component starts in the new mode
export function setMotionMode(mode) {
  let stored = true;
  try {
    window.localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    stored = false;
  }
  const url = new URL(window.location.href);
  if (!stored) {
    // Storage is blocked (private mode): carry the choice in the address instead
    url.searchParams.set("motion", mode);
    window.location.replace(url.toString());
  } else if (url.searchParams.has("motion")) {
    // A stale override in the address would win over the stored choice
    url.searchParams.delete("motion");
    window.location.replace(url.toString());
  } else {
    window.location.reload();
  }
}

const subscribeNever = () => () => {};
const readChoice = () => (motionChoiceAvailable() ? getMotionMode() : null);
const readChoiceOnServer = () => null;

// "full" | "calm" when the visitor should see the motion switch, otherwise null
export function useMotionChoice() {
  return useSyncExternalStore(subscribeNever, readChoice, readChoiceOnServer);
}
