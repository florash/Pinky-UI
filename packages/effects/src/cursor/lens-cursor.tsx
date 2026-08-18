"use client";

import { motion, useMotionTemplate, useMotionValue, useTransform, type MotionStyle } from "motion/react";
import { useMotionEnabled } from "@pinky-ui/primitives";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { useFinePointer, usePointerSource } from "../internal/pointer-motion";
import { useRect } from "../internal/use-rect";

export type LensCursorProps = {
  children: ReactNode;
  /** Image used inside the magnifier. The child image remains the source of truth for accessibility. */
  src?: string;
  radius?: number;
  zoom?: number;
  tint?: string;
  borderColor?: string;
  className?: string;
  zIndex?: number;
  disabled?: boolean;
};

/**
 * A restrained local magnifier for media surfaces.
 *
 * The lens is decorative and follows a fine pointer only. A focused surface
 * receives a centred lens as a useful keyboard fallback; touch devices keep
 * the normal image instead of pretending they have a hover cursor.
 */
export function LensCursor({
  children,
  src,
  radius = 72,
  zoom = 1.55,
  tint = "transparent",
  borderColor = "rgba(255,255,255,0.76)",
  className,
  zIndex = 30,
  disabled = false,
}: LensCursorProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rect = useRect(ref);
  const motionEnabled = useMotionEnabled();
  const fine = useFinePointer();
  const active = motionEnabled && fine && !disabled && Boolean(src);
  const pointer = usePointerSource(active);
  const localX = useMotionValue(0);
  const localY = useMotionValue(0);
  const visible = useMotionValue(0);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!active) {
      visible.set(0);
      return;
    }

    const update = () => {
      const box = rect.current;
      if (!box) return;

      const x = pointer.x.get() - box.left;
      const y = pointer.y.get() - box.top;
      const inside = x >= 0 && x <= box.width && y >= 0 && y <= box.height;
      if (!inside || !pointer.presence.get()) {
        visible.set(0);
        return;
      }

      localX.set(x);
      localY.set(y);
      visible.set(1);
    };

    update();
    const stopX = pointer.x.on("change", update);
    const stopY = pointer.y.on("change", update);
    const stopPresence = pointer.presence.on("change", update);
    return () => {
      stopX();
      stopY();
      stopPresence();
    };
  }, [active, localX, localY, pointer.presence, pointer.x, pointer.y, rect, visible]);

  const left = useTransform(localX, (value) => value - radius);
  const top = useTransform(localY, (value) => value - radius);
  const width = useTransform(localX, (value) => {
    const box = rect.current;
    return `${box ? 50 + (0.5 - value / Math.max(box.width, 1)) * 100 : 50}%`;
  });
  const height = useTransform(localY, (value) => {
    const box = rect.current;
    return `${box ? 50 + (0.5 - value / Math.max(box.height, 1)) * 100 : 50}%`;
  });
  const backgroundPosition = useMotionTemplate`${width} ${height}`;
  const opacity = useTransform(visible, (value) => (focused ? Math.max(value, 1) : value));

  const lensStyle: MotionStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: radius * 2,
    height: radius * 2,
    borderRadius: "50%",
    pointerEvents: "none",
    zIndex,
    overflow: "hidden",
    backgroundImage: src ? `url(${JSON.stringify(src)})` : undefined,
    backgroundRepeat: "no-repeat",
    backgroundSize: `${Math.max(zoom, 1) * 100}% ${Math.max(zoom, 1) * 100}%`,
    backgroundPosition,
    backgroundColor: tint,
    border: `1px solid ${borderColor}`,
    boxShadow: "0 10px 26px rgba(37,41,51,0.16)",
    x: left,
    y: top,
    opacity,
  };

  return (
    <div
      ref={ref}
      className={className}
      tabIndex={active ? 0 : undefined}
      onFocus={() => {
        if (!active) return;
        const box = rect.current;
        if (!box) return;
        localX.set(box.width / 2);
        localY.set(box.height / 2);
        visible.set(1);
        setFocused(true);
      }}
      onBlur={() => {
        setFocused(false);
        visible.set(0);
      }}
      style={{ position: "relative" }}
    >
      {children}
      {active ? <motion.span aria-hidden style={lensStyle} /> : null}
    </div>
  );
}
