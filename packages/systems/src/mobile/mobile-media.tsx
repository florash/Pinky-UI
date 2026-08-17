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

const MOVE_CANCEL_THRESHOLD = 10;
const HOLD_DURATION = 450;

export type LongPressContextMenuAction = {
  id: string;
  label: string;
  onAction: () => void;
  tone?: "default" | "destructive";
};

export type LongPressContextMenuProps = {
  children: ReactNode;
  actions: LongPressContextMenuAction[];
  label?: string;
  className?: string;
};

/**
 * iOS-style context menu: hold the surface, it lifts into a peek preview,
 * and the action list appears beside it. A movement past a small threshold
 * during the hold cancels it — so a long-press inside a scrollable list
 * never fires mid-scroll. See mobile-gesture-conflicts for the general rule.
 */
export function LongPressContextMenu({ children, actions, label = "More actions", className }: LongPressContextMenuProps) {
  const motionEnabled = useMotionEnabled();
  const menuId = useId();
  const [open, setOpen] = useState(false);
  const timer = useRef<number | null>(null);
  const start = useRef<{ x: number; y: number } | null>(null);
  const cancelled = useRef(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const scale = useMotionValue(1);

  const clearTimer = () => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = null;
  };

  const openMenu = () => {
    setOpen(true);
    if (motionEnabled) animate(scale, 1.05, { type: "spring", ...springs.snappy });
  };

  const closeMenu = () => {
    setOpen(false);
    if (motionEnabled) animate(scale, 1, { type: "spring", ...springs.snappy });
    else scale.set(1);
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse") return; // desktop uses onContextMenu directly
    start.current = { x: event.clientX, y: event.clientY };
    cancelled.current = false;
    clearTimer();
    timer.current = window.setTimeout(() => {
      if (!cancelled.current) openMenu();
    }, HOLD_DURATION);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!start.current || cancelled.current) return;
    const dx = event.clientX - start.current.x;
    const dy = event.clientY - start.current.y;
    if (Math.hypot(dx, dy) > MOVE_CANCEL_THRESHOLD) {
      cancelled.current = true;
      clearTimer();
    }
  };

  const onPointerUp = () => {
    clearTimer();
    start.current = null;
  };

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };
    const onPointerDownOutside = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) closeMenu();
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDownOutside);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDownOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <div ref={rootRef} className={cn("relative inline-block", className)}>
      <motion.div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onContextMenu={(event) => {
          event.preventDefault();
          openMenu();
        }}
        style={{ scale }}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {children}
      </motion.div>
      <button
        type="button"
        onClick={openMenu}
        className="absolute -top-2 -right-2 size-6 rounded-full border border-line bg-white text-xs text-ink-500 opacity-0 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25"
        aria-label={label}
      >
        ⋯
      </button>
      <AnimatePresence>
        {open ? (
          <>
            <motion.div
              aria-hidden
              className="fixed inset-0 z-40 bg-ink-900/20 backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: motionEnabled ? 0.18 : 0 }}
              onClick={closeMenu}
            />
            <motion.div
              id={menuId}
              role="menu"
              aria-label={label}
              className="absolute top-full left-1/2 z-50 mt-2 w-52 -translate-x-1/2 overflow-hidden rounded-2xl border border-line bg-white/95 p-1.5 shadow-lift backdrop-blur-xl"
              initial={motionEnabled ? { opacity: 0, scale: 0.92, y: -6 } : false}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={motionEnabled ? { opacity: 0, scale: 0.92 } : undefined}
              transition={motionEnabled ? { type: "spring", ...springs.snappy } : { duration: 0 }}
            >
              {actions.map((action) => (
                <button
                  key={action.id}
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    action.onAction();
                    closeMenu();
                  }}
                  className={cn(
                    "block min-h-11 w-full rounded-xl px-3 py-2 text-left text-sm font-medium hover:bg-cloud-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ink-900/25",
                    action.tone === "destructive" ? "text-[#b4344a]" : "text-ink-900",
                  )}
                >
                  {action.label}
                </button>
              ))}
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export type PinchZoomImageProps = {
  src: string;
  alt: string;
  onDismiss?: () => void;
  maxScale?: number;
  className?: string;
};

type ActivePointer = { x: number; y: number };

/**
 * Two-finger pinch to zoom, one-finger pan once zoomed, and a vertical
 * drag-to-dismiss at rest scale — the iOS Photos viewer gesture set, built
 * on raw Pointer Events and Motion springs, no gesture library.
 */
export function PinchZoomImage({ src, alt, onDismiss, maxScale = 4, className }: PinchZoomImageProps) {
  const motionEnabled = useMotionEnabled();
  const scale = useMotionValue(1);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const dismissOpacity = useMotionValue(1);
  const pointers = useRef(new Map<number, ActivePointer>());
  const pinchStart = useRef<{ distance: number; scale: number } | null>(null);
  const panStart = useRef<{ x: number; y: number; px: number; py: number } | null>(null);
  const dragStart = useRef<{ y: number } | null>(null);

  const distance = () => {
    const values = [...pointers.current.values()];
    if (values.length < 2) return 0;
    const [a, b] = values;
    if (!a || !b) return 0;
    return Math.hypot(a.x - b.x, a.y - b.y);
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    (event.target as Element).setPointerCapture?.(event.pointerId);
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.current.size === 2) {
      pinchStart.current = { distance: distance(), scale: scale.get() };
      panStart.current = null;
      dragStart.current = null;
    } else if (pointers.current.size === 1) {
      panStart.current = { x: event.clientX, y: event.clientY, px: x.get(), py: y.get() };
      if (scale.get() <= 1.01) dragStart.current = { y: event.clientY };
    }
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!pointers.current.has(event.pointerId)) return;
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (pointers.current.size === 2 && pinchStart.current) {
      const current = distance();
      if (pinchStart.current.distance > 0) {
        const next = Math.min(maxScale, Math.max(1, pinchStart.current.scale * (current / pinchStart.current.distance)));
        scale.set(next);
      }
      return;
    }

    if (pointers.current.size === 1 && scale.get() > 1.01 && panStart.current) {
      x.set(panStart.current.px + (event.clientX - panStart.current.x));
      y.set(panStart.current.py + (event.clientY - panStart.current.y));
      return;
    }

    if (pointers.current.size === 1 && dragStart.current) {
      const delta = Math.max(0, event.clientY - dragStart.current.y);
      y.set(delta);
      dismissOpacity.set(Math.max(0.4, 1 - delta / 400));
    }
  };

  const settle = () => {
    if (motionEnabled) {
      animate(scale, Math.max(1, Math.min(scale.get(), maxScale)), { type: "spring", ...springs.snappy });
      animate(x, scale.get() <= 1.01 ? 0 : x.get(), { type: "spring", ...springs.snappy });
    } else {
      scale.set(Math.max(1, Math.min(scale.get(), maxScale)));
    }
  };

  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    pointers.current.delete(event.pointerId);

    if (dragStart.current) {
      const dragged = y.get();
      dragStart.current = null;
      if (dragged > 110) {
        onDismiss?.();
        return;
      }
      if (motionEnabled) {
        animate(y, 0, { type: "spring", ...springs.elastic });
        animate(dismissOpacity, 1, { type: "spring", ...springs.soft });
      } else {
        y.set(0);
        dismissOpacity.set(1);
      }
      return;
    }

    if (pointers.current.size < 2) {
      pinchStart.current = null;
      settle();
    }
    if (pointers.current.size === 0) panStart.current = null;
  };

  return (
    <motion.div
      role="group"
      aria-label={`${alt} — pinch to zoom, swipe down to dismiss`}
      className={cn("relative touch-none overflow-hidden bg-ink-900/5", className)}
      style={{ opacity: dismissOpacity }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <motion.img
        src={src}
        alt={alt}
        draggable={false}
        className="size-full object-contain"
        style={{ scale, x, y }}
      />
      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Close image"
          className="absolute top-3 right-3 grid size-11 place-items-center rounded-full bg-white/85 text-ink-900 shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25"
        >
          ×
        </button>
      ) : null}
    </motion.div>
  );
}
