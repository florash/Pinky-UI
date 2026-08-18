"use client";

import { Parallax, ParallaxLayer, type SpringPreset } from "@pinky-ui/primitives";
import { type ReactNode } from "react";

import { cn } from "../internal/cn";

export type DepthHeroProps = {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  background?: ReactNode;
  artwork?: ReactNode;
  foreground?: ReactNode;
  preset?: SpringPreset;
  className?: string;
  disabled?: boolean;
};

/** A layered hero with restrained pointer depth from the existing Parallax primitive. */
export function DepthHero({
  eyebrow,
  title,
  description,
  actions,
  background,
  artwork,
  foreground,
  preset = "soft",
  className,
  disabled = false,
}: DepthHeroProps) {
  return (
    <Parallax preset={preset} disabled={disabled} className={cn("relative isolate overflow-hidden", className)}>
      {background ? (
        <ParallaxLayer depth={-0.22} className="pointer-events-none absolute -inset-6 -z-20">
          {background}
        </ParallaxLayer>
      ) : null}
      {artwork ? (
        <ParallaxLayer depth={0.42} className="pointer-events-none absolute inset-0 -z-10">
          {artwork}
        </ParallaxLayer>
      ) : null}

      <ParallaxLayer depth={0.1} className="relative z-10">
        <div>
          {eyebrow ? <div>{eyebrow}</div> : null}
          <h1>{title}</h1>
          {description ? <div>{description}</div> : null}
          {actions ? <div>{actions}</div> : null}
        </div>
      </ParallaxLayer>

      {foreground ? (
        <ParallaxLayer depth={0.62} className="pointer-events-none absolute inset-0 z-20">
          {foreground}
        </ParallaxLayer>
      ) : null}
    </Parallax>
  );
}
