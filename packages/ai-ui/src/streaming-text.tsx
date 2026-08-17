"use client";

import { useMotionEnabled } from "@pinky-ui/primitives";
import { useEffect, useRef } from "react";

import { cn } from "./internal/cn";

export type StreamingTextProps = {
  /** The text revealed so far — grow this as tokens arrive to stream in real time. */
  text: string;
  /** Characters revealed per second while animating. */
  speed?: number;
  /** Set to false to reveal the remaining text immediately, e.g. from a Stop button. */
  streaming?: boolean;
  /** Fires once the visible text catches up with `text`. */
  onDone?: () => void;
  /** Shows a blinking block cursor while text is still catching up. */
  cursor?: boolean;
  as?: "p" | "span" | "div";
  className?: string;
};

/**
 * A screen reader gets the complete `text` immediately through a hidden node;
 * only the visual reveal is animated, so nobody has to wait on the typewriter
 * to hear the message.
 */
export function StreamingText({
  text,
  speed = 45,
  streaming = true,
  onDone,
  cursor = true,
  as: Tag = "p",
  className,
}: StreamingTextProps) {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const revealedRef = useRef(0);
  // `motionEnabled` flips from false to true right after mount (it starts
  // false so server and first-paint markup match); dedupe on `text` so that
  // transition doesn't fire `onDone` a second time for the same message.
  const notifiedRef = useRef<string | null>(null);
  const motionEnabled = useMotionEnabled();

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;

    // A shorter or unrelated `text` (a fresh message) restarts the reveal.
    if (revealedRef.current > text.length || text.slice(0, revealedRef.current) !== node.textContent) {
      revealedRef.current = 0;
    }

    const notifyDone = () => {
      if (notifiedRef.current === text) return;
      notifiedRef.current = text;
      onDone?.();
    };

    if (!motionEnabled || !streaming) {
      node.textContent = text;
      revealedRef.current = text.length;
      notifyDone();
      return;
    }

    let frame = 0;
    let last = performance.now();
    let carry = 0;

    const tick = (now: number) => {
      const advance = Math.floor((carry += ((now - last) / 1000) * speed));
      last = now;
      if (advance > 0) {
        carry -= advance;
        revealedRef.current = Math.min(text.length, revealedRef.current + advance);
        node.textContent = text.slice(0, revealedRef.current);
      }
      if (revealedRef.current < text.length) frame = requestAnimationFrame(tick);
      else notifyDone();
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [text, speed, streaming, motionEnabled, onDone]);

  return (
    <Tag className={cn("whitespace-pre-wrap", className)}>
      <span ref={nodeRef} aria-hidden />
      {cursor ? (
        <span
          aria-hidden
          className={cn(
            "ml-0.5 inline-block h-[1em] w-[0.5em] translate-y-[0.15em] bg-ink-900 align-middle",
            motionEnabled && streaming ? "animate-pulse" : "hidden",
          )}
        />
      ) : null}
      <span className="sr-only">{text}</span>
    </Tag>
  );
}
