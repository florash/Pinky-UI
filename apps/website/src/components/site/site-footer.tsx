import Link from "next/link";

import { NAV_LINKS, SITE } from "@/lib/site";

import { GitHubMark } from "./icons";
import { Container } from "./layout";

export function SiteFooter() {
  return (
    <footer className="relative mt-24 border-t border-line py-14">
      <Container className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-sm">
          <p className="font-display text-lg font-semibold tracking-tight">{SITE.name}</p>
          <p className="mt-3 text-sm leading-relaxed text-ink-500">{SITE.tagline}</p>
          <p className="mt-6 font-mono text-[0.6875rem] tracking-[0.14em] text-ink-500 uppercase">
            MIT licensed · open source
          </p>
        </div>

        <div className="flex gap-12 sm:gap-16">
          <nav aria-label="Footer" className="flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-ink-700 transition-colors hover:text-ink-900"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col gap-3">
            <a
              href={SITE.github}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 text-sm text-ink-700 transition-colors hover:text-ink-900"
            >
              <GitHubMark className="size-4" />
              GitHub
            </a>
            <Link
              href="/showcase"
              className="text-sm text-ink-700 transition-colors hover:text-ink-900"
            >
              Showcase
            </Link>
            <Link
              href="/components"
              className="text-sm text-ink-700 transition-colors hover:text-ink-900"
            >
              Component index
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
