/**
 * Deterministic pseudo-randomness for scattered layouts.
 *
 * A photo wall wants to look unplanned, but `Math.random()` would place things
 * differently on the server and the client, which React would report as a
 * hydration mismatch — and every re-render would reshuffle the wall. Hashing
 * the index gives the same scatter everywhere, forever.
 */
function hash(seed: number, salt: number): number {
  let value = Math.imul(seed + salt * 0x9e3779b9, 0x85ebca6b);
  value ^= value >>> 13;
  value = Math.imul(value, 0xc2b2ae35);
  value ^= value >>> 16;
  // Map to 0…1.
  return (value >>> 0) / 4294967295;
}

/** A stable number in -1…1 for `index`, varying by `salt`. */
export function signedNoise(index: number, salt = 0): number {
  return hash(index, salt) * 2 - 1;
}

export type ScatterOptions = {
  /** Maximum rotation in degrees, applied in both directions. */
  rotation?: number;
  /** Maximum offset as a fraction of the item's own size. */
  offset?: number;
  /** Change to reshuffle the whole arrangement. */
  seed?: number;
};

export type ScatterTransform = {
  rotate: number;
  x: number;
  y: number;
};

/**
 * The resting transform for one item in a scattered arrangement.
 *
 * Offsets are returned as percentages so they scale with the item rather than
 * with the viewport.
 */
export function scatterAt(index: number, options: ScatterOptions = {}): ScatterTransform {
  const { rotation = 6, offset = 0.06, seed = 0 } = options;
  const base = index + seed * 101;

  return {
    rotate: signedNoise(base, 1) * rotation,
    x: signedNoise(base, 2) * offset * 100,
    y: signedNoise(base, 3) * offset * 100,
  };
}
