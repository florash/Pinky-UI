import Link from "next/link";

import { EXPLORE_LINK, NAV_GROUPS, NAV_UTILITY_LINKS } from "@/config/navigation";
import { SITE, UTILITY_LINKS } from "@/lib/site";

import { GitHubMark } from "./icons";
import { Container } from "./layout";

export function SiteFooter() {
  return (
    <footer className="relative mt-24 border-t border-line py-14">
      <Container className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-sm">
          <p className="font-display text-lg font-semibold tracking-tight">{SITE.name}</p>
          <p className="mt-3 text-sm leading-relaxed text-ink-500">{SITE.tagline}</p>
          <p className="mt-6 font-mono text-[0.6875rem] tracking-[0.14em] text-ink-500 uppercase">
            MIT licensed · open source
          </p>
        </div>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-12">
          <nav aria-label="Footer" className="flex flex-col gap-3">
            <p className="font-mono text-[0.65rem] tracking-[0.14em] text-ink-500 uppercase">Site</p>
            <Link href={EXPLORE_LINK.href} className={footerLink}>
              {EXPLORE_LINK.label}
            </Link>
            {NAV_UTILITY_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className={footerLink}>
                {link.label}
              </Link>
            ))}
            <p className="mt-3 font-mono text-[0.65rem] tracking-[0.14em] text-ink-500 uppercase">Tools</p>
            {UTILITY_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className={footerLink}>
                {link.label}
              </Link>
            ))}
            <a href={SITE.github} target="_blank" rel="noreferrer noopener" className={`inline-flex items-center gap-2 ${footerLink}`}>
              <GitHubMark className="size-4" />
              GitHub
            </a>
          </nav>

          {NAV_GROUPS.map((group) => (
            <nav key={group.href} aria-label={group.label} className="flex flex-col gap-3">
              <p className="font-mono text-[0.65rem] tracking-[0.14em] text-ink-500 uppercase">
                {group.label}
              </p>
              {group.children.map((link) => (
                <Link key={link.href} href={link.href} className={footerLink}>
                  {link.label}
                </Link>
              ))}
            </nav>
          ))}
        </div>
      </Container>
    </footer>
  );
}

const footerLink = "text-sm text-ink-700 transition-colors hover:text-ink-900";
