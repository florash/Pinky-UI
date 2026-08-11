"use client";

import { motion, useMotionValue, useTransform } from "motion/react";
import { useMotionEnabled } from "@pinky/primitives";
import { Children, useEffect, useRef, useState, type ReactNode } from "react";

import { useFinePointer } from "../internal/pointer-motion";
import { clampProgress, useScrollSource } from "../internal/scroll-motion";

export type HorizontalStoryProps = {
  panels?: ReactNode[];
  children?: ReactNode;
  gap?: number;
  height?: string | number;
  className?: string;
  panelClassName?: string;
  disabled?: boolean;
};

/** Maps a section's vertical travel to a restrained horizontal panel track. */
export function HorizontalStory({
  panels,
  children,
  gap = 24,
  height = "220vh",
  className,
  panelClassName,
  disabled = false,
}: HorizontalStoryProps) {
  const items = panels ?? Children.toArray(children);
  const section = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const motionEnabled = useMotionEnabled();
  const fine = useFinePointer();
  const [compact, setCompact] = useState(false);
  const source = useScrollSource(motionEnabled && fine && !disabled && !compact);
  const progress = useMotionValue(0);
  const maxXRef = useRef(0);
  const x = useTransform(progress, (value) => -value * maxXRef.current);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)");
    const sync = () => setCompact(query.matches || window.innerWidth <= 767);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const element = viewport.current;
    if (!element) return;

    const measure = () => {
      const next = Math.max(element.scrollWidth - element.clientWidth, 0);
      maxXRef.current = next;
    };
    measure();
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(measure);
    observer?.observe(element);
    window.addEventListener("resize", measure, { passive: true });
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [items.length, gap]);

  useEffect(() => {
    if (!motionEnabled || !fine || disabled || compact) {
      progress.set(0);
      return;
    }

    const update = () => {
      const element = section.current;
      if (!element) return;
      const box = element.getBoundingClientRect();
      const travel = Math.max(box.height - source.viewportHeight.get(), 1);
      progress.set(clampProgress(-box.top / travel));
    };
    update();
    const stopY = source.y.on("change", update);
    const stopHeight = source.viewportHeight.on("change", update);
    return () => {
      stopY();
      stopHeight();
    };
  }, [compact, disabled, fine, motionEnabled, progress, source.viewportHeight, source.y]);

  const nativeStyle = compact || !motionEnabled || !fine || disabled;

  return (
    <section ref={section} className={className} style={{ minHeight: nativeStyle ? undefined : height, position: "relative" }}>
      <div
        ref={viewport}
        style={{
          position: nativeStyle ? "relative" : "sticky",
          top: nativeStyle ? undefined : 0,
          minHeight: nativeStyle ? undefined : "100vh",
          display: "flex",
          alignItems: "center",
          overflowX: nativeStyle ? "auto" : "hidden",
          overscrollBehaviorX: "contain",
        }}
      >
        <motion.div
          className={panelClassName}
          style={{ display: "flex", gap, width: "max-content", paddingInline: 24, x: nativeStyle ? 0 : x, scrollSnapType: nativeStyle ? "x mandatory" : undefined }}
        >
          {items.map((panel, index) => (
            <div key={index} style={{ flex: "0 0 min(82vw, 560px)", scrollSnapAlign: "start" }}>
              {panel}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
