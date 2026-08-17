export type HapticPattern = "light" | "medium" | "success" | "warning";

const PATTERNS: Record<HapticPattern, number | number[]> = {
  light: 10,
  medium: 20,
  success: [10, 40, 10],
  warning: [20, 40, 20, 40, 20],
};

/**
 * Best-effort haptic tick through the Vibration API. Silently does nothing
 * where it's unavailable — notably iOS Safari, which has no public haptics
 * API for the web at all. Never call this from code the interaction depends
 * on; it is a bonus signal, not a channel anything relies on.
 */
export function triggerHaptic(pattern: HapticPattern = "light") {
  if (typeof navigator === "undefined" || typeof navigator.vibrate !== "function") return;
  navigator.vibrate(PATTERNS[pattern]);
}
