import { cn } from "@pinky/components";
import type { ReactNode } from "react";

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-[76rem] px-5 sm:px-8", className)}>{children}</div>;
}

export function Section({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("relative py-20 sm:py-28", className)}>
      {children}
    </section>
  );
}

/**
 * The one place section headings are composed, so every section on the site
 * shares the same rhythm instead of drifting apart.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? (
        <p className="mb-4 font-mono text-[0.6875rem] tracking-[0.18em] text-ink-500 uppercase">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-section text-balance-tight">{title}</h2>
      {description ? (
        <p className="mt-5 text-base leading-relaxed text-ink-700 sm:text-lg">{description}</p>
      ) : null}
    </div>
  );
}

/** Soft radial lighting. Decorative, never in the layout flow. */
export function Halo({
  className,
  color = "var(--pinky-halo-a)",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute -z-10 rounded-pill blur-[70px]", className)}
      style={{ background: color }}
    />
  );
}
