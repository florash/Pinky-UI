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

export type EmailTemplateHtmlProps = {
  brand?: string;
  eyebrow?: string;
  heading: string;
  body: string;
  ctaLabel?: string;
  ctaHref?: string;
  footer?: string;
};

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/**
 * Renders the same content as `<EmailTemplate>` as real email-safe HTML —
 * a table layout with every style inlined, no external stylesheet, no
 * flexbox/grid — so it can actually go through a transactional email
 * provider, not just preview on the site. Takes plain strings rather than
 * `EmailTemplateProps`' `ReactNode` fields, since arbitrary JSX has no
 * general email-safe serialization.
 */
export function emailTemplateHtml({ brand, eyebrow, heading, body, ctaLabel, ctaHref = "#", footer }: EmailTemplateHtmlProps): string {
  const safe = {
    brand: brand ? escapeHtml(brand) : "",
    eyebrow: eyebrow ? escapeHtml(eyebrow) : "",
    heading: escapeHtml(heading),
    body: escapeHtml(body),
    ctaLabel: ctaLabel ? escapeHtml(ctaLabel) : "",
    footer: footer ? escapeHtml(footer) : "",
  };

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${safe.heading}</title>
</head>
<body style="margin:0;padding:0;background:#fdfbf8;font-family:Arial,Helvetica,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="420" cellpadding="0" cellspacing="0" style="width:100%;max-width:420px;background:#ffffff;border:1px solid #e6e2dd;border-radius:20px;overflow:hidden;">
<tr><td style="padding:20px 24px;background:#eaf6fd;">
<table role="presentation" cellpadding="0" cellspacing="0"><tr>
<td style="width:24px;height:24px;border-radius:50%;background:#f4c7d7;font-size:0;line-height:0;">&nbsp;</td>
<td style="padding-left:8px;font-size:14px;font-weight:600;color:#252933;">${safe.brand}</td>
</tr></table>
</td></tr>
<tr><td style="padding:28px 24px;">
${safe.eyebrow ? `<p style="margin:0 0 8px;font-family:monospace;font-size:11px;letter-spacing:.05em;text-transform:uppercase;color:#7b8492;">${safe.eyebrow}</p>` : ""}
<h1 style="margin:0;font-size:20px;line-height:1.3;color:#252933;">${safe.heading}</h1>
<p style="margin:12px 0 0;font-size:14px;line-height:1.6;color:#4b5563;">${safe.body}</p>
${safe.ctaLabel ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:24px;"><tr><td style="border-radius:999px;background:#252933;"><a href="${ctaHref}" style="display:inline-block;padding:10px 20px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;">${safe.ctaLabel}</a></td></tr></table>` : ""}
</td></tr>
${safe.footer ? `<tr><td style="padding:16px 24px;border-top:1px solid #e6e2dd;font-size:12px;line-height:1.6;color:#7b8492;">${safe.footer}</td></tr>` : ""}
</table>
</td></tr></table>
</body>
</html>`;
}
