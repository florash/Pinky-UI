import type { Metadata } from "next";

const LOCAL_SITE_URL = "http://localhost:3000";

function normalizeBasePath(value?: string) {
  const raw = value?.trim() || "";
  if (!raw || raw === "/") return "";
  return `/${raw.replace(/^\/+|\/+$/g, "")}`;
}

/** Normalize the public origin once so metadata never grows competing URL logic. */
export function normalizeSiteUrl(value?: string) {
  const raw = value?.trim() || LOCAL_SITE_URL;
  const candidate = /^[a-z][a-z\d+.-]*:\/\//i.test(raw) ? raw : `https://${raw}`;
  const url = new URL(candidate);

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("NEXT_PUBLIC_SITE_URL must use http or https");
  }
  if (url.username || url.password) {
    throw new Error("NEXT_PUBLIC_SITE_URL must not contain credentials");
  }
  if (url.pathname !== "/" && url.pathname !== "") {
    throw new Error("NEXT_PUBLIC_SITE_URL must be an origin without a path");
  }
  if (url.search || url.hash) {
    throw new Error("NEXT_PUBLIC_SITE_URL must be an origin without a query or fragment");
  }

  url.pathname = "/";
  return url.toString().replace(/\/$/, "");
}

/** Single place for site-wide constants. */
export const SITE = {
  name: "Pinky UI",
  tagline: "A React library for interactive motion.",
  description:
    "A React library for interactive motion — 75 components, layouts and primitives, each with a live preview and an import path.",
  github: "https://github.com/florash/Pinky-UI",
  /** Set NEXT_PUBLIC_SITE_URL in the deployment environment; localhost is local-only fallback. */
  url: normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL),
  /** Project Pages deployments provide this at build time; custom domains leave it empty. */
  basePath: normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH),
} as const;

export function sitePathname(pathname = "/") {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  if (!SITE.basePath || path === SITE.basePath || path.startsWith(`${SITE.basePath}/`)) return path;
  return `${SITE.basePath}${path}`;
}

export function absoluteSiteUrl(pathname = "/") {
  return new URL(sitePathname(pathname), `${SITE.url}/`).toString();
}

export function pageMetadata(
  title: string,
  description: string,
  pathname: string,
  options?: { absoluteTitle?: boolean },
): Metadata {
  const socialTitle = title.includes(SITE.name) ? title : `${title} — ${SITE.name}`;
  const publicPathname = sitePathname(pathname);

  return {
    title: options?.absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: publicPathname },
    openGraph: {
      title: socialTitle,
      description,
      url: publicPathname,
      siteName: SITE.name,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
    },
  };
}

/** Top-level pages that are public documents, not implementation-only routes. */
export const PUBLIC_INDEXABLE_ROUTES = [
  "/",
  "/explore",
  "/ai",
  "/components",
  "/controls",
  "/layouts",
  "/experiences",
  "/navigation",
  "/heroes",
  "/backgrounds",
  "/transitions",
  "/systems",
  "/media",
  "/collections",
  "/forms",
  "/data",
  "/workflows",
  "/overlays",
  "/mobile",
  "/effects",
  "/primitives",
  "/skills",
  "/docs",
  "/showcase",
  "/playground",
  "/spatial",
] as const;

/**
 * Header, footer and breadcrumb navigation now read from
 * `@/config/navigation` (NAV_GROUPS, EXPLORE_LINK, NAV_UTILITY_LINKS)
 * instead of this file — that module is the single source of truth for the
 * L1/L2 taxonomy. Nothing here duplicates it.
 */

/** Useful surfaces that are not part of the L1/L2 taxonomy. Their routes stay live. */
export const UTILITY_LINKS = [
  { href: "/showcase", label: "Showcase" },
  { href: "/playground", label: "Playground" },
] as const;

/**
 * Layout implementation families collapse into three public families. The
 * old query values remain valid through `resolveLayoutFamily` so existing
 * links do not become 404s or silently lose their filter.
 */
export const PUBLIC_LAYOUT_FAMILIES = ["collections", "editorial", "spatial"] as const;
export type PublicLayoutFamily = (typeof PUBLIC_LAYOUT_FAMILIES)[number];

const LAYOUT_FAMILY_ALIASES: Record<PublicLayoutFamily, readonly string[]> = {
  collections: ["galleries", "grids", "stacks", "carousels", "collections"],
  editorial: ["editorial"],
  spatial: ["spatial"],
};

export function resolveLayoutFamily(value?: string): PublicLayoutFamily | "all" {
  if (!value || value === "all") return "all";
  return PUBLIC_LAYOUT_FAMILIES.find((family) => LAYOUT_FAMILY_ALIASES[family].includes(value)) ?? "all";
}

export function layoutBelongsToPublicFamily(
  implementationFamily: string,
  publicFamily: PublicLayoutFamily | "all",
) {
  return publicFamily === "all" || LAYOUT_FAMILY_ALIASES[publicFamily].includes(implementationFamily);
}

export function publicLayoutFamilyFor(implementationFamily: string): PublicLayoutFamily {
  return PUBLIC_LAYOUT_FAMILIES.find((family) => LAYOUT_FAMILY_ALIASES[family].includes(implementationFamily)) ?? "collections";
}

/**
 * Audit record for the public classification. This is deliberately about
 * visitor-facing names; package and filename changes are not required.
 */
export const TAXONOMY_MAPPING = [
  { current: "cards / buttons / controls / navigation / surfaces / effects", route: "/components", package: "@pinky-ui/components", canonicalCategory: "Components", canonicalName: "Components" },
  { current: "Menu Trigger wall", route: "/controls", package: "@pinky-ui/components + @pinky-ui/experiences", canonicalCategory: "Components", canonicalName: "Menu Triggers" },
  { current: "Morph Menu", route: "/navigation#navigation", package: "@pinky-ui/experiences", canonicalCategory: "Experiences → Navigation", canonicalName: "Morph Menu" },
  { current: "Gooey Menu", route: "/components/gooey-menu", package: "@pinky-ui/components", canonicalCategory: "Components → Navigation preset", canonicalName: "Gooey Menu" },
  { current: "Orbit Menu", route: "/experiences/orbit-menu", package: "@pinky-ui/experiences", canonicalCategory: "Experiences → Navigation → radial action", canonicalName: "Orbit Menu" },
  { current: "cursor effects", route: "/effects#cursor", package: "@pinky-ui/effects", canonicalCategory: "Effects → Cursor", canonicalName: "Cursor effects" },
  { current: "Magnetic Cursor Target", route: "/effects/magnetic-cursor-target", package: "@pinky-ui/effects", canonicalCategory: "Effects → Cursor", canonicalName: "Magnetic Cursor Target" },
  { current: "Morph primitive", route: "/primitives", package: "@pinky-ui/primitives", canonicalCategory: "Primitives", canonicalName: "Morph (geometry primitive)" },
  { current: "Morph Card", route: "/components/morph-card", package: "@pinky-ui/components", canonicalCategory: "Components → Surfaces", canonicalName: "Morph Card (card → dialog)" },
  { current: "Gallery ↔ List Morph", route: "/layouts/gallery-list-morph", package: "@pinky-ui/layouts", canonicalCategory: "Layouts → Editorial", canonicalName: "Gallery ↔ List Morph (layout morph)" },
  { current: "Morph Lightbox", route: "/systems/morph-lightbox", package: "@pinky-ui/systems", canonicalCategory: "Systems → Media", canonicalName: "Morph Lightbox (media morph)" },
  { current: "Jelly Card / Liquid Card", route: "/components/jelly-card and /components/liquid-card", package: "@pinky-ui/primitives + @pinky-ui/components", canonicalCategory: "Components → Surfaces", canonicalName: "Jelly / Liquid surfaces" },
  { current: "galleries / grids / stacks / carousels / collections", route: "/layouts?family=collections", package: "@pinky-ui/layouts", canonicalCategory: "Layouts → Collections", canonicalName: "Collection layouts" },
  { current: "editorial layouts", route: "/layouts?family=editorial", package: "@pinky-ui/layouts", canonicalCategory: "Layouts → Editorial", canonicalName: "Editorial layouts" },
  { current: "spatial layouts", route: "/layouts?family=spatial", package: "@pinky-ui/layouts", canonicalCategory: "Layouts → Spatial", canonicalName: "Spatial layouts" },
  { current: "hero patterns", route: "/heroes", package: "@pinky-ui/experiences", canonicalCategory: "Experiences → Heroes", canonicalName: "Hero patterns" },
  { current: "scroll interactions", route: "/effects#scroll", package: "@pinky-ui/effects", canonicalCategory: "Effects → Scroll", canonicalName: "Scroll interactions" },
  { current: "transitions", route: "/transitions", package: "@pinky-ui/experiences", canonicalCategory: "Experiences → Transitions", canonicalName: "Transitions" },
  { current: "text effects", route: "/effects#text", package: "@pinky-ui/effects", canonicalCategory: "Effects → Text", canonicalName: "Text effects" },
  { current: "media / forms / data / collections / overlays / mobile", route: "/media, /overlays and /mobile", package: "@pinky-ui/systems", canonicalCategory: "Systems", canonicalName: "Product systems" },
  { current: "content browsing systems", route: "/collections", package: "@pinky-ui/systems", canonicalCategory: "Systems → Collections", canonicalName: "Collection browsing systems" },
  { current: "feedback / search / loading / lists / drag / onboarding / mobile", route: "/workflows", package: "@pinky-ui/systems", canonicalCategory: "Systems → Workflows", canonicalName: "Workflow systems" },
  { current: "implementation folders in packages/skills", route: "/skills", package: "@pinky-ui/skills", canonicalCategory: "Skills", canonicalName: "Interaction recipes" },
  { current: "installation / composition / motion / accessibility", route: "/docs", package: "apps/website", canonicalCategory: "Docs", canonicalName: "Pinky UI guide" },
] as const;

/** Routes and query values kept for compatibility while public labels settle. */
export const ROUTE_COMPATIBILITY = [
  { path: "/layouts?family=galleries|grids|stacks|carousels", behavior: "treated as Layouts → Collections" },
  { path: "/spatial", behavior: "preserved as the secondary spatial-experiences wall; canonical layout link is /layouts?family=spatial" },
  { path: "/showcase and /playground", behavior: "preserved as utility surfaces, outside public taxonomy" },
  { path: "/skills/motion/shared-morph", behavior: "permanent redirect to /skills/patterns/shared-morph" },
] as const;
