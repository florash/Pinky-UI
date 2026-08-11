"use client";

import { AnimatePresence, motion } from "motion/react";
import { useMotionEnabled } from "@pinky/primitives";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";

import { cn } from "../internal/cn";
import { useControllable } from "../internal/use-controllable";

export type MorphSelectOption = { value: string; label: string; disabled?: boolean };
export type MorphSelectProps = {
  options: MorphSelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  label: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
};

export function MorphSelect({ options, value, defaultValue = "", onValueChange, label, placeholder = "Select…", className, disabled = false }: MorphSelectProps) {
  const id = useId();
  const [selected, setSelected] = useControllable(value, defaultValue, onValueChange);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const trigger = useRef<HTMLButtonElement>(null);
  const nodes = useRef<Array<HTMLButtonElement | null>>([]);
  const typeahead = useRef("");
  const typeTimer = useRef<number | null>(null);
  const motionEnabled = useMotionEnabled();
  const enabled = options.map((option, index) => ({ option, index })).filter(({ option }) => !option.disabled);
  useEffect(() => { if (open) nodes.current[active]?.focus(); }, [active, open]);
  useEffect(() => () => { if (typeTimer.current) clearTimeout(typeTimer.current); }, []);
  const close = () => { setOpen(false); requestAnimationFrame(() => trigger.current?.focus()); };
  const choose = (index: number) => { const option = options[index]; if (!option || option.disabled) return; setSelected(option.value); close(); };
  const move = (delta: number) => {
    const position = enabled.findIndex((item) => item.index === active);
    const target = enabled[(Math.max(position, 0) + delta + enabled.length) % enabled.length];
    if (target) setActive(target.index);
  };
  const keys = (event: KeyboardEvent) => {
    if (event.key === "Escape") { event.preventDefault(); close(); return; }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") { event.preventDefault(); move(event.key === "ArrowDown" ? 1 : -1); return; }
    if (event.key === "Home") { event.preventDefault(); if (enabled[0]) setActive(enabled[0].index); return; }
    if (event.key === "End") { event.preventDefault(); const last = enabled.at(-1); if (last) setActive(last.index); return; }
    if (event.key === "Enter" || event.key === " ") { event.preventDefault(); choose(active); return; }
    if (event.key.length === 1 && /\S/.test(event.key)) {
      typeahead.current += event.key.toLowerCase();
      if (typeTimer.current) clearTimeout(typeTimer.current);
      typeTimer.current = window.setTimeout(() => { typeahead.current = ""; }, 500);
      const match = options.findIndex((option) => !option.disabled && option.label.toLowerCase().startsWith(typeahead.current));
      if (match >= 0) setActive(match);
    }
  };
  const current = options.find((option) => option.value === selected);
  return (
    <div className={cn("relative", className)}>
      <span id={`${id}-label`} className="mb-2 block text-sm font-medium">{label}</span>
      <motion.button ref={trigger} type="button" disabled={disabled} aria-labelledby={`${id}-label`} aria-haspopup="listbox" aria-expanded={open} onClick={() => { const currentIndex = Math.max(options.findIndex((option) => option.value === selected), 0); setActive(currentIndex); setOpen(true); }} layout={motionEnabled} className="flex w-full items-center justify-between rounded-2xl border border-[color:var(--color-line,rgba(70,90,115,.1))] bg-white px-4 py-3 text-left shadow-sm"><span>{current?.label ?? placeholder}</span><span aria-hidden>⌄</span></motion.button>
      <AnimatePresence>{open ? <motion.div role="listbox" aria-labelledby={`${id}-label`} onKeyDown={keys} initial={motionEnabled ? { opacity: 0, scale: .97, y: -4 } : false} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: .98 }} className="absolute z-40 mt-2 max-h-64 w-full overflow-auto rounded-2xl border border-[color:var(--color-line,rgba(70,90,115,.1))] bg-white p-1.5 shadow-xl">{options.map((option, index) => <button key={option.value} ref={(node) => { nodes.current[index] = node; }} type="button" role="option" aria-selected={option.value === selected} disabled={option.disabled} onClick={() => choose(index)} onMouseMove={() => setActive(index)} className={cn("flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm", active === index && "bg-[color:var(--color-blush-50,#fff7fa)]", option.disabled && "opacity-40")}>{option.label}{option.value === selected ? <span aria-hidden>✓</span> : null}</button>)}</motion.div> : null}</AnimatePresence>
    </div>
  );
}
