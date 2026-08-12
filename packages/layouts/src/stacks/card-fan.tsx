"use client";

import { springs, useMotionEnabled } from "@pinky/primitives";
import { motion } from "motion/react";
import {
  Children,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from "react";

export type CardFanProps = {
  children: ReactNode;
  /** Horizontal distance between cards when fanned, in px. */
  spread?: number;
  /** Rotation of the outermost cards, in degrees. */
  rotation?: number;
  /** Controlled selection. */
  activeIndex?: number;
  onActiveIndexChange?: (index: number) => void;
  /** Start collapsed and fan out on interaction. */
  collapsible?: boolean;
  label?: string;
  className?: string;
};

/**
 * A compressed collection that can be inspected as a layered deck.
 *
 * The resting state is intentionally not a symmetrical fan. It exposes just
 * enough edge and depth to communicate that more content is behind the front
 * card. Pointer proximity anticipates the side being explored; selection then
 * lifts one card out and lets the residual stack reflow around it.
 */
export function CardFan({
  children,
  spread = 28,
  rotation = 8,
  activeIndex,
  onActiveIndexChange,
  collapsible = true,
  label = "Card fan",
  className,
}: CardFanProps) {
  const motionEnabled = useMotionEnabled();
  const items = Children.toArray(children);
  const [internalActive, setInternalActive] = useState(0);
  const [open, setOpen] = useState(!collapsible);
  const active = Math.min(Math.max(activeIndex ?? internalActive, 0), Math.max(items.length - 1, 0));
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);
  const swipeStart = useRef<number | null>(null);
  const skipClick = useRef(false);

  const setActive = (index: number) => {
    if (!items.length) return;
    const next = Math.min(Math.max(index, 0), items.length - 1);
    if (activeIndex === undefined) setInternalActive(next);
    onActiveIndexChange?.(next);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    const next =
      event.key === "ArrowRight"
        ? active + 1
        : event.key === "ArrowLeft"
          ? active - 1
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? items.length - 1
              : null;

    if (next === null) return;
    setActive(next);
    setOpen(true);
    event.preventDefault();
    requestAnimationFrame(() => buttons.current[Math.min(Math.max(next, 0), items.length - 1)]?.focus());
  };

  const middle = (items.length - 1) / 2;
  const handlePointerMove = (event: PointerEvent<HTMLUListElement>) => {
    if (event.pointerType === "touch") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const proximity = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / Math.max(rect.width, 1)) * 2 - 1));
    event.currentTarget.style.setProperty("--fan-proximity", proximity.toFixed(3));
    if (collapsible) setOpen(true);
  };

  const handlePointerLeave = (event: PointerEvent<HTMLUListElement>) => {
    event.currentTarget.style.setProperty("--fan-proximity", "0");
    if (collapsible && !event.currentTarget.contains(document.activeElement)) setOpen(false);
  };

  const handlePointerDown = (event: PointerEvent<HTMLUListElement>) => {
    if (event.pointerType === "touch") {
      swipeStart.current = event.clientX;
      skipClick.current = false;
    }
  };

  const handlePointerUp = (event: PointerEvent<HTMLUListElement>) => {
    if (swipeStart.current === null) return;
    const delta = event.clientX - swipeStart.current;
    swipeStart.current = null;
    if (Math.abs(delta) < 28) return;
    skipClick.current = true;
    setOpen(true);
    setActive(active + (delta < 0 ? 1 : -1));
  };

  const handlePointerCancel = () => {
    swipeStart.current = null;
    skipClick.current = false;
  };

  return (
    <div className={className}>
      <ul
        aria-label={label}
        onKeyDown={onKeyDown}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onFocusCapture={() => collapsible && setOpen(true)}
        onBlurCapture={(event) => {
          if (collapsible && !event.currentTarget.contains(event.relatedTarget)) setOpen(false);
        }}
        className="relative mx-auto flex list-none justify-center p-0 [touch-action:pan-y]"
        style={{
          height: 260,
          "--fan-proximity": 0,
        } as CSSProperties}
      >
        {items.map((child, index) => {
          const distance = index - middle;
          const isActive = index === active;
          const fanned = open || !collapsible;
          const side = Math.sign(distance) || (index % 2 === 0 ? -1 : 1);
          const edgeExposure = [0, 3, -2, 4, -3, 2, -1][index % 7] ?? 0;
          const restingX = distance * 7 + edgeExposure;
          const restingY = (index % 3) * 2;
          const restingRotation = [0, -1.4, 1.1, -0.8, 1.7, -1.1, 0.6][index % 7] ?? 0;
          const expandedX = distance * spread + (isActive ? 0 : side * 10);
          const expandedRotation = isActive
            ? 0
            : (distance / Math.max(Math.abs(middle), 1)) * rotation * 0.62;

          return (
            <motion.li
              key={index}
              className="absolute top-0 origin-bottom"
              style={{ zIndex: isActive ? items.length + 1 : items.length - Math.abs(index - active) }}
              animate={
                fanned
                  ? {
                      x: expandedX,
                      y: isActive ? -16 : Math.abs(distance) * 2,
                      scale: isActive ? 1.025 : 1,
                    }
                  : {
                      x: restingX,
                      y: isActive ? -8 : restingY,
                      scale: isActive ? 1.012 : 1,
                    }
              }
              transition={motionEnabled ? { type: "spring", ...springs.soft } : { duration: 0 }}
            >
              <div
                className="origin-bottom"
                style={{
                  "--fan-base-rotation": `${fanned ? expandedRotation : restingRotation}deg`,
                  "--fan-anticipation": side * (isActive ? 2 : 6),
                  transform:
                    "translateX(calc(var(--fan-proximity, 0) * var(--fan-anticipation, 0) * 1px)) rotate(var(--fan-base-rotation))",
                } as CSSProperties}
              >
                <button
                  ref={(node) => {
                    buttons.current[index] = node;
                  }}
                  type="button"
                  tabIndex={isActive ? 0 : -1}
                  aria-current={isActive ? "true" : undefined}
                  aria-pressed={isActive}
                  onFocus={() => {
                    setActive(index);
                    setOpen(true);
                  }}
                  onPointerEnter={(pointerEvent) => {
                    if (pointerEvent.pointerType !== "touch") setActive(index);
                  }}
                  onClick={() => {
                    if (skipClick.current) {
                      skipClick.current = false;
                      return;
                    }
                    setActive(index);
                    setOpen(true);
                  }}
                  data-active={isActive ? "true" : "false"}
                  className="group block cursor-pointer rounded-xl text-left outline-none transition-[filter] duration-300 focus-visible:ring-2 focus-visible:ring-ink-900 data-[active=true]:brightness-[1.02] data-[active=true]:drop-shadow-[0_16px_18px_rgba(53,61,73,0.16)]"
                >
                  {child}
                </button>
              </div>
            </motion.li>
          );
        })}
      </ul>
      <p className="sr-only" aria-live="polite">
        {items.length ? `${label}: ${active + 1} of ${items.length} selected` : `${label}: empty`}
      </p>
    </div>
  );
}
