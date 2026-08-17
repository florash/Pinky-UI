"use client";

import { useMotionEnabled, usePointerCapability } from "@pinky-ui/primitives";
import {
  createContext,
  useContext,
  useState,
  type ElementType,
  type FocusEvent as ReactFocusEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";

import { cn } from "../internal/cn";

type SiblingDimContextValue = { active: string | null; setActive: (id: string | null) => void };

const SiblingDimContext = createContext<SiblingDimContextValue | null>(null);

export type SiblingDimProps = { children: ReactNode; className?: string };

/**
 * Groups `SiblingDimItem`s so hovering or focusing one dims the rest —
 * connecting a set of options by making the one not being considered fade
 * back, rather than the one being considered stand out.
 */
export function SiblingDim({ children, className }: SiblingDimProps) {
  const [active, setActive] = useState<string | null>(null);
  return <SiblingDimContext.Provider value={{ active, setActive }}><div className={className}>{children}</div></SiblingDimContext.Provider>;
}

export type SiblingDimItemProps = {
  children: ReactNode;
  /** Identifies this item among its siblings. */
  id: string;
  as?: ElementType;
  className?: string;
};

/**
 * One member of a `SiblingDim` group.
 *
 * Dimming is opacity and a 2% scale — never a layout property — so nothing
 * reflows while the group responds. Touch never enters a dimmed state: a tap
 * is a commit, not a hover, so nothing here is a dead end on touch.
 */
export function SiblingDimItem({ children, id, as: Tag = "div", className }: SiblingDimItemProps) {
  const context = useContext(SiblingDimContext);
  const motionEnabled = useMotionEnabled();
  const { hasHover } = usePointerCapability();

  if (!context) return <Tag className={className}>{children}</Tag>;

  const dimmed = motionEnabled && context.active !== null && context.active !== id;

  return (
    <Tag
      className={cn("transition-[opacity,transform] duration-300 ease-out", dimmed && "scale-[0.98] opacity-45", className)}
      onPointerEnter={() => {
        if (hasHover) context.setActive(id);
      }}
      onPointerLeave={(event: ReactPointerEvent) => {
        if (event.relatedTarget instanceof Node && event.currentTarget.contains(event.relatedTarget)) return;
        context.setActive(null);
      }}
      onPointerCancel={() => context.setActive(null)}
      onFocus={() => context.setActive(id)}
      onBlur={(event: ReactFocusEvent) => {
        if (event.relatedTarget instanceof Node && event.currentTarget.contains(event.relatedTarget)) return;
        context.setActive(null);
      }}
    >
      {children}
    </Tag>
  );
}
