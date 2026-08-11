"use client";

import { motion } from "motion/react";
import { useMotionEnabled, usePressSpring } from "@pinky/primitives";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";

import { cn } from "../internal/cn";

export type HoldToConfirmProps = {
  children: string;
  duration?: number;
  onConfirm: () => void;
  disabled?: boolean;
  className?: string;
};

export function HoldToConfirm({ children, duration = 1200, onConfirm, disabled = false, className }: HoldToConfirmProps) {
  const motionEnabled = useMotionEnabled();
  const press = usePressSpring({ scale: .98, disabled });
  const [progress, setProgress] = useState(0);
  const [armed, setArmed] = useState(false);
  const started = useRef(0);
  const timer = useRef<number | null>(null);
  const interval = useRef<number | null>(null);
  const clear = () => { if (timer.current) clearTimeout(timer.current); if (interval.current) clearInterval(interval.current); timer.current = null; interval.current = null; };
  useEffect(() => clear, []);
  const begin = () => {
    if (disabled) return;
    if (!motionEnabled) { if (armed) { setArmed(false); onConfirm(); } else setArmed(true); return; }
    if (timer.current) return;
    started.current = performance.now(); setProgress(0);
    interval.current = window.setInterval(() => setProgress(Math.min((performance.now() - started.current) / duration, 1)), 50);
    timer.current = window.setTimeout(() => { clear(); setProgress(1); onConfirm(); }, duration);
  };
  const cancel = () => { if (!motionEnabled) return; clear(); setProgress(0); };
  const keyDown = (event: KeyboardEvent) => { if ((event.key === " " || event.key === "Enter") && !event.repeat) { event.preventDefault(); begin(); } };
  const keyUp = (event: KeyboardEvent) => { if (event.key === " " || event.key === "Enter") { event.preventDefault(); cancel(); } };
  return <motion.button type="button" disabled={disabled} onPointerDown={() => motionEnabled && begin()} onPointerUp={cancel} onPointerLeave={cancel} onPointerCancel={cancel} onKeyDown={keyDown} onKeyUp={keyUp} onClick={() => !motionEnabled && begin()} style={{ scale: press.scale }} className={cn("relative isolate overflow-hidden rounded-full bg-[color:var(--color-ink-900,#252933)] px-5 py-3 text-[color:var(--color-milk,#fcfbf8)] disabled:opacity-40", className)}><motion.span aria-hidden className="absolute inset-y-0 left-0 -z-10 origin-left bg-[color:var(--color-blush-300,#f4c7d7)]" animate={{ width: `${progress * 100}%` }} transition={{ duration: .05 }} /><span>{!motionEnabled && armed ? "Press again to confirm" : children}</span><span className="sr-only" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)} /></motion.button>;
}
