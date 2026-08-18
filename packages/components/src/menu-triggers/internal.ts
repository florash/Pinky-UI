"use client";

import { useMotionEnabled } from "@pinky-ui/primitives";
import { useCallback, useState } from "react";

export { DISABLED, FOCUS_RING, useEngagement } from "../buttons/tactile/internal";

export type MenuTriggerBase = {
  /** Controlled open state. Omit for uncontrolled. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** id of the surface this trigger controls, for `aria-controls`. */
  controls?: string;
  label?: string;
  closeLabel?: string;
  disabled?: boolean;
  className?: string;
};

/**
 * Open state plus the semantics every menu trigger owes the platform.
 *
 * Kept as a hook rather than a base component on purpose: these eight triggers
 * share their state machine and their accessibility contract, and share nothing
 * else. A common wrapper component would have had to own the markup, and the
 * markup is exactly where they differ — a bracket frame, two independent rails
 * and a recessed chamber cannot be one element tree with a variant prop.
 */
export function useMenuTrigger({
  open,
  defaultOpen = false,
  onOpenChange,
  controls,
  label = "Menu",
  closeLabel = "Close menu",
  disabled,
}: MenuTriggerBase) {
  const [internal, setInternal] = useState(defaultOpen);
  const isOpen = open ?? internal;
  const motionEnabled = useMotionEnabled();

  const toggle = useCallback(() => {
    const next = !isOpen;
    if (open === undefined) setInternal(next);
    onOpenChange?.(next);
  }, [isOpen, onOpenChange, open]);

  /**
   * Space and Enter come free with a real `<button>`; nothing here re-implements
   * them. What this does supply is the expanded/controls pair, so the trigger
   * announces the surface it owns rather than only its own label.
   */
  const buttonProps = {
    type: "button" as const,
    "aria-expanded": isOpen,
    "aria-controls": controls,
    "aria-label": isOpen ? closeLabel : label,
    disabled,
    onClick: toggle,
  };

  /**
   * Reduced motion resolves state instantly instead of suppressing it: the
   * lines still travel to their open geometry, they simply arrive. The trigger
   * must never stop reporting whether the menu is open.
   */
  const spring = motionEnabled
    ? { type: "spring" as const, stiffness: 420, damping: 34, mass: 0.8 }
    : { duration: 0 };

  return { isOpen, toggle, buttonProps, spring, motionEnabled };
}

/** The shared line. Every trigger draws its own, but they agree on weight. */
export const LINE_H = 1.5;
export const lineClass = "absolute left-1/2 block rounded-pill bg-ink-900";
