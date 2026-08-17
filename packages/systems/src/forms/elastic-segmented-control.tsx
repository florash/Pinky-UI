"use client";

import { motion } from "motion/react";
import { springs, useMotionEnabled } from "@pinky-ui/primitives";
import { useId, useRef, type KeyboardEvent, type ReactNode } from "react";

import { cn } from "../internal/cn";
import { useControllable } from "../internal/use-controllable";

export type SegmentItem = { value: string; label: ReactNode; disabled?: boolean };
export type ElasticSegmentedControlProps = {
  items: SegmentItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  mode?: "radio" | "tabs";
  label: string;
  className?: string;
};

export function ElasticSegmentedControl({ items, value, defaultValue, onValueChange, mode = "radio", label, className }: ElasticSegmentedControlProps) {
  const id = useId();
  const [selected, setSelected] = useControllable(value, defaultValue ?? items.find((item) => !item.disabled)?.value ?? "", onValueChange);
  const refs = useRef(new Map<string, HTMLButtonElement>());
  const motionEnabled = useMotionEnabled();
  const keys = (event: KeyboardEvent<HTMLDivElement>) => {
    const enabled = items.filter((item) => !item.disabled);
    const current = enabled.findIndex((item) => item.value === selected);
    let next = current;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (current + 1) % enabled.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (current - 1 + enabled.length) % enabled.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = enabled.length - 1;
    else return;
    const target = enabled[next];
    if (!target) return;
    event.preventDefault(); setSelected(target.value); refs.current.get(target.value)?.focus();
  };
  return (
    <div role={mode === "tabs" ? "tablist" : "radiogroup"} aria-label={label} onKeyDown={keys} className={cn("inline-flex max-w-full gap-1 overflow-x-auto rounded-full bg-[color:var(--color-blush-50,#fff7fa)] p-1 ring-1 ring-[color:var(--color-line,rgba(70,90,115,.1))]", className)}>
      {items.map((item) => { const active = item.value === selected; return <button key={item.value} ref={(node) => { if (node) refs.current.set(item.value, node); else refs.current.delete(item.value); }} type="button" role={mode === "tabs" ? "tab" : "radio"} aria-selected={mode === "tabs" ? active : undefined} aria-checked={mode === "radio" ? active : undefined} tabIndex={active ? 0 : -1} disabled={item.disabled} onClick={() => setSelected(item.value)} className="relative isolate rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap disabled:opacity-40">{active ? <motion.span aria-hidden layoutId={`${id}-segment`} className="absolute inset-0 -z-10 rounded-full bg-white shadow-sm" transition={motionEnabled ? { type: "spring", ...springs.responsive } : { duration: 0 }} /> : null}<span>{item.label}</span></button>; })}
    </div>
  );
}
