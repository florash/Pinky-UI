"use client";

import { useMotionEnabled } from "@pinky-ui/primitives";
import { useEffect, useRef, type ReactNode } from "react";

import { cn } from "../internal/cn";
import { useFinePointer, usePointerSource } from "../internal/pointer-motion";
import { useRect } from "../internal/use-rect";

export type ImageTrailProps = {
  children?: ReactNode;
  /** Image URLs, cycled in order as the pointer moves. */
  images: string[];
  /** Pointer speed in px/s below which nothing appears. */
  threshold?: number;
  /** How long one image takes to fade out, in ms. */
  lifetime?: number;
  /** Width of a trail image, in px. Height follows the aspect ratio. */
  size?: number;
  aspect?: number;
  /** Maximum tilt of a trail image, in degrees. */
  rotation?: number;
  /** Pointer travel between images, in px. */
  spacing?: number;
  /** Hard cap on simultaneous images. */
  count?: number;
  className?: string;
  disabled?: boolean;
};

/**
 * Images that flick past along the pointer's path when you move through a
 * region quickly.
 *
 * The velocity threshold is what makes this feel intentional rather than
 * sticky: browsing slowly leaves the section clean, and only a deliberate sweep
 * pulls the work out. A trail that fires on any movement makes a page feel like
 * it is shedding.
 *
 * A fixed pool of `count` `<img>` elements is created once and recycled, so a
 * long sweep costs no allocations and the DOM never grows.
 */
export function ImageTrail({
  children,
  images,
  threshold = 80,
  lifetime = 700,
  size = 180,
  aspect = 1.25,
  rotation = 8,
  spacing = 90,
  count = 8,
  className,
  disabled = false,
}: ImageTrailProps) {
  const motionEnabled = useMotionEnabled();
  const fine = useFinePointer();
  const active = motionEnabled && fine && !disabled && images.length > 0;

  const container = useRef<HTMLDivElement>(null);
  const rect = useRect(container);
  const pointer = usePointerSource(active);
  const nodes = useRef<HTMLImageElement[]>([]);
  const poolSize = Math.max(Math.floor(count), 0);

  const height = Math.round(size / aspect);

  useEffect(() => {
    if (!active) return;

    const pool = nodes.current.slice(0, poolSize);
    if (pool.length === 0) return;
    const animations: Animation[] = new Array(pool.length);
    let cursor = 0;
    let image = 0;
    let lastX = 0;
    let lastY = 0;
    let seeded = false;

    const spawn = () => {
      const box = rect.current;
      if (!box) return;

      const x = pointer.x.get();
      const y = pointer.y.get();

      const inside =
        x >= box.left && x <= box.left + box.width && y >= box.top && y <= box.top + box.height;
      if (!inside) {
        seeded = false;
        return;
      }

      if (!seeded) {
        seeded = true;
        lastX = x;
        lastY = y;
        return;
      }

      if (pointer.speed.get() < threshold) return;
      if (Math.hypot(x - lastX, y - lastY) < spacing) return;
      lastX = x;
      lastY = y;

      const index = cursor;
      cursor = (cursor + 1) % pool.length;
      const node = pool[index];
      if (!node) return;

      const src = images[image % images.length];
      image += 1;
      if (src && node.getAttribute("src") !== src) node.setAttribute("src", src);

      if (typeof node.animate !== "function") return;
      animations[index]?.cancel();

      const localX = x - box.left - size / 2;
      const localY = y - box.top - height / 2;
      // Alternate the lean so a sweep reads as a scatter, not a shear.
      const tilt = (index % 2 === 0 ? 1 : -1) * rotation;

      animations[index] = node.animate(
        [
          {
            transform: `translate3d(${localX}px, ${localY}px, 0) rotate(${tilt}deg) scale(0.86)`,
            opacity: 0,
          },
          {
            transform: `translate3d(${localX}px, ${localY}px, 0) rotate(${tilt}deg) scale(1)`,
            opacity: 1,
            offset: 0.18,
          },
          {
            transform: `translate3d(${localX}px, ${localY}px, 0) rotate(${tilt}deg) scale(0.94)`,
            opacity: 0,
          },
        ],
        { duration: lifetime, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "forwards" },
      );
    };

    const stopX = pointer.x.on("change", spawn);
    const stopY = pointer.y.on("change", spawn);

    return () => {
      stopX();
      stopY();
      for (const animation of animations) animation?.cancel();
    };
  }, [
    active,
    count,
    height,
    images,
    lifetime,
    pointer.speed,
    pointer.x,
    pointer.y,
    poolSize,
    rect,
    rotation,
    size,
    spacing,
    threshold,
  ]);

  return (
    <div ref={container} className={cn("relative isolate", className)}>
      {active ? (
        <div
          aria-hidden
          style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}
        >
          {Array.from({ length: poolSize }, (_, index) => (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              key={index}
              alt=""
              ref={(node) => {
                if (node) nodes.current[index] = node;
              }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: size,
                height,
                objectFit: "cover",
                borderRadius: 14,
                opacity: 0,
                willChange: "transform, opacity",
                boxShadow: "var(--shadow-soft)",
              }}
            />
          ))}
        </div>
      ) : null}
      {children}
    </div>
  );
}
