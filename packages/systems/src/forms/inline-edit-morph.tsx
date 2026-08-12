"use client";

import { motion } from "motion/react";
import { useMotionEnabled } from "@pinky/primitives";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";

import { cn } from "../internal/cn";
import { useControllable } from "../internal/use-controllable";

export type InlineEditMorphProps = {
  label: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  validate?: (value: string) => string | null;
  className?: string;
  disabled?: boolean;
};

export function InlineEditMorph({ label, value, defaultValue = "", onValueChange, validate, className, disabled = false }: InlineEditMorphProps) {
  const [current, setCurrent] = useControllable(value, defaultValue, onValueChange);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(current);
  const [error, setError] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const motionEnabled = useMotionEnabled();
  useEffect(() => { if (editing) { setDraft(current); input.current?.focus(); input.current?.select(); } }, [current, editing]);
  const save = () => { const problem = validate?.(draft); if (problem) { setError(problem); return; } setError(""); setCurrent(draft); setEditing(false); };
  const cancel = () => { setDraft(current); setError(""); setEditing(false); };
  const keys = (event: KeyboardEvent) => { if (event.key === "Enter") { event.preventDefault(); save(); } else if (event.key === "Escape") { event.preventDefault(); cancel(); } };
  return <motion.div layout={motionEnabled} className={cn("inline-flex min-w-56 items-center rounded-2xl border border-[color:var(--color-line,rgba(70,90,115,.1))] bg-white p-1.5 shadow-sm", className)}>{editing ? <><label className="sr-only" htmlFor={`${label}-inline-edit`}>{label}</label><input ref={input} id={`${label}-inline-edit`} value={draft} aria-invalid={Boolean(error)} aria-describedby={error ? `${label}-inline-error` : undefined} onChange={(event) => setDraft(event.currentTarget.value)} onKeyDown={keys} className="min-w-0 flex-1 rounded-xl px-3 py-2 outline-none" /><button type="button" onClick={save} aria-label={`Save ${label}`} className="rounded-xl px-3 py-2">✓</button><button type="button" onClick={cancel} aria-label={`Cancel ${label}`} className="rounded-xl px-3 py-2">×</button>{error ? <span id={`${label}-inline-error`} role="alert" className="sr-only">{error}</span> : null}</> : <button type="button" disabled={disabled} onClick={() => setEditing(true)} aria-label={`Edit ${label}`} className="flex w-full items-center justify-between gap-4 rounded-xl px-3 py-2 text-left"><span>{current}</span><span aria-hidden>✎</span></button>}</motion.div>;
}
