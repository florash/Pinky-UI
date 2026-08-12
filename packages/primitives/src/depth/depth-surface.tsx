"use client";

import { forwardRef, type CSSProperties, type ElementType, type ReactNode } from "react";

/**
 * The five ways a Pinky surface can sit relative to the plane it lives on.
 *
 * These are semantic, not stylistic. A component asks for "raised" and gets
 * whatever the system currently thinks raised means — which is the only way a
 * depth language survives more than one milestone. The alternative is what the
 * library does today: sixty-four hand-written `shadow-soft` classes and no way
 * to say "inset" at all.
 */
export type SurfaceLevel = "flat" | "raised" | "floating" | "inset" | "pressed";

/** How far above the plane a raised surface sits. Ignored by flat/inset/pressed. */
export type DepthStep = "sm" | "md" | "lg";

const RAISED: Record<DepthStep, string> = {
  sm: "var(--depth-raised-sm)",
  md: "var(--depth-raised-md)",
  lg: "var(--depth-raised-lg)",
};

const LIFT: Record<DepthStep, string> = {
  sm: "var(--lift-sm)",
  md: "var(--lift-md)",
  lg: "var(--lift-lg)",
};

/**
 * The composed box-shadow for a surface level.
 *
 * `edge` adds the 1px catch of light along the top. It is deliberately opt-in:
 * on a surface that sits below the plane it would read as a seam rather than a
 * highlight.
 */
export function surfaceShadow(level: SurfaceLevel, depth: DepthStep = "md", edge = false): string {
  const base =
    level === "flat"
      ? "var(--depth-flat)"
      : level === "raised"
        ? RAISED[depth]
        : level === "floating"
          ? "var(--depth-floating)"
          : level === "inset"
            ? "var(--depth-inset)"
            : "var(--depth-pressed)";

  const wantsEdge = edge && (level === "raised" || level === "floating");
  return wantsEdge ? `${base}, var(--edge-light)` : base;
}

/** The travel a surface uses when it lifts. Inset surfaces travel back toward flush. */
export function surfaceLift(depth: DepthStep = "md"): string {
  return LIFT[depth];
}

export type DepthSurfaceProps = {
  children?: ReactNode;
  surface?: SurfaceLevel;
  depth?: DepthStep;
  /** Adds the top-edge light. Only meaningful on raised and floating surfaces. */
  edge?: boolean;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
};

/**
 * A surface at a named depth.
 *
 * Intentionally does not own hover or press: those belong to the component,
 * because a button whose layers separate on hover and a button whose extrusion
 * collapses on press are different ideas and must not be flattened into one
 * shared animation. This renders the resting material; the component supplies
 * the behaviour.
 */
export const DepthSurface = forwardRef<HTMLElement, DepthSurfaceProps>(function DepthSurface(
  { children, surface = "flat", depth = "md", edge = false, as: Tag = "div", className, style },
  ref,
) {
  return (
    <Tag
      ref={ref}
      className={className}
      style={{ boxShadow: surfaceShadow(surface, depth, edge), ...style }}
    >
      {children}
    </Tag>
  );
});
