"use client";

import {
  CursorTarget,
  HoverImagePreview,
  HoverImagePreviewItem,
} from "@pinky/effects";
import { type ReactNode } from "react";

import { cn } from "../internal/cn";

export type CursorPreviewNavItem = {
  id: string;
  label: ReactNode;
  href: string;
  image: string;
  description?: ReactNode;
  cursorLabel?: string;
};

export type CursorPreviewNavProps = {
  items: CursorPreviewNavItem[];
  label?: string;
  previewWidth?: number;
  previewHeight?: number;
  className?: string;
};

/** A semantic project/editorial nav composed with the 2.6 preview system. */
export function CursorPreviewNav({
  items,
  label = "Projects",
  previewWidth = 300,
  previewHeight = 210,
  className,
}: CursorPreviewNavProps) {
  return (
    <HoverImagePreview width={previewWidth} height={previewHeight} className={className}>
      <nav aria-label={label}>
        <ul className="divide-y divide-[color:var(--color-line,rgba(70,90,115,.1))]">
          {items.map((item, index) => (
            <HoverImagePreviewItem key={item.id} src={item.image} as="li">
              <CursorTarget label={item.cursorLabel ?? "Open"} as="div">
                <a
                  href={item.href}
                  className={cn(
                    "group grid grid-cols-[auto_1fr_auto] items-center gap-4 py-5",
                    "text-[color:var(--color-ink-700,#505865)] hover:text-[color:var(--color-ink-900,#252933)]",
                  )}
                >
                  <span className="font-mono text-xs text-[color:var(--color-ink-500,#7b8492)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <span className="block text-xl font-semibold">{item.label}</span>
                    {item.description ? (
                      <span className="mt-1 block text-sm text-[color:var(--color-ink-500,#7b8492)]">
                        {item.description}
                      </span>
                    ) : null}
                  </span>
                  <span aria-hidden className="transition-transform group-hover:translate-x-1">↗</span>
                </a>
              </CursorTarget>
            </HoverImagePreviewItem>
          ))}
        </ul>
      </nav>
    </HoverImagePreview>
  );
}
