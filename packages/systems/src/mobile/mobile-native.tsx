"use client";

import { springs, useMotionEnabled } from "@pinky-ui/primitives";
import { AnimatePresence, animate, motion, useMotionValue } from "motion/react";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";

import { cn } from "../internal/cn";

const SAFE_BOTTOM = "max(0.75rem, env(safe-area-inset-bottom))";

export type ActionSheetAction = {
  id: string;
  label: string;
  onAction: () => void;
  tone?: "default" | "destructive";
};

export type ActionSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  actions: ActionSheetAction[];
  cancelLabel?: string;
  className?: string;
};

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * The iOS-style action list — a named object, its actions, an explicit
 * Cancel. Distinct from Detent Sheet (arbitrary content at named heights)
 * and Quick Action Sheet (searchable command entry): this is one flat,
 * short list of choices for one object.
 */
export function ActionSheet({ open = false, onOpenChange, title, actions, cancelLabel = "Cancel", className }: ActionSheetProps) {
  const motionEnabled = useMotionEnabled();
  const sheetRef = useRef<HTMLDivElement>(null);
  const restoreFocus = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const close = () => onOpenChange?.(false);

  useEffect(() => {
    if (!open) return;
    restoreFocus.current = document.activeElement as HTMLElement | null;
    const first = sheetRef.current?.querySelector<HTMLElement>(FOCUSABLE);
    first?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      restoreFocus.current?.focus();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[80] flex items-end justify-center bg-ink-900/35"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: motionEnabled ? 0.2 : 0 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <motion.div
            ref={sheetRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? titleId : undefined}
            className={cn("w-full max-w-md p-3", className)}
            style={{ paddingBottom: SAFE_BOTTOM }}
            initial={motionEnabled ? { y: "100%" } : false}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={motionEnabled ? { type: "spring", ...springs.snappy } : { duration: 0 }}
          >
            {title ? <p id={titleId} className="mb-2 px-1 text-center font-mono text-[0.65rem] tracking-[0.14em] text-ink-500 uppercase">{title}</p> : null}
            <div role="group" aria-label={title ?? "Actions"} className="flex flex-col divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white shadow-lift">
              {actions.map((action) => (
                <button
                  key={action.id}
                  type="button"
                  onClick={() => {
                    action.onAction();
                    close();
                  }}
                  className={cn(
                    "min-h-12 px-4 text-center text-[0.9375rem] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ink-900/25",
                    action.tone === "destructive" ? "text-[#b4344a]" : "text-ink-900",
                  )}
                >
                  {action.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={close}
              className="mt-2 min-h-12 w-full rounded-2xl border border-line bg-white text-[0.9375rem] font-semibold text-ink-900 shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25"
            >
              {cancelLabel}
            </button>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export type WheelPickerOption = { value: string; label: string };

export type WheelPickerProps = {
  options: WheelPickerOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  label: string;
  itemHeight?: number;
  visibleCount?: number;
  className?: string;
};

/**
 * A scrollable value picker with a fixed centre selection window.
 *
 * Inertia and momentum are native `scroll-snap` behaviour, not a custom
 * physics loop — the browser already does this correctly on touch. A
 * listbox role and Arrow/Home/End keyboard support keep it reachable
 * without a gesture.
 */
export function WheelPicker({ options, value, defaultValue, onValueChange, label, itemHeight = 40, visibleCount = 5, className }: WheelPickerProps) {
  const listId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const settleTimer = useRef<number | null>(null);
  const [internal, setInternal] = useState(() => value ?? defaultValue ?? options[0]?.value ?? "");
  const selected = value ?? internal;
  const padding = (Math.floor(visibleCount / 2)) * itemHeight;

  const commit = (next: string) => {
    if (value === undefined) setInternal(next);
    onValueChange?.(next);
  };

  const scrollToValue = (next: string, smooth: boolean) => {
    const index = options.findIndex((option) => option.value === next);
    const node = containerRef.current;
    if (index === -1 || !node) return;
    node.scrollTo({ top: index * itemHeight, behavior: smooth ? "smooth" : "auto" });
  };

  useEffect(() => {
    scrollToValue(selected, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onScroll = () => {
    if (settleTimer.current) window.clearTimeout(settleTimer.current);
    settleTimer.current = window.setTimeout(() => {
      const node = containerRef.current;
      if (!node) return;
      const index = Math.round(node.scrollTop / itemHeight);
      const next = options[Math.max(0, Math.min(options.length - 1, index))];
      if (next && next.value !== selected) commit(next.value);
    }, 120);
  };

  useEffect(() => () => {
    if (settleTimer.current) window.clearTimeout(settleTimer.current);
  }, []);

  const move = (delta: number) => {
    const index = options.findIndex((option) => option.value === selected);
    const next = options[Math.max(0, Math.min(options.length - 1, index + delta))];
    if (!next) return;
    commit(next.value);
    scrollToValue(next.value, true);
  };

  return (
    <div className={cn("relative", className)} style={{ height: itemHeight * visibleCount }}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 z-10 rounded-xl bg-cloud-50/70 ring-1 ring-line/70"
        style={{ top: padding, height: itemHeight }}
      />
      <div
        ref={containerRef}
        role="listbox"
        aria-label={label}
        aria-activedescendant={`${listId}-${selected}`}
        tabIndex={0}
        onScroll={onScroll}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            move(1);
          } else if (event.key === "ArrowUp") {
            event.preventDefault();
            move(-1);
          } else if (event.key === "Home") {
            event.preventDefault();
            const first = options[0];
            if (first) {
              commit(first.value);
              scrollToValue(first.value, true);
            }
          } else if (event.key === "End") {
            event.preventDefault();
            const last = options[options.length - 1];
            if (last) {
              commit(last.value);
              scrollToValue(last.value, true);
            }
          }
        }}
        className="h-full snap-y snap-mandatory overflow-y-auto overscroll-contain focus-visible:outline-none [scrollbar-width:none]"
        style={{ paddingTop: padding, paddingBottom: padding }}
      >
        {options.map((option) => (
          <div
            key={option.value}
            id={`${listId}-${option.value}`}
            role="option"
            aria-selected={option.value === selected}
            className={cn(
              "flex snap-center items-center justify-center text-center text-[0.9375rem] transition-colors",
              option.value === selected ? "font-semibold text-ink-900" : "text-ink-400",
            )}
            style={{ height: itemHeight }}
          >
            {option.label}
          </div>
        ))}
      </div>
    </div>
  );
}

export type SwipeBackGestureProps = {
  onBack: () => void;
  children: ReactNode;
  /** The previous screen, peeking from the left edge as the current one moves aside. */
  behind?: ReactNode;
  edgeWidth?: number;
  threshold?: number;
  label?: string;
  className?: string;
};

/**
 * An edge-anchored back gesture with two-plane parallax: the current screen
 * follows the finger 1:1, the previous screen (if supplied) trails in from
 * further left at a slower rate, exactly like a native push/pop transition.
 */
export function SwipeBackGesture({ onBack, children, behind, edgeWidth = 24, threshold = 90, label = "Swipeable screen", className }: SwipeBackGestureProps) {
  const motionEnabled = useMotionEnabled();
  const x = useMotionValue(0);
  const behindX = useMotionValue(behind ? -80 : 0);
  const start = useRef<number | null>(null);
  const width = useRef(1);
  const node = useRef<HTMLDivElement>(null);

  const settle = (progress: number) => {
    if (!motionEnabled) {
      x.set(progress >= 1 ? width.current : 0);
      behindX.set(progress >= 1 ? 0 : behind ? -80 : 0);
      if (progress >= 1) onBack();
      return;
    }
    if (progress >= 1) {
      animate(x, width.current, { type: "spring", ...springs.snappy });
      animate(behindX, 0, { type: "spring", ...springs.snappy, onComplete: onBack });
    } else {
      animate(x, 0, { type: "spring", ...springs.elastic });
      animate(behindX, behind ? -80 : 0, { type: "spring", ...springs.elastic });
    }
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.clientX > edgeWidth) return;
    start.current = event.clientX;
    width.current = node.current?.clientWidth ?? window.innerWidth;
    node.current?.setPointerCapture?.(event.pointerId);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (start.current === null) return;
    const delta = Math.max(0, event.clientX - start.current);
    x.set(delta);
    if (behind) behindX.set(-80 + Math.min(80, (delta / width.current) * 80));
  };

  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (start.current === null) return;
    if (node.current?.hasPointerCapture?.(event.pointerId)) node.current.releasePointerCapture(event.pointerId);
    const delta = x.get();
    start.current = null;
    settle(delta >= threshold ? 1 : 0);
  };

  return (
    <div ref={node} className={cn("relative isolate overflow-hidden", className)}>
      {behind ? (
        <motion.div aria-hidden className="absolute inset-y-0 left-0 w-full brightness-90" style={{ x: behindX }}>
          {behind}
        </motion.div>
      ) : null}
      <motion.div
        role="group"
        aria-label={label}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{ x, touchAction: "pan-y" }}
        className="relative bg-white shadow-lift"
      >
        {children}
      </motion.div>
    </div>
  );
}
