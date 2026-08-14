"use client";

import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { springs, useMotionEnabled } from "@pinky/primitives";
import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";

import { cn } from "../internal/cn";
import { useCompactLayout } from "../internal/use-compact-layout";
import { useControllable } from "../internal/use-controllable";

function mod(value: number, length: number) {
  return ((value % length) + length) % length;
}

export type CursorPreviewListItem = {
  id: string;
  label: string;
  preview: ReactNode;
  meta?: ReactNode;
  description?: ReactNode;
};

export type CursorPreviewListProps = {
  items: CursorPreviewListItem[];
  activeId?: string | null;
  defaultActiveId?: string | null;
  onActiveIdChange?: (id: string | null) => void;
  label?: string;
  className?: string;
};

/** A text-first browsing list with one detached preview that follows intent, not every frame. */
export function CursorPreviewList({ items, activeId, defaultActiveId, onActiveIdChange, label = "Preview list", className }: CursorPreviewListProps) {
  const [selectedId, setSelectedId] = useControllable(activeId, defaultActiveId ?? items[0]?.id ?? null, onActiveIdChange);
  const selected = items.find((item) => item.id === selectedId) ?? null;
  const previewPosition = { left: "var(--preview-x, 72%)", top: "var(--preview-y, 32%)" } as CSSProperties;

  const movePreview = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch" || event.pointerType === "pen") return;
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--preview-x", `${Math.min(Math.max(((event.clientX - rect.left) / Math.max(rect.width, 1)) * 100 + 12, 22), 78)}%`);
    event.currentTarget.style.setProperty("--preview-y", `${Math.min(Math.max(((event.clientY - rect.top) / Math.max(rect.height, 1)) * 100 + 6, 18), 72)}%`);
  };

  return (
    <div
      className={cn("relative min-w-0", className)}
      onPointerMove={movePreview}
      onPointerLeave={(event) => {
        if (!(event.currentTarget.contains(document.activeElement))) setSelectedId(null);
      }}
      onBlur={(event) => {
        if (!(event.currentTarget.contains(event.relatedTarget as Node | null))) setSelectedId(null);
      }}
    >
      <ul aria-label={label} className="m-0 list-none divide-y divide-line p-0">
        {items.map((item, index) => {
          const active = item.id === selectedId;
          return (
            <li key={item.id}>
              <button
                type="button"
                aria-pressed={active}
                onPointerEnter={(event) => { if (event.pointerType !== "touch" && event.pointerType !== "pen") setSelectedId(item.id); }}
                onFocus={() => setSelectedId(item.id)}
                onClick={() => setSelectedId(item.id)}
                className={cn("group flex min-h-16 w-full items-center gap-4 px-1 py-4 text-left transition-[padding,color] duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25", active && "px-3 text-ink-900")}
              >
                <span aria-hidden="true" className="w-8 shrink-0 font-mono text-[0.625rem] tracking-[0.14em] text-ink-400">{String(index + 1).padStart(2, "0")}</span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-lg font-semibold tracking-tight">{item.label}</span>
                  {item.description ? <span className="mt-1 block max-w-xl text-sm leading-relaxed text-ink-500">{item.description}</span> : null}
                </span>
                {item.meta ? <span aria-hidden="true" className="shrink-0 text-xs text-ink-500">{item.meta}</span> : null}
                <span aria-hidden className={cn("size-2 shrink-0 rounded-full bg-line-strong transition-colors", active && "bg-blush-400")} />
              </button>
            </li>
          );
        })}
      </ul>

      <aside
        aria-live="polite"
        aria-label={selected ? `${selected.label} preview` : "Preview"}
        className="pointer-events-none absolute z-10 hidden w-[min(16rem,42%)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[22px] border border-line bg-white/95 p-2 shadow-lift backdrop-blur sm:block"
        style={previewPosition}
      >
        <AnimatePresence mode="wait" initial={false}>
          {selected ? <motion.div key={selected.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>{selected.preview}</motion.div> : null}
        </AnimatePresence>
      </aside>
      <div className="mt-4 sm:hidden">
        <AnimatePresence mode="wait" initial={false}>
          {selected ? <motion.div key={selected.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="overflow-hidden rounded-[22px] border border-line bg-cloud-50 p-2">{selected.preview}</motion.div> : null}
        </AnimatePresence>
      </div>
    </div>
  );
}

export type HoverImageRevealItem = {
  id: string;
  label: string;
  media: ReactNode;
  meta?: ReactNode;
  description?: ReactNode;
};

export type HoverImageRevealProps = {
  items: HoverImageRevealItem[];
  activeId?: string;
  defaultActiveId?: string;
  onActiveIdChange?: (id: string) => void;
  label?: string;
  className?: string;
};

/** An editorial list whose text remains primary while one controlled media viewport changes. */
export function HoverImageReveal({ items, activeId, defaultActiveId, onActiveIdChange, label = "Editorial image list", className }: HoverImageRevealProps) {
  const [selectedId, setSelectedId] = useControllable(activeId, defaultActiveId ?? items[0]?.id ?? "", onActiveIdChange);
  const selected = items.find((item) => item.id === selectedId) ?? items[0];
  if (!selected) return null;

  const choose = (id: string) => setSelectedId(id);
  const preview = (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div key={selected.id} initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }} animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }} exit={{ opacity: 0, clipPath: "inset(100% 0 0 0)" }} transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden rounded-[24px] bg-cloud-50 p-2">{selected.media}</motion.div>
    </AnimatePresence>
  );

  return (
    <div className={cn("grid min-w-0 gap-7 sm:grid-cols-[minmax(0,1fr)_minmax(15rem,0.8fr)]", className)}>
      <ul aria-label={label} className="m-0 list-none divide-y divide-line p-0">
        {items.map((item, index) => {
          const active = item.id === selected.id;
          return (
            <li key={item.id}>
              <button type="button" aria-pressed={active} onPointerEnter={(event) => { if (event.pointerType !== "touch" && event.pointerType !== "pen") choose(item.id); }} onFocus={() => choose(item.id)} onClick={() => choose(item.id)} className={cn("group flex w-full items-start gap-4 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25", active && "text-ink-900")}>
                <span className={cn("mt-2 h-px w-8 shrink-0 bg-line-strong transition-[width,background-color] duration-300", active && "w-14 bg-blush-400")} />
                <span className="min-w-0 flex-1"><span className="block font-display text-xl font-semibold tracking-tight">{item.label}</span>{item.description ? <span className="mt-1 block max-w-lg text-sm leading-relaxed text-ink-500">{item.description}</span> : null}</span>
                {item.meta ? <span aria-hidden="true" className="shrink-0 pt-1 font-mono text-[0.625rem] tracking-[0.12em] text-ink-500 uppercase">{item.meta}</span> : <span aria-hidden="true" className="shrink-0 pt-1 font-mono text-[0.625rem] text-ink-400">{String(index + 1).padStart(2, "0")}</span>}
              </button>
              <div className="pb-4 sm:hidden">{active ? preview : null}</div>
            </li>
          );
        })}
      </ul>
      <aside aria-live="polite" aria-label={`${selected.label} image reveal`} className="sticky top-24 hidden h-fit sm:block">{preview}</aside>
    </div>
  );
}

export type ExpandableContentRowItem = {
  id: string;
  label: string;
  summary?: ReactNode;
  meta?: ReactNode;
  media?: ReactNode;
  content: ReactNode;
};

export type ExpandableContentRowProps = {
  items: ExpandableContentRowItem[];
  openIds?: string[];
  defaultOpenIds?: string[];
  onOpenIdsChange?: (ids: string[]) => void;
  multiple?: boolean;
  label?: string;
  className?: string;
};

/** Editorial/content disclosure that reflows surrounding rows instead of opening a modal. */
export function ExpandableContentRow({ items, openIds, defaultOpenIds = [], onOpenIdsChange, multiple = false, label = "Expandable content rows", className }: ExpandableContentRowProps) {
  const [shownIds, setShownIds] = useControllable(openIds, defaultOpenIds, onOpenIdsChange);
  const baseId = useId().replace(/:/g, "");
  const motionEnabled = useMotionEnabled();

  const toggle = (id: string) => {
    const isOpen = shownIds.includes(id);
    const next = multiple ? (isOpen ? shownIds.filter((value) => value !== id) : [...shownIds, id]) : isOpen ? [] : [id];
    setShownIds(next);
  };

  return (
    <ul aria-label={label} className={cn("m-0 list-none divide-y divide-line overflow-hidden rounded-[24px] border border-line bg-white/75 p-0", className)}>
      {items.map((item, index) => {
        const isOpen = shownIds.includes(item.id);
        const triggerId = `${baseId}-${item.id}-trigger`;
        const panelId = `${baseId}-${item.id}-panel`;
        return (
          <li key={item.id}>
            <button id={triggerId} type="button" aria-expanded={isOpen} aria-controls={panelId} onClick={() => toggle(item.id)} className="group flex min-h-16 w-full items-center gap-4 px-4 py-4 text-left transition-colors hover:bg-cloud-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ink-900/25 sm:px-5">
              <span className="w-7 shrink-0 font-mono text-[0.625rem] text-ink-400">{String(index + 1).padStart(2, "0")}</span>
              <span className="min-w-0 flex-1"><span className="block font-display text-base font-semibold tracking-tight">{item.label}</span>{item.summary ? <span className="mt-1 block text-sm leading-relaxed text-ink-500">{item.summary}</span> : null}</span>
              {item.meta ? <span className="hidden shrink-0 text-xs text-ink-500 sm:block">{item.meta}</span> : null}
              <span aria-hidden className="grid size-8 shrink-0 place-items-center rounded-full border border-line text-lg leading-none text-ink-700">{isOpen ? "−" : "+"}</span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div id={panelId} role="region" aria-labelledby={triggerId} initial={motionEnabled ? { height: 0, opacity: 0 } : false} animate={{ height: "auto", opacity: 1 }} exit={motionEnabled ? { height: 0, opacity: 0 } : undefined} transition={motionEnabled ? { duration: 0.32, ease: [0.22, 1, 0.36, 1] } : { duration: 0 }} className="overflow-hidden">
                  <div className="grid gap-5 border-t border-line bg-cloud-50/55 p-4 sm:grid-cols-[minmax(8rem,0.7fr)_minmax(0,1.3fr)] sm:p-5">
                    {item.media ? <div className="overflow-hidden rounded-2xl bg-white">{item.media}</div> : null}
                    <div className={cn("min-w-0", !item.media && "sm:col-span-2")}>{item.content}</div>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}

export type ListDetailMorphItem = {
  id: string;
  title: string;
  summary?: ReactNode;
  meta?: ReactNode;
  media: ReactNode;
  detail: ReactNode;
};

export type ListDetailMorphProps = {
  items: ListDetailMorphItem[];
  activeId?: string | null;
  onActiveIdChange?: (id: string | null) => void;
  label?: string;
  className?: string;
  disabled?: boolean;
};

/** The selected list item becomes the detail surface; it is not an unrelated modal or route fade. */
export function ListDetailMorph({ items, activeId, onActiveIdChange, label = "List detail morph", className, disabled = false }: ListDetailMorphProps) {
  const [selectedId, setSelectedId] = useControllable(activeId, null, onActiveIdChange);
  const motionEnabled = useMotionEnabled() && !disabled;
  const sourceButtons = useRef<Record<string, HTMLButtonElement | null>>({});
  const restoreId = useRef<string | null>(null);
  const detailHeading = useRef<HTMLHeadingElement>(null);
  const selected = items.find((item) => item.id === selectedId) ?? null;

  useEffect(() => {
    if (!selected) return;
    const frame = window.requestAnimationFrame(() => detailHeading.current?.focus());
    return () => window.cancelAnimationFrame(frame);
  }, [selected]);

  useEffect(() => {
    if (selected || !restoreId.current) return;
    const previous = restoreId.current;
    const frame = window.requestAnimationFrame(() => {
      sourceButtons.current[previous]?.focus();
      restoreId.current = null;
    });
    return () => window.cancelAnimationFrame(frame);
  }, [selected]);

  useEffect(() => {
    if (!selected) return;
    const handleEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      restoreId.current = selectedId;
      setSelectedId(null);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [selected, selectedId, setSelectedId]);

  const close = () => {
    const previous = selectedId;
    restoreId.current = previous;
    setSelectedId(null);
  };

  return (
    <LayoutGroup id={`list-detail-${label}`}>
      <div aria-label={label} className={cn("min-w-0", className)}>
        <AnimatePresence mode="wait" initial={false}>
          {!selected ? (
            <motion.ul key="list" layout={motionEnabled} className="m-0 grid list-none gap-3 p-0 sm:grid-cols-2">
              {items.map((item) => (
                <motion.li layout={motionEnabled} key={item.id} className="min-w-0 overflow-hidden rounded-[22px] border border-line bg-white/75 shadow-soft">
                  <button ref={(node) => { sourceButtons.current[item.id] = node; }} type="button" onClick={() => setSelectedId(item.id)} className="group block w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ink-900/25">
                    <motion.div layoutId={`detail-media-${item.id}`} className="aspect-[4/3] overflow-hidden bg-cloud-50">{item.media}</motion.div>
                    <div className="p-4"><div className="flex items-start justify-between gap-3"><motion.span layoutId={`detail-title-${item.id}`} className="font-display text-lg font-semibold tracking-tight">{item.title}</motion.span>{item.meta ? <span className="text-xs text-ink-500">{item.meta}</span> : null}</div>{item.summary ? <p className="mt-2 text-sm leading-relaxed text-ink-600">{item.summary}</p> : null}<span className="mt-4 inline-flex text-xs font-medium text-ink-700 underline decoration-line-strong underline-offset-4">Open detail ↗</span></div>
                  </button>
                </motion.li>
              ))}
            </motion.ul>
          ) : (
            <motion.section key="detail" layout={motionEnabled} className="overflow-hidden rounded-[26px] border border-line bg-white shadow-lift" onKeyDown={(event) => { if (event.key === "Escape") { event.preventDefault(); close(); } }}>
              <div className="flex items-center justify-between gap-4 border-b border-line px-4 py-3 sm:px-6"><button type="button" onClick={close} className="min-h-10 rounded-pill border border-line px-3 py-2 text-sm text-ink-700 transition-colors hover:bg-cloud-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25">← Back to collection</button><span className="font-mono text-[0.625rem] tracking-[0.14em] text-ink-500 uppercase">Detail · same object</span></div>
              <motion.div layoutId={`detail-media-${selected.id}`} className="max-h-[28rem] overflow-hidden bg-cloud-50">{selected.media}</motion.div>
              <div className="grid gap-6 p-5 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] sm:p-7"><div><motion.h2 ref={detailHeading} tabIndex={-1} layoutId={`detail-title-${selected.id}`} className="font-display text-3xl font-semibold tracking-tight outline-none">{selected.title}</motion.h2>{selected.meta ? <p className="mt-2 text-xs text-ink-500">{selected.meta}</p> : null}</div><div className="text-sm leading-relaxed text-ink-700">{selected.detail}</div></div>
            </motion.section>
          )}
        </AnimatePresence>
        <p className="mt-3 text-center font-mono text-[0.625rem] tracking-[0.12em] text-ink-500 uppercase">Select a source · Escape returns to it</p>
      </div>
    </LayoutGroup>
  );
}

export type ScrubPreviewProps = {
  frames: ReactNode[];
  labels?: string[];
  index?: number;
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
  label?: string;
  className?: string;
};

/** Bounded content inspection across frames, with a slider-like keyboard and touch path. */
export function ScrubPreview({ frames, labels = [], index, defaultIndex = 0, onIndexChange, label = "Scrub preview", className }: ScrubPreviewProps) {
  const [currentIndex, setCurrentIndex] = useControllable(index, defaultIndex, onIndexChange);
  const dragging = useRef(false);
  const active = Math.min(Math.max(currentIndex, 0), Math.max(frames.length - 1, 0));
  const setFrame = (next: number) => setCurrentIndex(Math.min(Math.max(next, 0), Math.max(frames.length - 1, 0)));
  const seek = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch" && !dragging.current) return;
    const rect = event.currentTarget.getBoundingClientRect();
    setFrame(Math.round(Math.min(Math.max((event.clientX - rect.left) / Math.max(rect.width, 1), 0), 1) * Math.max(frames.length - 1, 0)));
  };
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    setFrame(event.key === "Home" ? 0 : event.key === "End" ? frames.length - 1 : active + (event.key === "ArrowRight" ? 1 : -1));
  };

  if (!frames.length) return null;
  return (
    <div className={cn("min-w-0", className)}>
      <div role="slider" tabIndex={0} aria-label={label} aria-valuemin={1} aria-valuemax={frames.length} aria-valuenow={active + 1} aria-valuetext={labels[active] ?? `Frame ${active + 1}`} onKeyDown={onKeyDown} onPointerMove={seek} onPointerDown={(event) => { dragging.current = true; event.currentTarget.setPointerCapture(event.pointerId); seek(event); }} onPointerUp={() => { dragging.current = false; }} onPointerCancel={() => { dragging.current = false; }} className="relative touch-pan-y overflow-hidden rounded-[24px] border border-line bg-cloud-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25">
        <AnimatePresence mode="wait" initial={false}><motion.div key={active} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} className="min-h-48">{frames[active]}</motion.div></AnimatePresence>
        <div className="pointer-events-none absolute inset-x-3 bottom-3 flex items-center justify-between gap-3 rounded-pill bg-white/85 px-3 py-2 text-[0.625rem] text-ink-700 shadow-soft"><span>{labels[active] ?? `Frame ${active + 1}`}</span><span>{active + 1} / {frames.length}</span></div>
      </div>
      <div role="group" aria-label={`${label} frames`} className="mt-3 flex gap-1.5 overflow-x-auto pb-1">
        {frames.map((_, frameIndex) => <button key={frameIndex} type="button" aria-label={`Show ${labels[frameIndex] ?? `frame ${frameIndex + 1}`}`} aria-pressed={frameIndex === active} onClick={() => setFrame(frameIndex)} className={cn("h-2 min-w-8 flex-1 rounded-pill bg-line transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25", frameIndex === active && "bg-ink-900")}>{frameIndex === active ? <span className="sr-only">Current</span> : null}</button>)}
      </div>
    </div>
  );
}

type RevealDirection = "left" | "right" | "top" | "bottom";

export type DirectionalCardRevealProps = {
  label: string;
  children: ReactNode;
  reveal: ReactNode;
  className?: string;
};

/** Reveals a card's secondary surface from the side where intent entered. */
export function DirectionalCardReveal({ label, children, reveal, className }: DirectionalCardRevealProps) {
  const [direction, setDirection] = useState<RevealDirection>("bottom");
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const revealId = useId().replace(/:/g, "");
  const clip = { left: "inset(0 100% 0 0)", right: "inset(0 0 0 100%)", top: "inset(0 0 100% 0)", bottom: "inset(100% 0 0 0)" }[direction];
  const chooseDirection = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType === "touch" || event.pointerType === "pen") { setDirection("bottom"); return; }
    const rect = event.currentTarget.getBoundingClientRect();
    const distances = { left: Math.abs(event.clientX - rect.left), right: Math.abs(rect.right - event.clientX), top: Math.abs(event.clientY - rect.top), bottom: Math.abs(rect.bottom - event.clientY) };
    setDirection((Object.entries(distances).sort(([, a], [, b]) => a - b)[0]?.[0] as RevealDirection) ?? "bottom");
  };
  return (
    <button type="button" aria-label={label} aria-describedby={open ? revealId : undefined} aria-expanded={open} onPointerEnter={(event) => { chooseDirection(event); setOpen(true); }} onPointerDown={(event) => { if (event.pointerType === "touch") { chooseDirection(event); setOpen((value) => !value); } }} onPointerLeave={() => { if (!focused) setOpen(false); }} onFocus={() => { setDirection("bottom"); setFocused(true); setOpen(true); }} onBlur={() => { setFocused(false); setOpen(false); }} onKeyDown={(event) => { if (event.key === "Escape") { event.preventDefault(); setOpen(false); } else if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setOpen(true); } }} className={cn("group relative block min-h-48 w-full overflow-hidden rounded-[24px] border border-line bg-white text-left shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25", className)}>
      <span className="relative z-0 block h-full min-h-48 p-5">{children}</span>
      <span id={revealId} className="absolute inset-0 z-10 flex min-h-48 items-end bg-ink-900 p-5 text-milk transition-[clip-path,opacity] duration-500 ease-[var(--ease-soft)] motion-reduce:transition-none" style={{ clipPath: open ? "inset(0 0 0 0)" : clip, opacity: open ? 1 : 0 }}>{reveal}</span>
      <span aria-hidden className="pointer-events-none absolute right-4 bottom-4 z-20 rounded-pill bg-white/80 px-2 py-1 font-mono text-[0.55rem] tracking-[0.1em] text-ink-700 uppercase opacity-100 transition-opacity group-hover:opacity-0 group-focus-visible:opacity-0">enter from a side</span>
    </button>
  );
}

export type PeekPanelCollectionItem = {
  id: string;
  label: string;
  summary?: ReactNode;
  preview: ReactNode;
  detail: ReactNode;
};

export type PeekPanelCollectionProps = {
  items: PeekPanelCollectionItem[];
  activeId?: string;
  defaultActiveId?: string;
  onActiveIdChange?: (id: string) => void;
  label?: string;
  className?: string;
};

/** A collection keeps its items visible while an attached neighbour reveals the active detail. */
export function PeekPanelCollection({ items, activeId, defaultActiveId, onActiveIdChange, label = "Peek panel collection", className }: PeekPanelCollectionProps) {
  const [selectedId, setSelectedId] = useControllable(activeId, defaultActiveId ?? items[0]?.id ?? "", onActiveIdChange);
  const selected = items.find((item) => item.id === selectedId) ?? items[0];
  if (!selected) return null;
  const choose = (id: string) => setSelectedId(id);
  return (
    <div className={cn("grid min-w-0 gap-4 sm:grid-cols-[minmax(0,0.9fr)_minmax(15rem,1.1fr)]", className)}>
      <ul aria-label={label} className="m-0 grid list-none gap-2 p-0">
        {items.map((item, index) => <li key={item.id}><button type="button" aria-pressed={item.id === selected.id} onPointerEnter={(event) => { if (event.pointerType !== "touch" && event.pointerType !== "pen") choose(item.id); }} onFocus={() => choose(item.id)} onClick={() => choose(item.id)} className={cn("flex min-h-20 w-full items-center gap-3 rounded-2xl border border-line bg-white/75 p-3 text-left transition-[border-color,background-color,transform] duration-300 hover:border-line-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25", item.id === selected.id && "translate-x-1 border-ink-900 bg-blush-50")}><span className="font-mono text-[0.625rem] text-ink-400">{String(index + 1).padStart(2, "0")}</span><span className="min-w-0 flex-1"><span className="block font-medium">{item.label}</span>{item.summary ? <span className="mt-1 block truncate text-xs text-ink-500">{item.summary}</span> : null}</span><span aria-hidden>↗</span></button></li>)}
      </ul>
      <aside aria-live="polite" aria-label={`${selected.label} peek panel`} className="min-w-0 overflow-hidden rounded-[24px] border border-line bg-white shadow-soft"><AnimatePresence mode="wait" initial={false}><motion.div key={selected.id} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={{ type: "spring", ...springs.soft }}><div className="overflow-hidden bg-cloud-50 p-2">{selected.preview}</div><div className="border-t border-line p-5"><h3 className="font-display text-xl font-semibold tracking-tight">{selected.label}</h3><div className="mt-3 text-sm leading-relaxed text-ink-700">{selected.detail}</div></div></motion.div></AnimatePresence></aside>
    </div>
  );
}

export type MagazineIndexItem = {
  id: string;
  title: string;
  number?: string;
  meta?: ReactNode;
  description?: ReactNode;
  preview: ReactNode;
};

export type MagazineIndexProps = {
  items: MagazineIndexItem[];
  activeId?: string;
  defaultActiveId?: string;
  onActiveIdChange?: (id: string) => void;
  label?: string;
  className?: string;
};

/** A content index, not navigation: selecting a story changes the shared editorial preview. */
export function MagazineIndex({ items, activeId, defaultActiveId, onActiveIdChange, label = "Magazine index", className }: MagazineIndexProps) {
  const [selectedId, setSelectedId] = useControllable(activeId, defaultActiveId ?? items[0]?.id ?? "", onActiveIdChange);
  const selectedIndex = Math.max(0, items.findIndex((item) => item.id === selectedId));
  const selected = items[selectedIndex] ?? items[0];
  if (!selected) return null;
  const chooseIndex = (index: number) => setSelectedId(items[mod(index, items.length)]?.id ?? selected.id);
  const keyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    chooseIndex(event.key === "Home" ? 0 : event.key === "End" ? items.length - 1 : selectedIndex + (event.key === "ArrowDown" ? 1 : -1));
  };
  return (
    <div className={cn("grid min-w-0 gap-8 sm:grid-cols-[minmax(0,0.85fr)_minmax(15rem,1.15fr)]", className)}>
      <ol aria-label={label} className="m-0 list-none p-0">
        {items.map((item, index) => { const active = item.id === selected.id; return <li key={item.id} className="border-t border-line first:border-t-0"><button type="button" aria-pressed={active} onPointerEnter={(event) => { if (event.pointerType !== "touch" && event.pointerType !== "pen") setSelectedId(item.id); }} onFocus={() => setSelectedId(item.id)} onClick={() => setSelectedId(item.id)} onKeyDown={keyDown} className={cn("group flex w-full items-start gap-3 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25", active && "text-ink-900")}><span className={cn("pt-1 font-mono text-[0.625rem] tracking-[0.12em] text-ink-400", active && "text-blush-500")}>{item.number ?? String(index + 1).padStart(2, "0")}</span><span className="min-w-0 flex-1"><span className="block font-display text-xl font-semibold tracking-tight">{item.title}</span>{item.description ? <span className="mt-1 block max-w-md text-sm leading-relaxed text-ink-500">{item.description}</span> : null}</span>{item.meta ? <span className="hidden pt-1 text-[0.625rem] text-ink-500 sm:block">{item.meta}</span> : null}</button></li>; })}
      </ol>
      <aside aria-live="polite" aria-label={`${selected.title} editorial preview`} className="min-w-0"><AnimatePresence mode="wait" initial={false}><motion.div key={selected.id} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} transition={{ type: "spring", ...springs.soft }} className="overflow-hidden rounded-[26px] border border-line bg-white p-2 shadow-soft"><div className="aspect-[4/3] overflow-hidden rounded-[20px] bg-cloud-50">{selected.preview}</div><div className="flex items-center justify-between gap-3 px-3 py-4"><span className="font-display text-lg font-semibold tracking-tight">{selected.title}</span>{selected.meta ? <span className="text-xs text-ink-500">{selected.meta}</span> : null}</div></motion.div></AnimatePresence></aside>
    </div>
  );
}

export type ProgressiveCollectionItem = {
  id: string;
  label: string;
  summary?: ReactNode;
  meta?: ReactNode;
  content: ReactNode;
};

export type ProgressiveCollectionProps = {
  items: ProgressiveCollectionItem[];
  activeId?: string;
  defaultActiveId?: string;
  onActiveIdChange?: (id: string) => void;
  label?: string;
  className?: string;
};

/** A collection reallocates real layout space to the active item while inactive context stays compact. */
export function ProgressiveCollection({ items, activeId, defaultActiveId, onActiveIdChange, label = "Progressive collection", className }: ProgressiveCollectionProps) {
  const [selectedId, setSelectedId] = useControllable(activeId, defaultActiveId ?? items[0]?.id ?? "", onActiveIdChange);
  const compact = useCompactLayout();
  const motionEnabled = useMotionEnabled();
  if (!items.length) return null;
  return (
    <ul aria-label={label} className={cn("m-0 grid list-none gap-3 p-0", className)} style={{ gridTemplateColumns: compact ? "1fr" : items.map((item) => item.id === selectedId ? "minmax(0, 1.9fr)" : "minmax(0, 0.72fr)").join(" ") }}>
      {items.map((item) => { const active = item.id === selectedId; return <motion.li layout={motionEnabled} key={item.id} className={cn("min-w-0 overflow-hidden rounded-[24px] border border-line bg-white/75 p-4 shadow-soft", active && "border-ink-900")} transition={motionEnabled ? { type: "spring", ...springs.soft } : { duration: 0 }}><button type="button" aria-pressed={active} onClick={() => setSelectedId(item.id)} onFocus={() => setSelectedId(item.id)} className="flex min-h-24 w-full flex-col text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25"><span className="flex items-start justify-between gap-3"><span className="min-w-0 font-display text-lg font-semibold tracking-tight">{item.label}</span>{item.meta ? <span className="shrink-0 text-xs text-ink-500">{item.meta}</span> : null}</span>{item.summary ? <span className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-500">{item.summary}</span> : null}{active ? <span className="mt-5 block text-sm leading-relaxed text-ink-700">{item.content}</span> : <span className="mt-auto pt-5 font-mono text-[0.6rem] tracking-[0.1em] text-ink-400 uppercase">Focus to open</span>}</button></motion.li>; })}
    </ul>
  );
}

export type FocusStripCollectionItem = {
  id: string;
  label: string;
  meta?: ReactNode;
  content: ReactNode;
};

export type FocusStripCollectionProps = {
  items: FocusStripCollectionItem[];
  orientation?: "horizontal" | "vertical";
  activeId?: string;
  defaultActiveId?: string;
  onActiveIdChange?: (id: string) => void;
  label?: string;
  className?: string;
};

/** A content strip changes flex basis so the active item gains room and neighbours yield it. */
export function FocusStripCollection({ items, orientation = "horizontal", activeId, defaultActiveId, onActiveIdChange, label = "Focus strip", className }: FocusStripCollectionProps) {
  const [selectedId, setSelectedId] = useControllable(activeId, defaultActiveId ?? items[0]?.id ?? "", onActiveIdChange);
  const compact = useCompactLayout();
  const motionEnabled = useMotionEnabled();
  const vertical = orientation === "vertical" && !compact;
  return (
    <ul aria-label={label} className={cn("m-0 flex list-none gap-2 p-0", vertical ? "flex-col" : "overflow-x-auto pb-2", className)}>
      {items.map((item) => { const active = item.id === selectedId; return <motion.li layout={motionEnabled} key={item.id} className={cn("min-w-0 overflow-hidden rounded-[22px] border border-line bg-white/75", !vertical && "min-w-[12rem] sm:min-w-0")} style={{ flex: compact && !vertical ? "0 0 min(76vw, 20rem)" : active ? "1.8 1 0%" : "0.72 1 0%" }} transition={motionEnabled ? { type: "spring", ...springs.soft } : { duration: 0 }}><button type="button" aria-pressed={active} onPointerEnter={(event) => { if (event.pointerType !== "touch" && event.pointerType !== "pen") setSelectedId(item.id); }} onFocus={() => setSelectedId(item.id)} onClick={() => setSelectedId(item.id)} className="flex min-h-40 w-full flex-col p-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ink-900/25"><span className="flex items-start justify-between gap-3"><span className="font-display text-lg font-semibold tracking-tight">{item.label}</span>{item.meta ? <span className="text-xs text-ink-500">{item.meta}</span> : null}</span><span className={cn("mt-8 block text-sm leading-relaxed text-ink-700 transition-opacity duration-300 motion-reduce:transition-none", !active && "line-clamp-2 opacity-55")}>{item.content}</span></button></motion.li>; })}
    </ul>
  );
}

export type SharedPreviewCollectionItem = {
  id: string;
  label: string;
  meta?: ReactNode;
  description?: ReactNode;
  preview: ReactNode;
};

export type SharedPreviewCollectionProps = {
  items: SharedPreviewCollectionItem[];
  activeId?: string;
  defaultActiveId?: string;
  onActiveIdChange?: (id: string) => void;
  label?: string;
  className?: string;
};

/** Many compact entries drive one shared preview, keeping the browsing surface calm and direct. */
export function SharedPreviewCollection({ items, activeId, defaultActiveId, onActiveIdChange, label = "Shared preview collection", className }: SharedPreviewCollectionProps) {
  const [selectedId, setSelectedId] = useControllable(activeId, defaultActiveId ?? items[0]?.id ?? "", onActiveIdChange);
  const selected = items.find((item) => item.id === selectedId) ?? items[0];
  if (!selected) return null;
  return (
    <div className={cn("grid min-w-0 gap-5 sm:grid-cols-[minmax(9rem,0.62fr)_minmax(0,1.38fr)]", className)}>
      <ul aria-label={label} className="m-0 flex list-none gap-2 overflow-x-auto p-0 pb-1 sm:flex-col sm:overflow-visible">
        {items.map((item, index) => <li key={item.id} className="min-w-40 sm:min-w-0"><button type="button" aria-pressed={item.id === selected.id} onPointerEnter={(event) => { if (event.pointerType !== "touch" && event.pointerType !== "pen") setSelectedId(item.id); }} onFocus={() => setSelectedId(item.id)} onClick={() => setSelectedId(item.id)} className={cn("w-full rounded-xl border border-line bg-white/70 px-3 py-3 text-left transition-[border-color,background-color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25", item.id === selected.id && "border-ink-900 bg-blush-50")}><span className="block font-mono text-[0.6rem] text-ink-400">{String(index + 1).padStart(2, "0")}</span><span className="mt-1 block font-medium">{item.label}</span>{item.meta ? <span className="mt-1 block truncate text-xs text-ink-500">{item.meta}</span> : null}</button></li>)}
      </ul>
      <aside aria-live="polite" aria-label={`${selected.label} shared preview`} className="min-w-0 overflow-hidden rounded-[26px] border border-line bg-white p-2 shadow-soft"><AnimatePresence mode="wait" initial={false}><motion.div key={selected.id} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.02 }} transition={{ type: "spring", ...springs.soft }} className="overflow-hidden rounded-[20px] bg-cloud-50">{selected.preview}</motion.div></AnimatePresence><div className="flex flex-wrap items-center justify-between gap-3 px-3 py-4"><div><p className="font-display text-lg font-semibold tracking-tight">{selected.label}</p>{selected.description ? <p className="mt-1 text-sm text-ink-500">{selected.description}</p> : null}</div><span className="font-mono text-[0.6rem] tracking-[0.1em] text-ink-400 uppercase">shared surface</span></div></aside>
    </div>
  );
}

export type AccordionGalleryItem = {
  id: string;
  title: string;
  meta?: ReactNode;
  description?: ReactNode;
  media: ReactNode;
  content?: ReactNode;
};

export type AccordionGalleryProps = {
  items: AccordionGalleryItem[];
  activeId?: string | null;
  defaultActiveId?: string | null;
  onActiveIdChange?: (id: string | null) => void;
  label?: string;
  className?: string;
};

/** A media-led accordion: title row, masked gallery region and caption stay one object. */
export function AccordionGallery({ items, activeId, defaultActiveId = null, onActiveIdChange, label = "Accordion gallery", className }: AccordionGalleryProps) {
  const [selectedId, setSelectedId] = useControllable(activeId, defaultActiveId, onActiveIdChange);
  const motionEnabled = useMotionEnabled();
  const baseId = useId().replace(/:/g, "");
  const toggle = (id: string) => setSelectedId(selectedId === id ? null : id);
  return (
    <ul aria-label={label} className={cn("m-0 list-none divide-y divide-line overflow-hidden rounded-[24px] border border-line bg-white/75 p-0", className)}>
      {items.map((item, index) => { const open = selectedId === item.id; const triggerId = `${baseId}-${item.id}-trigger`; const panelId = `${baseId}-${item.id}-panel`; return <li key={item.id}><button id={triggerId} type="button" aria-expanded={open} aria-controls={panelId} onClick={() => toggle(item.id)} className="flex min-h-16 w-full items-center gap-4 px-4 py-4 text-left transition-colors hover:bg-cloud-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ink-900/25 sm:px-5"><span className="font-mono text-[0.625rem] text-ink-400">{String(index + 1).padStart(2, "0")}</span><span className="min-w-0 flex-1"><span className="block font-display text-lg font-semibold tracking-tight">{item.title}</span>{item.description ? <span className="mt-1 block truncate text-sm text-ink-500">{item.description}</span> : null}</span>{item.meta ? <span className="hidden text-xs text-ink-500 sm:block">{item.meta}</span> : null}<span aria-hidden className="grid size-8 place-items-center rounded-full border border-line text-lg">{open ? "−" : "+"}</span></button><AnimatePresence initial={false}>{open ? <motion.div id={panelId} role="region" aria-labelledby={triggerId} initial={motionEnabled ? { height: 0, opacity: 0 } : false} animate={{ height: "auto", opacity: 1 }} exit={motionEnabled ? { height: 0, opacity: 0 } : undefined} transition={motionEnabled ? { duration: 0.38, ease: [0.22, 1, 0.36, 1] } : { duration: 0 }} className="overflow-hidden"><div className="grid gap-5 border-t border-line bg-cloud-50/55 p-3 sm:grid-cols-[minmax(0,1.2fr)_minmax(12rem,0.8fr)] sm:p-5"><div className="overflow-hidden rounded-[20px] bg-white">{item.media}</div><div className="self-center p-2"><p className="font-display text-xl font-semibold tracking-tight">{item.title}</p>{item.meta ? <p className="mt-2 text-xs text-ink-500">{item.meta}</p> : null}{item.content ? <div className="mt-4 text-sm leading-relaxed text-ink-700">{item.content}</div> : null}</div></div></motion.div> : null}</AnimatePresence></li>; })}
    </ul>
  );
}
