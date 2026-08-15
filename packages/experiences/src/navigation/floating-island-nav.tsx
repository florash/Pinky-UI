"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { Magnetic, springs } from "@pinky/primitives";
import { useScrollSource } from "@pinky/effects";
import { useEffect } from "react";

import { cn } from "../internal/cn";
import { LiquidNavbar, type LiquidNavbarItem } from "./liquid-navbar";

export type FloatingIslandNavProps = {
  items: LiquidNavbarItem[];
  activeId?: string;
  defaultActiveId?: string;
  onActiveChange?: (id: string) => void;
  collapseOnScroll?: boolean;
  proximity?: boolean;
  position?: "top" | "bottom";
  fixed?: boolean;
  "aria-label"?: string;
  className?: string;
};

/** A compact floating nav that can quietly tuck away during downward scroll. */
export function FloatingIslandNav({
  items,
  activeId,
  defaultActiveId,
  onActiveChange,
  collapseOnScroll = false,
  proximity = false,
  position = "bottom",
  fixed = true,
  className,
  "aria-label": ariaLabel = "Quick navigation",
}: FloatingIslandNavProps) {
  const source = useScrollSource(collapseOnScroll);
  const hidden = useMotionValue(0);
  const settled = useSpring(hidden, springs.soft);
  const y = useTransform(settled, [0, 1], [0, position === "bottom" ? 28 : -28]);
  const opacity = useTransform(settled, [0, 1], [1, 0]);

  useEffect(() => {
    if (!collapseOnScroll) {
      hidden.set(0);
      return;
    }
    let previous = source.y.get();
    const stop = source.y.on("change", (next) => {
      const delta = next - previous;
      if (next < 64 || delta < -4) hidden.set(0);
      else if (delta > 5) hidden.set(1);
      previous = next;
    });
    return stop;
  }, [collapseOnScroll, hidden, source.y]);

  const island = (
    <motion.div style={{ y, opacity }}>
      <LiquidNavbar
        items={items}
        activeId={activeId}
        defaultActiveId={defaultActiveId}
        onActiveChange={onActiveChange}
        aria-label={ariaLabel}
        className="rounded-[999px] bg-white/75 p-1 shadow-[0_18px_55px_rgba(37,41,51,.13)] backdrop-blur-md"
      />
    </motion.div>
  );

  return (
    <div
      className={cn(
        "pointer-events-none right-0 left-0 z-40 flex justify-center px-4",
        fixed ? "fixed" : "relative",
        fixed && (position === "bottom" ? "bottom-5" : "top-5"),
        className,
      )}
    >
      <div className="pointer-events-auto">
        {proximity ? (
          <Magnetic strength={0.12} range={90} maxOffset={3} preset="soft">
            {island}
          </Magnetic>
        ) : (
          island
        )}
      </div>
    </div>
  );
}
