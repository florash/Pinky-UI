"use client";

import { GridReveal, useMotionEnabled, useReducedMotion } from "@pinky-ui/primitives";
import { motion } from "motion/react";
import { useId, useState, type ReactNode } from "react";

import { cn } from "./internal/cn";

export type ToolCallStatus = "pending" | "running" | "done" | "error";

export type ToolCallCardProps = {
  /** The tool's name, e.g. "search_files". */
  name: string;
  status: ToolCallStatus;
  /** One-line result shown while the details panel is collapsed. */
  summary?: string;
  /** Expandable detail — arguments, output, a diff. Omit to make the card non-expanding. */
  children?: ReactNode;
  defaultOpen?: boolean;
  className?: string;
};

const STATUS_LABEL: Record<ToolCallStatus, string> = {
  pending: "Queued",
  running: "Running",
  done: "Done",
  error: "Failed",
};

function StatusIcon({ status, motionEnabled }: { status: ToolCallStatus; motionEnabled: boolean }) {
  if (status === "running") {
    return (
      <motion.span
        aria-hidden
        className="size-3.5 rounded-full border-2 border-cloud-300 border-t-transparent"
        animate={motionEnabled ? { rotate: 360 } : undefined}
        transition={motionEnabled ? { duration: 0.8, repeat: Infinity, ease: "linear" } : undefined}
      />
    );
  }
  if (status === "done") return <span aria-hidden className="text-sm text-cloud-300">✓</span>;
  if (status === "error") return <span aria-hidden className="text-sm text-blush-300">!</span>;
  return <span aria-hidden className="size-1.5 rounded-full bg-ink-500/40" />;
}

export function ToolCallCard({ name, status, summary, children, defaultOpen = false, className }: ToolCallCardProps) {
  const [open, setOpen] = useState(defaultOpen);
  const motionEnabled = useMotionEnabled();
  const reducedMotion = useReducedMotion();
  const id = useId();
  const canExpand = Boolean(children);

  return (
    <div role="status" className={cn("overflow-hidden rounded-xl border border-line bg-white/70", className)}>
      <button
        type="button"
        disabled={!canExpand}
        aria-expanded={canExpand ? open : undefined}
        aria-controls={canExpand ? id : undefined}
        onClick={() => canExpand && setOpen((value) => !value)}
        className="flex min-h-11 w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm disabled:cursor-default"
      >
        <StatusIcon status={status} motionEnabled={motionEnabled} />
        <span className="min-w-0 flex-1 truncate font-mono text-xs text-ink-900">{name}</span>
        <span className="shrink-0 font-mono text-[0.625rem] tracking-[0.08em] text-ink-500 uppercase">
          {STATUS_LABEL[status]}
        </span>
      </button>

      {summary && !open ? <p className="-mt-1 px-3.5 pb-2.5 text-xs text-ink-500">{summary}</p> : null}

      {canExpand ? (
        <GridReveal
          open={open}
          contentProps={{
            id,
            // The divider only belongs between the trigger and real detail
            // content; kept off the always-mounted wrapper's own border-top
            // so a collapsed card doesn't show a stray hairline sitting on
            // top of the card's own outer border.
            className: cn("border-line", open && "border-t"),
            style: { opacity: open ? 1 : 0, transition: reducedMotion ? "none" : "opacity 300ms cubic-bezier(0.22, 1, 0.36, 1)" },
          }}
        >
          <div className="px-3.5 py-3 font-mono text-xs leading-relaxed text-ink-700">{children}</div>
        </GridReveal>
      ) : null}
    </div>
  );
}
