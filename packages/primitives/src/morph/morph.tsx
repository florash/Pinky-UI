"use client";

import { AnimatePresence, motion } from "motion/react";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

import { useMotionEnabled } from "../internal/use-motion-enabled";
import { springs } from "../spring/springs";

export type MorphProps = {
  /** The resting state — what is visible before expansion. */
  children: ReactNode;
  /** The expanded state. Rendered only while open. */
  expanded: ReactNode;
  /** Accessible name for the expanded dialog. */
  label: string;
  /** Optional name for visual-only triggers whose children have no text. */
  triggerLabel?: string;
  /** Controlled open state. Omit to let the primitive own it. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Width of the expanded panel. */
  maxWidth?: number;
  className?: string;
  expandedClassName?: string;
  disabled?: boolean;
};

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Expands one surface into another, keeping it the same object.
 *
 * Both states share a `layoutId`, so the collapsed card does not fade out and a
 * dialog fade in — the surface travels and resizes. That continuity is the
 * whole point: the user should never have to work out what became what.
 *
 * The expanded state is a modal dialog and behaves like one: Escape closes it,
 * Tab is trapped inside it, and focus returns to the trigger on close.
 */
export function Morph({
  children,
  expanded,
  label,
  triggerLabel,
  open: controlledOpen,
  onOpenChange,
  maxWidth = 620,
  className,
  expandedClassName,
  disabled = false,
}: MorphProps) {
  const baseId = useId();
  const motionEnabled = useMotionEnabled();
  const [uncontrolled, setUncontrolled] = useState(false);
  const open = controlledOpen ?? uncontrolled;
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const setOpen = useCallback(
    (next: boolean) => {
      if (controlledOpen === undefined) setUncontrolled(next);
      onOpenChange?.(next);
    },
    [controlledOpen, onOpenChange],
  );

  // Escape closes, and the page behind cannot scroll away under the dialog.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        setOpen(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, setOpen]);

  // Focus moves into the panel on open and back to the trigger on close.
  // Gated on `mounted` too: the panel only exists in the DOM once the portal
  // has mounted, which happens one render after `open` first flips true.
  useEffect(() => {
    if (!open || !mounted) return;
    const panel = panelRef.current;
    if (!panel) return;

    const first = panel.querySelector<HTMLElement>(FOCUSABLE);
    (first ?? panel).focus();
  }, [open, mounted]);

  const trapTab = useCallback((event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab") return;
    const panel = panelRef.current;
    if (!panel) return;

    const focusable = [...panel.querySelectorAll<HTMLElement>(FOCUSABLE)];
    if (focusable.length === 0) {
      event.preventDefault();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!first || !last) return;

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }, []);

  const layout = motionEnabled ? { layoutId: `${baseId}-morph` } : {};
  const transition = motionEnabled
    ? { type: "spring" as const, ...springs.soft }
    : { duration: 0 };

  return (
    <>
      <motion.button
        ref={triggerRef}
        type="button"
        {...layout}
        transition={transition}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={triggerLabel}
        disabled={disabled}
        onClick={() => setOpen(true)}
        className={`focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25 focus-visible:ring-offset-2 ${className ?? ""}`}
        style={{ display: open ? "none" : undefined, textAlign: "inherit" }}
      >
        {children}
      </motion.button>

      {/*
        Portalled to document.body: a `position: fixed` descendant of any
        ancestor with a non-none filter/backdrop-filter/transform (e.g. a
        scrolled header that gains backdrop-blur) becomes fixed relative to
        that ancestor instead of the viewport, breaking the panel's position
        and making its backdrop miss "click outside" entirely. Portalling
        out of the caller's subtree sidesteps that regardless of what any
        future ancestor does.
      */}
      {mounted
        ? createPortal(
            <AnimatePresence onExitComplete={() => triggerRef.current?.focus()}>
              {open ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
                  <motion.div
                    aria-hidden
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: motionEnabled ? 0.25 : 0 }}
                    onClick={() => setOpen(false)}
                    className="absolute inset-0 bg-[rgba(37,41,51,0.28)]"
                  />

                  <motion.div
                    ref={panelRef}
                    role="dialog"
                    aria-modal="true"
                    aria-label={label}
                    tabIndex={-1}
                    onKeyDown={trapTab}
                    {...layout}
                    transition={transition}
                    style={{ maxWidth, width: "100%" }}
                    className={`relative z-10 ${expandedClassName ?? ""}`}
                  >
                    {expanded}
                  </motion.div>
                </div>
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </>
  );
}
