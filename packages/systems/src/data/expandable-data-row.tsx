"use client";

import { AnimatePresence, motion } from "motion/react";
import { useMotionEnabled } from "@pinky/primitives";
import { useId, type ReactNode } from "react";

import { cn } from "../internal/cn";
import { useControllable } from "../internal/use-controllable";

export type ExpandableDataRowItem = { id: string; label: string; secondary?: string; values?: ReactNode[]; detail: ReactNode };
export type ExpandableDataRowProps = {
  row: ExpandableDataRowItem;
  columns?: string[];
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  label?: string;
  className?: string;
};

/** A row-to-detail surface that keeps identity and actions in the same data context. */
export function ExpandableDataRow({ row, columns = [], open, defaultOpen = false, onOpenChange, label = "Expand row", className }: ExpandableDataRowProps) {
  const id = useId();
  const detailId = `${id}-detail`;
  const [expanded, setExpanded] = useControllable(open, defaultOpen, onOpenChange);
  const motionEnabled = useMotionEnabled();
  const toggle = () => setExpanded(!expanded);
  return (
    <motion.div layout={motionEnabled} className={cn("w-full overflow-hidden rounded-[20px] border border-line bg-white shadow-sm", className)}>
      <button type="button" aria-expanded={expanded} aria-controls={expanded ? detailId : undefined} aria-label={`${expanded ? "Collapse" : "Expand"} ${row.label}`} onClick={toggle} className="grid w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-cloud-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ink-900/20 sm:grid-cols-[minmax(9rem,1.35fr)_repeat(var(--row-columns),minmax(4.5rem,1fr))_auto]" style={{ "--row-columns": columns.length } as React.CSSProperties}>
        <span className="min-w-0"><span className="block truncate text-sm font-medium text-ink-900">{row.label}</span>{row.secondary ? <span className="mt-0.5 block truncate text-xs text-ink-500">{row.secondary}</span> : null}</span>
        {row.values?.map((value, index) => <span key={`${row.id}-value-${index}`} className="hidden min-w-0 truncate text-sm text-ink-700 sm:block">{value}</span>)}
        <span aria-hidden className={cn("ml-auto grid size-7 place-items-center rounded-full bg-cloud-50 text-ink-700 transition-transform", expanded && "rotate-180")}>⌄</span>
      </button>
      <AnimatePresence initial={false}>{expanded ? <motion.div id={detailId} role="region" aria-label={`${row.label} details`} initial={motionEnabled ? { height: 0, opacity: 0 } : false} animate={{ height: "auto", opacity: 1 }} exit={motionEnabled ? { height: 0, opacity: 0 } : undefined} className="overflow-hidden"><div className="border-t border-line bg-cloud-50/60 px-4 py-4 sm:px-5">{row.detail}</div></motion.div> : null}</AnimatePresence>
      <span className="sr-only">{label}</span>
    </motion.div>
  );
}
