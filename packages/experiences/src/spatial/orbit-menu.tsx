"use client";

import { AnimatePresence, motion } from "motion/react";
import { useMotionEnabled } from "@pinky/primitives";
import { useEffect, useRef, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from "react";

import { cn } from "../internal/cn";
import { useControllable } from "../internal/use-controllable";
import { useMediaQuery } from "../internal/use-media-query";

export type OrbitMenuItem = {
  id: string;
  label: string;
  icon?: ReactNode;
  href?: string;
  onSelect?: () => void;
};

export type OrbitMenuProps = {
  items: OrbitMenuItem[];
  trigger?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  radius?: number;
  startAngle?: number;
  endAngle?: number;
  label?: string;
  className?: string;
  disabled?: boolean;
};

/** A practical arc menu with logical DOM order and a compact linear fallback. */
export function OrbitMenu({
  items,
  trigger = "+",
  open,
  defaultOpen = false,
  onOpenChange,
  radius = 112,
  startAngle = -165,
  endAngle = -15,
  label = "Actions",
  className,
  disabled = false,
}: OrbitMenuProps) {
  const [expanded, setExpanded] = useControllable(open, defaultOpen, onOpenChange);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const nodes = useRef<Array<HTMLElement | null>>([]);
  const motionEnabled = useMotionEnabled();
  const compact = useMediaQuery("(max-width: 767px)");
  const linear = compact || !motionEnabled || disabled;

  useEffect(() => {
    if (!expanded) return;
    nodes.current[0]?.focus();
  }, [expanded]);

  const close = () => {
    setExpanded(false);
    requestAnimationFrame(() => triggerRef.current?.focus());
  };

  const keyboard = (event: ReactKeyboardEvent, index: number) => {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }
    if (!["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    let next = index;
    if (event.key === "Home") next = 0;
    else if (event.key === "End") next = items.length - 1;
    else next = (index + (event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1) + items.length) % items.length;
    nodes.current[next]?.focus();
  };

  return (
    <div className={cn("relative inline-grid place-items-center", className)} style={{ minWidth: linear ? undefined : radius * 2 + 72, minHeight: linear ? undefined : radius + 116 }}>
      <AnimatePresence>
        {expanded ? (
          <motion.ul
            id="pinky-orbit-menu"
            aria-label={label}
            className={linear ? "mb-3 flex flex-wrap justify-center gap-2" : "absolute inset-0"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {items.map((item, index) => {
              const t = items.length <= 1 ? 0.5 : index / (items.length - 1);
              const angle = startAngle + (endAngle - startAngle) * t;
              const radians = (angle * Math.PI) / 180;
              const x = Math.cos(radians) * radius;
              const y = Math.sin(radians) * radius;
              const common = {
                ref: (node: HTMLAnchorElement | HTMLButtonElement | null) => {
                  nodes.current[index] = node;
                },
                onKeyDown: (event: ReactKeyboardEvent) => keyboard(event, index),
                className: "grid min-w-14 place-items-center gap-1 rounded-2xl border border-[color:var(--color-line,rgba(70,90,115,.1))] bg-white px-3 py-2 text-xs shadow-sm",
              };
              return (
                <motion.li
                  key={item.id}
                  className={linear ? "relative" : "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"}
                  initial={linear ? { opacity: 0, y: 6 } : { opacity: 0, x: 0, y: 0, scale: 0.75 }}
                  animate={linear ? { opacity: 1, y: 0 } : { opacity: 1, x, y, scale: 1 }}
                  exit={linear ? { opacity: 0, y: 4 } : { opacity: 0, x: 0, y: 0, scale: 0.75 }}
                  transition={{ type: "spring", stiffness: 320, damping: 32, mass: 0.8, delay: index * 0.025 }}
                >
                  {item.href ? (
                    <a
                      {...common}
                      href={item.href}
                      onClick={() => {
                        item.onSelect?.();
                        setExpanded(false);
                      }}
                    >
                      {item.icon ? <span aria-hidden>{item.icon}</span> : null}
                      <span>{item.label}</span>
                    </a>
                  ) : (
                    <button
                      {...common}
                      type="button"
                      onClick={() => {
                        item.onSelect?.();
                        close();
                      }}
                    >
                      {item.icon ? <span aria-hidden>{item.icon}</span> : null}
                      <span>{item.label}</span>
                    </button>
                  )}
                </motion.li>
              );
            })}
          </motion.ul>
        ) : null}
      </AnimatePresence>

      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        aria-expanded={expanded}
        aria-controls="pinky-orbit-menu"
        aria-label={expanded ? `Close ${label}` : `Open ${label}`}
        onClick={() => setExpanded(!expanded)}
        onKeyDown={(event) => {
          if (event.key === "Escape" && expanded) close();
        }}
        className="relative z-10 grid size-16 place-items-center rounded-full bg-[color:var(--color-ink-900,#252933)] text-[color:var(--color-milk,#fcfbf8)] shadow-lg"
      >
        <motion.span aria-hidden animate={{ rotate: expanded && motionEnabled ? 45 : 0 }} transition={{ type: "spring", stiffness: 460, damping: 36, mass: 0.7 }}>
          {trigger}
        </motion.span>
      </button>
    </div>
  );
}
