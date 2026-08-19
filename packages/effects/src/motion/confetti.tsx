"use client";

import { useMotionEnabled } from "@pinky-ui/primitives";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

import { cn } from "../internal/cn";

export type ConfettiProps = {
  trigger?: number;
  count?: number;
  colors?: string[];
  duration?: number;
  className?: string;
};

type Piece = { id: number; x: number; rotate: number; color: string; delay: number };

/**
 * A one-shot celebration burst, fired by incrementing `trigger` (starts
 * inactive at 0, so mounting the component never fires it on its own).
 * `aria-hidden`: this is decorative reinforcement for a success state the
 * calling component already announces (e.g. its own status text), not the
 * announcement itself. Reduced motion renders nothing rather than a static
 * substitute — a burst has no meaningful settled frame.
 */
export function Confetti({ trigger = 0, count = 24, colors = ["#f4c7d7", "#c8e4f7", "#252933"], duration = 1.1, className }: ConfettiProps) {
  const motionEnabled = useMotionEnabled();
  const [pieces, setPieces] = useState<Piece[]>([]);

  useEffect(() => {
    if (trigger === 0 || !motionEnabled) return;
    setPieces(
      Array.from({ length: count }, (_, index) => ({
        id: index,
        x: (Math.random() - 0.5) * 220,
        rotate: Math.random() * 360,
        color: colors[index % colors.length]!,
        delay: Math.random() * 0.12,
      })),
    );
    const timer = window.setTimeout(() => setPieces([]), duration * 1000 + 200);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger, motionEnabled]);

  if (pieces.length === 0) return null;

  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {pieces.map((piece) => (
        <motion.span
          key={piece.id}
          className="absolute top-1/2 left-1/2 block h-2 w-1.5 rounded-[1px]"
          style={{ background: piece.color }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
          animate={{ x: piece.x, y: 160 + Math.random() * 60, opacity: 0, rotate: piece.rotate }}
          transition={{ duration, delay: piece.delay, ease: [0.16, 1, 0.3, 1] }}
        />
      ))}
    </div>
  );
}
