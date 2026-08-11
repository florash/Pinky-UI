"use client";

import { motion } from "motion/react";
import { useMotionEnabled } from "@pinky/primitives";
import { useRef, type ReactNode } from "react";

import { useInView } from "../internal/in-view";

export type ImageRevealProps = {
  src?: string;
  alt?: string;
  children?: ReactNode;
  width?: number | string;
  height?: number | string;
  duration?: number;
  delay?: number;
  overlay?: string | false;
  className?: string;
  disabled?: boolean;
};

/** A media-specific reveal combining a mask, a slight scale and soft focus. */
export function ImageReveal({
  src,
  alt = "",
  children,
  width,
  height,
  duration = 0.78,
  delay = 0,
  overlay = "rgba(255,255,255,0.12)",
  className,
  disabled = false,
}: ImageRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const motionEnabled = useMotionEnabled();
  const visible = useInView(ref, { amount: 0.18, once: true });
  const animate = !motionEnabled || disabled || visible;

  return (
    <div ref={ref} className={className} style={{ position: "relative", overflow: "hidden", width, height }}>
      <motion.div
        initial={
          motionEnabled && !disabled
            ? { opacity: 0, scale: 1.06, filter: "blur(5px)", clipPath: "inset(0% 0% 100% 0%)" }
            : false
        }
        animate={
          animate
            ? { opacity: 1, scale: 1, filter: "blur(0px)", clipPath: "inset(0% 0% 0% 0%)" }
            : undefined
        }
        transition={{ duration: motionEnabled && !disabled ? duration : 0, delay: motionEnabled && !disabled ? delay : 0, ease: [0.22, 1, 0.36, 1] }}
        style={{ width: "100%", height: "100%" }}
      >
        {src ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={src} alt={alt} width={width} height={height} style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          children
        )}
      </motion.div>
      {overlay ? (
        <motion.span
          aria-hidden
          initial={motionEnabled && !disabled ? { opacity: 1 } : false}
          animate={animate ? { opacity: 0 } : undefined}
          transition={{ duration: motionEnabled && !disabled ? duration * 0.8 : 0, delay: motionEnabled && !disabled ? delay : 0 }}
          style={{ position: "absolute", inset: 0, pointerEvents: "none", background: overlay }}
        />
      ) : null}
    </div>
  );
}
