"use client";

import { springs, useMotionEnabled } from "@pinky/primitives";
import { motion } from "motion/react";
import { useState, type ReactNode } from "react";

import { cn } from "../internal/cn";

export type LayeredEditorialProps = {
  title: ReactNode;
  description?: ReactNode;
  media: ReactNode;
  foreground?: ReactNode;
  background?: ReactNode;
  caption?: ReactNode;
  className?: string;
  disabled?: boolean;
};

/** A readable editorial stack where typography and media occupy distinct depth planes. */
export function LayeredEditorial({ title, description, media, foreground, background, caption, className, disabled = false }: LayeredEditorialProps) {
  const motionEnabled = useMotionEnabled();
  const [active, setActive] = useState(false);
  const enabled = motionEnabled && !disabled;

  return <section className={cn("relative isolate overflow-hidden rounded-[28px] bg-cloud-50 p-6 sm:p-12", className)} onPointerEnter={(event) => { if (event.pointerType !== "touch" && event.pointerType !== "pen") setActive(true); }} onPointerLeave={() => setActive(false)} onFocusCapture={() => setActive(true)} onBlurCapture={(event) => { if (!(event.relatedTarget instanceof Node) || !event.currentTarget.contains(event.relatedTarget)) setActive(false); }}>
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">{background}</div>
    <div className="relative min-h-[26rem] [perspective:1100px] sm:min-h-[32rem]">
      <motion.div aria-hidden className="pointer-events-none absolute inset-x-0 top-4 z-10 font-display text-[clamp(4rem,13vw,10rem)] leading-[.82] font-semibold tracking-[-.08em] text-ink-900/10" animate={enabled ? { x: active ? -6 : 0, y: active ? -4 : 0 } : { x: 0, y: 0 }} transition={enabled ? { type: "spring", ...springs.soft } : { duration: 0 }}>{title}</motion.div>
      <div className="relative z-20 max-w-xl pt-5 sm:pt-14"><h2 className="max-w-lg font-display text-4xl leading-[.98] font-semibold tracking-tight sm:text-6xl">{title}</h2>{description ? <p className="mt-5 max-w-md text-base leading-relaxed text-ink-700">{description}</p> : null}</div>
      <motion.div className="absolute right-0 bottom-8 z-30 w-[min(70%,28rem)] overflow-hidden rounded-[24px] shadow-lift" animate={enabled ? { z: active ? 26 : 0, y: active ? -6 : 0, rotate: active ? -1.2 : 0 } : { z: 0, y: 0, rotate: 0 }} transition={enabled ? { type: "spring", ...springs.soft } : { duration: 0 }}>{media}</motion.div>
      {foreground ? <motion.div className="absolute right-[8%] bottom-2 z-40" animate={enabled ? { z: active ? 46 : 12, y: active ? -10 : 0 } : { z: 0, y: 0 }} transition={enabled ? { type: "spring", ...springs.soft } : { duration: 0 }}>{foreground}</motion.div> : null}
      {caption ? <div className="absolute bottom-0 left-0 z-40 max-w-44 text-xs leading-relaxed text-ink-500">{caption}</div> : null}
    </div>
  </section>;
}
