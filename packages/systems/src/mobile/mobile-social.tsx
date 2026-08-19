"use client";

import { useMotionEnabled } from "@pinky-ui/primitives";
import { AnimatePresence, motion } from "motion/react";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

import { cn } from "../internal/cn";
import { useControllable } from "../internal/use-controllable";

const FOCUS_RING = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25";
const SAFE_BOTTOM = "max(0.75rem, env(safe-area-inset-bottom))";
const SAFE_TOP = "max(1.5rem, env(safe-area-inset-top))";

function HeartGlyph({ className, filled }: { className?: string; filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={filled ? 0 : 2}>
      <path d="M12 20.5s-7.5-4.7-10-9.4C.5 7.8 2.3 4.5 5.7 4.5c2 0 3.6 1.1 4.3 2.6.7-1.5 2.3-2.6 4.3-2.6 3.4 0 5.2 3.3 3.7 6.6-2.5 4.7-10 9.4-10 9.4z" />
    </svg>
  );
}

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

function ReplyGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 10 4 15l5 5" />
      <path d="M4 15h10a6 6 0 0 0 6-6v-1" />
    </svg>
  );
}

export type StoryProgressProps = {
  count: number;
  index?: number;
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
  duration?: number;
  onComplete?: () => void;
  children: ReactNode;
  label?: string;
  className?: string;
};

/**
 * The Stories segmented progress bar: N segments auto-advance one at a time,
 * a press-and-hold pauses in place, and tapping either half of the media
 * steps to the previous/next segment. The tap zones are real buttons (not a
 * bare div with a pointer handler) so the same navigation is reachable by
 * keyboard and announced to assistive tech, since the hold-to-pause gesture
 * itself has no keyboard equivalent worth inventing.
 */
export function StoryProgress({ count, index, defaultIndex = 0, onIndexChange, duration = 4000, onComplete, children, label = "Story", className }: StoryProgressProps) {
  const motionEnabled = useMotionEnabled();
  const [current, setCurrent] = useControllable(index, defaultIndex, onIndexChange);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const frame = useRef<number | null>(null);
  const timer = useRef<number | null>(null);
  const startedAt = useRef<number | null>(null);
  const elapsedAtPause = useRef(0);
  const holdTimer = useRef<number | null>(null);
  const wasHold = useRef(false);

  const clearLoop = () => {
    if (frame.current) cancelAnimationFrame(frame.current);
    if (timer.current) window.clearTimeout(timer.current);
    frame.current = null;
    timer.current = null;
  };

  const goTo = (next: number) => {
    const clamped = Math.max(0, Math.min(count - 1, next));
    clearLoop();
    elapsedAtPause.current = 0;
    startedAt.current = null;
    setProgress(0);
    setCurrent(clamped);
  };

  const advance = () => {
    if (current >= count - 1) {
      setProgress(1);
      onComplete?.();
      return;
    }
    goTo(current + 1);
  };

  useEffect(() => {
    if (paused) return;
    if (!motionEnabled) {
      const remaining = Math.max(0, duration - elapsedAtPause.current);
      timer.current = window.setTimeout(() => {
        setProgress(1);
        advance();
      }, remaining);
      return () => { if (timer.current) window.clearTimeout(timer.current); };
    }
    const tick = (now: number) => {
      if (startedAt.current === null) startedAt.current = now - elapsedAtPause.current;
      const elapsed = now - startedAt.current;
      const ratio = Math.min(1, elapsed / duration);
      setProgress(ratio);
      if (ratio >= 1) {
        advance();
        return;
      }
      frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
    return () => { if (frame.current) cancelAnimationFrame(frame.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, paused, duration, count, motionEnabled]);

  useEffect(() => () => clearLoop(), []);

  const pause = () => {
    elapsedAtPause.current = progress * duration;
    startedAt.current = null;
    clearLoop();
    setPaused(true);
  };
  const resume = () => setPaused(false);

  const onDown = () => {
    wasHold.current = false;
    holdTimer.current = window.setTimeout(() => {
      wasHold.current = true;
      pause();
    }, 180);
  };
  const onUp = () => {
    if (holdTimer.current) { window.clearTimeout(holdTimer.current); holdTimer.current = null; }
    if (wasHold.current) resume();
  };
  const onStep = (direction: -1 | 1) => {
    if (wasHold.current) { wasHold.current = false; return; }
    goTo(current + direction);
  };

  return (
    <div className={cn("relative overflow-hidden rounded-[20px] bg-ink-900", className)} role="group" aria-label={label}>
      <div className="absolute inset-x-2 top-2 z-10 flex gap-1">
        {Array.from({ length: count }, (_, segment) => (
          <div key={segment} className="h-1 flex-1 overflow-hidden rounded-full bg-white/30">
            <div
              className="h-full bg-white"
              style={{ width: `${segment < current ? 100 : segment === current ? progress * 100 : 0}%` }}
            />
          </div>
        ))}
      </div>
      <div className="relative">{children}</div>
      <button type="button" aria-label="Previous segment" onClick={() => onStep(-1)} onPointerDown={onDown} onPointerUp={onUp} onPointerLeave={onUp} onPointerCancel={onUp} className={cn("absolute inset-y-0 left-0 w-1/2", FOCUS_RING)} />
      <button type="button" aria-label="Next segment" onClick={() => onStep(1)} onPointerDown={onDown} onPointerUp={onUp} onPointerLeave={onUp} onPointerCancel={onUp} className={cn("absolute inset-y-0 right-0 w-1/2", FOCUS_RING)} />
      <p className="sr-only" aria-live="polite">Segment {current + 1} of {count}{paused ? ", paused" : ""}</p>
    </div>
  );
}

export type DoubleTapLikeProps = {
  liked?: boolean;
  defaultLiked?: boolean;
  onLikedChange?: (liked: boolean) => void;
  label?: string;
  children: ReactNode;
  className?: string;
};

/**
 * Instagram/TikTok's double-tap-to-like: the gesture only ever sets liked to
 * true (a second double-tap never unlikes), matching the real pattern. The
 * heart button in the corner is the full toggle and the only path a
 * keyboard or screen-reader user has, since a double-tap gesture has no
 * accessible equivalent worth simulating.
 */
export function DoubleTapLike({ liked, defaultLiked = false, onLikedChange, label = "Like", children, className }: DoubleTapLikeProps) {
  const motionEnabled = useMotionEnabled();
  const [isLiked, setLiked] = useControllable(liked, defaultLiked, onLikedChange);
  const [burstKey, setBurstKey] = useState(0);
  const [showBurst, setShowBurst] = useState(false);
  const lastTap = useRef(0);

  const burstLike = () => {
    setLiked(true);
    setBurstKey((key) => key + 1);
    setShowBurst(true);
  };

  const onPointerUp = () => {
    const now = performance.now();
    if (now - lastTap.current < 300) {
      burstLike();
      lastTap.current = 0;
    } else {
      lastTap.current = now;
    }
  };

  return (
    <div className={cn("relative overflow-hidden rounded-2xl", className)}>
      <div onPointerUp={onPointerUp} className="select-none">{children}</div>
      <AnimatePresence>
        {showBurst ? (
          <motion.div
            key={burstKey}
            aria-hidden
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: [0, 1, 1, 0], scale: [0.4, 1.15, 1, 1] }}
            transition={{ duration: motionEnabled ? 0.7 : 0.001, times: [0, 0.25, 0.7, 1] }}
            onAnimationComplete={() => setShowBurst(false)}
          >
            <HeartGlyph filled className="size-20 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]" />
          </motion.div>
        ) : null}
      </AnimatePresence>
      <button
        type="button"
        aria-pressed={isLiked}
        aria-label={label}
        onClick={() => setLiked(!isLiked)}
        className={cn("absolute bottom-3 right-3 inline-flex size-11 items-center justify-center rounded-full bg-white/90 shadow-soft", FOCUS_RING)}
      >
        <HeartGlyph filled={isLiked} className={cn("size-5", isLiked ? "text-blush-400" : "text-ink-500")} />
      </button>
    </div>
  );
}

export type MiniPlayerProps = {
  title: string;
  subtitle?: string;
  artwork?: ReactNode;
  playing?: boolean;
  defaultPlaying?: boolean;
  onPlayingChange?: (playing: boolean) => void;
  progress?: number;
  expanded?: boolean;
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  children?: ReactNode;
  className?: string;
};

/**
 * The Spotify/Apple Music mini player: a persistent compact bar that expands
 * to a full player on tap or an upward drag, and collapses on a downward
 * drag past threshold. Portalled to `document.body` for the same reason as
 * `BottomSheet` — a `position: fixed` expanded panel would otherwise become
 * fixed relative to whatever ancestor happens to apply a filter/transform
 * (this site's header does, once scrolled) instead of the viewport.
 */
export function MiniPlayer({ title, subtitle, artwork, playing, defaultPlaying = false, onPlayingChange, progress = 0, expanded, defaultExpanded = false, onExpandedChange, children, className }: MiniPlayerProps) {
  const motionEnabled = useMotionEnabled();
  const [isPlaying, setPlaying] = useControllable(playing, defaultPlaying, onPlayingChange);
  const [isExpanded, setExpanded] = useControllable(expanded, defaultExpanded, onExpandedChange);
  const [mounted, setMounted] = useState(false);
  const titleId = useId();
  const sheetRef = useRef<HTMLElement>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!isExpanded || !mounted) return;
    sheetRef.current?.focus();
    const onKeyDown = (event: globalThis.KeyboardEvent) => { if (event.key === "Escape") setExpanded(false); };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isExpanded, mounted, setExpanded]);

  const bar = (
    <div className={cn("relative overflow-hidden rounded-[18px] border border-line bg-white/95 shadow-soft backdrop-blur", className)}>
      <div aria-hidden className="h-0.5 bg-cloud-100"><div className="h-full bg-ink-900" style={{ width: `${Math.round(Math.min(1, Math.max(0, progress)) * 100)}%` }} /></div>
      <div className="relative flex min-h-14 items-center gap-3 px-3 py-2">
        <button type="button" onClick={() => setExpanded(true)} aria-label={`Expand player — ${title}`} className={cn("absolute inset-0", FOCUS_RING)} />
        <span aria-hidden className="pointer-events-none grid size-10 shrink-0 place-items-center overflow-hidden rounded-[10px] bg-cloud-100">{artwork}</span>
        <span className="pointer-events-none min-w-0 flex-1">
          <span className="block truncate text-sm font-medium text-ink-900">{title}</span>
          {subtitle ? <span className="block truncate text-xs text-ink-500">{subtitle}</span> : null}
        </span>
        <button
          type="button"
          onClick={(event) => { event.stopPropagation(); setPlaying(!isPlaying); }}
          aria-label={isPlaying ? "Pause" : "Play"}
          aria-pressed={isPlaying}
          className={cn("relative z-10 inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-ink-900 text-milk", FOCUS_RING)}
        >
          <PlayPauseGlyph playing={isPlaying} />
        </button>
      </div>
    </div>
  );

  const overlay = (
    <AnimatePresence>
      {isExpanded ? (
        <motion.div
          className="fixed inset-0 z-[85] flex flex-col bg-[color-mix(in_oklab,var(--pinky-page)_92%,white)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.section
            ref={sheetRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            drag={motionEnabled ? "y" : false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.15}
            dragMomentum={false}
            onDragEnd={(_, info) => { if (info.offset.y > 120) setExpanded(false); }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            className="flex h-full flex-col overflow-y-auto px-6"
            style={{ paddingTop: SAFE_TOP, paddingBottom: SAFE_BOTTOM }}
          >
            <div className="mx-auto mb-6 h-1.5 w-12 shrink-0 rounded-full bg-cloud-200" />
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 id={titleId} className="truncate text-lg font-semibold text-ink-900">{title}</h2>
                {subtitle ? <p className="mt-1 truncate text-sm text-ink-500">{subtitle}</p> : null}
              </div>
              <button type="button" onClick={() => setExpanded(false)} aria-label="Collapse player" className={cn("shrink-0 rounded-full p-2", FOCUS_RING)}>×</button>
            </div>
            <div className="mt-6 flex-1">{children}</div>
            <div className="mt-6 flex items-center justify-center gap-4 pb-2">
              <button
                type="button"
                onClick={() => setPlaying(!isPlaying)}
                aria-label={isPlaying ? "Pause" : "Play"}
                aria-pressed={isPlaying}
                className={cn("inline-flex size-16 items-center justify-center rounded-full bg-ink-900 text-milk", FOCUS_RING)}
              >
                <PlayPauseGlyph playing={isPlaying} size={22} />
              </button>
            </div>
          </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );

  return (
    <>
      {bar}
      {mounted ? createPortal(overlay, document.body) : null}
    </>
  );
}

export type SwipeToReplyProps = {
  children: ReactNode;
  onReply: () => void;
  replyLabel?: string;
  align?: "start" | "end";
  className?: string;
};

/**
 * iMessage/WhatsApp's swipe-a-bubble-to-reply: dragging right reveals a
 * reply glyph that fades in with distance and rubber-bands to a max travel,
 * committing past a threshold. The small corner button is the keyboard and
 * screen-reader path, since the drag gesture itself has none.
 */
export function SwipeToReply({ children, onReply, replyLabel = "Reply", align = "start", className }: SwipeToReplyProps) {
  const [offset, setOffset] = useState(0);
  const [replied, setReplied] = useState(false);
  const start = useRef<{ x: number; y: number } | null>(null);
  const locked = useRef(false);
  const replyTimer = useRef<number | null>(null);
  const MAX = 64;
  const THRESHOLD = 48;

  useEffect(() => () => { if (replyTimer.current) window.clearTimeout(replyTimer.current); }, []);

  const commitReply = () => {
    onReply();
    setReplied(true);
    if (replyTimer.current) window.clearTimeout(replyTimer.current);
    replyTimer.current = window.setTimeout(() => setReplied(false), 900);
  };

  const begin = (event: ReactPointerEvent<HTMLDivElement>) => {
    start.current = { x: event.clientX, y: event.clientY };
    locked.current = false;
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };
  const move = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!start.current) return;
    const dx = event.clientX - start.current.x;
    const dy = event.clientY - start.current.y;
    if (!locked.current && Math.abs(dx) > 8) locked.current = Math.abs(dx) > Math.abs(dy);
    if (!locked.current) return;
    if (dx > 0) {
      setOffset(Math.min(MAX, dx));
      if (event.cancelable) event.preventDefault();
    }
  };
  const end = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!start.current) return;
    const distance = event.clientX - start.current.x;
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    start.current = null;
    locked.current = false;
    if (distance > THRESHOLD) commitReply();
    setOffset(0);
  };

  return (
    <div className={cn("relative", className)}>
      <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 flex w-16 items-center justify-center text-ink-500" style={{ opacity: Math.min(1, offset / THRESHOLD) }}>
        <ReplyGlyph className="size-5" />
      </div>
      <div
        onPointerDown={begin}
        onPointerMove={move}
        onPointerUp={end}
        onPointerCancel={end}
        className={cn("relative touch-pan-y", align === "end" ? "ml-auto w-fit" : "w-fit")}
        style={{ transform: `translateX(${offset}px)`, transition: start.current ? "none" : "transform 220ms cubic-bezier(.22,.72,.2,1)" }}
      >
        {children}
      </div>
      <button type="button" onClick={commitReply} aria-label={replyLabel} className={cn("absolute -bottom-1 right-1 inline-flex size-8 items-center justify-center rounded-full border border-line bg-white text-ink-500 shadow-sm", FOCUS_RING)}>
        <ReplyGlyph className="size-3.5" />
      </button>
      <p role="status" aria-live="polite" className="sr-only">{replied ? "Reply started." : ""}</p>
    </div>
  );
}
