"use client";

import { useEffect, useRef } from "react";

import { subscribeToPointer } from "../internal/pointer-store";
import { useElementRect } from "../internal/use-element-rect";
import { useMotionEnabled } from "../internal/use-motion-enabled";

export type PointerGlowOptions = {
  /** How far outside the element the glow starts fading in, in px. */
  range?: number;
  disabled?: boolean;
};

/**
 * Writes the pointer's position, relative to an element, into CSS custom
 * properties: `--pinky-glow-x`, `--pinky-glow-y` and `--pinky-glow-opacity`.
 *
 * Lighting is then pure CSS. React renders once; the browser does the rest,
 * which is what keeps several glowing surfaces on one page cheap.
 */
export function usePointerGlow<T extends HTMLElement>({
  range = 90,
  disabled = false,
}: PointerGlowOptions = {}) {
  const ref = useRef<T>(null);
  const rect = useElementRect(ref);
  const motionEnabled = useMotionEnabled();
  const active = motionEnabled && !disabled;
  // A zero range would divide the falloff by nothing and leave the glow dark.
  const falloff = Math.max(range, 1);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (!active) {
      // Reduced motion still gets light, it just stops chasing the pointer:
      // the gradient sits at the centre and CSS `:hover` fades it in.
      element.style.setProperty("--pinky-glow-x", "50%");
      element.style.setProperty("--pinky-glow-y", "50%");
      element.style.removeProperty("--pinky-glow-opacity");
      return;
    }

    let lastOpacity = -1;

    return subscribeToPointer((pointer) => {
      const box = rect.current;
      if (!box) return;

      if (pointer.coarse || !pointer.active) {
        if (lastOpacity !== 0) {
          lastOpacity = 0;
          element.style.setProperty("--pinky-glow-opacity", "0");
        }
        return;
      }

      const dx = pointer.x - box.centerX;
      const dy = pointer.y - box.centerY;
      const outsideX = Math.max(Math.abs(dx) - box.width / 2, 0);
      const outsideY = Math.max(Math.abs(dy) - box.height / 2, 0);
      const distance = Math.hypot(outsideX, outsideY);
      const opacity = distance >= falloff ? 0 : 1 - distance / falloff;

      if (opacity > 0) {
        element.style.setProperty("--pinky-glow-x", `${pointer.x - box.left}px`);
        element.style.setProperty("--pinky-glow-y", `${pointer.y - box.top}px`);
      }

      // Rounded so a resting pointer stops producing style writes entirely.
      const rounded = Math.round(opacity * 100) / 100;
      if (rounded !== lastOpacity) {
        lastOpacity = rounded;
        element.style.setProperty("--pinky-glow-opacity", `${rounded}`);
      }
    });
  }, [active, falloff, rect]);

  return ref;
}
