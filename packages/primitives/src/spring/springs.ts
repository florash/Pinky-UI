/**
 * The Pinky motion vocabulary.
 *
 * Four springs cover everything the library does. Components pick one by name
 * instead of inventing physics, which is what keeps unrelated parts of a page
 * feeling like they belong to the same system — while still leaving room for a
 * component to choose the spring that suits it.
 */
export const springs = {
  /** Calm and settled. Large surfaces, layout-ish movement. */
  soft: { stiffness: 210, damping: 30, mass: 1 },
  /** Follows the pointer closely with a trace of lag. Tracking, indicators. */
  responsive: { stiffness: 320, damping: 32, mass: 0.8 },
  /** Quick, near-critically damped. Buttons and small affordances. */
  snappy: { stiffness: 460, damping: 36, mass: 0.7 },
  /** Visible overshoot. Small distances only, and sparingly. */
  elastic: { stiffness: 280, damping: 16, mass: 0.9 },
} as const;

export type SpringPreset = keyof typeof springs;

export type SpringConfig = {
  stiffness: number;
  damping: number;
  mass: number;
};

/**
 * Blends `soft` toward `elastic` so a component can expose one 0–1
 * `elasticity` knob instead of three physics numbers.
 *
 * The low end stays properly damped — at `elasticity={0}` the surface should
 * settle without a wobble, not merely wobble less.
 */
export function elasticSpring(elasticity: number): SpringConfig {
  const t = Math.min(Math.max(elasticity, 0), 1);
  const lerp = (from: number, to: number) => from + (to - from) * t;

  return {
    stiffness: lerp(springs.soft.stiffness, springs.elastic.stiffness),
    damping: lerp(springs.soft.damping, springs.elastic.damping),
    mass: lerp(springs.soft.mass, springs.elastic.mass),
  };
}
