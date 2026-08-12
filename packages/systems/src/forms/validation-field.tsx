"use client";

import { useId, useState, type ReactNode } from "react";

import { cn } from "../internal/cn";
import { useControllable } from "../internal/use-controllable";

export type ValidationStatus = "idle" | "valid" | "warning" | "invalid" | "correcting";
export type ValidationResult = { status: Exclude<ValidationStatus, "idle" | "correcting">; message: string } | null;
export type ValidationFieldProps = {
  label: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  validate?: (value: string) => ValidationResult;
  description?: ReactNode;
  placeholder?: string;
  type?: "text" | "email" | "url";
  className?: string;
};

/** A field where validation is a readable state transition, not a colour flash. */
export function ValidationField({
  label,
  value,
  defaultValue = "",
  onValueChange,
  validate,
  description,
  placeholder,
  type = "text",
  className,
}: ValidationFieldProps) {
  const id = useId();
  const inputId = `${id}-input`;
  const descriptionId = `${id}-description`;
  const statusId = `${id}-status`;
  const [current, setCurrent] = useControllable(value, defaultValue, onValueChange);
  const [touched, setTouched] = useState(false);
  const [focused, setFocused] = useState(false);
  const [validatedValue, setValidatedValue] = useState(defaultValue);
  const result = touched ? validate?.(current) ?? null : null;
  const status: ValidationStatus = !touched ? "idle" : result?.status === "invalid" && focused && current !== validatedValue ? "correcting" : result?.status ?? "valid";
  const statusMessage = status === "correcting" ? "Updating the value…" : result?.message ?? (status === "valid" ? "Ready to continue." : "");
  const statusStyles: Record<ValidationStatus, string> = {
    idle: "border-line bg-white",
    valid: "border-emerald-200 bg-emerald-50/40",
    warning: "border-amber-200 bg-amber-50/40",
    invalid: "border-rose-200 bg-rose-50/40",
    correcting: "border-cloud-300 bg-cloud-50",
  };
  const statusLabel: Record<ValidationStatus, string> = { idle: "Not checked", valid: "Valid", warning: "Check", invalid: "Needs attention", correcting: "Correcting" };

  return (
    <div className={cn("w-full max-w-md", className)}>
      <label htmlFor={inputId} className="block text-sm font-medium text-ink-900">{label}</label>
      {description ? <p id={descriptionId} className="mt-1 text-xs leading-relaxed text-ink-500">{description}</p> : null}
      <div className={cn("mt-3 rounded-[18px] border p-1.5 transition-colors", statusStyles[status])}>
        <input
          id={inputId}
          type={type}
          value={current}
          placeholder={placeholder}
          aria-invalid={status === "invalid"}
          aria-describedby={[description ? descriptionId : "", touched ? statusId : ""].filter(Boolean).join(" ") || undefined}
          onFocus={() => setFocused(true)}
          onBlur={() => { setFocused(false); setTouched(true); setValidatedValue(current); }}
          onChange={(event) => { setCurrent(event.currentTarget.value); setTouched(true); }}
          className="w-full rounded-xl bg-transparent px-3 py-2.5 text-sm text-ink-900 outline-none placeholder:text-ink-400 focus-visible:ring-2 focus-visible:ring-ink-900/15"
        />
        <div className="flex items-center justify-between gap-3 px-3 pb-1 pt-2 text-xs">
          <span className="flex items-center gap-2 text-ink-700"><span aria-hidden className={cn("grid size-4 place-items-center rounded-full text-[0.625rem]", status === "valid" ? "bg-emerald-200" : status === "invalid" ? "bg-rose-200" : "bg-cloud-200")}>{status === "valid" ? "✓" : status === "invalid" ? "!" : "·"}</span>{statusLabel[status]}</span>
          {statusMessage ? <span id={statusId} role={status === "invalid" ? "alert" : "status"} className="text-right text-ink-500">{statusMessage}</span> : null}
        </div>
      </div>
    </div>
  );
}
