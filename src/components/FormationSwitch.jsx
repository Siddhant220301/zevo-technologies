"use client";

const MODES = [
  { mode: "dice", short: "01 RAIL", label: "01 DICE RAIL" },
  { mode: "grid", short: "02 VOXEL", label: "02 VOXEL MATRIX" },
  { mode: "ring", short: "03 HELIX", label: "03 DNA HELIX" },
  { mode: "saturn", short: "04 SATURN", label: "04 SATURN RINGS" },
];

// One-tap formation switch for touch layouts: each tap steps the die to its
// next formation. Desktop has the full dock instead.
export default function FormationSwitch({
  activeFormation,
  onFormationChange,
  compact = false,
  tabIndex,
  className = "",
}) {
  const index = Math.max(
    0,
    MODES.findIndex((m) => m.mode === activeFormation)
  );
  const current = MODES[index];

  const cycle = () => {
    // Haptic tick; browsers only allow it after a real touch
    if (navigator.vibrate && navigator.userActivation?.hasBeenActive) navigator.vibrate(8);
    if (onFormationChange) onFormationChange(MODES[(index + 1) % MODES.length].mode);
  };

  return (
    <button
      type="button"
      className={`formation-switch ${className}`}
      tabIndex={tabIndex}
      aria-label={`Die formation: ${current.label}. Tap to change.`}
      onClick={cycle}
    >
      <span
        className="formation-switch-icon"
        style={{ transform: `rotate(${45 + index * 90}deg)` }}
        aria-hidden="true"
      />
      <span className="formation-switch-text">
        <span className="k">ENGINE</span>
        <span className="v">{compact ? current.short : current.label}</span>
      </span>
    </button>
  );
}
