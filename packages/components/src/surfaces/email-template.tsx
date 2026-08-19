import type { ReactNode } from "react";

import { cn } from "../utils/cn";

export type EmailTemplateProps = {
  brand?: string;
  logo?: ReactNode;
  eyebrow?: string;
  heading: ReactNode;
  body: ReactNode;
  ctaLabel?: string;
  ctaHref?: string;
  footer?: ReactNode;
  className?: string;
};

/**
 * A simple transactional email body — subscription confirmations, password
 * resets, welcome notes — one column, one primary action, styled to preview
 * correctly on the site.
 *
 * This is layout only, not email-safe markup: no table-based structure, no
 * inlined styles, no client-specific fallbacks. Sending it as a real email
 * needs a table-based renderer (e.g. react-email) to produce HTML that
 * survives Outlook and Gmail's stripped CSS support — this component is for
 * showing what that email looks like on the site, not for sending it.
 */
export function EmailTemplate({ brand, logo, eyebrow, heading, body, ctaLabel, ctaHref, footer, className }: EmailTemplateProps) {
  return (
    <div className={cn("mx-auto w-full max-w-[420px] overflow-hidden rounded-[20px] border border-line bg-white shadow-soft", className)}>
      <div className="border-b border-line bg-cloud-50 px-6 py-5">
        <div className="flex items-center gap-2">
          {logo ?? <span aria-hidden className="size-6 shrink-0 rounded-full bg-[linear-gradient(135deg,var(--color-blush-300),var(--color-cloud-300))]" />}
          {brand ? <span className="font-display text-sm font-semibold text-ink-900">{brand}</span> : null}
        </div>
      </div>
      <div className="px-6 py-7">
        {eyebrow ? <p className="font-mono text-[0.65rem] tracking-[0.14em] text-ink-500 uppercase">{eyebrow}</p> : null}
        <h1 className="mt-2 text-xl font-semibold text-balance text-ink-900">{heading}</h1>
        <div className="mt-3 text-sm leading-relaxed text-ink-700">{body}</div>
        {ctaLabel ? (
          <a href={ctaHref ?? "#"} className="mt-6 inline-flex min-h-10 items-center rounded-pill bg-ink-900 px-5 text-sm font-medium text-milk focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25">
            {ctaLabel}
          </a>
        ) : null}
      </div>
      {footer ? <div className="border-t border-line px-6 py-4 text-xs leading-relaxed text-ink-500">{footer}</div> : null}
    </div>
  );
}
