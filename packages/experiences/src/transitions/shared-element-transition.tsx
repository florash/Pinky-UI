"use client";

import { motion } from "motion/react";
import { Morph, useMotionEnabled } from "@pinky/primitives";
import { type CSSProperties, type MouseEventHandler, type ReactNode } from "react";

export type SharedElementTransitionProps = {
  name: string;
  children: ReactNode;
  /** Preserve navigation semantics when moving between real routes. */
  href?: string;
  /** When supplied, the existing accessible Morph dialog architecture is used. */
  expanded?: ReactNode;
  label?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  maxWidth?: number;
  className?: string;
  expandedClassName?: string;
  disabled?: boolean;
};

/**
 * One shared-element surface with two coherent modes: a real anchor for route
 * navigation, or the existing Morph primitive for in-place detail.
 */
export function SharedElementTransition({
  name,
  children,
  href,
  expanded,
  label = name,
  open,
  onOpenChange,
  onClick,
  maxWidth,
  className,
  expandedClassName,
  disabled = false,
}: SharedElementTransitionProps) {
  const motionEnabled = useMotionEnabled();

  if (expanded !== undefined) {
    return (
      <Morph
        label={label}
        expanded={expanded}
        open={open}
        onOpenChange={onOpenChange}
        maxWidth={maxWidth}
        className={className}
        expandedClassName={expandedClassName}
        disabled={disabled}
      >
        {children}
      </Morph>
    );
  }

  const transitionName = name.replace(/[^a-zA-Z0-9_-]/g, "-");
  const style = {
    viewTransitionName: motionEnabled && !disabled ? transitionName : "none",
  } as CSSProperties;
  const layout = motionEnabled && !disabled ? { layoutId: transitionName } : {};

  if (href) {
    return (
      <motion.a href={href} onClick={onClick} className={className} style={style} {...layout}>
        {children}
      </motion.a>
    );
  }

  return (
    <motion.div className={className} style={style} {...layout}>
      {children}
    </motion.div>
  );
}
