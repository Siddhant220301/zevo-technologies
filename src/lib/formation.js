// One die formation per visit. A first visit opens on Dice Rail; every reload
// or return visit moves on to the next one, so the same formation never shows
// twice in a row. The browser remembers the last one shown (localStorage).
//
// QA: ?formation=dice|grid|helix|saturn forces one without moving the rotation on.
export const FORMATION_ORDER = ["dice", "grid", "helix", "saturn"];

const STORAGE_KEY = "zevo-formation";

// Decided once per page load, so a component that mounts twice still gets the same answer
let chosen = null;

export function pickVisitFormation() {
  if (chosen) return chosen;
  if (typeof window === "undefined") return FORMATION_ORDER[0];

  const forced = new URLSearchParams(window.location.search).get("formation");
  if (FORMATION_ORDER.includes(forced)) {
    chosen = forced;
    return chosen;
  }

  let next = FORMATION_ORDER[0];
  try {
    const last = window.localStorage.getItem(STORAGE_KEY);
    const index = FORMATION_ORDER.indexOf(last);
    if (index !== -1) next = FORMATION_ORDER[(index + 1) % FORMATION_ORDER.length];
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // Storage is blocked (private browsing): every visit counts as a first visit
  }
  chosen = next;
  return chosen;
}
