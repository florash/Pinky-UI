"use client";

import { motion, useMotionValue } from "motion/react";
import { useMotionEnabled } from "@pinky-ui/primitives";
import { useEffect, useRef, type CSSProperties, type RefObject } from "react";

import { calculateScrollProgress, useScrollSource } from "../internal/scroll-motion";

export type ScrollProgressProps = {
  mode?: "page" | "container";
  target?: RefObject<HTMLElement | null>;
  orientation?: "horizontal" | "vertical";
  position?: "top" | "bottom" | "left" | "right";
  thickness?: number;
  color?: string;
  track?: string;
  className?: string;
  disabled?: boolean;
};

/** A lightweight page or local-container progress indicator. */
export function ScrollProgress({
  mode = "page",
  target,
  orientation = "horizontal",
  position = orientation === "horizontal" ? "top" : "right",
  thickness = 3,
  color = "var(--color-blush-300)",
  track = "transparent",
  className,
  disabled = false,
}: ScrollProgressProps) {
  const motionEnabled = useMotionEnabled();
  const progress = useMotionValue(0);
  const localRef = useRef<HTMLDivElement>(null);
  const source = useScrollSource(!disabled && mode === "page");
  const node = target ?? localRef;

  useEffect(() => {
    if (disabled) {
      progress.set(0);
      return;
    }

    if (mode === "page") {
      const update = () => {
        progress.set(
          calculateScrollProgress(
            source.y.get(),
            source.documentHeight.get(),
            source.viewportHeight.get(),
          ),
        );
      };
      update();
      const stopY = source.y.on("change", update);
      const stopHeight = source.viewportHeight.on("change", update);
      const stopDocument = source.documentHeight.on("change", update);
      return () => {
        stopY();
        stopHeight();
        stopDocument();
      };
    }

    const element = node.current;
    if (!element) return;
    const update = () => progress.set(calculateScrollProgress(element.scrollTop, element.scrollHeight, element.clientHeight));
    update();
    element.addEventListener("scroll", update, { passive: true });
    return () => element.removeEventListener("scroll", update);
  }, [disabled, mode, node, progress, source.documentHeight, source.viewportHeight, source.y]);

  const horizontal = orientation === "horizontal";
  const trackStyle: CSSProperties = {
    position: mode === "page" ? "fixed" : "absolute",
    zIndex: 50,
    pointerEvents: "none",
    background: track,
    ...(horizontal
      ? { left: 0, right: 0, [position === "bottom" ? "bottom" : "top"]: 0, height: thickness }
      : { top: 0, bottom: 0, [position === "left" ? "left" : "right"]: 0, width: thickness }),
  };

  return (
    <div ref={mode === "container" && !target ? localRef : undefined} className={className} style={trackStyle} aria-hidden>
      <motion.div
        style={{
          width: horizontal ? "100%" : "100%",
          height: horizontal ? "100%" : "100%",
          background: color,
          transformOrigin: horizontal ? "left center" : "center top",
          scaleX: horizontal ? progress : 1,
          scaleY: horizontal ? 1 : progress,
        }}
        transition={{ duration: motionEnabled ? 0.08 : 0 }}
      />
    </div>
  );
}

export { calculateScrollProgress };
