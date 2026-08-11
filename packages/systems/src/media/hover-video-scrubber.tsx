"use client";

import { useRef, type KeyboardEvent, type PointerEvent } from "react";

import { cn } from "../internal/cn";

export type HoverVideoScrubberProps = {
  src: string;
  poster?: string;
  label: string;
  preload?: "none" | "metadata" | "auto";
  clickToPlay?: boolean;
  muted?: boolean;
  className?: string;
  onPlayChange?: (playing: boolean) => void;
};

/** Pointer position seeks the video directly; React does not render per frame. */
export function HoverVideoScrubber({ src, poster, label, preload = "metadata", clickToPlay = true, muted = true, className, onPlayChange }: HoverVideoScrubberProps) {
  const video = useRef<HTMLVideoElement>(null);
  const frame = useRef(0);
  const seek = (clientX: number, target: HTMLElement) => {
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const node = video.current;
      if (!node || !Number.isFinite(node.duration)) return;
      const box = target.getBoundingClientRect();
      node.currentTime = Math.min(Math.max((clientX - box.left) / Math.max(box.width, 1), 0), 1) * node.duration;
    });
  };
  const pointer = (event: PointerEvent<HTMLDivElement>) => seek(event.clientX, event.currentTarget);
  const toggle = async () => {
    const node = video.current;
    if (!node) return;
    if (node.paused) { await node.play(); onPlayChange?.(true); } else { node.pause(); onPlayChange?.(false); }
  };
  const keys = (event: KeyboardEvent<HTMLDivElement>) => {
    const node = video.current;
    if (!node) return;
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      node.currentTime = Math.min(Math.max(node.currentTime + (event.key === "ArrowRight" ? 2 : -2), 0), Number.isFinite(node.duration) ? node.duration : Infinity);
    } else if ((event.key === " " || event.key === "Enter") && clickToPlay) { event.preventDefault(); void toggle(); }
  };
  return (
    <div role="group" aria-label={label} tabIndex={0} onPointerMove={pointer} onPointerDown={pointer} onKeyDown={keys} onClick={() => clickToPlay && void toggle()} className={cn("relative overflow-hidden rounded-[22px] focus-visible:outline-2", className)}>
      <video ref={video} src={src} poster={poster} preload={preload} muted={muted} playsInline className="size-full object-cover" onPlay={() => onPlayChange?.(true)} onPause={() => onPlayChange?.(false)} />
      <span className="pointer-events-none absolute right-3 bottom-3 rounded-full bg-black/65 px-3 py-1.5 text-xs text-white">Scrub · {clickToPlay ? "play" : "preview"}</span>
    </div>
  );
}
