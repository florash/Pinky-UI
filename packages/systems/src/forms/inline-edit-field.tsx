"use client";

import { motion } from "motion/react";
import { useMotionEnabled } from "@pinky-ui/primitives";
import { useEffect, useId, useRef, useState, type InputHTMLAttributes, type ReactNode } from "react";

import { cn } from "../internal/cn";
import { useControllable } from "../internal/use-controllable";

export type InlineEditFieldProps = {
  label: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  validate?: (value: string) => string | null;
  description?: ReactNode;
  placeholder?: string;
  required?: boolean;
  inputMode?: InputHTMLAttributes<HTMLInputElement>["inputMode"];
  className?: string;
  disabled?: boolean;
};

/**
 * A product field that keeps its label, help text and validation attached
 * while switching between a resting value and an editor.
 */
export function InlineEditField({
  label,
  value,
  defaultValue = "",
  onValueChange,
  validate,
  description,
  placeholder = "Add a value",
  required = false,
  inputMode,
  className,
  disabled = false,
}: InlineEditFieldProps) {
  const id = useId();
  const inputId = `${id}-input`;
  const descriptionId = `${id}-description`;
  const errorId = `${id}-error`;
  const [current, setCurrent] = useControllable(value, defaultValue, onValueChange);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(current);
  const [error, setError] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const motionEnabled = useMotionEnabled();

  useEffect(() => {
    if (!editing) return;
    setDraft(current);
    requestAnimationFrame(() => {
      input.current?.focus();
      input.current?.select();
    });
  }, [current, editing]);

  const closeToTrigger = () => requestAnimationFrame(() => trigger.current?.focus());
  const open = () => {
    if (disabled) return;
    setError("");
    setEditing(true);
  };
  const cancel = () => {
    setDraft(current);
    setError("");
    setEditing(false);
    closeToTrigger();
  };
  const save = () => {
    const problem = required && !draft.trim() ? `${label} is required.` : validate?.(draft) ?? null;
    if (problem) {
      setError(problem);
      return;
    }
    setError("");
    setCurrent(draft);
    setEditing(false);
    closeToTrigger();
  };

  return (
    <motion.div layout={motionEnabled} className={cn("w-full max-w-md rounded-[22px] border border-line bg-white p-4 shadow-soft", className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-ink-900">{label}</p>
          {description ? <p id={descriptionId} className="mt-1 text-xs leading-relaxed text-ink-500">{description}</p> : null}
        </div>
        {!editing ? <span className="shrink-0 rounded-full bg-cloud-50 px-2.5 py-1 text-[0.625rem] text-ink-500">Click to edit</span> : null}
      </div>

      {editing ? (
        <form className="mt-4" onSubmit={(event) => { event.preventDefault(); save(); }}>
          <label className="sr-only" htmlFor={inputId}>{label}</label>
          <input
            ref={input}
            id={inputId}
            value={draft}
            required={required}
            inputMode={inputMode}
            placeholder={placeholder}
            aria-invalid={Boolean(error)}
            aria-describedby={[description ? descriptionId : "", error ? errorId : ""].filter(Boolean).join(" ") || undefined}
            onChange={(event) => { setDraft(event.currentTarget.value); if (error) setError(""); }}
            onKeyDown={(event) => { if (event.key === "Escape") { event.preventDefault(); cancel(); } }}
            className="w-full rounded-xl border border-line bg-milk px-3 py-2.5 text-sm text-ink-900 outline-none transition-colors placeholder:text-ink-400 focus:border-ink-900 focus:ring-2 focus:ring-ink-900/10"
          />
          {error ? <p id={errorId} role="alert" className="mt-2 text-xs leading-relaxed text-ink-700">{error}</p> : null}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button type="submit" className="rounded-full bg-ink-900 px-3.5 py-2 text-xs text-milk focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/30">Save</button>
            <button type="button" onClick={cancel} className="rounded-full border border-line px-3.5 py-2 text-xs text-ink-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/20">Cancel</button>
          </div>
        </form>
      ) : (
        <button
          ref={trigger}
          type="button"
          disabled={disabled}
          onClick={open}
          aria-label={`Edit ${label}`}
          className="mt-4 block w-full rounded-xl bg-cloud-50 px-3 py-3 text-left text-sm text-ink-900 transition-colors hover:bg-blush-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {current || <span className="text-ink-400">{placeholder}</span>}
        </button>
      )}
    </motion.div>
  );
}
