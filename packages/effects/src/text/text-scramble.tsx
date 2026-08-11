"use client";

import { useMotionEnabled } from "@pinky/primitives";
import { useCallback, useEffect, useRef, useState } from "react";

const DEFAULT_CHARACTERS = "·+*#@";

export type TextScrambleProps = {
  text: string;
  duration?: number;
  characters?: string;
  trigger?: "mount" | "hover" | "manual";
  className?: string;
  disabled?: boolean;
};

/**
 * A short decode effect. The accessible label is always the resolved text;
 * only the decorative visual child changes during the brief animation.
 */
export function TextScramble({
  text,
  duration = 480,
  characters = DEFAULT_CHARACTERS,
  trigger = "mount",
  className,
  disabled = false,
}: TextScrambleProps) {
  const motionEnabled = useMotionEnabled();
  const [display, setDisplay] = useState(text);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const clear = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
  }, []);

  const run = useCallback(() => {
    clear();
    if (!motionEnabled || disabled || !characters || duration <= 0) {
      setDisplay(text);
      return;
    }

    const started = performance.now();
    const tick = () => {
      const elapsed = performance.now() - started;
      const progress = Math.min(elapsed / duration, 1);
      const resolved = Math.floor(progress * text.length);
      const next = Array.from(text, (character, index) => {
        if (index < resolved || /\s/.test(character)) return character;
        return characters[Math.floor(Math.random() * characters.length)] ?? character;
      }).join("");
      setDisplay(progress >= 1 ? text : next);
      if (progress >= 1) clear();
    };

    tick();
    timer.current = setInterval(tick, 40);
  }, [characters, clear, disabled, duration, motionEnabled, text]);

  useEffect(() => {
    setDisplay(text);
    if (trigger === "mount") run();
    return clear;
  }, [clear, run, text, trigger]);

  return (
    <span
      className={className}
      aria-label={text}
      data-pinky-text-scramble
      onPointerEnter={trigger === "hover" ? run : undefined}
      onFocus={trigger === "hover" ? run : undefined}
    >
      <span aria-hidden="true">{display}</span>
    </span>
  );
}
