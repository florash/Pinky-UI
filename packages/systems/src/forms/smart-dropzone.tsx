"use client";

import { useId, useRef, useState, type DragEvent } from "react";

import { cn } from "../internal/cn";

export type DropzoneStatus = "idle" | "processing" | "complete";
export type SmartDropzoneProps = {
  label: string;
  description?: string;
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  status?: DropzoneStatus;
  onFiles?: (files: File[]) => void;
  onReject?: (files: File[], reason: string) => void;
  validate?: (file: File) => string | null;
  className?: string;
  disabled?: boolean;
};

export function SmartDropzone({ label, description, accept, multiple = false, maxSize, status = "idle", onFiles, onReject, validate, className, disabled = false }: SmartDropzoneProps) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState<"idle" | "nearby" | "over">("idle");
  const [message, setMessage] = useState("");
  const testType = (file: File) => !accept || accept.split(",").some((rule) => { const value = rule.trim(); return value.startsWith(".") ? file.name.toLowerCase().endsWith(value.toLowerCase()) : value.endsWith("/*") ? file.type.startsWith(value.slice(0, -1)) : file.type === value; });
  const handle = (list: FileList | File[]) => {
    const files = [...list];
    const rejected = files.filter((file) => !testType(file) || (maxSize !== undefined && file.size > maxSize) || Boolean(validate?.(file)));
    if (rejected.length) { const reason = validate?.(rejected[0]!) ?? "File type or size is not accepted."; setMessage(reason); onReject?.(rejected, reason); return; }
    const accepted = multiple ? files : files.slice(0, 1); setMessage(`${accepted.length} file${accepted.length === 1 ? "" : "s"} accepted.`); onFiles?.(accepted);
  };
  const over = (event: DragEvent) => { event.preventDefault(); if (!disabled) setDrag("over"); };
  return <div className={cn("relative", className)} onDragEnter={() => !disabled && setDrag("nearby")} onDragOver={over} onDragLeave={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node)) setDrag("idle"); }} onDrop={(event) => { event.preventDefault(); setDrag("idle"); if (!disabled) handle(event.dataTransfer.files); }}><input ref={input} id={id} type="file" accept={accept} multiple={multiple} disabled={disabled} onChange={(event) => event.currentTarget.files && handle(event.currentTarget.files)} className="sr-only" /><label htmlFor={id} tabIndex={disabled ? -1 : 0} onKeyDown={(event) => { if ((event.key === "Enter" || event.key === " ") && !disabled) { event.preventDefault(); input.current?.click(); } }} className={cn("grid min-h-48 cursor-pointer place-items-center rounded-[24px] border border-dashed p-6 text-center transition-[transform,background-color,border-color]", drag === "over" ? "scale-[1.015] border-[color:var(--color-ink-900,#252933)] bg-[color:var(--color-cloud-50,#f4fafe)]" : drag === "nearby" ? "border-[color:var(--color-cloud-300,#c8e4f7)] bg-white" : "border-[color:var(--color-line-strong,rgba(70,90,115,.18))] bg-white", disabled && "cursor-not-allowed opacity-50")}><span><span className="block font-medium">{status === "processing" ? "Processing…" : status === "complete" ? "Complete" : label}</span>{description ? <span className="mt-2 block text-sm text-[color:var(--color-ink-500,#7b8492)]">{description}</span> : null}</span></label><p aria-live="polite" className="mt-2 text-sm text-[color:var(--color-ink-700,#505865)]">{message}</p></div>;
}
