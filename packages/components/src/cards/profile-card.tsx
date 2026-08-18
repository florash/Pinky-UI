"use client";

import type { ElementType, ReactNode } from "react";

import { cn } from "../utils/cn";

export type ProfileCardProps = {
  /** Photo URL. Takes priority over `initials` when both are present. */
  avatarSrc?: string;
  avatarAlt?: string;
  /** Shown in a plain circle when there's no `avatarSrc` — usually one or two letters. */
  initials?: string;
  name: ReactNode;
  subtitle?: ReactNode;
  tags?: string[];
  /** Tags beyond this count collapse into a single "+N" pill. */
  maxTags?: number;
  actions?: ReactNode;
  radius?: "md" | "lg" | "xl" | "2xl";
  padded?: boolean;
  shadow?: "neutral" | "pink";
  /** Renders as this element/component instead of a plain div — pass `Link` from next/link to make the whole card navigable. */
  as?: ElementType;
  /** Only meaningful when `as` renders an anchor (e.g. `as={Link}`). */
  href?: string;
  onClick?: () => void;
  className?: string;
  surfaceClassName?: string;
  disabled?: boolean;
};

const RADIUS: Record<NonNullable<ProfileCardProps["radius"]>, string> = {
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
};

const SHADOW: Record<NonNullable<ProfileCardProps["shadow"]>, { rest: string; hover: string }> = {
  neutral: { rest: "shadow-soft", hover: "hover:shadow-lift" },
  pink: { rest: "shadow-pink-soft", hover: "hover:shadow-pink-lift" },
};

const CLICKABLE_FOCUS = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25 focus-visible:ring-offset-2";

const DEFAULT_MAX_TAGS = 3;

/**
 * Avatar has three states, in priority order: `avatarSrc` (a real photo),
 * `initials` (a plain circle with one or two letters), or — when neither is
 * given — a generic silhouette. Never renders a broken-image icon: an
 * `avatarSrc` that fails to load still leaves the surrounding circle intact,
 * it just shows nothing inside it, same as any bare `<img>` would.
 */
function Avatar({ src, alt, initials }: { src?: string; alt?: string; initials?: string }) {
  return (
    <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-cloud-100 text-ink-700">
      {src ? (
        <img src={src} alt={alt ?? ""} className="size-full object-cover" />
      ) : initials ? (
        <span className="font-display text-lg font-semibold tracking-tight" aria-hidden="true">
          {initials}
        </span>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" className="size-6 text-ink-500" aria-hidden="true">
          <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.75" />
          <path d="M4.5 20c1.4-3.6 4.5-5.5 7.5-5.5s6.1 1.9 7.5 5.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      )}
    </div>
  );
}

/**
 * Avatar + name + subtitle + tag group + optional action region. See
 * docs/card-api-conventions.md for the shared prop shape — `as`/`href` apply
 * here the same way they do to Basic Card, for the "whole card links to the
 * profile" case; when `actions` holds its own button, prefer leaving the
 * card itself non-clickable so the two targets don't compete (same call
 * Basic Card's skill doc makes).
 */
export function ProfileCard({
  avatarSrc,
  avatarAlt,
  initials,
  name,
  subtitle,
  tags,
  maxTags = DEFAULT_MAX_TAGS,
  actions,
  radius = "xl",
  padded = true,
  shadow = "neutral",
  as,
  href,
  onClick,
  className,
  surfaceClassName,
  disabled = false,
}: ProfileCardProps) {
  const Tag = as ?? "div";
  const clickable = Boolean(onClick || href) && !disabled;
  const visibleTags = tags?.slice(0, maxTags) ?? [];
  const overflowCount = (tags?.length ?? 0) - visibleTags.length;

  return (
    <Tag
      href={href}
      onClick={disabled ? undefined : onClick}
      aria-disabled={disabled || undefined}
      className={cn(
        "block w-full overflow-hidden border border-line bg-white/90 text-left",
        RADIUS[radius],
        SHADOW[shadow].rest,
        clickable && cn("transition-shadow duration-300 ease-[var(--ease-soft)]", SHADOW[shadow].hover, CLICKABLE_FOCUS),
        disabled && "cursor-not-allowed opacity-60",
        className,
      )}
    >
      <div className={cn(padded && "p-6 sm:p-7", surfaceClassName)}>
        <div className="flex items-start gap-4">
          <Avatar src={avatarSrc} alt={avatarAlt} initials={initials} />
          <div className="min-w-0 flex-1 pt-0.5">
            <p className="font-display text-lg font-semibold tracking-tight text-ink-900">{name}</p>
            {subtitle ? <p className="mt-0.5 text-sm leading-relaxed text-ink-700">{subtitle}</p> : null}
          </div>
        </div>
        {visibleTags.length > 0 ? (
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {visibleTags.map((tag) => (
              <li key={tag} className="rounded-pill bg-cloud-50 px-2.5 py-1 text-xs font-medium text-ink-700">
                {tag}
              </li>
            ))}
            {overflowCount > 0 ? (
              <li className="rounded-pill bg-cloud-50 px-2.5 py-1 text-xs font-medium text-ink-500">+{overflowCount}</li>
            ) : null}
          </ul>
        ) : null}
        {actions ? <div className="mt-5">{actions}</div> : null}
      </div>
    </Tag>
  );
}
