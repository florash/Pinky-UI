"use client";

import { Morph } from "@pinky-ui/primitives";
import { type ReactNode } from "react";

import { cn } from "../internal/cn";

export type ExpandableMediaProps = {
  preview: ReactNode;
  expanded?: ReactNode;
  label: string;
  caption?: ReactNode;
  className?: string;
  expandedClassName?: string;
  disabled?: boolean;
};

/** Media-specific in-page detail: preview, immersive media and caption remain one surface. */
export function ExpandableMedia({ preview, expanded, label, caption, className, expandedClassName, disabled = false }: ExpandableMediaProps) {
  return <Morph label={label} maxWidth={1100} disabled={disabled} className={cn("block overflow-hidden rounded-[22px] bg-white text-left shadow-soft", className)} expandedClassName={cn("overflow-hidden rounded-[28px] bg-white shadow-2xl", expandedClassName)} expanded={<figure><div className="max-h-[76vh] overflow-auto">{expanded ?? preview}</div>{caption ? <figcaption className="border-t border-[color:var(--color-line,rgba(70,90,115,.1))] p-4 text-sm text-[color:var(--color-ink-700,#505865)]">{caption}</figcaption> : null}</figure>}>{preview}</Morph>;
}
