"use client";

import { useMotionEnabled, usePointerCapability } from "@pinky-ui/primitives";
import { AnimatePresence, motion } from "motion/react";
import {
  cloneElement,
  isValidElement,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";

import { cn } from "../internal/cn";

type TooltipTriggerProps = {
  className?: string;
  "aria-describedby"?: string;
  onMouseEnter?: (event: React.MouseEvent) => void;
  onMouseLeave?: (event: React.MouseEvent) => void;
  onFocus?: (event: React.FocusEvent) => void;
  onBlur?: (event: React.FocusEvent) => void;
  onClick?: (event: React.MouseEvent) => void;
};

export type TooltipProps = {
  /** A single focusable element — the tooltip clones it to attach aria-describedby and handlers. */
  children: ReactElement<TooltipTriggerProps>;
  content: ReactNode;
  side?: "top" | "bottom";
  delay?: number;
  className?: string;
};

/**
 * A short, non-interactive label for a control — not a popover with actions.
 * Independent positioning logic, no external dependency: it measures the
 * trigger and clamps to the viewport on open, and nothing else.
 */
export function Tooltip({ children, content, side = "top", delay = 300, className }: TooltipProps) {
  const motionEnabled = useMotionEnabled();
  const { hasHover } = usePointerCapability();
  const id = useId();
  const [open, setOpen] = useState(false);
  const [resolvedSide, setResolvedSide] = useState(side);
  const triggerRef = useRef<HTMLElement | null>(null);
  const timer = useRef<number | undefined>(undefined);

  const show = () => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(true), delay);
  };
  const hide = () => {
    window.clearTimeout(timer.current);
    setOpen(false);
  };

  useEffect(() => () => window.clearTimeout(timer.current), []);

  useEffect(() => {
    if (!open) return;
    const node = triggerRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const preferred = side === "top" && rect.top < 64 ? "bottom" : side === "bottom" && rect.bottom > window.innerHeight - 64 ? "top" : side;
    setResolvedSide(preferred);
  }, [open, side]);

  // No hover-capable pointer means `onMouseEnter` never fires at all: tap
  // becomes the trigger instead, closed by an outside tap or Escape. The
  // trigger's own tap action (if any) still fires on the same tap — the
  // tooltip label is a bonus alongside it, never a gate in front of it.
  useEffect(() => {
    if (!open || hasHover) return;
    const closeOnOutside = (event: PointerEvent) => {
      if (triggerRef.current?.contains(event.target as Node)) return;
      hide();
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") hide();
    };
    document.addEventListener("pointerdown", closeOnOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open, hasHover]);

  if (!isValidElement(children)) return children;

  const trigger = cloneElement(children, {
    "aria-describedby": open ? id : undefined,
    ref: (node: HTMLElement | null) => {
      triggerRef.current = node;
      const existing = (children as ReactElement & { ref?: unknown }).ref;
      if (typeof existing === "function") existing(node);
    },
    onMouseEnter: (event: React.MouseEvent) => {
      children.props.onMouseEnter?.(event);
      show();
    },
    onMouseLeave: (event: React.MouseEvent) => {
      children.props.onMouseLeave?.(event);
      hide();
    },
    onFocus: (event: React.FocusEvent) => {
      children.props.onFocus?.(event);
      setOpen(true);
    },
    onBlur: (event: React.FocusEvent) => {
      children.props.onBlur?.(event);
      hide();
    },
    onClick: (event: React.MouseEvent) => {
      children.props.onClick?.(event);
      // A tap already focuses the trigger, which opens the tooltip on its
      // own (below); this only has to cover pointer types that click
      // without focusing, so it sets open rather than toggling — toggling
      // here would immediately re-close what focus just opened.
      if (!hasHover) setOpen(true);
    },
  } as Record<string, unknown>);

  return (
    <span className="relative inline-flex">
      {trigger}
      <AnimatePresence>
        {open ? (
          <motion.span
            id={id}
            role="tooltip"
            initial={motionEnabled ? { opacity: 0, y: resolvedSide === "top" ? 4 : -4 } : false}
            animate={{ opacity: 1, y: 0 }}
            exit={motionEnabled ? { opacity: 0 } : undefined}
            transition={{ duration: motionEnabled ? 0.12 : 0 }}
            className={cn(
              "pointer-events-none absolute left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-lg bg-ink-900 px-2.5 py-1.5 text-xs font-medium text-milk shadow-lift",
              resolvedSide === "top" ? "bottom-[calc(100%+8px)]" : "top-[calc(100%+8px)]",
              className,
            )}
          >
            {content}
          </motion.span>
        ) : null}
      </AnimatePresence>
    </span>
  );
}
