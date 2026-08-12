"use client";

import { BottomSheet } from "@pinky/systems";
import { cn } from "@pinky/components";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";

import { LIBRARY_SECTIONS, NAV_LINKS, SITE } from "@/lib/site";

import { GitHubMark } from "./icons";
import { Container } from "./layout";
import { MagneticLink } from "./magnetic-link";
import { ThemeSwitch } from "./theme-switch";

const LIBRARY_MENU_ID = "library-menu";
type LibraryLink = { href: string; label: string };
const LIBRARY_LINKS: ReadonlyArray<LibraryLink> = LIBRARY_SECTIONS.reduce<LibraryLink[]>(
  (links, section) => links.concat(Array.from(section.links as ReadonlyArray<LibraryLink>)),
  [],
);

export function SiteHeader() {
  const pathname = usePathname();
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const libraryTrigger = useRef<HTMLButtonElement>(null);
  const libraryMenu = useRef<HTMLDivElement>(null);
  const libraryLinks = useRef<Array<HTMLAnchorElement | null>>([]);

  useEffect(() => {
    setLibraryOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!libraryOpen) return;
    const focusFirst = () => libraryLinks.current.find((link) => link)?.focus();
    const focusFrame = window.requestAnimationFrame(focusFirst);
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!libraryMenu.current?.contains(target) && !libraryTrigger.current?.contains(target)) {
        setLibraryOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [libraryOpen]);

  const closeLibrary = (restoreFocus = false) => {
    setLibraryOpen(false);
    if (restoreFocus) window.requestAnimationFrame(() => libraryTrigger.current?.focus());
  };

  const onLibraryTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setLibraryOpen(true);
    }
  };

  const onLibraryMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const links = libraryLinks.current.filter((link): link is HTMLAnchorElement => Boolean(link));
    const currentIndex = links.indexOf(document.activeElement as HTMLAnchorElement);
    if (event.key === "Escape") {
      event.preventDefault();
      closeLibrary(true);
      return;
    }
    if (event.key === "Tab") {
      setLibraryOpen(false);
      return;
    }
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp" && event.key !== "Home" && event.key !== "End") return;
    event.preventDefault();
    const nextIndex = event.key === "Home"
      ? 0
      : event.key === "End"
        ? links.length - 1
        : (currentIndex + (event.key === "ArrowDown" ? 1 : -1) + links.length) % links.length;
    links[nextIndex]?.focus();
  };

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
        <Link href="/" className="group flex shrink-0 items-center gap-2.5" aria-label={`${SITE.name} home`}>
          <PinkyMark />
          <span className="font-display text-[0.9375rem] font-semibold tracking-tight whitespace-nowrap">{SITE.name}</span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          <DesktopLink href="/explore" label="Explore" active={pathname === "/explore"} />
          <div className="relative">
            <button
              ref={libraryTrigger}
              type="button"
              aria-expanded={libraryOpen}
              aria-controls={libraryOpen ? LIBRARY_MENU_ID : undefined}
              onClick={() => setLibraryOpen((open) => !open)}
              onKeyDown={onLibraryTriggerKeyDown}
              className={cn(
                "inline-flex items-center gap-1 rounded-pill px-3.5 py-2 text-sm transition-colors duration-200",
                libraryIsActive(pathname) ? "text-ink-900" : "text-ink-500 hover:text-ink-900",
              )}
            >
              Library
              <span aria-hidden className={cn("text-xs transition-transform", libraryOpen && "rotate-180")}>⌄</span>
            </button>
            {libraryOpen ? (
              <div
                ref={libraryMenu}
                id={LIBRARY_MENU_ID}
                role="menu"
                aria-label="Library sections"
                onKeyDown={onLibraryMenuKeyDown}
                className="absolute top-[calc(100%+0.75rem)] right-0 z-50 w-[min(44rem,calc(100vw-2rem))] rounded-[24px] border border-line bg-white/95 p-5 shadow-soft backdrop-blur-xl"
              >
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {LIBRARY_SECTIONS.map((section) => (
                    <div key={section.label}>
                      <p className="font-mono text-[0.625rem] tracking-[0.14em] text-ink-500 uppercase">{section.label}</p>
                      <ul className="mt-2 flex flex-col gap-1">
                        {section.links.map((link) => (
                          <li key={link.href}>
                            <Link
                              ref={(node) => { libraryLinks.current[LIBRARY_LINKS.findIndex((item) => item.href === link.href)] = node; }}
                              role="menuitem"
                              href={link.href}
                              onClick={() => closeLibrary()}
                              className="block rounded-xl px-3 py-2 text-sm text-ink-700 transition-colors hover:bg-cloud-50 hover:text-ink-900 focus-visible:bg-cloud-50"
                            >
                              {link.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
          {NAV_LINKS.filter((link) => link.href !== "/explore").map((link) => (
            <DesktopLink
              key={link.href}
              href={link.href}
              label={link.label}
              active={pathMatches(pathname, link.href, link.matchPrefixes)}
            />
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeSwitch className="hidden sm:inline-flex" />
          <a href={SITE.github} target="_blank" rel="noreferrer noopener" aria-label="Pinky UI on GitHub" className="hidden size-9 items-center justify-center rounded-pill text-ink-700 transition-colors hover:bg-white/70 hover:text-ink-900 lg:inline-flex">
            <GitHubMark className="size-[18px]" />
          </a>
          <MagneticLink href="/docs" size="sm" wrapperClassName="hidden sm:inline-flex">Get started</MagneticLink>
          <button
            type="button"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            onClick={() => setMobileOpen(true)}
            className="inline-flex size-10 items-center justify-center rounded-pill border border-line bg-white/70 lg:hidden"
          >
            <MenuGlyph open={mobileOpen} />
          </button>
        </div>
      </Container>

      <BottomSheet open={mobileOpen} onOpenChange={setMobileOpen} title="Pinky UI navigation" snapPoints={[78, 94]}>
        <div id="mobile-nav" className="space-y-6">
          <nav aria-label="Mobile navigation" className="flex flex-col gap-1">
            <MobileLink href="/explore" label="Explore" active={pathname === "/explore"} />
            <p className="mt-4 px-3 font-mono text-[0.625rem] tracking-[0.14em] text-ink-500 uppercase">Library</p>
            {LIBRARY_SECTIONS.map((section) => (
              <div key={section.label} className="mt-2">
                <p className="px-3 text-xs font-medium text-ink-500">{section.label}</p>
                {section.links.map((link) => <MobileLink key={link.href} href={link.href} label={link.label} active={pathMatches(pathname, link.href, [])} onClick={() => setMobileOpen(false)} />)}
              </div>
            ))}
            {NAV_LINKS.filter((link) => link.href !== "/explore").map((link) => <MobileLink key={link.href} href={link.href} label={link.label} active={pathMatches(pathname, link.href, link.matchPrefixes)} onClick={() => setMobileOpen(false)} />)}
          </nav>
          <a href={SITE.github} target="_blank" rel="noreferrer noopener" className="block rounded-xl px-3 py-3 text-base text-ink-700 hover:bg-cloud-50">GitHub</a>
          <ThemeSwitch />
        </div>
      </BottomSheet>
    </header>
  );
}

function DesktopLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return <Link href={href} aria-current={active ? "page" : undefined} className={cn("rounded-pill px-3.5 py-2 text-sm transition-colors duration-200", active ? "text-ink-900" : "text-ink-500 hover:text-ink-900")}>{label}</Link>;
}

function MobileLink({ href, label, active, onClick }: { href: string; label: string; active: boolean; onClick?: () => void }) {
  return <Link href={href} aria-current={active ? "page" : undefined} onClick={onClick} className={cn("rounded-xl px-3 py-3 text-base transition-colors hover:bg-cloud-50", active ? "font-medium text-ink-900" : "text-ink-700")}>{label}</Link>;
}

function pathMatches(pathname: string, href: string, prefixes: readonly string[]) {
  const path = href.split(/[?#]/, 1)[0];
  return pathname === path || pathname.startsWith(`${path}/`) || prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

function libraryIsActive(pathname: string) {
  return LIBRARY_SECTIONS.some((section) => section.links.some((link) => pathMatches(pathname, link.href, []))) || pathname.startsWith("/systems/") || pathname.startsWith("/spatial");
}

/** The mark: two soft overlapping fields, blush over milk blue. */
function PinkyMark() {
  return (
    <span aria-hidden className="relative inline-flex size-7 items-center justify-center rounded-[10px] border border-line bg-white shadow-soft">
      <span className="absolute size-3.5 rounded-pill blur-[1px] transition-transform duration-500 ease-[var(--ease-soft)] group-hover:translate-x-[3px]" style={{ background: "var(--color-blush-300)", transform: "translateX(-3px)" }} />
      <span className="absolute size-3.5 rounded-pill mix-blend-multiply blur-[1px] transition-transform duration-500 ease-[var(--ease-soft)] group-hover:-translate-x-[3px]" style={{ background: "var(--color-cloud-300)", transform: "translateX(3px)" }} />
    </span>
  );
}

function MenuGlyph({ open }: { open: boolean }) {
  return (
    <span aria-hidden className="relative block h-3 w-4">
      <span className={cn("absolute left-0 h-px w-full bg-ink-900 transition-transform duration-300 ease-[var(--ease-soft)]", open ? "top-1/2 rotate-45" : "top-0")} />
      <span className={cn("absolute left-0 h-px w-full bg-ink-900 transition-transform duration-300 ease-[var(--ease-soft)]", open ? "top-1/2 -rotate-45" : "top-full")} />
    </span>
  );
}
