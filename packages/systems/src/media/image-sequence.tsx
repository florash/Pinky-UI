"use client";

import { useEffect, useRef, type KeyboardEvent, type PointerEvent } from "react";

import { cn } from "../internal/cn";
import { useControllable } from "../internal/use-controllable";

export type ImageSequenceProps = {
  frames: string[];
  alt: string | ((index: number) => string);
  index?: number;
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
  interaction?: "pointer" | "drag";
  autoplay?: boolean;
  autoplayInterval?: number;
  preloadCount?: number;
  className?: string;
};

export function ImageSequence({ frames, alt, index, defaultIndex = 0, onIndexChange, interaction = "drag", autoplay = false, autoplayInterval = 900, preloadCount = 4, className }: ImageSequenceProps) {
  const [active, setActive] = useControllable(index, defaultIndex, onIndexChange);
  const dragging = useRef(false);
  const bounded = Math.min(Math.max(active, 0), Math.max(frames.length - 1, 0));
  const autoplayIndex = useRef(bounded);
  useEffect(() => { autoplayIndex.current = bounded; }, [bounded]);
  useEffect(() => {
    frames.slice(0, Math.min(Math.max(preloadCount, 1), frames.length)).forEach((src) => { const image = new Image(); image.src = src; });
  }, [frames, preloadCount]);
  useEffect(() => {
    if (!autoplay || frames.length < 2) return;
    const timer = window.setInterval(() => {
      autoplayIndex.current = (autoplayIndex.current + 1) % frames.length;
      setActive(autoplayIndex.current);
    }, autoplayInterval);
    return () => window.clearInterval(timer);
  }, [autoplay, autoplayInterval, frames.length, setActive]);
  const seek = (event: PointerEvent<HTMLDivElement>) => {
    if (interaction === "drag" && !dragging.current) return;
    const box = event.currentTarget.getBoundingClientRect();
    setActive(Math.round(Math.min(Math.max((event.clientX - box.left) / Math.max(box.width, 1), 0), 1) * Math.max(frames.length - 1, 0)));
  };
  const keys = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft" && event.key !== "Home" && event.key !== "End") return;
    event.preventDefault();
    if (event.key === "Home") setActive(0);
    else if (event.key === "End") setActive(Math.max(frames.length - 1, 0));
    else setActive(Math.min(Math.max(bounded + (event.key === "ArrowRight" ? 1 : -1), 0), Math.max(frames.length - 1, 0)));
  };
  const src = frames[bounded];
  return (
    <div role="slider" tabIndex={0} aria-label="Image sequence" aria-valuemin={1} aria-valuemax={Math.max(frames.length, 1)} aria-valuenow={bounded + 1} aria-valuetext={`Frame ${bounded + 1} of ${Math.max(frames.length, 1)}`} onKeyDown={keys} onPointerMove={seek} onPointerDown={(event) => { dragging.current = true; event.currentTarget.setPointerCapture(event.pointerId); seek(event); }} onPointerUp={() => { dragging.current = false; }} onPointerCancel={() => { dragging.current = false; }} className={cn("relative touch-pan-y overflow-hidden rounded-[22px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25 focus-visible:ring-offset-2", className)}>
      {/* Library consumers may supply local, remote or generated frame URLs; image policy belongs to the host framework. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {src ? <img src={src} alt={typeof alt === "function" ? alt(bounded) : alt} draggable={false} className="size-full select-none object-cover" /> : <div className="grid min-h-48 place-items-center">No frames</div>}
      <span className="absolute right-3 bottom-3 rounded-full bg-ink-900/80 px-3 py-1.5 text-xs text-milk">{bounded + 1} / {frames.length}</span>
    </div>
  );
}
