"use client";

import { springs, useMotionEnabled } from "@pinky/primitives";
import { motion, useMotionValue, useSpring } from "motion/react";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";

import { cn } from "../utils/cn";

export type FluidTabItem = {
  id: string;
  label: ReactNode;
  content?: ReactNode;
  disabled?: boolean;
};

export type FluidTabsProps = {
  items: FluidTabItem[];
  /** Controlled selection. Omit for uncontrolled use. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  size?: "sm" | "md";
  /** `solid` sits on a track, `bare` floats on the page background. */
  variant?: "solid" | "bare";
  /** Stretches the tabs to fill the row. */
  fill?: boolean;
  "aria-label"?: string;
  className?: string;
};

const SIZES = {
  sm: "h-9 px-3.5 text-[0.8125rem]",
  md: "h-11 px-5 text-sm",
} as const;

/**
 * Tabs whose selection indicator flows from one tab to the next.
 *
 * The indicator is a single shared element animated with a layout transition,
 * so it morphs between differently sized tabs instead of cross-fading. Keyboard
 * behaviour follows the ARIA tabs pattern: roving tab stop, arrows to move,
 * Home/End to jump.
 */
export function FluidTabs({
  items,
  value,
  defaultValue,
  onValueChange,
  size = "md",
  variant = "solid",
  fill = false,
  className,
  "aria-label": ariaLabel = "Tabs",
}: FluidTabsProps) {
  const baseId = useId();
  const motionEnabled = useMotionEnabled();
  const buttons = useRef(new Map<string, HTMLButtonElement>());

  const firstEnabled = items.find((item) => !item.disabled)?.id ?? items[0]?.id ?? "";
  const [internal, setInternal] = useState(defaultValue ?? firstEnabled);
  const selected = value ?? internal;

  /**
   * The indicator stretches along its direction of travel and settles back.
   * It is what stops the pill from reading as a rectangle being slid around:
   * the shape reacts to the movement, the way something soft would.
   */
  const stretchTarget = useMotionValue(1);
  const stretch = useSpring(stretchTarget, springs.elastic);

  useEffect(() => {
    if (!motionEnabled) return;
    stretchTarget.set(1.08);
    const timer = setTimeout(() => stretchTarget.set(1), 90);
    return () => clearTimeout(timer);
  }, [motionEnabled, selected, stretchTarget]);

  const select = useCallback(
    (id: string) => {
      if (value === undefined) setInternal(id);
      onValueChange?.(id);
    },
    [onValueChange, value],
  );

  const move = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const enabled = items.filter((item) => !item.disabled);
      if (enabled.length === 0) return;

      const current = enabled.findIndex((item) => item.id === selected);
      let next = -1;

      switch (event.key) {
        case "ArrowRight":
        case "ArrowDown":
          next = (current + 1) % enabled.length;
          break;
        case "ArrowLeft":
        case "ArrowUp":
          next = (current - 1 + enabled.length) % enabled.length;
          break;
        case "Home":
          next = 0;
          break;
        case "End":
          next = enabled.length - 1;
          break;
        default:
          return;
      }

      const target = enabled[next];
      if (!target) return;

      event.preventDefault();
      select(target.id);
      buttons.current.get(target.id)?.focus();
    },
    [items, select, selected],
  );

  // `responsive` rather than `soft`: the indicator should arrive with the
  // click, not drift toward it.
  const transition = motionEnabled
    ? { type: "spring" as const, ...springs.responsive }
    : { duration: 0 };

  const activeItem = items.find((item) => item.id === selected);
  const hasPanels = items.some((item) => item.content !== undefined);

  return (
    <div className={cn("w-full", className)}>
      <div
        role="tablist"
        aria-label={ariaLabel}
        aria-orientation="horizontal"
        onKeyDown={move}
        className={cn(
          "relative inline-flex max-w-full items-center gap-1 overflow-x-auto rounded-pill p-1",
          variant === "solid" && "bg-blush-50/70 ring-1 ring-line/70 shadow-soft",
          fill && "flex w-full",
        )}
      >
        {items.map((item) => {
          const isSelected = item.id === selected;
          return (
            <button
              key={item.id}
              ref={(node) => {
                if (node) buttons.current.set(item.id, node);
                else buttons.current.delete(item.id);
              }}
              role="tab"
              id={`${baseId}-tab-${item.id}`}
              aria-selected={isSelected}
              aria-controls={item.content !== undefined ? `${baseId}-panel-${item.id}` : undefined}
              tabIndex={isSelected ? 0 : -1}
              disabled={item.disabled}
              onClick={() => select(item.id)}
              className={cn(
                "relative isolate shrink-0 rounded-pill font-medium whitespace-nowrap",
                "transition-colors duration-200 ease-[var(--ease-soft)]",
                "disabled:cursor-not-allowed disabled:opacity-40",
                fill && "flex-1",
                SIZES[size],
                isSelected ? "text-ink-900" : "text-ink-500 hover:text-ink-700",
              )}
            >
              {isSelected ? (
                <motion.span
                  aria-hidden
                  layoutId={`${baseId}-indicator`}
                  transition={transition}
                  className="absolute inset-0 -z-10"
                >
                  {/* The visual pill is a child of the morphing element, so the
                      stretch below cannot fight motion's layout animation. */}
                  <motion.span
                    className="block size-full rounded-pill bg-white shadow-soft ring-1 ring-line"
                    style={{ scaleX: motionEnabled ? stretch : 1 }}
                  />
                </motion.span>
              ) : null}
              <span className="relative">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* The panel is keyed, so switching tabs remounts it and replays the
          entrance. There is deliberately no exit animation: a panel lingering
          after its tab is deselected leaves assistive technology describing
          content that is on its way out. */}
      {hasPanels ? (
        <motion.div
          key={selected}
          role="tabpanel"
          id={`${baseId}-panel-${selected}`}
          aria-labelledby={`${baseId}-tab-${selected}`}
          tabIndex={0}
          initial={motionEnabled ? { opacity: 0, y: 6 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={motionEnabled ? { duration: 0.22, ease: [0.22, 1, 0.36, 1] } : { duration: 0 }}
          className="mt-6 rounded-lg focus-visible:outline-2"
        >
          {activeItem?.content}
        </motion.div>
      ) : null}
    </div>
  );
}
