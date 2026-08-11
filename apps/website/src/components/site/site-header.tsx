"use client";

import { cn } from "@pinky/components";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { NAV_LINKS, SITE } from "@/lib/site";

import { GitHubMark } from "./icons";
import { Container } from "./layout";
import { MagneticLink } from "./magnetic-link";
import { ThemeSwitch } from "./theme-switch";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-[background-color,border-color,backdrop-filter] duration-500",
        scrolled
          ? "border-b border-line bg-[color-mix(in_oklab,var(--pinky-page)_78%,white)]/85 backdrop-blur-xl"
          : "border-b border-transparent",
      )}
    >
      <Container className="flex h-16 items-center justify-between gap-4 sm:h-18">
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2.5"
          aria-label={`${SITE.name} home`}
        >
          <PinkyMark />
          <span className="font-display text-[0.9375rem] font-semibold tracking-tight whitespace-nowrap">
            {SITE.name}
          </span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => {
            const active =
              pathname === link.href ||
              pathname.startsWith(`${link.href}/`) ||
              link.matchPrefixes.some(
                (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
              );
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-pill px-3.5 py-2 text-sm transition-colors duration-200",
                  active ? "text-ink-900" : "text-ink-500 hover:text-ink-900",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeSwitch className="hidden sm:inline-flex" />
          <a
            href={SITE.github}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="Pinky UI on GitHub"
            className="hidden size-9 items-center justify-center rounded-pill text-ink-700 transition-colors hover:bg-white/70 hover:text-ink-900 lg:inline-flex"
          >
            <GitHubMark className="size-[18px]" />
          </a>
          <MagneticLink href="/docs" size="sm" wrapperClassName="hidden sm:inline-flex">
            Get started
          </MagneticLink>

          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((value) => !value)}
            className="inline-flex size-10 items-center justify-center rounded-pill border border-line bg-white/70 lg:hidden"
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <MenuGlyph open={open} />
          </button>
        </div>
      </Container>

      <div
        id="mobile-nav"
        hidden={!open}
        className="border-t border-line bg-[color-mix(in_oklab,var(--pinky-page)_80%,white)] backdrop-blur-xl lg:hidden"
      >
        <Container className="flex flex-col gap-1 py-4">
          {NAV_LINKS.map((link) => {
            const active =
              pathname === link.href ||
              pathname.startsWith(`${link.href}/`) ||
              link.matchPrefixes.some(
                (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
              );
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className="rounded-md px-2 py-3 text-base text-ink-700 hover:bg-white/70 hover:text-ink-900"
              >
                {link.label}
              </Link>
            );
          })}
          <a
            href={SITE.github}
            target="_blank"
            rel="noreferrer noopener"
            className="rounded-md px-2 py-3 text-base text-ink-700 hover:bg-white/70 hover:text-ink-900"
          >
            GitHub
          </a>
          <div className="mt-3 px-2">
            <ThemeSwitch />
          </div>
        </Container>
      </div>
    </header>
  );
}

/** The mark: two soft overlapping fields, blush over milk blue. */
function PinkyMark() {
  return (
    <span
      aria-hidden
      className="relative inline-flex size-7 items-center justify-center rounded-[10px] border border-line bg-white shadow-soft"
    >
      <span
        className="absolute size-3.5 rounded-pill blur-[1px] transition-transform duration-500 ease-[var(--ease-soft)] group-hover:translate-x-[3px]"
        style={{ background: "var(--color-blush-300)", transform: "translateX(-3px)" }}
      />
      <span
        className="absolute size-3.5 rounded-pill mix-blend-multiply blur-[1px] transition-transform duration-500 ease-[var(--ease-soft)] group-hover:-translate-x-[3px]"
        style={{ background: "var(--color-cloud-300)", transform: "translateX(3px)" }}
      />
    </span>
  );
}

function MenuGlyph({ open }: { open: boolean }) {
  return (
    <span aria-hidden className="relative block h-3 w-4">
      <span
        className={cn(
          "absolute left-0 h-px w-full bg-ink-900 transition-transform duration-300 ease-[var(--ease-soft)]",
          open ? "top-1/2 rotate-45" : "top-0",
        )}
      />
      <span
        className={cn(
          "absolute left-0 h-px w-full bg-ink-900 transition-transform duration-300 ease-[var(--ease-soft)]",
          open ? "top-1/2 -rotate-45" : "top-full",
        )}
      />
    </span>
  );
}
