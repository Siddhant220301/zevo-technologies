import { useSyncExternalStore } from "react";

// Motion mode for this visit.
//   "full"  the default for everyone: every animation.
//   "calm"  chosen by the visitor (the MOTION switch in the footer and the
//           phone menu): entrances are short fades, the page scrolls natively,
//           cards do not tilt and strips that move on their own stand still.
// The inline script in app/layout.js decides the mode before first paint (URL
// override, then the stored choice, then "full") and writes it to <html> as a
// class, so CSS and scripts always agree.
const STORAGE_KEY = "zevo-motion";

export function getMotionMode() {
  if (typeof document === "undefined") return "full";
  return document.documentElement.classList.contains("motion-calm") ? "calm" : "full";
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
const readMode = () => getMotionMode();
const readModeOnServer = () => null;

// "full" | "calm" in the browser, null while rendering on the server, so the
// switch appears only once the page knows which mode it is in
export function useMotionChoice() {
  return useSyncExternalStore(subscribeNever, readMode, readModeOnServer);
}
