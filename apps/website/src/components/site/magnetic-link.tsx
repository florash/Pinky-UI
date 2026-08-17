"use client";

import { buttonSurface, type MagneticButtonProps } from "@pinky-ui/components";
import { Magnetic } from "@pinky-ui/primitives";
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type MagneticLinkProps = {
  href: string;
  children: ReactNode;
  variant?: MagneticButtonProps["variant"];
  size?: MagneticButtonProps["size"];
  className?: string;
  /** Layout classes for the magnetic wrapper — display, visibility, grid placement. */
  wrapperClassName?: string;
  external?: boolean;
} & Omit<ComponentProps<typeof Link>, "href" | "className" | "children">;

/**
 * Navigation that behaves like Pinky's buttons but stays a real link — so
 * middle-click, open-in-new-tab and screen readers all keep working.
 */
export function MagneticLink({
  href,
  children,
  variant = "primary",
  size = "md",
  className,
  wrapperClassName,
  external = false,
  ...props
}: MagneticLinkProps) {
  const classes = buttonSurface(variant, size, className);

  return (
    <Magnetic className={wrapperClassName ?? "inline-flex"}>
      {external ? (
        <a href={href} target="_blank" rel="noreferrer noopener" className={classes}>
          {children}
        </a>
      ) : (
        <Link href={href} className={classes} {...props}>
          {children}
        </Link>
      )}
    </Magnetic>
  );
}
