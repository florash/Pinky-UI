"use client";

import { AnimatePresence, motion } from "motion/react";
import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { cn } from "../internal/cn";
import { useControllable } from "../internal/use-controllable";

const FOCUS_RING = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25";

function PlayPauseGlyph({ playing, size = 16 }: { playing: boolean; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      {playing ? (
        <><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></>
      ) : (
        <path d="M8 5.5v13l11-6.5z" />
      )}
    </svg>
  );
}

export type VerticalFeedItem = { id: string; content: ReactNode; label?: string };
export type VerticalFeedProps = {
  items: VerticalFeedItem[];
  index?: number;
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
  label?: string;
  className?: string;
};

/**
 * The TikTok/Reels feed: one full-height item per scroll snap, the active
 * index tracked by IntersectionObserver rather than scroll-position math so
 * it stays correct under momentum scrolling and resize. ArrowUp/ArrowDown on
 * the focused container is the full keyboard path — native scroll-snap is
 * already the touch gesture, so there is no separate gesture to shadow.
 */
export function VerticalFeed({ items, index, defaultIndex = 0, onIndexChange, label = "Feed", className }: VerticalFeedProps) {
  const [current, setCurrent] = useControllable(index, defaultIndex, onIndexChange);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const nextIndex = itemRefs.current.findIndex((el) => el === visible.target);
        if (nextIndex !== -1) setCurrent(nextIndex);
      },
      { root: container, threshold: [0.6] },
    );
    itemRefs.current.forEach((el) => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, [items.length, setCurrent]);

  const goTo = (next: number) => {
    const clamped = Math.max(0, Math.min(items.length - 1, next));
    itemRefs.current[clamped]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      ref={containerRef}
      role="group"
      aria-label={label}
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "ArrowDown" || event.key === "PageDown") { event.preventDefault(); goTo(current + 1); }
        if (event.key === "ArrowUp" || event.key === "PageUp") { event.preventDefault(); goTo(current - 1); }
      }}
      className={cn("relative h-full snap-y snap-mandatory overflow-y-auto overscroll-y-contain", FOCUS_RING, className)}
    >
      {items.map((item, itemIndex) => (
        <div key={item.id} ref={(el) => { itemRefs.current[itemIndex] = el; }} className="relative flex h-full w-full snap-start snap-always items-center justify-center">
          {item.content}
        </div>
      ))}
      {items.length > 1 ? (
        <div aria-hidden className="pointer-events-none absolute inset-y-4 right-3 flex flex-col gap-1.5">
          {items.map((_, dotIndex) => (
            <span key={dotIndex} className={cn("h-1.5 w-1.5 rounded-full", dotIndex === current ? "bg-white" : "bg-white/40")} />
          ))}
        </div>
      ) : null}
      <p className="sr-only" aria-live="polite">{items[current]?.label ?? `Item ${current + 1}`} — {current + 1} of {items.length}</p>
    </div>
  );
}

export type VoiceWaveformProps = {
  amplitudes: number[];
  duration?: string;
  playing?: boolean;
  defaultPlaying?: boolean;
  onPlayingChange?: (playing: boolean) => void;
  progress?: number;
  onSeek?: (progress: number) => void;
  label?: string;
  className?: string;
};

/**
 * A voice-message waveform: static bars carry amplitude, a played/unplayed
 * colour split carries progress. Seeking is a real `role="slider"` with
 * arrow-key support, not a bare click target, since the waveform itself
 * conveys position visually but needs an accessible equivalent too.
 */
export function VoiceWaveform({ amplitudes, duration, playing, defaultPlaying = false, onPlayingChange, progress = 0, onSeek, label = "Voice message", className }: VoiceWaveformProps) {
  const [isPlaying, setPlaying] = useControllable(playing, defaultPlaying, onPlayingChange);
  const barsRef = useRef<HTMLDivElement>(null);
  const clamped = Math.min(1, Math.max(0, progress));

  const seekAt = (clientX: number) => {
    const el = barsRef.current;
    if (!el || !onSeek) return;
    const rect = el.getBoundingClientRect();
    onSeek(Math.min(1, Math.max(0, (clientX - rect.left) / rect.width)));
  };

  return (
    <div className={cn("flex items-center gap-3 rounded-full bg-cloud-50 py-2 pl-2 pr-4", className)}>
      <button type="button" onClick={() => setPlaying(!isPlaying)} aria-label={isPlaying ? "Pause voice message" : "Play voice message"} aria-pressed={isPlaying} className={cn("inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-ink-900 text-milk", FOCUS_RING)}>
        <PlayPauseGlyph playing={isPlaying} size={14} />
      </button>
      <div
        ref={barsRef}
        role="slider"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(clamped * 100)}
        tabIndex={0}
        onKeyDown={(event) => {
          if (!onSeek) return;
          if (event.key === "ArrowRight") { event.preventDefault(); onSeek(Math.min(1, clamped + 0.05)); }
          if (event.key === "ArrowLeft") { event.preventDefault(); onSeek(Math.max(0, clamped - 0.05)); }
        }}
        onPointerDown={(event) => seekAt(event.clientX)}
        className={cn("flex h-8 flex-1 items-center gap-[3px]", FOCUS_RING)}
      >
        {amplitudes.map((amplitude, index) => {
          const played = amplitudes.length > 1 ? index / (amplitudes.length - 1) <= clamped : clamped >= 1;
          return <span key={index} aria-hidden className={cn("w-[3px] shrink-0 rounded-full", played ? "bg-ink-900" : "bg-ink-900/25")} style={{ height: `${Math.max(0.15, amplitude) * 100}%` }} />;
        })}
      </div>
      {duration ? <span className="shrink-0 font-mono text-[0.65rem] text-ink-500">{duration}</span> : null}
    </div>
  );
}

export type ReactionOption = { id: string; emoji: string; label: string };
export type ReactionPickerProps = {
  options: ReactionOption[];
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  children: ReactNode;
  label?: string;
  className?: string;
};

/**
 * iMessage/Slack tapback: holding the wrapped content opens a row of
 * reactions. The small corner button opens the same row on click, since a
 * hold gesture has no keyboard equivalent — it is the only path for
 * keyboard and screen-reader users, not a decorative extra.
 */
export function ReactionPicker({ options, value, defaultValue = null, onValueChange, children, label = "React", className }: ReactionPickerProps) {
  const [selected, setSelected] = useControllable(value, defaultValue, onValueChange);
  const [open, setOpen] = useState(false);
  const holdTimer = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: globalThis.KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const pick = (id: string) => {
    setSelected(selected === id ? null : id);
    setOpen(false);
  };

  const clearHold = () => {
    if (holdTimer.current) { window.clearTimeout(holdTimer.current); holdTimer.current = null; }
  };
  const startHold = () => {
    clearHold();
    holdTimer.current = window.setTimeout(() => setOpen(true), 420);
  };

  const activeOption = options.find((option) => option.id === selected);

  return (
    <div ref={containerRef} className={cn("relative inline-flex", className)}>
      <div onPointerDown={startHold} onPointerUp={clearHold} onPointerLeave={clearHold} onPointerCancel={clearHold} onContextMenu={(event) => { event.preventDefault(); clearHold(); setOpen(true); }}>
        {children}
      </div>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-label={activeOption ? `${label} — reacted ${activeOption.label}` : label}
        aria-expanded={open}
        className={cn("absolute -bottom-2 -right-2 inline-flex size-7 items-center justify-center rounded-full border border-line bg-white text-xs shadow-sm", FOCUS_RING)}
      >
        {activeOption ? activeOption.emoji : "+"}
      </button>
      <AnimatePresence>
        {open ? (
          <motion.div
            role="menu"
            aria-label={label}
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.9 }}
            transition={{ duration: 0.16 }}
            className="absolute -top-14 left-0 z-10 flex gap-1 rounded-full border border-line bg-white p-1.5 shadow-soft"
          >
            {options.map((option) => (
              <button key={option.id} type="button" role="menuitemradio" aria-checked={selected === option.id} onClick={() => pick(option.id)} aria-label={option.label} className={cn("inline-flex size-9 items-center justify-center rounded-full text-lg hover:bg-cloud-50", FOCUS_RING)}>
                {option.emoji}
              </button>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export type LiveActivityCardProps = {
  title: string;
  subtitle?: string;
  progress?: number;
  icon?: ReactNode;
  tone?: "default" | "success" | "warning";
  onDismiss?: () => void;
  className?: string;
};

/**
 * A Dynamic-Island-style pinned status pill for one in-progress task
 * (delivery, upload, timer) — generic, unlike Mini Player's media focus.
 */
export function LiveActivityCard({ title, subtitle, progress, icon, tone = "default", onDismiss, className }: LiveActivityCardProps) {
  const toneRing = tone === "success" ? "ring-blush-300/60" : tone === "warning" ? "ring-cloud-300/60" : "ring-white/15";
  const clamped = typeof progress === "number" ? Math.min(1, Math.max(0, progress)) : undefined;
  return (
    <div role="status" aria-live="polite" className={cn("flex items-center gap-3 rounded-full border border-ink-900 bg-ink-900 px-3 py-2 text-milk shadow-lift ring-1", toneRing, className)}>
      {icon ? <span aria-hidden className="grid size-7 shrink-0 place-items-center rounded-full bg-white/15">{icon}</span> : null}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-xs font-medium">{title}</span>
        {subtitle ? <span className="block truncate text-[0.65rem] text-milk/70">{subtitle}</span> : null}
      </span>
      {clamped !== undefined ? (
        <span aria-hidden className="relative size-6 shrink-0">
          <svg viewBox="0 0 24 24" className="size-6 -rotate-90">
            <circle cx="12" cy="12" r="10" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />
            <circle cx="12" cy="12" r="10" fill="none" stroke="white" strokeWidth="3" strokeDasharray={`${clamped * 62.8} 62.8`} strokeLinecap="round" />
          </svg>
        </span>
      ) : null}
      {onDismiss ? (
        <button type="button" onClick={onDismiss} aria-label="Dismiss" className={cn("shrink-0 rounded-full p-1 text-milk/70 hover:text-milk", FOCUS_RING)}>×</button>
      ) : null}
    </div>
  );
}

export type NotificationStackItemData = { id: string; title: string; body?: string; time?: string };
export type NotificationStackProps = {
  items: NotificationStackItemData[];
  expanded?: boolean;
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  onDismiss?: (id: string) => void;
  label?: string;
  className?: string;
};

/**
 * iOS-style grouped notifications: a shallow layered stack at rest — a
 * single real button, since the peek cards behind it are decorative, not a
 * fan of separately-focusable ghosts — that opens into a dismissible list.
 */
export function NotificationStack({ items, expanded, defaultExpanded = false, onExpandedChange, onDismiss, label = "Notifications", className }: NotificationStackProps) {
  const [isExpanded, setExpanded] = useControllable(expanded, defaultExpanded, onExpandedChange);
  if (items.length === 0) return null;
  const [top, ...rest] = items as [NotificationStackItemData, ...NotificationStackItemData[]];

  if (!isExpanded) {
    return (
      <div className={cn("relative", className)}>
        {rest.slice(0, 2).map((_, index) => (
          <div key={index} aria-hidden className="absolute inset-x-0 top-0 h-16 rounded-2xl border border-line bg-white shadow-soft" style={{ transform: `translateY(${(index + 1) * 8}px) scale(${1 - (index + 1) * 0.04})`, zIndex: -index }} />
        ))}
        <button type="button" onClick={() => setExpanded(true)} aria-label={items.length > 1 ? `${top.title}. And ${items.length - 1} more notifications. Expand.` : `${top.title}. Expand.`} className={cn("relative z-10 flex w-full items-start justify-between gap-3 rounded-2xl border border-line bg-white px-4 py-3 text-left shadow-soft", FOCUS_RING)}>
          <span className="min-w-0">
            <span className="block truncate text-sm font-medium text-ink-900">{top.title}</span>
            {top.body ? <span className="block truncate text-xs text-ink-500">{top.body}</span> : null}
          </span>
          {items.length > 1 ? <span className="shrink-0 rounded-full bg-cloud-100 px-2 py-0.5 text-[0.65rem] text-ink-700">+{items.length - 1}</span> : null}
        </button>
      </div>
    );
  }

  return (
    <div role="group" aria-label={label} className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <p className="font-mono text-[0.6rem] tracking-[0.1em] text-ink-500 uppercase">{label}</p>
        <button type="button" onClick={() => setExpanded(false)} className={cn("text-xs text-ink-700 underline decoration-line-strong underline-offset-4", FOCUS_RING)}>Collapse</button>
      </div>
      {items.map((item) => (
        <div key={item.id} className="flex items-start justify-between gap-3 rounded-2xl border border-line bg-white px-4 py-3 shadow-soft">
          <span className="min-w-0">
            <span className="block truncate text-sm font-medium text-ink-900">{item.title}</span>
            {item.body ? <span className="block truncate text-xs text-ink-500">{item.body}</span> : null}
          </span>
          <span className="flex shrink-0 items-center gap-2">
            {item.time ? <span className="text-[0.65rem] text-ink-500">{item.time}</span> : null}
            {onDismiss ? <button type="button" onClick={() => onDismiss(item.id)} aria-label={`Dismiss ${item.title}`} className={cn("rounded-full p-1 text-ink-500 hover:text-ink-900", FOCUS_RING)}>×</button> : null}
          </span>
        </div>
      ))}
    </div>
  );
}
