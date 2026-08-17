"use client";

import { AnimatePresence, motion } from "motion/react";
import { useMotionEnabled } from "@pinky-ui/primitives";
import { useEffect, useRef, useState, type ReactNode } from "react";

export type StickyStoryStep = {
  id?: string;
  eyebrow?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  content?: ReactNode;
  visual: ReactNode;
};

export type StickyStoryProps = {
  steps: StickyStoryStep[];
  className?: string;
  visualClassName?: string;
  contentClassName?: string;
  top?: number;
  disabled?: boolean;
};

/**
 * A sticky visual paired with readable, normally-flowing story steps. On
 * compact/touch layouts each visual moves back into its corresponding step so
 * the page becomes an ordinary, accessible stack.
 */
export function StickyStory({
  steps,
  className,
  visualClassName,
  contentClassName,
  top = 24,
  disabled = false,
}: StickyStoryProps) {
  const motionEnabled = useMotionEnabled();
  const [compact, setCompact] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const stepRefs = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)");
    const sync = () => setCompact(query.matches || window.innerWidth <= 767);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (compact || disabled || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        let best = -1;
        let ratio = 0;
        for (const entry of entries) {
          if (!entry.isIntersecting || entry.intersectionRatio < ratio) continue;
          const index = Number((entry.target as HTMLElement).dataset.pinkyStoryIndex);
          if (Number.isFinite(index)) {
            best = index;
            ratio = entry.intersectionRatio;
          }
        }
        if (best >= 0) setActiveIndex(best);
      },
      { threshold: [0.2, 0.5, 0.8], rootMargin: "-15% 0px -35% 0px" },
    );

    for (const node of stepRefs.current) {
      if (node) observer.observe(node);
    }
    return () => observer.disconnect();
  }, [compact, disabled, steps.length]);

  if (steps.length === 0) return null;

  const activeStep = steps[Math.min(activeIndex, steps.length - 1)] ?? steps[0];

  return (
    <div className={className} style={{ display: "grid", gridTemplateColumns: compact ? "1fr" : "minmax(0, 0.9fr) minmax(0, 1fr)", gap: compact ? 28 : 56 }}>
      <div className={visualClassName} style={{ position: compact ? "relative" : "sticky", top: compact ? undefined : top, alignSelf: "start", minHeight: compact ? undefined : 320 }}>
        {!compact && activeStep ? (
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeStep.id ?? activeIndex}
              initial={motionEnabled && !disabled ? { opacity: 0, scale: 0.97 } : false}
              animate={{ opacity: 1, scale: 1 }}
              exit={motionEnabled && !disabled ? { opacity: 0, scale: 0.98 } : undefined}
              transition={{ duration: motionEnabled && !disabled ? 0.32 : 0 }}
            >
              {activeStep.visual}
            </motion.div>
          </AnimatePresence>
        ) : null}
      </div>

      <div className={contentClassName}>
        {steps.map((step, index) => (
          <article
            key={step.id ?? index}
            ref={(node) => {
              stepRefs.current[index] = node;
            }}
            data-pinky-story-index={index}
            style={{ minHeight: compact ? undefined : "72vh", paddingBlock: compact ? 0 : "12vh" }}
          >
            {compact ? <div style={{ marginBottom: 20 }}>{step.visual}</div> : null}
            {step.eyebrow ? <div>{step.eyebrow}</div> : null}
            {step.title ? <h2>{step.title}</h2> : null}
            {step.description ? <p>{step.description}</p> : null}
            {step.content}
          </article>
        ))}
      </div>
    </div>
  );
}
