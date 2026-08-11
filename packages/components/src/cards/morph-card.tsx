"use client";

import { Morph } from "@pinky/primitives";
import type { ReactNode } from "react";

import { cn } from "../utils/cn";

export type MorphCardProps = {
  /** The collapsed card. Becomes the trigger. */
  children: ReactNode;
  /** What the card becomes when expanded. */
  expandedContent: ReactNode;
  /** Accessible name for the expanded dialog. */
  label: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  maxWidth?: number;
  radius?: "lg" | "xl" | "2xl";
  className?: string;
  disabled?: boolean;
};

const RADIUS = {
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
} as const;

/**
 * A card that expands into its own detail view.
 *
 * The collapsed card and the expanded panel are the same object travelling and
 * resizing, not a card fading out while a modal fades in. Everything a dialog
 * owes the user comes with it: Escape, a focus trap, and focus returned to the
 * card afterwards.
 */
export function MorphCard({
  children,
  expandedContent,
  label,
  open,
  onOpenChange,
  maxWidth = 620,
  radius = "2xl",
  className,
  disabled = false,
}: MorphCardProps) {
  const surface = cn(
    "block w-full overflow-hidden bg-white text-left shadow-soft ring-1 ring-line",
    RADIUS[radius],
  );

  return (
    <Morph
      label={label}
      open={open}
      onOpenChange={onOpenChange}
      maxWidth={maxWidth}
      disabled={disabled}
      className={cn(
        surface,
        "cursor-pointer transition-shadow duration-500 ease-[var(--ease-soft)] hover:shadow-lift",
        className,
      )}
      expandedClassName={cn(surface, "max-h-[85dvh] overflow-y-auto shadow-lift")}
      expanded={expandedContent}
    >
      {children}
    </Morph>
  );
}
