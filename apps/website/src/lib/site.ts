/** Single place for site-wide constants. */
export const SITE = {
  name: "Pinky UI",
  tagline: "Soft, fluid and interactive React components for modern interfaces.",
  short: "UI that likes to move.",
  github: "https://github.com/florash/Pinky-UI",
  /** No production domain yet — set NEXT_PUBLIC_SITE_URL once the site is deployed. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;

export const NAV_LINKS = [
  { href: "/explore", label: "Explore", matchPrefixes: [] },
  { href: "/primitives", label: "Primitives", matchPrefixes: [] },
  { href: "/skills", label: "Skills", matchPrefixes: [] },
  { href: "/docs", label: "Docs", matchPrefixes: [] },
] as const;

/**
 * Public taxonomy, as real links.
 *
 * These are intentionally coarser than the package folders. Visitors should
 * see interaction families; implementation names stay in the registry and
 * import paths. The header and footer both consume this array.
 */
export const PUBLIC_TAXONOMY = [
  {
    label: "Components",
    links: [
      { href: "/components", label: "Components" },
      { href: "/controls", label: "Menu Triggers" },
    ],
  },
  {
    label: "Layouts",
    links: [
      { href: "/layouts?family=collections", label: "Collections" },
      { href: "/layouts?family=editorial", label: "Editorial" },
      { href: "/layouts?family=spatial", label: "Spatial" },
    ],
  },
  {
    label: "Experiences",
    links: [
      { href: "/experiences", label: "Overview" },
      { href: "/navigation", label: "Navigation" },
      { href: "/heroes", label: "Heroes" },
      { href: "/backgrounds", label: "Backgrounds" },
      { href: "/transitions", label: "Transitions" },
    ],
  },
  {
    label: "Systems",
    links: [
      { href: "/media", label: "Media" },
      { href: "/collections", label: "Collections" },
      { href: "/forms", label: "Forms" },
      { href: "/data", label: "Data" },
      { href: "/workflows", label: "Workflows" },
    ],
  },
  {
    label: "Effects",
    links: [
      { href: "/effects", label: "Overview" },
      { href: "/effects#cursor", label: "Cursor" },
      { href: "/effects#motion", label: "Motion" },
      { href: "/effects#text", label: "Text" },
      { href: "/effects#scroll", label: "Scroll" },
    ],
  },
] as const;

/** The current header/footer contract; kept as a named export for old callers. */
export const LIBRARY_SECTIONS = PUBLIC_TAXONOMY;

/** Useful surfaces that are not public taxonomy families. Their routes stay live. */
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
  { current: "cards / buttons / controls / navigation / surfaces / effects", route: "/components", package: "@pinky/components", canonicalCategory: "Components", canonicalName: "Components" },
  { current: "Menu Trigger wall", route: "/controls", package: "@pinky/components + @pinky/experiences", canonicalCategory: "Components", canonicalName: "Menu Triggers" },
  { current: "Morph Menu", route: "/navigation#navigation", package: "@pinky/experiences", canonicalCategory: "Experiences → Navigation", canonicalName: "Morph Menu" },
  { current: "Gooey Menu", route: "/components/gooey-menu", package: "@pinky/components", canonicalCategory: "Components → Navigation preset", canonicalName: "Gooey Menu" },
  { current: "Orbit Menu", route: "/experiences/orbit-menu", package: "@pinky/experiences", canonicalCategory: "Experiences → Navigation → radial action", canonicalName: "Orbit Menu" },
  { current: "cursor effects", route: "/effects#cursor", package: "@pinky/effects", canonicalCategory: "Effects → Cursor", canonicalName: "Cursor effects" },
  { current: "Magnetic Cursor Target", route: "/effects/magnetic-cursor-target", package: "@pinky/effects", canonicalCategory: "Effects → Cursor", canonicalName: "Magnetic Cursor Target" },
  { current: "Morph primitive", route: "/primitives", package: "@pinky/primitives", canonicalCategory: "Primitives", canonicalName: "Morph (geometry primitive)" },
  { current: "Morph Card", route: "/components/morph-card", package: "@pinky/components", canonicalCategory: "Components → Surfaces", canonicalName: "Morph Card (card → dialog)" },
  { current: "Gallery ↔ List Morph", route: "/layouts/gallery-list-morph", package: "@pinky/layouts", canonicalCategory: "Layouts → Editorial", canonicalName: "Gallery ↔ List Morph (layout morph)" },
  { current: "Morph Lightbox", route: "/systems/morph-lightbox", package: "@pinky/systems", canonicalCategory: "Systems → Media", canonicalName: "Morph Lightbox (media morph)" },
  { current: "Jelly Card / Liquid Card", route: "/components/jelly-card and /components/liquid-card", package: "@pinky/primitives + @pinky/components", canonicalCategory: "Components → Surfaces", canonicalName: "Jelly / Liquid surfaces" },
  { current: "galleries / grids / stacks / carousels / collections", route: "/layouts?family=collections", package: "@pinky/layouts", canonicalCategory: "Layouts → Collections", canonicalName: "Collection layouts" },
  { current: "editorial layouts", route: "/layouts?family=editorial", package: "@pinky/layouts", canonicalCategory: "Layouts → Editorial", canonicalName: "Editorial layouts" },
  { current: "spatial layouts", route: "/layouts?family=spatial", package: "@pinky/layouts", canonicalCategory: "Layouts → Spatial", canonicalName: "Spatial layouts" },
  { current: "hero patterns", route: "/heroes", package: "@pinky/experiences", canonicalCategory: "Experiences → Heroes", canonicalName: "Hero patterns" },
  { current: "scroll interactions", route: "/effects#scroll", package: "@pinky/effects", canonicalCategory: "Effects → Scroll", canonicalName: "Scroll interactions" },
  { current: "transitions", route: "/transitions", package: "@pinky/experiences", canonicalCategory: "Experiences → Transitions", canonicalName: "Transitions" },
  { current: "text effects", route: "/effects#text", package: "@pinky/effects", canonicalCategory: "Effects → Text", canonicalName: "Text effects" },
  { current: "media / forms / data / collections", route: "/media", package: "@pinky/systems", canonicalCategory: "Systems", canonicalName: "Product systems" },
  { current: "content browsing systems", route: "/collections", package: "@pinky/systems", canonicalCategory: "Systems → Collections", canonicalName: "Collection browsing systems" },
  { current: "feedback / search / loading / lists / drag / onboarding / mobile", route: "/workflows", package: "@pinky/systems", canonicalCategory: "Systems → Workflows", canonicalName: "Workflow systems" },
  { current: "implementation folders in packages/skills", route: "/skills", package: "@pinky/skills", canonicalCategory: "Skills", canonicalName: "Interaction recipes" },
  { current: "installation / composition / motion / accessibility", route: "/docs", package: "apps/website", canonicalCategory: "Docs", canonicalName: "Pinky UI guide" },
] as const;

/** Routes and query values kept for compatibility while public labels settle. */
export const ROUTE_COMPATIBILITY = [
  { path: "/layouts?family=galleries|grids|stacks|carousels", behavior: "treated as Layouts → Collections" },
  { path: "/spatial", behavior: "preserved as the secondary spatial-experiences wall; canonical layout link is /layouts?family=spatial" },
  { path: "/showcase and /playground", behavior: "preserved as utility surfaces, outside public taxonomy" },
  { path: "/skills/motion/shared-morph", behavior: "permanent redirect to /skills/patterns/shared-morph" },
] as const;
