"use client";

import { motion } from "motion/react";
import { useMotionEnabled } from "@pinky-ui/primitives";
import { type ReactNode } from "react";

import { cn } from "../internal/cn";
import { useControllable } from "../internal/use-controllable";

export type MediaPlayerMode = "inline" | "floating" | "closed";
export type FloatingMediaPlayerProps = {
  children: ReactNode;
  label: string;
  mode?: MediaPlayerMode;
  defaultMode?: MediaPlayerMode;
  onModeChange?: (mode: MediaPlayerMode) => void;
  playing?: boolean;
  onPlayPause?: (playing: boolean) => void;
  className?: string;
};

export function FloatingMediaPlayer({ children, label, mode, defaultMode = "inline", onModeChange, playing = false, onPlayPause, className }: FloatingMediaPlayerProps) {
  const [current, setCurrent] = useControllable(mode, defaultMode, onModeChange);
  const motionEnabled = useMotionEnabled();
  if (current === "closed") return null;
  const floating = current === "floating";
  return (
    <motion.section aria-label={label} layout={motionEnabled} className={cn(floating ? "fixed right-4 bottom-4 z-40 w-[min(22rem,calc(100vw-2rem))] rounded-[22px] bg-white p-3 shadow-2xl" : "relative rounded-[22px] bg-white p-3 shadow-soft", className)} transition={motionEnabled ? { type: "spring", stiffness: 240, damping: 30 } : { duration: 0 }}>
      <div className="overflow-hidden rounded-2xl">{children}</div>
      <div className="mt-3 flex items-center gap-2">
        {onPlayPause ? <button type="button" onClick={() => onPlayPause(!playing)} aria-label={playing ? "Pause media" : "Play media"} className="rounded-full border border-[color:var(--color-line,rgba(70,90,115,.1))] px-3 py-2">{playing ? "Ⅱ" : "▶"}</button> : null}
        <span className="min-w-0 flex-1 truncate text-sm font-medium">{label}</span>
        <button type="button" onClick={() => setCurrent(floating ? "inline" : "floating")} aria-label={floating ? "Restore player" : "Minimize player"} className="rounded-full border border-[color:var(--color-line,rgba(70,90,115,.1))] px-3 py-2">{floating ? "↗" : "↘"}</button>
        <button type="button" onClick={() => setCurrent("closed")} aria-label="Close player" className="rounded-full border border-[color:var(--color-line,rgba(70,90,115,.1))] px-3 py-2">×</button>
      </div>
    </motion.section>
  );
}
