"use client";

import { BottomSheet } from "@pinky-ui/systems";
import { cn, PillNav, type PillNavItem } from "@pinky-ui/components";
import { springs, useMotionEnabled } from "@pinky-ui/primitives";
import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";

import { EXPLORE_LINK, NAV_GROUPS, NAV_UTILITY_LINKS, type NavGroup } from "@/config/navigation";
import { SITE } from "@/lib/site";

import { GitHubMark } from "./icons";
import { Container } from "./layout";
import { MagneticLink } from "./magnetic-link";
import { ThemeSwitch } from "./theme-switch";

export function SiteHeader() {
  const pathname = usePathname();
  const motionEnabled = useMotionEnabled();
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const triggerRefs = useRef<Record<string, HTMLButtonElement | HTMLAnchorElement | null>>({});
  const menuRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const linkRefs = useRef<HTMLAnchorElement[]>([]);

  useEffect(() => {
    setOpenGroup(null);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!openGroup) return;
    const focusFirst = () => linkRefs.current[0]?.focus();
    const focusFrame = window.requestAnimationFrame(focusFirst);
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      const menu = menuRefs.current[openGroup];
      const trigger = triggerRefs.current[openGroup];
      if (!menu?.contains(target) && !trigger?.contains(target)) setOpenGroup(null);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [openGroup]);

  const close = (restoreFocus = false, groupHref?: string) => {
    setOpenGroup(null);
    if (restoreFocus && groupHref) window.requestAnimationFrame(() => triggerRefs.current[groupHref]?.focus());
  };

  const onMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>, groupHref: string, itemCount: number) => {
    const links = linkRefs.current;
    const currentIndex = links.indexOf(document.activeElement as HTMLAnchorElement);
    if (event.key === "Escape") {
      event.preventDefault();
      close(true, groupHref);
      return;
    }
    if (event.key === "Tab") {
      setOpenGroup(null);
      return;
    }
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp" && event.key !== "Home" && event.key !== "End") return;
    event.preventDefault();
    const nextIndex = event.key === "Home"
      ? 0
      : event.key === "End"
        ? itemCount - 1
        : (currentIndex + (event.key === "ArrowDown" ? 1 : -1) + itemCount) % itemCount;
    links[nextIndex]?.focus();
  };

  const pillItems: PillNavItem[] = [
    { id: EXPLORE_LINK.href, label: EXPLORE_LINK.label, href: EXPLORE_LINK.href, active: pathname === EXPLORE_LINK.href },
    ...NAV_GROUPS.map((group) => {
      const active = group.children.some((child) => pathMatches(pathname, child.href)) || pathname === group.href;
      const menuId = `nav-menu-${group.href.replace(/\W/g, "")}`;
      const open = openGroup === group.href;
      return {
        id: group.href,
        label: (
          <span className="inline-flex items-center gap-1">
            {group.label}
            <span aria-hidden className={cn("text-xs transition-transform", open && "rotate-180")}>⌄</span>
          </span>
        ),
        active,
        "aria-expanded": open,
        "aria-haspopup": "menu" as const,
        "aria-controls": open ? menuId : undefined,
        onClick: () => setOpenGroup((current) => (current === group.href ? null : group.href)),
        ref: (node: HTMLAnchorElement | HTMLButtonElement | null) => { triggerRefs.current[group.href] = node; },
        panel: open ? (
          <MegaMenuPanel
            group={group}
            menuId={menuId}
            onKeyDown={(event) => onMenuKeyDown(event, group.href, group.children.length)}
            onLinkClick={() => close()}
            menuRef={(node) => { menuRefs.current[group.href] = node; }}
            registerLinkRef={(node, index) => { linkRefs.current[index] = node; }}
            motionEnabled={motionEnabled}
          />
        ) : null,
      } satisfies PillNavItem;
    }),
    ...NAV_UTILITY_LINKS.map((link) => ({ id: link.href, label: link.label, href: link.href, active: pathMatches(pathname, link.href) })),
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-[background-color,border-color,backdrop-filter] duration-500",
        scrolled
          ? "border-b border-line bg-[color-mix(in_oklab,var(--pinky-page)_78%,white)]/85 backdrop-blur-xl"
          : "border-b border-transparent",
      )}
    >
      <Container className={cn("flex items-center justify-between gap-4 transition-[height] duration-300", scrolled ? "h-14" : "h-16 sm:h-18")}>
        <Link href="/" className="group flex shrink-0 items-center gap-2.5" aria-label={`${SITE.name} home`}>
          <PinkyMark />
          <span className="font-display text-[0.9375rem] font-semibold tracking-tight whitespace-nowrap">{SITE.name}</span>
        </Link>

        <div className="hidden lg:block">
          <PillNav items={pillItems} size={scrolled ? "sm" : "md"} aria-label="Main" />
        </div>

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
            className="relative inline-flex size-10 items-center justify-center rounded-pill border border-line bg-white/70 [@media(pointer:coarse)]:before:absolute [@media(pointer:coarse)]:before:-inset-0.5 [@media(pointer:coarse)]:before:content-[''] lg:hidden"
          >
            <MenuGlyph open={mobileOpen} />
          </button>
        </div>
      </Container>

      <BottomSheet open={mobileOpen} onOpenChange={setMobileOpen} title="Pinky UI navigation" snapPoints={[82, 96]}>
        <div id="mobile-nav" className="space-y-6">
          <nav aria-label="Mobile navigation" className="flex flex-col gap-1">
            <MobileLink href={EXPLORE_LINK.href} label={EXPLORE_LINK.label} active={pathname === EXPLORE_LINK.href} onClick={() => setMobileOpen(false)} />
            {NAV_GROUPS.map((group) => (
              <div key={group.href} className="mt-4">
                <Link
                  href={group.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 font-mono text-[0.625rem] tracking-[0.14em] text-ink-500 uppercase transition-colors hover:text-ink-900"
                >
                  {group.label}
                </Link>
                {group.children.map((link) => (
                  <MobileLink key={link.href} href={link.href} label={link.label} active={pathMatches(pathname, link.href)} onClick={() => setMobileOpen(false)} />
                ))}
              </div>
            ))}
            <p className="mt-4 px-3 font-mono text-[0.625rem] tracking-[0.14em] text-ink-500 uppercase">More</p>
            {NAV_UTILITY_LINKS.map((link) => (
              <MobileLink key={link.href} href={link.href} label={link.label} active={pathMatches(pathname, link.href)} onClick={() => setMobileOpen(false)} />
            ))}
          </nav>
          <a href={SITE.github} target="_blank" rel="noreferrer noopener" className="block rounded-xl px-3 py-3 text-base text-ink-700 hover:bg-cloud-50">GitHub</a>
          <ThemeSwitch />
        </div>
      </BottomSheet>
    </header>
  );
}

function MegaMenuPanel({
  group,
  menuId,
  onKeyDown,
  onLinkClick,
  menuRef,
  registerLinkRef,
  motionEnabled,
}: {
  group: NavGroup;
  menuId: string;
  onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
  onLinkClick: () => void;
  menuRef: (node: HTMLDivElement | null) => void;
  registerLinkRef: (node: HTMLAnchorElement, index: number) => void;
  motionEnabled: boolean;
}) {
  const wide = group.children.length > 4;

  return (
    <motion.div
      ref={menuRef}
      id={menuId}
      role="menu"
      aria-label={`${group.label} sections`}
      onKeyDown={onKeyDown}
      initial={motionEnabled ? { opacity: 0, scale: 0.95, y: -6 } : false}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={motionEnabled ? { opacity: 0, scale: 0.95 } : undefined}
      transition={motionEnabled ? { type: "spring", ...springs.snappy } : { duration: 0 }}
      style={{ transformOrigin: "top left" }}
      className={cn(
        "absolute top-[calc(100%+0.5rem)] left-0 z-50 overflow-hidden rounded-[20px] border border-line bg-white/95 p-3 shadow-soft backdrop-blur-xl",
        wide ? "grid w-[34rem] grid-cols-2 gap-1" : "w-64",
      )}
    >
      {group.children.map((link, index) => (
        <Link
          key={link.href}
          ref={(node) => { if (node) registerLinkRef(node, index); }}
          role="menuitem"
          href={link.href}
          onClick={onLinkClick}
          className="block rounded-xl px-3 py-2.5 transition-colors hover:bg-cloud-50 focus-visible:bg-cloud-50"
        >
          <span className="block text-sm font-medium text-ink-900">{link.label}</span>
          {link.description ? <span className="mt-0.5 block text-xs leading-snug text-ink-500">{link.description}</span> : null}
        </Link>
      ))}
    </motion.div>
  );
}

function MobileLink({ href, label, active, onClick }: { href: string; label: string; active: boolean; onClick?: () => void }) {
  return <Link href={href} aria-current={active ? "page" : undefined} onClick={onClick} className={cn("rounded-xl px-3 py-3 text-base transition-colors hover:bg-cloud-50", active ? "font-medium text-ink-900" : "text-ink-700")}>{label}</Link>;
}

function pathMatches(pathname: string, href: string) {
  const path = href.split(/[?#]/, 1)[0];
  return pathname === path || pathname.startsWith(`${path}/`);
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
