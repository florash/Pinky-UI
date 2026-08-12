"use client";

import { springs, useMotionEnabled } from "@pinky/primitives";
import { LayoutGroup, motion } from "motion/react";
import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";

import { cn } from "../internal/cn";
import { useCompactLayout } from "../internal/use-compact-layout";
import { useControllable } from "../internal/use-controllable";

export type GalleryListMorphItem = { id: string; title: string; media: ReactNode; meta?: ReactNode; href?: string };
export type GalleryListMorphProps = {
  items: GalleryListMorphItem[];
  mode?: "gallery" | "list";
  defaultMode?: "gallery" | "list";
  onModeChange?: (mode: "gallery" | "list") => void;
  columns?: 2 | 3 | 4;
  label?: string;
  className?: string;
  disabled?: boolean;
};

/** The same keyed collection visibly travels between a media grid and a list. */
export function GalleryListMorph({
  items,
  mode,
  defaultMode = "gallery",
  onModeChange,
  columns = 3,
  label = "Gallery and list",
  className,
  disabled = false,
}: GalleryListMorphProps) {
  const motionEnabled = useMotionEnabled();
  const compact = useCompactLayout();
  const [current, setCurrent] = useControllable(mode, defaultMode, onModeChange);
  const enabled = motionEnabled && !disabled;
  const list = useRef<HTMLUListElement>(null);
  const columnCount = compact ? Math.min(columns, 2) : columns;

  const keyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key.toLowerCase() === "g") { event.preventDefault(); setCurrent("gallery"); }
    if (event.key.toLowerCase() === "l") { event.preventDefault(); setCurrent("list"); }
  };

  const effective = compact && current === "gallery" ? "gallery" : current;

  return (
    <div className={cn("w-full", className)} onKeyDown={keyDown}>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><p className="font-mono text-xs text-ink-500">{items.length} items · {effective}</p><div role="group" aria-label="Collection view"><button type="button" aria-pressed={effective === "gallery"} onClick={() => setCurrent("gallery")} className={cn("min-h-10 rounded-l-pill border px-3 py-2 text-sm transition-colors", effective === "gallery" ? "border-ink-900 bg-ink-900 text-milk" : "border-line bg-white text-ink-700 hover:bg-cloud-50")}>Gallery</button><button type="button" aria-pressed={effective === "list"} onClick={() => setCurrent("list")} className={cn("min-h-10 rounded-r-pill border border-l-0 px-3 py-2 text-sm transition-colors", effective === "list" ? "border-ink-900 bg-ink-900 text-milk" : "border-line bg-white text-ink-700 hover:bg-cloud-50")}>List</button></div></div>
      <LayoutGroup id={`gallery-list-${label}`}>
        <ul ref={list} aria-label={label} className={cn("list-none p-0", effective === "gallery" ? "grid gap-3" : "flex flex-col divide-y divide-line rounded-2xl border border-line bg-white")} style={effective === "gallery" ? { gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` } : undefined}>
          {items.map((item, index) => <MorphItem key={item.id} item={item} index={index} mode={effective} enabled={enabled} />)}
        </ul>
      </LayoutGroup>
    </div>
  );
}

function MorphItem({ item, index, mode, enabled }: { item: GalleryListMorphItem; index: number; mode: "gallery" | "list"; enabled: boolean }) {
  const [focused, setFocused] = useState(false);
  const body = <><motion.div layout className={cn("relative overflow-hidden bg-cloud-50", mode === "gallery" ? "aspect-[4/3]" : "size-20 shrink-0 rounded-xl")} layoutId={`gallery-media-${item.id}`} animate={enabled ? { scale: focused ? 1.04 : 1 } : { scale: 1 }}>{item.media}</motion.div><div className={cn(mode === "gallery" ? "p-4" : "min-w-0 flex-1")}><motion.h3 layout className="font-display font-semibold" layoutId={`gallery-title-${item.id}`} animate={enabled ? { x: focused ? 4 : 0 } : { x: 0 }}>{item.title}</motion.h3>{item.meta ? <motion.p layout className="mt-1 text-xs text-ink-500">{item.meta}</motion.p> : null}</div></>;
  return <motion.li layout className={cn("group relative", mode === "gallery" ? "overflow-hidden rounded-2xl border border-line bg-white shadow-soft" : "flex items-center gap-4 px-4 py-3")} animate={enabled ? { x: focused ? 4 : 0 } : { x: 0 }} transition={enabled ? { type: "spring", ...springs.soft } : { duration: 0 }} onPointerEnter={(event) => { if (event.pointerType !== "touch" && event.pointerType !== "pen") setFocused(true); }} onPointerLeave={() => setFocused(false)} onFocus={() => setFocused(true)} onBlur={(event) => { if (!(event.relatedTarget instanceof Node) || !event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}><span className={cn("absolute font-mono text-xs text-ink-500", mode === "list" ? "left-4" : "top-3 left-3 z-10 rounded-pill bg-white/80 px-2 py-1")}>{mode === "list" ? String(index + 1).padStart(2, "0") : null}</span>{item.href ? <a href={item.href} className={cn("flex outline-none focus-visible:ring-2 focus-visible:ring-ink-900", mode === "gallery" ? "flex-col" : "w-full items-center gap-4")}>{body}</a> : <div className={cn("flex", mode === "gallery" ? "flex-col" : "w-full items-center gap-4")}>{body}</div>}</motion.li>;
}
