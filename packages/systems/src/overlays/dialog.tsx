"use client";

import { springs, useMotionEnabled } from "@pinky-ui/primitives";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, type ReactNode } from "react";

import { cn } from "../internal/cn";

export type DialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  maxWidth?: number;
  className?: string;
};

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * A plain modal dialog: fades and scales in place, with no shared-element
 * continuity to a trigger. Use `Morph` when the dialog should read as the
 * same object as what opened it; use `Dialog` for everything else — confirmations,
 * settings panels, anything opened from more than one place.
 */
export function Dialog({ open, onOpenChange, title, description, children, footer, maxWidth = 480, className }: DialogProps) {
  const motionEnabled = useMotionEnabled();
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreFocus = useRef<HTMLElement | null>(null);

  const close = useCallback(() => onOpenChange(false), [onOpenChange]);

  useEffect(() => {
    if (!open) return;
    restoreFocus.current = document.activeElement as HTMLElement | null;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        close();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      restoreFocus.current?.focus();
    };
  }, [open, close]);

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    if (!panel) return;
    const first = panel.querySelector<HTMLElement>(FOCUSABLE);
    (first ?? panel).focus();
  }, [open]);

  const trapTab = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
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

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
          <motion.div
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: motionEnabled ? 0.2 : 0 }}
            onClick={close}
            className="absolute inset-0 bg-[rgba(37,41,51,0.28)]"
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            tabIndex={-1}
            onKeyDown={trapTab}
            initial={motionEnabled ? { opacity: 0, scale: 0.96, y: 8 } : false}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={motionEnabled ? { opacity: 0, scale: 0.98 } : undefined}
            transition={motionEnabled ? { type: "spring", ...springs.snappy } : { duration: 0 }}
            style={{ maxWidth, width: "100%" }}
            className={cn("relative z-10 rounded-[24px] border border-line bg-white p-6 shadow-lift", className)}
          >
            <p className="font-display text-lg font-semibold tracking-tight">{title}</p>
            {description ? <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{description}</p> : null}
            {children ? <div className="mt-4">{children}</div> : null}
            {footer ? <div className="mt-6 flex flex-wrap justify-end gap-3">{footer}</div> : null}
            <button
              type="button"
              onClick={close}
              aria-label="Close dialog"
              className="absolute top-4 right-4 grid size-8 place-items-center rounded-full text-ink-500 hover:bg-cloud-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25"
            >
              ×
            </button>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
