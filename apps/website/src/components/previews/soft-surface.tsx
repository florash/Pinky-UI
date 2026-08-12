"use client";

import type { CSSProperties } from "react";

/**
 * The demo surface, in place of photography.
 *
 * Pinky's whole argument is that depth belongs to the interface — its layers,
 * edges and press states — so a demo that leans on architectural photography is
 * quietly making the opposite case: the picture supplies the richness and the
 * component supplies a frame. These surfaces are blush, cloud, white and the
 * blush→cloud blend, so the only interesting thing in any preview is the
 * interaction.
 *
 * Deterministic by index rather than random, so a given item keeps the same
 * face between renders and across the site.
 */
const SURFACES = [
  "linear-gradient(150deg, var(--color-blush-100), var(--color-blush-200) 55%, var(--color-cloud-100))",
  "linear-gradient(160deg, var(--color-cloud-100), var(--color-cloud-200) 60%, var(--color-white))",
  "linear-gradient(140deg, var(--color-white), var(--color-blush-100) 48%, var(--color-cloud-200))",
  "linear-gradient(170deg, var(--color-blush-50), var(--color-cloud-100) 52%, var(--color-blush-200))",
] as const;

const MEDIA_PALETTES = [
  ["#f7dfe7", "#f7eef3", "#dfeef8"],
  ["#e2f0f8", "#edf6fb", "#ffffff"],
  ["#ffffff", "#f8e7ed", "#dcecf7"],
  ["#fbf0f4", "#e7f1f8", "#f2dce6"],
] as const;

/** Valid image sources for demos whose interaction reveals or magnifies media. */
export const SOFT_MEDIA_SOURCES = MEDIA_PALETTES.map(([start, middle, end]) =>
  `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 520"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${start}"/><stop offset=".55" stop-color="${middle}"/><stop offset="1" stop-color="${end}"/></linearGradient></defs><rect width="800" height="520" fill="url(#g)"/><circle cx="180" cy="140" r="160" fill="#fff" opacity=".3"/><circle cx="670" cy="430" r="220" fill="#fff" opacity=".18"/></svg>`)}`,
);

/** A faint second plane, so a large surface is not one flat wash. */
const VEIL =
  "radial-gradient(120% 90% at 22% 12%, rgba(255,255,255,.85), transparent 58%), radial-gradient(90% 80% at 82% 88%, rgba(255,255,255,.5), transparent 60%)";

export function SoftSurface({
  index = 0,
  className = "h-full w-full",
  label,
  style,
}: {
  index?: number;
  className?: string;
  /** Optional quiet caption rendered inside the surface. */
  label?: string;
  style?: CSSProperties;
}) {
  return (
    <span
      aria-hidden
      className={`relative block overflow-hidden ${className}`}
      style={{ backgroundImage: `${VEIL}, ${SURFACES[index % SURFACES.length]}`, ...style }}
    >
      {label ? (
        <span className="absolute bottom-3 left-3 rounded-pill bg-white/75 px-2.5 py-1 font-mono text-[0.6rem] tracking-[0.1em] text-ink-700 uppercase">
          {label}
        </span>
      ) : null}
    </span>
  );
}
