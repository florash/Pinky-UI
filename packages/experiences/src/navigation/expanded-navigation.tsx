"use client";

import { GridReveal, useMotionEnabled } from "@pinky-ui/primitives";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useId, useRef, useState, type ReactNode, type RefObject } from "react";

import { cn } from "../internal/cn";

export type NavigationLink = {
  id: string;
  label: string;
  href?: string;
  description?: string;
  meta?: string;
  icon?: ReactNode;
};

export type NavigationGroup = NavigationLink & {
  links: NavigationLink[];
  preview?: ReactNode;
};

function useEscapeRestore(open: boolean, onOpenChange: (open: boolean) => void, triggerRef: RefObject<HTMLButtonElement | null>) {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      onOpenChange(false);
      requestAnimationFrame(() => triggerRef.current?.focus());
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onOpenChange, open, triggerRef]);
}

function linkHref(item: NavigationLink) {
  return item.href ?? `#${item.id}`;
}

function focusRing() {
  return "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/20 focus-visible:ring-offset-2";
}

/** A compact row where hover/focus expands the item itself and reflows its neighbours. */
export function HoverExpandNavigation({
  items,
  className,
  "aria-label": ariaLabel = "Expanded navigation",
}: {
  items: NavigationLink[];
  className?: string;
  "aria-label"?: string;
}) {
  const [engagedId, setEngagedId] = useState(items[0]?.id);
  const [selectedId, setSelectedId] = useState(items[0]?.id);
  const motionEnabled = useMotionEnabled();

  return (
    <nav aria-label={ariaLabel} className={cn("w-full", className)}>
      <ul className="flex flex-wrap gap-2">
        {items.map((item) => {
          const engaged = item.id === engagedId || item.id === selectedId;
          return (
            <motion.li
              key={item.id}
              layout={motionEnabled}
              animate={{ flexGrow: engaged ? 1.7 : 1 }}
              transition={motionEnabled ? { type: "spring", stiffness: 360, damping: 34, mass: 0.8 } : { duration: 0 }}
              className="min-w-[9.5rem] flex-1"
              onPointerEnter={(event) => {
                if (event.pointerType !== "touch") setEngagedId(item.id);
              }}
              onPointerLeave={() => setEngagedId(undefined)}
              onFocus={() => setEngagedId(item.id)}
              onBlur={() => setEngagedId(undefined)}
            >
              <a
                href={linkHref(item)}
                aria-current={item.id === selectedId ? "page" : undefined}
                onClick={() => setSelectedId(item.id)}
                className={cn(
                  "group block min-h-16 rounded-2xl border px-4 py-3 transition-[background-color,border-color] duration-300",
                  engaged ? "border-line-strong bg-white shadow-soft" : "border-line bg-white/55",
                  focusRing(),
                )}
              >
                <span className="flex items-center justify-between gap-3">
                  <span className="font-display text-sm font-semibold tracking-tight text-ink-900">{item.label}</span>
                  <span aria-hidden className="text-ink-500 transition-transform duration-300 group-hover:translate-x-0.5">↗</span>
                </span>
                <span className={cn("block overflow-hidden text-xs leading-relaxed text-ink-700 transition-[max-height,opacity,margin] duration-300 motion-reduce:transition-none", engaged ? "mt-1 max-h-10 opacity-100" : "max-h-0 opacity-0")}>
                  {item.description ?? "Open this destination."}
                </span>
              </a>
            </motion.li>
          );
        })}
      </ul>
    </nav>
  );
}

/** A navigation row whose active item gains real layout width and neighbours yield space. */
export function NeighborShiftNavigation({
  items,
  className,
  "aria-label": ariaLabel = "Neighbor shift navigation",
}: {
  items: NavigationLink[];
  className?: string;
  "aria-label"?: string;
}) {
  const [activeId, setActiveId] = useState(items[0]?.id);
  const motionEnabled = useMotionEnabled();

  return (
    <nav aria-label={ariaLabel} className={cn("w-full overflow-x-auto overflow-y-hidden overscroll-x-contain", className)}>
      <ul className="flex min-w-max items-stretch gap-1 rounded-2xl border border-line bg-white/70 p-1">
        {items.map((item) => {
          const active = item.id === activeId;
          return (
            <motion.li
              key={item.id}
              layout={motionEnabled}
              animate={{ flexGrow: active ? 1.45 : 1 }}
              transition={motionEnabled ? { type: "spring", stiffness: 420, damping: 36, mass: 0.8 } : { duration: 0 }}
              className="min-w-[6.5rem] flex-1"
              onPointerEnter={(event) => {
                if (event.pointerType !== "touch") setActiveId(item.id);
              }}
              onFocus={() => setActiveId(item.id)}
            >
              <a
                href={linkHref(item)}
                aria-current={active ? "page" : undefined}
                onClick={() => setActiveId(item.id)}
                className={cn(
                  "flex min-h-11 h-full items-center justify-between gap-2 rounded-xl px-3 text-sm transition-colors",
                  active ? "bg-ink-900 text-milk" : "text-ink-700 hover:bg-cloud-50 hover:text-ink-900",
                  focusRing(),
                )}
              >
                <span className="truncate">{item.label}</span>
                {active ? <span aria-hidden className="text-xs text-milk/70">{item.meta ?? "01"}</span> : null}
              </a>
            </motion.li>
          );
        })}
      </ul>
    </nav>
  );
}

/** A typography-led index with a traveling rule, numbering and contextual metadata. */
export function EditorialIndexNavigation({
  items,
  className,
  "aria-label": ariaLabel = "Editorial index",
}: {
  items: NavigationLink[];
  className?: string;
  "aria-label"?: string;
}) {
  const [activeId, setActiveId] = useState(items[0]?.id);
  const id = useId();
  const motionEnabled = useMotionEnabled();

  return (
    <nav aria-label={ariaLabel} className={cn("w-full", className)}>
      <ol className="divide-y divide-line border-y border-line">
        {items.map((item, index) => {
          const active = item.id === activeId;
          return (
            <li key={item.id} onPointerEnter={(event) => event.pointerType !== "touch" && setActiveId(item.id)} onFocus={() => setActiveId(item.id)}>
              <a
                href={linkHref(item)}
                aria-current={active ? "page" : undefined}
                onClick={() => setActiveId(item.id)}
                className={cn("group grid min-h-20 grid-cols-[2.5rem_1fr_auto] items-center gap-4 py-3", focusRing())}
              >
                <span className="font-mono text-[0.65rem] tracking-[0.14em] text-ink-500">{String(index + 1).padStart(2, "0")}</span>
                <span>
                  <span className={cn("block font-display text-2xl font-semibold tracking-tight transition-transform duration-300 motion-reduce:transition-none", active ? "translate-x-1 text-ink-900" : "text-ink-700")}>{item.label}</span>
                  {item.description ? <span className="mt-1 block max-w-md text-sm text-ink-500">{item.description}</span> : null}
                </span>
                <span className="flex items-center gap-3 text-xs text-ink-500">
                  {item.meta ? <span className="font-mono tracking-[0.08em] uppercase">{item.meta}</span> : null}
                  <motion.span aria-hidden animate={{ scaleX: active ? 1 : 0.25, opacity: active ? 1 : 0.45 }} transition={motionEnabled ? { duration: 0.25 } : { duration: 0 }} style={{ originX: 0 }} className="block h-px w-12 bg-ink-900" />
                  <span className="transition-transform duration-300 group-hover:translate-x-1">↗</span>
                </span>
              </a>
            </li>
          );
        })}
      </ol>
      <span aria-hidden className="sr-only" id={`${id}-note`}>The active rule follows the focused destination.</span>
    </nav>
  );
}

/** A navbar that grows into its own contextual surface instead of dropping a detached menu. */
export function MorphingMegaNavigation({
  groups,
  defaultOpen = false,
  className,
  "aria-label": ariaLabel = "Morphing mega navigation",
}: {
  groups: NavigationGroup[];
  defaultOpen?: boolean;
  className?: string;
  "aria-label"?: string;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const [activeId, setActiveId] = useState(groups[0]?.id);
  const motionEnabled = useMotionEnabled();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const close = useCallback((next: boolean) => setOpen(next), []);
  useEscapeRestore(open, close, triggerRef);
  const active = groups.find((group) => group.id === activeId) ?? groups[0];

  return (
    <motion.div layout={motionEnabled} className={cn("w-full overflow-hidden rounded-[24px] border border-line bg-white/85 shadow-soft", className)}>
      <div className="flex min-h-16 items-center justify-between gap-4 px-4 py-3 sm:px-5">
        <span className="font-display text-base font-semibold tracking-tight text-ink-900">Pinky / Index</span>
        <div className="flex items-center gap-3">
          <nav aria-label={ariaLabel} className="hidden items-center gap-4 text-sm text-ink-700 sm:flex">
            {groups.slice(0, 3).map((group) => <a key={group.id} href={linkHref(group)} className={cn("transition-colors hover:text-ink-900", focusRing())}>{group.label}</a>)}
          </nav>
          <button ref={triggerRef} type="button" aria-expanded={open} aria-controls={panelId} onClick={() => setOpen((value) => !value)} className={cn("rounded-pill bg-ink-900 px-4 py-2 text-sm text-milk", focusRing())}>
            {open ? "Close index" : "Open index"}
          </button>
        </div>
      </div>

      <GridReveal
        open={open && Boolean(active)}
        contentProps={{ id: panelId, className: "border-t border-line" }}
      >
        {active ? (
          <div className="grid gap-6 bg-cloud-50/60 p-5 sm:grid-cols-[minmax(10rem,0.7fr)_1.3fr] sm:p-7">
            <div>
              <p className="font-mono text-[0.625rem] tracking-[0.16em] text-ink-500 uppercase">Browse by intent</p>
              <div role="group" aria-label="Mega navigation sections" className="mt-4 flex gap-1 overflow-x-auto sm:block">
                {groups.map((group) => <button key={group.id} type="button" aria-pressed={group.id === activeId} onClick={() => setActiveId(group.id)} className={cn("block min-h-10 shrink-0 rounded-xl px-3 py-2 text-left text-sm transition-colors sm:w-full", group.id === activeId ? "bg-white text-ink-900 shadow-soft" : "text-ink-700 hover:bg-white/70", focusRing())}>{group.label}</button>)}
              </div>
            </div>
            <motion.div key={active.id} initial={motionEnabled ? { opacity: 0, x: 12 } : false} animate={{ opacity: 1, x: 0 }} transition={motionEnabled ? { duration: 0.22 } : { duration: 0 }}>
              <p className="font-mono text-[0.625rem] tracking-[0.16em] text-ink-500 uppercase">{active.meta ?? "Selected destination"}</p>
              <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink-900">{active.label}</h3>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-700">{active.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {active.links.map((item) => <a key={item.id} href={linkHref(item)} className={cn("rounded-pill border border-line bg-white px-3 py-2 text-sm text-ink-700 hover:border-line-strong hover:text-ink-900", focusRing())}>{item.label} <span aria-hidden>↗</span></a>)}
              </div>
            </motion.div>
          </div>
        ) : null}
      </GridReveal>
    </motion.div>
  );
}

/** A two-pane menu where category focus changes one contextual preview at a time. */
export function SpotlightMegaMenu({
  groups,
  defaultOpen = false,
  className,
  "aria-label": ariaLabel = "Spotlight mega menu",
}: {
  groups: NavigationGroup[];
  defaultOpen?: boolean;
  className?: string;
  "aria-label"?: string;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const [activeId, setActiveId] = useState(groups[0]?.id);
  const motionEnabled = useMotionEnabled();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const close = useCallback((next: boolean) => setOpen(next), []);
  useEscapeRestore(open, close, triggerRef);
  const active = groups.find((group) => group.id === activeId) ?? groups[0];

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between gap-4">
        <p className="font-mono text-[0.65rem] tracking-[0.16em] text-ink-500 uppercase">Direct preview, one destination at a time</p>
        <button ref={triggerRef} type="button" aria-expanded={open} aria-controls={panelId} onClick={() => setOpen((value) => !value)} className={cn("rounded-pill border border-line bg-white px-4 py-2 text-sm text-ink-900 shadow-soft", focusRing())}>{open ? "Close menu" : "Browse work"}</button>
      </div>
      <AnimatePresence initial={false}>
        {open && active ? (
          <motion.div id={panelId} role="region" aria-label={ariaLabel} initial={motionEnabled ? { opacity: 0, y: -8 } : false} animate={{ opacity: 1, y: 0 }} exit={motionEnabled ? { opacity: 0, y: -8 } : { opacity: 1 }} transition={motionEnabled ? { duration: 0.24 } : { duration: 0 }} className="mt-3 grid overflow-hidden rounded-[24px] border border-line bg-white shadow-soft sm:grid-cols-[0.7fr_1.3fr]">
            <div className="border-b border-line bg-cloud-50/60 p-3 sm:border-r sm:border-b-0 sm:p-4">
              <p className="px-3 py-2 font-mono text-[0.6rem] tracking-[0.14em] text-ink-500 uppercase">Sections</p>
              <div role="group" aria-label="Spotlight sections" className="space-y-1">
                {groups.map((group) => <button key={group.id} type="button" aria-pressed={group.id === activeId} onMouseEnter={() => setActiveId(group.id)} onFocus={() => setActiveId(group.id)} onClick={() => setActiveId(group.id)} className={cn("flex min-h-11 w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm", group.id === activeId ? "bg-white text-ink-900 shadow-soft" : "text-ink-700 hover:bg-white/70", focusRing())}>{group.label}<span aria-hidden>→</span></button>)}
              </div>
            </div>
            <motion.div key={active.id} initial={motionEnabled ? { opacity: 0 } : false} animate={{ opacity: 1 }} transition={motionEnabled ? { duration: 0.18 } : { duration: 0 }} className="min-h-52 p-5 sm:p-7">
              <div className="flex min-h-24 items-center rounded-2xl bg-blush-50 p-4">{active.preview ?? <span className="font-display text-2xl font-semibold text-ink-900">{active.label}</span>}</div>
              <h3 className="mt-5 font-display text-2xl font-semibold tracking-tight">{active.label}</h3>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-700">{active.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">{active.links.map((item) => <a key={item.id} href={linkHref(item)} className={cn("rounded-pill border border-line px-3 py-2 text-sm text-ink-700 hover:border-line-strong", focusRing())}>{item.label}</a>)}</div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

/** A single mega surface whose inner content slides while the surface stays open. */
export function SlidingMegaPanel({
  groups,
  defaultOpen = false,
  className,
  "aria-label": ariaLabel = "Sliding mega panel",
}: {
  groups: NavigationGroup[];
  defaultOpen?: boolean;
  className?: string;
  "aria-label"?: string;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const motionEnabled = useMotionEnabled();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const close = useCallback((next: boolean) => setOpen(next), []);
  useEscapeRestore(open, close, triggerRef);
  const active = groups[activeIndex] ?? groups[0];

  const selectGroup = (index: number) => {
    setDirection(index >= activeIndex ? 1 : -1);
    setActiveIndex(index);
  };

  return (
    <div className={cn("w-full overflow-hidden rounded-[24px] border border-line bg-white/85 shadow-soft", className)}>
      <div className="flex items-center justify-between gap-4 px-5 py-4">
        <span className="font-display text-base font-semibold tracking-tight">Library / browse</span>
        <button ref={triggerRef} type="button" aria-expanded={open} aria-controls={panelId} onClick={() => setOpen((value) => !value)} className={cn("rounded-pill bg-ink-900 px-4 py-2 text-sm text-milk", focusRing())}>{open ? "Close" : "Open library"}</button>
      </div>
      <GridReveal open={open && Boolean(active)} contentProps={{ id: panelId, role: "region", "aria-label": ariaLabel, className: "border-t border-line" }}>
        {active ? (
          <>
            <div className="flex gap-1 overflow-x-auto border-b border-line bg-cloud-50/60 p-3">
              {groups.map((group, index) => <button key={group.id} type="button" aria-pressed={index === activeIndex} onClick={() => selectGroup(index)} className={cn("min-h-10 shrink-0 rounded-xl px-3 py-2 text-sm", index === activeIndex ? "bg-white text-ink-900 shadow-soft" : "text-ink-700 hover:bg-white/70", focusRing())}>{group.label}</button>)}
            </div>
            <div className="overflow-hidden p-5 sm:p-7">
              <AnimatePresence initial={false} mode="wait" custom={direction}>
                <motion.div key={active.id} custom={direction} initial={motionEnabled ? { opacity: 0, x: direction * 28 } : false} animate={{ opacity: 1, x: 0 }} exit={motionEnabled ? { opacity: 0, x: direction * -28 } : { opacity: 1 }} transition={motionEnabled ? { duration: 0.24 } : { duration: 0 }}>
                  <p className="font-mono text-[0.625rem] tracking-[0.16em] text-ink-500 uppercase">{active.meta ?? "Now browsing"}</p>
                  <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight">{active.label}</h3>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-700">{active.description}</p>
                  <div className="mt-5 grid gap-2 sm:grid-cols-2">{active.links.map((item) => <a key={item.id} href={linkHref(item)} className={cn("rounded-xl border border-line bg-cloud-50 px-3 py-3 text-sm text-ink-700 hover:border-line-strong hover:bg-white", focusRing())}>{item.label}<span aria-hidden className="float-right">↗</span></a>)}</div>
                </motion.div>
              </AnimatePresence>
            </div>
          </>
        ) : null}
      </GridReveal>
    </div>
  );
}

/** Three readable surfaces appear together, with the selected layer owning the focus. */
export function LayeredNavigationMenu({
  groups,
  defaultOpen = false,
  className,
  "aria-label": ariaLabel = "Layered navigation menu",
}: {
  groups: NavigationGroup[];
  defaultOpen?: boolean;
  className?: string;
  "aria-label"?: string;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const [activeId, setActiveId] = useState(groups[0]?.id);
  const motionEnabled = useMotionEnabled();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const close = useCallback((next: boolean) => setOpen(next), []);
  useEscapeRestore(open, close, triggerRef);
  const active = groups.find((group) => group.id === activeId) ?? groups[0];

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between rounded-2xl border border-line bg-white px-4 py-3 shadow-soft">
        <span className="font-display text-base font-semibold tracking-tight">Project navigation</span>
        <button ref={triggerRef} type="button" aria-expanded={open} aria-controls={panelId} onClick={() => setOpen((value) => !value)} className={cn("rounded-pill border border-line px-4 py-2 text-sm text-ink-900", focusRing())}>{open ? "Close layers" : "Open layers"}</button>
      </div>
      <AnimatePresence initial={false}>
        {open && active ? (
          <motion.div id={panelId} role="region" aria-label={ariaLabel} initial={motionEnabled ? { opacity: 0, y: -10 } : false} animate={{ opacity: 1, y: 0 }} exit={motionEnabled ? { opacity: 0, y: -10 } : { opacity: 1 }} transition={motionEnabled ? { duration: 0.24 } : { duration: 0 }} className="relative mt-3 min-h-56 overflow-hidden rounded-[24px] border border-line bg-cloud-50/60 p-3 sm:min-h-64">
            <div className="relative min-h-48 rounded-2xl border border-line bg-white p-4 shadow-soft sm:absolute sm:inset-3 sm:w-[72%]">
              <p className="font-mono text-[0.625rem] tracking-[0.16em] text-ink-500 uppercase">Layer one · destinations</p>
              <div className="mt-4 grid gap-1">{groups.map((group) => <button key={group.id} type="button" aria-pressed={group.id === activeId} onClick={() => setActiveId(group.id)} className={cn("flex min-h-10 items-center justify-between rounded-xl px-3 py-2 text-left text-sm", group.id === activeId ? "bg-blush-50 text-ink-900" : "text-ink-700 hover:bg-cloud-50", focusRing())}>{group.label}<span aria-hidden>→</span></button>)}</div>
            </div>
            <motion.div key={active.id} initial={motionEnabled ? { opacity: 0, x: 16 } : false} animate={{ opacity: 1, x: 0 }} transition={motionEnabled ? { duration: 0.2 } : { duration: 0 }} className="relative mt-3 min-h-40 rounded-2xl border border-line bg-white p-4 shadow-[var(--depth-raised-md)] sm:absolute sm:top-9 sm:right-3 sm:mt-0 sm:w-[43%]">
              <p className="font-mono text-[0.625rem] tracking-[0.16em] text-ink-500 uppercase">Layer two · context</p>
              <h3 className="mt-2 font-display text-xl font-semibold tracking-tight">{active.label}</h3>
              <p className="mt-2 text-xs leading-relaxed text-ink-700">{active.description}</p>
              <div className="mt-4 space-y-1">{active.links.slice(0, 3).map((item) => <a key={item.id} href={linkHref(item)} className={cn("block rounded-lg px-2 py-1.5 text-xs text-ink-700 hover:bg-cloud-50", focusRing())}>{item.label}</a>)}</div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

/** A structural clip-path reveal anchored to the same local navigation surface. */
export function ClipRevealMenu({
  items,
  defaultOpen = false,
  className,
  "aria-label": ariaLabel = "Clip reveal menu",
}: {
  items: NavigationLink[];
  defaultOpen?: boolean;
  className?: string;
  "aria-label"?: string;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const motionEnabled = useMotionEnabled();
  const close = useCallback((next: boolean) => setOpen(next), []);
  useEscapeRestore(open, close, triggerRef);

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) {
        close(false);
        requestAnimationFrame(() => triggerRef.current?.focus());
      }
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [close, open]);

  return (
    <div ref={rootRef} className={cn("relative w-full", className)}>
      <div className="flex items-center justify-between rounded-2xl border border-line bg-white px-4 py-3 shadow-soft">
        <span className="font-display text-base font-semibold tracking-tight">Archive</span>
        <button ref={triggerRef} type="button" aria-expanded={open} aria-controls={panelId} onClick={() => setOpen((value) => !value)} className={cn("rounded-pill bg-ink-900 px-4 py-2 text-sm text-milk", focusRing())}>{open ? "Close" : "Reveal menu"}</button>
      </div>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.nav
            id={panelId}
            aria-label={ariaLabel}
            initial={motionEnabled ? { clipPath: "inset(0 0 100% 0 round 24px)", opacity: 0 } : false}
            animate={{ clipPath: "inset(0 0 0% 0 round 24px)", opacity: 1 }}
            exit={motionEnabled ? { clipPath: "inset(0 0 100% 0 round 24px)", opacity: 0 } : { opacity: 0 }}
            transition={motionEnabled ? { duration: 0.3 } : { duration: 0 }}
            className="mt-2 overflow-hidden rounded-[24px] border border-line bg-cloud-50 p-3 shadow-soft"
          >
            <ul className="grid gap-1 sm:grid-cols-2">{items.map((item) => <li key={item.id}><a href={linkHref(item)} className={cn("group flex min-h-12 items-center justify-between rounded-xl bg-white px-4 py-3 text-sm text-ink-700 transition-colors hover:bg-blush-50 hover:text-ink-900", focusRing())}><span><span className="block font-medium">{item.label}</span>{item.description ? <span className="mt-0.5 block text-xs text-ink-500">{item.description}</span> : null}</span><span aria-hidden className="transition-transform group-hover:translate-x-1">↗</span></a></li>)}</ul>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

/** A narrow side rail that expands its own labels without obscuring the page. */
export function EdgeRailNavigation({
  items,
  defaultActiveId,
  className,
  "aria-label": ariaLabel = "Edge rail navigation",
}: {
  items: NavigationLink[];
  defaultActiveId?: string;
  className?: string;
  "aria-label"?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const [activeId, setActiveId] = useState(defaultActiveId ?? items[0]?.id);
  const motionEnabled = useMotionEnabled();

  return (
    // width is a real layout-occupying dimension here, not a visual overlay:
    // this rail sits in normal flow next to page content (it isn't absolute/
    // fixed), so expanding it must actually reserve more space, not just
    // paint wider — a transform: scaleX would stretch the rail's own labels
    // and icons without moving anything beside it.
    <motion.nav
      aria-label={ariaLabel}
      animate={{ width: expanded ? 208 : 60 }}
      transition={motionEnabled ? { type: "spring", stiffness: 360, damping: 34, mass: 0.8 } : { duration: 0 }}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      className={cn("overflow-hidden rounded-[22px] border border-line bg-white/85 p-2 shadow-soft", className)}
    >
      <ul className="space-y-1">
        {items.map((item) => {
          const active = item.id === activeId;
          return <li key={item.id}><a href={linkHref(item)} aria-current={active ? "page" : undefined} onClick={() => setActiveId(item.id)} onFocus={() => setExpanded(true)} className={cn("group flex min-h-11 items-center gap-3 rounded-xl px-3 py-2 text-sm", active ? "bg-ink-900 text-milk" : "text-ink-700 hover:bg-cloud-50 hover:text-ink-900", focusRing())}><span aria-hidden className={cn("grid size-7 shrink-0 place-items-center rounded-lg border text-xs", active ? "border-milk/30 bg-white/10" : "border-line bg-white")}>{item.icon ?? item.label.slice(0, 1)}</span><span className={cn("truncate whitespace-nowrap transition-[opacity,max-width] duration-200 motion-reduce:transition-none", expanded ? "max-w-32 opacity-100" : "max-w-0 opacity-0")}>{item.label}</span></a></li>;
        })}
      </ul>
    </motion.nav>
  );
}

/** A shared indicator follows the section currently intersecting the reading window. */
export function SectionAwareNavigation({
  sections,
  className,
  "aria-label": ariaLabel = "Section navigation",
}: {
  sections: NavigationLink[];
  className?: string;
  "aria-label"?: string;
}) {
  const [activeId, setActiveId] = useState(sections[0]?.id);
  const motionEnabled = useMotionEnabled();

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const elements = sections.map((section) => document.getElementById(section.id)).filter(Boolean) as HTMLElement[];
    if (!elements.length) return;
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (visible[0]?.target instanceof HTMLElement) setActiveId(visible[0].target.id);
    }, { rootMargin: "-24% 0px -58%", threshold: [0, 0.25, 0.55] });
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav aria-label={ariaLabel} className={cn("w-full", className)}>
      <ul className="flex max-w-full gap-1 overflow-x-auto border-b border-line">
        {sections.map((section) => {
          const active = section.id === activeId;
          return <li key={section.id} className="shrink-0"><a href={section.href ?? `#${section.id}`} aria-current={active ? "location" : undefined} onClick={() => setActiveId(section.id)} className={cn("relative flex min-h-11 items-center gap-2 px-3 text-sm text-ink-700", active ? "text-ink-900" : "hover:text-ink-900", focusRing())}>{section.label}{active ? <motion.span layout={motionEnabled} layoutId="section-aware-indicator" aria-hidden className="absolute inset-x-3 -bottom-px h-0.5 rounded-pill bg-ink-900" transition={motionEnabled ? { type: "spring", stiffness: 420, damping: 36 } : { duration: 0 }} /> : null}</a></li>;
        })}
      </ul>
    </nav>
  );
}

/**
 * A vertical table of contents whose indicator bar tracks whichever heading
 * is currently in the reading window — the same IntersectionObserver
 * mechanic as Section-Aware Navigation, applied to a docked sidebar instead
 * of a horizontal tab strip.
 */
export function ScrollSpySidebar({
  sections,
  className,
  "aria-label": ariaLabel = "On this page",
}: {
  sections: NavigationLink[];
  className?: string;
  "aria-label"?: string;
}) {
  const [activeId, setActiveId] = useState(sections[0]?.id);
  const motionEnabled = useMotionEnabled();

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const elements = sections.map((section) => document.getElementById(section.id)).filter(Boolean) as HTMLElement[];
    if (!elements.length) return;
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (visible[0]?.target instanceof HTMLElement) setActiveId(visible[0].target.id);
    }, { rootMargin: "-10% 0px -70%", threshold: [0, 0.25, 0.55] });
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav aria-label={ariaLabel} className={cn("relative", className)}>
      <ul className="flex flex-col gap-0.5 border-l border-line">
        {sections.map((section) => {
          const active = section.id === activeId;
          return (
            <li key={section.id} className="relative">
              {active ? (
                <motion.span
                  aria-hidden
                  layout={motionEnabled}
                  layoutId="scroll-spy-indicator"
                  className="absolute inset-y-1 left-0 w-0.5 rounded-pill bg-ink-900"
                  transition={motionEnabled ? { type: "spring", stiffness: 420, damping: 36 } : { duration: 0 }}
                />
              ) : null}
              <a
                href={section.href ?? `#${section.id}`}
                aria-current={active ? "location" : undefined}
                onClick={() => setActiveId(section.id)}
                className={cn(
                  "block min-h-9 py-1.5 pl-4 text-sm transition-colors",
                  active ? "font-medium text-ink-900" : "text-ink-500 hover:text-ink-900",
                  focusRing(),
                )}
              >
                {section.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** A mobile-first island where the selected destination expands into a labelled action. */
export function ExpandableBottomNavigation({
  items,
  defaultActiveId,
  fixed = false,
  className,
  "aria-label": ariaLabel = "Bottom navigation",
}: {
  items: NavigationLink[];
  defaultActiveId?: string;
  fixed?: boolean;
  className?: string;
  "aria-label"?: string;
}) {
  const [activeId, setActiveId] = useState(defaultActiveId ?? items[0]?.id);
  const motionEnabled = useMotionEnabled();

  return (
    <nav aria-label={ariaLabel} className={cn(fixed ? "fixed inset-x-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-20" : "w-full", className)}>
      <ul className="mx-auto flex max-w-full items-center justify-center gap-1 rounded-[22px] border border-line bg-white/90 p-1.5 shadow-soft sm:gap-2">
        {items.map((item) => {
          const active = item.id === activeId;
          return <li key={item.id} className="min-w-0"><a href={linkHref(item)} aria-current={active ? "page" : undefined} onClick={() => setActiveId(item.id)} className={cn("flex min-h-11 items-center gap-2 rounded-[16px] px-3 py-2 text-sm transition-[background-color,color] duration-200", active ? "bg-ink-900 text-milk" : "text-ink-700 hover:bg-cloud-50 hover:text-ink-900", focusRing())}><span aria-hidden className="grid size-7 shrink-0 place-items-center rounded-lg border border-current/15 text-xs">{item.icon ?? item.label.slice(0, 1)}</span><motion.span initial={false} animate={{ maxWidth: active ? 96 : 0, opacity: active ? 1 : 0 }} transition={motionEnabled ? { duration: 0.2 } : { duration: 0 }} className="overflow-hidden whitespace-nowrap">{item.label}</motion.span></a></li>;
        })}
      </ul>
    </nav>
  );
}

/** A header compresses in place after deliberate scroll instead of disappearing. */
export function CompressingScrollNavigation({
  items,
  title = "Pinky UI",
  compactAfter = 96,
  compressed: controlledCompressed,
  defaultCompressed = false,
  className,
  "aria-label": ariaLabel = "Scroll-aware navigation",
}: {
  items: NavigationLink[];
  title?: string;
  compactAfter?: number;
  compressed?: boolean;
  defaultCompressed?: boolean;
  className?: string;
  "aria-label"?: string;
}) {
  const [internalCompressed, setInternalCompressed] = useState(defaultCompressed);
  const motionEnabled = useMotionEnabled();
  const compressed = controlledCompressed ?? internalCompressed;

  useEffect(() => {
    if (controlledCompressed !== undefined) return;
    let ticking = false;
    const update = () => {
      ticking = false;
      const current = window.scrollY;
      setInternalCompressed((value) => current > compactAfter ? true : current < compactAfter * 0.55 ? false : value);
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [compactAfter, controlledCompressed]);

  return (
    // height is real layout occupancy: this header sits in normal flow at
    // the top of a page, so compressing it must actually shrink the space it
    // reserves — content below needs to move up, which a scaleY transform
    // (which leaves the layout box at its original size) would not do, on
    // top of stretching the header's own children vertically.
    <motion.header aria-label={ariaLabel} animate={{ height: compressed ? 68 : 112 }} transition={motionEnabled ? { type: "spring", stiffness: 300, damping: 32 } : { duration: 0 }} className={cn("w-full overflow-hidden rounded-[24px] border border-line bg-white/85 shadow-soft", className)}>
      <div className="flex h-full items-center justify-between gap-4 px-5">
        <motion.div animate={{ scale: compressed ? 0.88 : 1, originX: 0 }} className="min-w-0"><p className="font-display text-xl font-semibold tracking-tight text-ink-900">{title}</p><p className={cn("mt-1 truncate font-mono text-[0.6rem] tracking-[0.14em] text-ink-500 uppercase transition-opacity motion-reduce:transition-none", compressed ? "opacity-0" : "opacity-100")}>A considered header, still present</p></motion.div>
        <nav aria-label={`${ariaLabel} destinations`} className="flex min-w-0 gap-1 overflow-x-auto">
          {items.map((item) => <a key={item.id} href={linkHref(item)} className={cn("shrink-0 rounded-pill px-3 py-2 text-sm text-ink-700 hover:bg-cloud-50 hover:text-ink-900", focusRing())}>{item.label}</a>)}
        </nav>
      </div>
    </motion.header>
  );
}
