"use client";

import { cn } from "@pinky/components";

import { THEMES, useTheme, type Theme } from "./theme-provider";

const SWATCHES: Record<Theme, string> = {
  milk: "var(--color-milk)",
  blush: "var(--color-blush-200)",
  cloud: "var(--color-cloud-200)",
};

/**
 * Switches the page environment. Themes retint the atmosphere; they are not
 * three separate design systems, so the control stays this small.
 */
export function ThemeSwitch({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  return (
    <div
      role="radiogroup"
      aria-label="Colour environment"
      className={cn("inline-flex items-center gap-1 rounded-pill border border-line bg-white/70 p-1", className)}
    >
      {THEMES.map((option) => (
        <button
          key={option}
          role="radio"
          aria-checked={theme === option}
          aria-label={option}
          title={option}
          onClick={() => setTheme(option)}
          className={cn(
            "size-6 rounded-pill border transition-[transform,box-shadow,border-color] duration-300 ease-[var(--ease-soft)]",
            theme === option
              ? "scale-105 border-ink-500/40 shadow-soft"
              : "border-line hover:border-line-strong",
          )}
          style={{ background: SWATCHES[option] }}
        />
      ))}
    </div>
  );
}
