/**
 * The single source of truth for site navigation.
 *
 * The header, footer, breadcrumbs, sitemap and the orphan-page check all
 * read this file instead of keeping their own copy of the taxonomy. Nothing
 * here deletes a route — every href already exists as a real page. This is
 * a three-level display hierarchy (L1 destination -> L2 section -> unit
 * page) layered over routes that keep their existing URLs.
 */

export type NavLeaf = { href: string; label: string; description?: string; section?: string };

export type NavGroup = {
  /** The L1 destination itself — its own overview page. */
  href: string;
  label: string;
  /**
   * L2 sections shown in the dropdown and on the L1 overview page. When two
   * or more children share a `section`, the dropdown groups them under that
   * label instead of listing everything flat — used where an L1 now covers
   * more than one former taxonomy branch (Components+Layouts, Docs+AI+Skills).
   */
  children: NavLeaf[];
};

/**
 * L1 destinations, left to right. Explore has no dropdown — it is the
 * cross-cutting search/filter surface, not a taxonomy branch.
 *
 * Four groups, each answerable in one sentence: Components is what you drop
 * into a UI (pieces and the ways to arrange them); Experiences is page- and
 * site-level interaction; Mobile is the small-screen platform surface; Docs
 * is everything written about the library, including the AI-pattern guide.
 * Previously eight L1 entries (Components/AI/Layouts/Experiences/Mobile/
 * Skills/Docs, plus Explore) mixed three different axes — component type,
 * platform, and abstraction level — with no consistent way to guess which
 * bucket a given page lived in.
 */
export const NAV_GROUPS: NavGroup[] = [
  {
    href: "/components",
    label: "Components",
    children: [
      { href: "/components", label: "Overview", section: "Components", description: "Small pieces with an immediate physical response." },
      { href: "/controls", label: "Controls", section: "Components", description: "Toggles and menu triggers with tactile depth." },
      { href: "/overlays", label: "Overlays", section: "Components", description: "Tooltips, dialogs and anchored contextual surfaces." },
      { href: "/forms", label: "Forms", section: "Components", description: "Fields and selectors that keep their context." },
      { href: "/data", label: "Data", section: "Components", description: "Charts and rows that stay inspectable while they move." },
      { href: "/components/email-template", label: "Surfaces", section: "Components", description: "Email templates and a departures-board number roll." },
      { href: "/layouts", label: "Layouts", section: "Layouts", description: "Arrangements for a collection with a point of view." },
      { href: "/collections", label: "Collections", section: "Layouts", description: "Stacks, grids and galleries built for volume." },
      { href: "/media", label: "Media", section: "Layouts", description: "Inspection and comparison for photos and video." },
      { href: "/layouts?family=editorial", label: "Editorial", section: "Layouts", description: "Rhythm and whitespace as part of the interface." },
      { href: "/layouts?family=spatial", label: "Spatial", section: "Layouts", description: "Depth experiments in CSS 3D, kept deliberately later." },
    ],
  },
  {
    href: "/experiences",
    label: "Experiences",
    children: [
      { href: "/experiences", label: "Overview", description: "Page- and site-level interaction, not single components." },
      { href: "/navigation", label: "Navigation", description: "Mega menus, morphing bars and edge-anchored rails." },
      { href: "/heroes", label: "Heroes", description: "Opening moments that set a page's first impression." },
      { href: "/backgrounds", label: "Backgrounds", description: "Ambient atmosphere that never competes with content." },
      { href: "/transitions", label: "Transitions", description: "Route and state changes that keep spatial continuity." },
      { href: "/effects", label: "Effects", description: "Cursor, motion, text and scroll — the smallest layer." },
    ],
  },
  {
    href: "/mobile",
    label: "Mobile",
    children: [
      { href: "/mobile", label: "Overview", description: "A small-screen interaction reference, 390px first." },
      { href: "/mobile#navigation", label: "Navigation", description: "Tab bars, swipe-back and floating docks." },
      { href: "/mobile#sheets", label: "Sheets", description: "Detent, action and content-aware sheets." },
      { href: "/mobile#lists", label: "Lists", description: "Swipe actions, long-press and pull to refresh." },
      { href: "/mobile#inputs", label: "Inputs", description: "Keyboard-aware fields, pickers and segmented controls." },
      { href: "/mobile#media", label: "Media", description: "Pinch zoom, context menus and fullscreen inspection." },
      { href: "/mobile#feedback", label: "Feedback", description: "Skeletons, empty states and status pipelines." },
    ],
  },
  {
    href: "/docs",
    label: "Docs",
    children: [
      { href: "/docs", label: "Guide", section: "Docs", description: "Install, composition and the primitives API." },
      { href: "/skills", label: "Skills", section: "Docs", description: "Agent-readable Markdown recipes for every item." },
      { href: "/ai", label: "AI", section: "AI patterns", description: "Motion-first building blocks for chat and agent products." },
      { href: "/ai#streaming", label: "Streaming", section: "AI patterns", description: "Token-by-token text and a Stop/Regenerate morph." },
      { href: "/ai#composer", label: "Composer", section: "AI patterns", description: "A prompt field with attachments and slash commands." },
      { href: "/ai#structure", label: "Structure", section: "AI patterns", description: "Message bubbles, thinking panels and tool calls." },
    ],
  },
];

/** Explore is its own top-level link — the whole-registry search surface. */
export const EXPLORE_LINK: NavLeaf = { href: "/explore", label: "Explore" };

/**
 * Right-aligned utility links, outside the L1/L2 taxonomy. Skills and Docs
 * moved into the Docs group above; nothing else has needed this slot yet.
 */
export const NAV_UTILITY_LINKS: NavLeaf[] = [];

/**
 * Routes that don't fit the L1/L2 shape but must never become orphans.
 * Each entry names where it is actually linked from, so the mount point and
 * the breadcrumb trail agree with each other.
 */
export const SPECIAL_MOUNTS = {
  systems: {
    href: "/systems",
    label: "Systems",
    mountedOn: "/explore",
    breadcrumb: [EXPLORE_LINK, { href: "/systems", label: "Systems" }],
  },
  workflows: {
    href: "/workflows",
    label: "Workflows",
    mountedOn: "/systems",
    breadcrumb: [
      EXPLORE_LINK,
      { href: "/systems", label: "Systems" },
      { href: "/workflows", label: "Workflows" },
    ],
  },
  primitives: {
    href: "/primitives",
    label: "Primitives",
    mountedOn: "/docs",
    breadcrumb: [
      { href: "/docs", label: "Docs" },
      { href: "/primitives", label: "Primitives" },
    ],
  },
  showcase: {
    href: "/showcase",
    label: "Showcase",
    mountedOn: "/explore",
    breadcrumb: [EXPLORE_LINK, { href: "/showcase", label: "Showcase" }],
  },
  playground: {
    href: "/playground",
    label: "Playground",
    mountedOn: "/docs",
    breadcrumb: [
      { href: "/docs", label: "Docs" },
      { href: "/playground", label: "Playground" },
    ],
  },
} as const satisfies Record<string, { href: string; label: string; mountedOn: string; breadcrumb: NavLeaf[] }>;

/** Every L2 href, flattened, for the header/footer/orphan-check to iterate once. */
export const NAV_L2_LEAVES: NavLeaf[] = NAV_GROUPS.flatMap((group) => group.children);

/**
 * The L1 group that owns a given L2 href (matched by pathname, ignoring any
 * query string) — used to insert the missing top layer into a detail page's
 * breadcrumb, which otherwise only knows its immediate L2 collection.
 */
export function l1ForHref(href: string): NavLeaf | null {
  const path = href.split("?")[0];
  for (const group of NAV_GROUPS) {
    if (group.href === path) return { href: group.href, label: group.label };
    if (group.children.some((child) => child.href.split("?")[0] === path)) {
      return { href: group.href, label: group.label };
    }
  }
  return null;
}

/**
 * Breadcrumb trail for a known static route. Dynamic unit pages
 * ([slug] routes) build their own trail from registry data instead — see
 * each page's own `family` lookup — because their L2 depends on the item,
 * not the route.
 */
export function breadcrumbForStaticRoute(pathname: string): NavLeaf[] | null {
  if (pathname === "/explore") return [EXPLORE_LINK];

  for (const group of NAV_GROUPS) {
    if (pathname === group.href) return [{ href: group.href, label: group.label }];
    const leaf = group.children.find((child) => child.href.split("?")[0] === pathname);
    if (leaf) return [{ href: group.href, label: group.label }, { href: pathname, label: leaf.label }];
  }

  const special = Object.values(SPECIAL_MOUNTS).find((entry) => entry.href === pathname);
  if (special) return special.breadcrumb;

  return null;
}
