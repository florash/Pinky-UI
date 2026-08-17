"use client";

import { AnimatePresence, motion } from "motion/react";
import { useMotionEnabled } from "@pinky-ui/primitives";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";

import { cn } from "../internal/cn";
import { useControllable } from "../internal/use-controllable";

export type ExpandingSearchProps = {
  label?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onClear?: () => void;
  results?: ReactNode;
  className?: string;
  disabled?: boolean;
};

/** A compact intent trigger that opens into a local, focus-managed search field. */
export function ExpandingSearch({
  label = "Search",
  placeholder = "Search this workspace",
  value,
  defaultValue = "",
  onValueChange,
  onClear,
  results,
  className,
  disabled = false,
}: ExpandingSearchProps) {
  const id = useId();
  const inputId = `${id}-input`;
  const resultsId = `${id}-results`;
  const [query, setQuery] = useControllable(value, defaultValue, onValueChange);
  const [open, setOpen] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const motionEnabled = useMotionEnabled();

  useEffect(() => {
    if (!open) return;
    requestAnimationFrame(() => input.current?.focus());
  }, [open]);

  const close = () => {
    setOpen(false);
    requestAnimationFrame(() => trigger.current?.focus());
  };
  const clear = () => {
    setQuery("");
    onClear?.();
    input.current?.focus();
  };

  return (
    <div role="search" aria-label={label} className={cn("w-full max-w-xl", className)}>
      <AnimatePresence initial={false}>
        {!open ? (
          <motion.button
            key="trigger"
            ref={trigger}
            type="button"
            disabled={disabled}
            onClick={() => setOpen(true)}
            aria-label={label}
            aria-expanded={false}
            aria-controls={open && results !== undefined ? resultsId : undefined}
            className="flex w-full items-center justify-between gap-4 rounded-[18px] border border-line bg-white/80 px-4 py-3 text-left text-sm text-ink-700 shadow-sm transition-colors hover:border-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/20 disabled:cursor-not-allowed disabled:opacity-50"
            initial={motionEnabled ? { opacity: 0.6, scale: 0.98 } : false}
            animate={{ opacity: 1, scale: 1 }}
            exit={motionEnabled ? { opacity: 0, scale: 0.98 } : undefined}
          >
            <span className="flex min-w-0 items-center gap-3"><span aria-hidden className="text-base">⌕</span><span className="truncate">{query || placeholder}</span></span>
            <kbd className="hidden rounded-md border border-line px-1.5 py-0.5 font-mono text-[0.625rem] text-ink-500 sm:inline">/</kbd>
          </motion.button>
        ) : (
          <motion.div
            key="field"
            className="rounded-[20px] border border-ink-900/15 bg-white p-2 shadow-soft"
            initial={motionEnabled ? { opacity: 0, y: 5 } : false}
            animate={{ opacity: 1, y: 0 }}
            exit={motionEnabled ? { opacity: 0, y: -5 } : undefined}
          >
            <div className="flex items-center gap-2">
              <span aria-hidden className="px-2 text-base text-ink-500">⌕</span>
              <label className="sr-only" htmlFor={inputId}>{label}</label>
              <input
                ref={input}
                id={inputId}
                value={query}
                placeholder={placeholder}
                onChange={(event) => setQuery(event.currentTarget.value)}
                onKeyDown={(event) => { if (event.key === "Escape") { event.preventDefault(); close(); } }}
                className="min-w-0 flex-1 bg-transparent px-1 py-2 text-sm text-ink-900 outline-none placeholder:text-ink-400"
              />
              {query ? <button type="button" onClick={clear} aria-label={`Clear ${label}`} className="rounded-full px-2 py-1 text-xs text-ink-500 hover:bg-cloud-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/20">Clear</button> : null}
              <button type="button" onClick={close} aria-label={`Close ${label}`} className="rounded-full border border-line px-2.5 py-1 text-xs text-ink-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/20">Close</button>
            </div>
            {results !== undefined ? <div id={resultsId} role="region" aria-label={`${label} results`} className="mt-2 border-t border-line pt-2">{results}</div> : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
