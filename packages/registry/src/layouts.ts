import type { PropDef, Status } from "./types";

export const LAYOUT_FAMILIES = [
  "galleries",
  "grids",
  "stacks",
  "carousels",
  "collections",
] as const;

export type LayoutFamily = (typeof LAYOUT_FAMILIES)[number];

export type LayoutEntry = {
  slug: string;
  name: string;
  description: string;
  family: LayoutFamily;
  status: Status;
  tags: string[];
  /** Primitives and components this layout is built from. */
  builtOn: string[];
  importPath: string;
  usage: string;
  props: PropDef[];
  /** How many items this arrangement is actually good for. */
  itemRange: string;
  mobile: string;
  accessibility: string[];
  performance: string[];
  reducedMotion: string;
  whenToUse: string[];
  whenNotToUse: string[];
  related: string[];
  skill?: string;
};

export const layouts: LayoutEntry[] = [
  {
    slug: "polaroid-wall",
    name: "Polaroid Wall",
    description: "Photos pinned to a wall, straightening as you focus them.",
    family: "galleries",
    status: "ready",
    tags: ["photos", "scatter", "editorial", "wall"],
    builtOn: ["scatter", "spring"],
    importPath: 'import { PolaroidWall } from "@pinky/layouts";',
    usage: `<PolaroidWall spread="soft" rotation={6} overlap={0.12}>
  {photos.map((photo) => (
    <Polaroid key={photo.id} {...photo} />
  ))}
</PolaroidWall>`,
    props: [
      { name: "spread", type: '"tight" | "soft" | "loose"', defaultValue: '"soft"', description: "How far photos drift from their grid position." },
      { name: "rotation", type: "number", defaultValue: "6", description: "Maximum resting rotation, in degrees." },
      { name: "overlap", type: "number", defaultValue: "0.12", description: "How far neighbours are nudged aside by the focused photo." },
      { name: "columns", type: "number", defaultValue: "3", description: "Column count." },
      { name: "seed", type: "number", defaultValue: "0", description: "Change to reshuffle the arrangement." },
    ],
    itemRange: "6–24 photos. Past that the scatter stops reading as deliberate.",
    mobile: "Drop to two columns and reduce spread to `tight` — overlap needs room that phones do not have.",
    accessibility: [
      "Items respond to focus as well as hover, so the wall can be browsed by keyboard.",
      "Rotation and offset are transforms only; DOM and reading order are untouched.",
      "Whatever you put inside keeps its own semantics — make photos links or buttons if they are actionable.",
      "Alt text is your responsibility; the layout never invents it.",
    ],
    performance: [
      "No pointer subscription: the wall tracks focus and hover on the item itself.",
      "Scatter is computed from a hash, not measured, so nothing reflows.",
      "Give images explicit dimensions — the layout cannot prevent a jump you cause by omitting them.",
    ],
    reducedMotion:
      "With prefers-reduced-motion: reduce, photos sit straight and still in an ordinary grid. Nothing rotates, lifts or moves aside.",
    whenToUse: [
      "Editorial photo essays and personal galleries",
      "Team or event pages that should feel human",
      "Any collection where perfect alignment feels too corporate",
    ],
    whenNotToUse: [
      "Product grids where comparison matters — rotation makes sizes hard to compare",
      "Large collections; use Masonry Gallery",
      "Content where the images carry critical detail at small sizes",
    ],
    related: ["masonry-gallery", "stack-grid"],
    skill: "polaroid-wall",
  },
  {
    slug: "stack-grid",
    name: "Stack to Grid",
    description: "One collection in two arrangements — a pile that unpacks into a grid.",
    family: "grids",
    status: "ready",
    tags: ["shared layout", "expand", "signature", "transition"],
    builtOn: ["morph", "spring"],
    importPath: 'import { StackGrid } from "@pinky/layouts";',
    usage: `<StackGrid defaultMode="stack" columns={3}>
  {items.map((item) => (
    <SpotlightCard key={item.id}>{item.title}</SpotlightCard>
  ))}
</StackGrid>`,
    props: [
      { name: "mode", type: '"stack" | "grid"', description: "Controlled mode. Omit to let the component own it." },
      { name: "defaultMode", type: '"stack" | "grid"', defaultValue: '"stack"', description: "Initial arrangement." },
      { name: "onModeChange", type: "(mode) => void", description: "Called when the arrangement changes." },
      { name: "columns", type: "number", defaultValue: "3", description: "Grid columns when spread out." },
      { name: "offset", type: "number", defaultValue: "14", description: "Offset between stacked cards, in px." },
      { name: "controls", type: "boolean", defaultValue: "true", description: "Renders the built-in toggle." },
    ],
    itemRange: "3–12. A stack of more than a dozen cannot show what it contains.",
    mobile: "Drop to one or two columns; the stack state is identical.",
    accessibility: [
      "Both states are the same list in the same DOM order.",
      "The toggle is a real button with aria-pressed.",
      "Nothing is removed from the accessibility tree in either arrangement.",
    ],
    performance: [
      "Shared layout animation measures each card once per transition, not per frame.",
      "Only the top five cards render offset in the stack; the rest sit hidden behind them.",
    ],
    reducedMotion:
      "With prefers-reduced-motion: reduce, the two arrangements swap instantly. No cards fly across the screen.",
    whenToUse: [
      "Showing that a small collection has more inside it",
      "Onboarding or feature walkthroughs",
      "A section that should reward one click",
    ],
    whenNotToUse: [
      "Primary navigation of a large catalogue",
      "Anywhere users need to scan everything immediately — start in grid mode instead",
    ],
    related: ["card-fan", "expandable-bento"],
    skill: "stack-grid",
  },
  {
    slug: "masonry-gallery",
    name: "Masonry Gallery",
    description: "Responsive columns for content of mixed heights, stable from first paint.",
    family: "galleries",
    status: "ready",
    tags: ["masonry", "columns", "photos", "density"],
    builtOn: ["use-columns"],
    importPath: 'import { MasonryGallery } from "@pinky/layouts";',
    usage: `<MasonryGallery
  columns={{ mobile: 2, tablet: 3, desktop: 4 }}
  gap={16}
>
  {items}
</MasonryGallery>`,
    props: [
      { name: "columns", type: "ResponsiveColumns | number", defaultValue: "{ mobile: 2, tablet: 3, desktop: 4 }", description: "Column count per breakpoint." },
      { name: "gap", type: "number", defaultValue: "16", description: "Gap in px." },
      { name: "label", type: "string", description: "Accessible name for the list." },
    ],
    itemRange: "12–200+. The one layout here built for volume.",
    mobile: "Two columns by default; one column is usually better for tall content.",
    accessibility: [
      "Renders a list; items keep their own semantics.",
      "Round-robin distribution keeps visual order close to DOM order.",
      "No motion of its own, so it is safe at any size.",
    ],
    performance: [
      "No measurement, no reflow after images load, no layout shift.",
      "The layout adds zero listeners — cost is whatever you put inside it.",
      "Use `loading=\"lazy\"` and explicit dimensions on images.",
    ],
    reducedMotion: "Nothing to reduce — the layout itself does not animate.",
    whenToUse: [
      "Photo galleries with mixed aspect ratios",
      "Content walls, blog indexes, moodboards",
      "Any collection large enough that per-item motion would be noise",
    ],
    whenNotToUse: [
      "Content that must be read in strict order across columns",
      "Small sets of three or four items, where a plain grid is clearer",
    ],
    related: ["polaroid-wall", "focus-gallery"],
    skill: "masonry-gallery",
  },
  {
    slug: "draggable-card-stack",
    name: "Draggable Card Stack",
    description: "A stack whose top card can be thrown away — or advanced with a button.",
    family: "stacks",
    status: "ready",
    tags: ["drag", "swipe", "deck", "review"],
    builtOn: ["spring"],
    importPath: 'import { DraggableCardStack } from "@pinky/layouts";',
    usage: `<DraggableCardStack threshold={110} loop>
  {cards.map((card) => (
    <JellyCard key={card.id}>{card.body}</JellyCard>
  ))}
</DraggableCardStack>`,
    props: [
      { name: "threshold", type: "number", defaultValue: "110", description: "Drag distance in px past which the card is dismissed." },
      { name: "rotation", type: "number", defaultValue: "12", description: "Maximum rotation while dragging." },
      { name: "loop", type: "boolean", defaultValue: "true", description: "Send dismissed cards to the back instead of removing them." },
      { name: "onDismiss", type: "(index: number) => void", description: "Called with the dismissed card's index." },
      { name: "controls", type: "boolean", defaultValue: "true", description: "Renders previous/next buttons." },
    ],
    itemRange: "3–20. Long decks need a list, not a stack.",
    mobile: "Where it works best — the gesture is native to touch. Keep the controls visible anyway.",
    accessibility: [
      "Drag is never the only way through: the previous/next buttons do everything the gesture does.",
      "Dismissals are announced through a polite live region.",
      "Cards keep their own semantics and focus order.",
    ],
    performance: [
      "Only three cards are rendered at a time regardless of deck size.",
      "Drag is handled by transform motion values — no React state per frame.",
    ],
    reducedMotion:
      "With prefers-reduced-motion: reduce, dragging is disabled entirely and the buttons advance the deck with no animation.",
    whenToUse: [
      "Reviewing items one at a time",
      "Onboarding sequences and tips",
      "Playful browsing of a small set",
    ],
    whenNotToUse: [
      "Content users need to compare or return to",
      "Anything important enough that dismissing it by accident would matter",
      "Long lists — dragging through fifty cards is a chore",
    ],
    related: ["card-fan", "peek-carousel"],
    skill: "draggable-card-stack",
  },
  {
    slug: "expandable-bento",
    name: "Expandable Bento",
    description: "A bento grid whose tiles expand in place, reflowing their neighbours.",
    family: "grids",
    status: "ready",
    tags: ["bento", "expand", "grid", "detail"],
    builtOn: ["spring"],
    importPath: 'import { ExpandableBento } from "@pinky/layouts";',
    usage: `<ExpandableBento
  columns={3}
  items={features}
/>`,
    props: [
      { name: "items", type: "BentoItem[]", description: "Each needs an id, a label, preview content and detail content." },
      { name: "columns", type: "number", defaultValue: "3", description: "Grid columns." },
      { name: "expanded", type: "string | null", description: "Controlled expanded id." },
      { name: "onExpandedChange", type: "(id: string | null) => void", description: "Called when a tile expands or collapses." },
      { name: "gap", type: "number", defaultValue: "12", description: "Gap in px." },
    ],
    itemRange: "4–9 tiles. A bento with twenty tiles is just a grid.",
    mobile: "Drop to one or two columns; expansion then behaves like an accordion, which is the right thing.",
    accessibility: [
      "Tiles are buttons with aria-expanded and aria-controls.",
      "Expansion happens in place, so reading order and focus order are unchanged.",
      "Escape collapses and returns focus to the tile that opened.",
      "A visible Collapse button gives pointer users the same exit.",
    ],
    performance: [
      "Detail content mounts only while expanded.",
      "One layout animation per change, not per frame.",
    ],
    reducedMotion:
      "With prefers-reduced-motion: reduce, tiles resize instantly and neighbours reflow with no animation. Every behaviour is otherwise identical.",
    whenToUse: [
      "Feature overviews where some items deserve more room",
      "Dashboards of summaries that can each open a little further",
      "Marketing sections that would otherwise need a modal",
    ],
    whenNotToUse: [
      "Detail content long enough to need its own page",
      "Grids where more than one item should be open at once",
    ],
    related: ["stack-grid", "shuffle-grid"],
    skill: "expandable-bento",
  },
  {
    slug: "card-fan",
    name: "Card Fan",
    description: "Cards held like a hand of playing cards, fanning out on approach.",
    family: "stacks",
    status: "ready",
    tags: ["fan", "deck", "hand", "playful"],
    builtOn: ["spring"],
    importPath: 'import { CardFan } from "@pinky/layouts";',
    usage: `<CardFan spread={28} rotation={8} activeIndex={active}>
  {photos.map((photo) => (
    <TiltCard key={photo.id}>{photo.title}</TiltCard>
  ))}
</CardFan>`,
    props: [
      { name: "spread", type: "number", defaultValue: "28", description: "Horizontal distance between cards when fanned, in px." },
      { name: "rotation", type: "number", defaultValue: "8", description: "Rotation of the outermost cards, in degrees." },
      { name: "activeIndex", type: "number", description: "Controlled selection." },
      { name: "onActiveIndexChange", type: "(index: number) => void", description: "Selection callback." },
      { name: "collapsible", type: "boolean", defaultValue: "true", description: "Start collapsed and fan out on hover or focus." },
    ],
    itemRange: "3–7 cards. A fan of twelve is a mess in any hand.",
    mobile: "Reduce `spread` and consider `collapsible={false}` — there is no hover to open it with.",
    accessibility: [
      "Roving tab stop with arrow keys, Home and End.",
      "Fanning is triggered by focus as well as hover.",
      "The fan is a list; the spatial arrangement is presentation only.",
    ],
    performance: [
      "One spring per card, no pointer subscription.",
      "Cards render regardless of state — keep the set small.",
    ],
    reducedMotion:
      "With prefers-reduced-motion: reduce, the cards sit permanently fanned and flat, with no lift on selection.",
    whenToUse: [
      "Small curated sets — plans, categories, featured pieces",
      "A playful entry point into a few options",
    ],
    whenNotToUse: [
      "Anything needing careful comparison — overlap hides content",
      "More than about seven items",
      "Dense or text-heavy cards",
    ],
    related: ["draggable-card-stack", "stack-grid"],
    skill: "card-fan",
  },
];

export function getLayout(slug: string): LayoutEntry | undefined {
  return layouts.find((entry) => entry.slug === slug);
}

export function filterLayouts(family: LayoutFamily | "all"): LayoutEntry[] {
  return family === "all" ? layouts : layouts.filter((entry) => entry.family === family);
}
