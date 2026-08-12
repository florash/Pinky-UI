import type { PropDef, Status } from "./types";

export const LAYOUT_FAMILIES = [
  "editorial",
  "galleries",
  "grids",
  "stacks",
  "carousels",
  "collections",
  "spatial",
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

const foundationalLayouts: LayoutEntry[] = [
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
    description: "A compressed collection that separates into an inspectable layered deck with selection and residual-stack reflow.",
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
      { name: "collapsible", type: "boolean", defaultValue: "true", description: "Start as a compressed deck and open on proximity, focus or selection." },
    ],
    itemRange: "3–7 cards. A fan of twelve is a mess in any hand.",
    mobile: "Reduce `spread`; taps select and horizontal touch drags browse the deck without requiring hover.",
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

type ModernLayoutConfig = {
  component: string;
  slug: string;
  name: string;
  family: LayoutFamily;
  description: string;
  tags: string[];
  builtOn: string[];
  usage: string;
  primaryProp: PropDef;
  itemRange: string;
  mobile: string;
  accessibility?: string[];
  performance?: string[];
  reducedMotion?: string;
  whenToUse?: string[];
  whenNotToUse?: string[];
  related?: string[];
};

const modernLayout = ({ component, primaryProp, accessibility, performance, reducedMotion, whenToUse, whenNotToUse, related, ...config }: ModernLayoutConfig): LayoutEntry => ({
  ...config,
  status: "ready",
  importPath: `import { ${component} } from "@pinky/layouts";`,
  props: [primaryProp, { name: "className", type: "string", description: "Styles the outer layout surface." }, { name: "disabled", type: "boolean", defaultValue: "false", description: "Keeps the content and interaction while removing spatial choreography." }],
  accessibility: accessibility ?? ["Visual depth never changes DOM or reading order.", "Hover states have a focus equivalent and controls remain native."],
  performance: performance ?? ["Uses transforms and MotionValues rather than pointer-frame React renders.", "The layout does not create a rendering or media dependency for its children."],
  reducedMotion: reducedMotion ?? "Renders the same collection in a readable flat arrangement with no spatial transition.",
  whenToUse: whenToUse ?? ["Small, curated collections where the arrangement adds useful context."],
  whenNotToUse: whenNotToUse ?? ["Large scanning-heavy datasets or content that requires spatial navigation to understand."],
  related: related ?? [],
  skill: config.slug,
});

const editorialLayouts: LayoutEntry[] = [
  modernLayout({
    component: "EditorialMosaic", slug: "editorial-mosaic", name: "Editorial Mosaic", family: "editorial",
    description: "A deterministic composition grid for mixed media, text blocks and deliberate whitespace.",
    tags: ["editorial", "mosaic", "asymmetry", "media"], builtOn: ["CSS Grid", "Motion", "shared spring vocabulary"],
    usage: `<EditorialMosaic items={projects} columns={3} preset="editorial" />`,
    primaryProp: { name: "items", type: "EditorialMosaicItem[]", description: "Ordered media, text and featured items with explicit spans." }, itemRange: "4–14 items; use explicit spans to author the rhythm.", mobile: "One or two columns with the same DOM order; featured spans normalize automatically.",
    accessibility: ["Items remain in logical list order regardless of spans.", "Focus receives the same lift and metadata treatment as pointer hover.", "Metadata is supplemental; the item label remains available without hover."],
    performance: ["CSS Grid performs stable placement; no random coordinates or measurement pass.", "Neighbour response is a single focused-index state, not a per-item pointer loop."],
    whenToUse: ["Editorial portfolios, case studies and mixed portrait/landscape collections."], whenNotToUse: ["Tables, dense comparison grids or unbounded feeds."], related: ["masonry-gallery", "broken-offset-grid", "polaroid-wall"],
  }),
  modernLayout({
    component: "SplitScreenGallery", slug: "split-screen-gallery", name: "Split-Screen Gallery", family: "editorial",
    description: "Two coordinated media planes that change together with a cinematic but controlled handoff.",
    tags: ["split-screen", "gallery", "cinematic", "controlled"], builtOn: ["AnimatePresence", "Motion", "native buttons"],
    usage: `<SplitScreenGallery items={projects} index={index} onIndexChange={setIndex} />`,
    primaryProp: { name: "items", type: "SplitScreenGalleryItem[]", description: "Paired primary and secondary media for each collection entry." }, itemRange: "2–8 paired items.", mobile: "Stacks the two planes and keeps previous/next controls plus touch swiping.",
    accessibility: ["Previous and next are explicit buttons with a polite current-position announcement.", "Each media pane can receive focus and does not require hover.", "Touch swipe is an accelerator, never the only navigation path."],
    performance: ["Only the selected pair participates in the transition.", "Uses transform/opacity handoffs without an image preloader."],
    whenToUse: ["Paired project views, editorial before/after stories and art direction."], whenNotToUse: ["Independent feeds where two items do not share a relationship."], related: ["before-after", "perspective-gallery", "cinematic-horizontal-gallery"],
  }),
  modernLayout({
    component: "CinematicHorizontalGallery", slug: "cinematic-horizontal-gallery", name: "Cinematic Horizontal Gallery", family: "editorial",
    description: "A large media rail for project browsing with variable widths, snapping and optional scroll mapping.",
    tags: ["horizontal", "gallery", "snap", "media"], builtOn: ["native overflow", "MotionValues", "Scroll source"],
    usage: `<CinematicHorizontalGallery items={projects} verticalMapping={false} />`,
    primaryProp: { name: "items", type: "CinematicGalleryItem[]", description: "Large media cards with labels, metadata and optional widths." }, itemRange: "3–18 items; keep each card legible.", mobile: "Uses native horizontal overflow and scroll snap; vertical mapping is disabled on compact layouts.",
    accessibility: ["The rail is a focusable list with Arrow, Home and End navigation.", "Previous/next buttons mirror the scroll interaction.", "Captions stay in the DOM and are not hover-only."],
    performance: ["Native overflow is the default and does not hijack page scroll.", "Vertical mapping measures one rail and moves it with a MotionValue."],
    whenToUse: ["Portfolio browsing, product stories and image-led archives."], whenNotToUse: ["Long prose or utility lists that should read vertically."], related: ["horizontal-story", "masonry-gallery", "spatial-carousel"],
  }),
  modernLayout({
    component: "GalleryListMorph", slug: "gallery-list-morph", name: "Gallery ↔ List Morph", family: "editorial",
    description: "One keyed collection visibly transforms between a media gallery and a practical list.",
    tags: ["morph", "gallery", "list", "signature"], builtOn: ["LayoutGroup", "layoutId", "Motion"],
    usage: `<GalleryListMorph items={projects} mode={mode} onModeChange={setMode} />`,
    primaryProp: { name: "items", type: "GalleryListMorphItem[]", description: "Stable ids, titles, media and optional list metadata." }, itemRange: "3–24 items.", mobile: "Gallery remains a compact grid; List is available for scanning and preserves the same items.",
    accessibility: ["The collection remains one keyed list instead of mounting unrelated copies.", "Gallery/List controls expose aria-pressed and G/L keyboard shortcuts.", "Links, titles and metadata remain available in both modes."],
    performance: ["Stable item keys allow Motion layout interpolation rather than duplicate trees.", "Media is supplied by the consumer, so lazy loading stays in the host."],
    reducedMotion: "Switches layout immediately while retaining stable item identity and semantics.", whenToUse: ["Project indexes where visual browsing and fast scanning are equally important."], whenNotToUse: ["Collections whose two modes would expose different information architectures."], related: ["stack-grid", "morph-card", "cursor-preview-nav"],
  }),
  modernLayout({
    component: "BrokenOffsetGrid", slug: "broken-offset-grid", name: "Broken / Offset Grid", family: "editorial",
    description: "A deliberately offset editorial grid with authored whitespace and predictable placement.",
    tags: ["offset", "editorial", "asymmetry", "grid"], builtOn: ["CSS Grid", "Motion", "explicit offsets"],
    usage: `<BrokenOffsetGrid items={projects} columns={3} />`,
    primaryProp: { name: "items", type: "BrokenOffsetGridItem[]", description: "Ordered items with explicit span and vertical offset values." }, itemRange: "4–16 items.", mobile: "Offsets and spans flatten into a readable grid; no random placement survives on small screens.",
    accessibility: ["Placement is decorative and content order remains the input order.", "Focus straightens the active item just as pointer hover does.", "Metadata is supplemental and visible without interaction."],
    performance: ["Explicit transforms avoid measurement and layout reflow.", "Only one active item and its neighbours receive emphasis."],
    whenToUse: ["Creative portfolios and campaign indexes with intentional negative space."], whenNotToUse: ["Strictly comparable plans, tables or dense dashboards."], related: ["editorial-mosaic", "polaroid-wall", "stack-grid"],
  }),
  modernLayout({
    component: "LayeredEditorial", slug: "layered-editorial", name: "Layered Editorial", family: "editorial",
    description: "Typography, media and caption planes overlap with shallow depth while reading in a sensible order.",
    tags: ["editorial", "layers", "typography", "2.5d"], builtOn: ["CSS perspective", "Motion", "Parallax vocabulary"],
    usage: `<LayeredEditorial title="A softer archive" media={<Cover />} foreground={<Badge />} />`,
    primaryProp: { name: "media", type: "ReactNode", description: "The main visual plane that can move slightly toward the viewer." }, itemRange: "One composition per section.", mobile: "Layers flatten into normal flow with the title and description first.",
    accessibility: ["The title and description render before decorative overlap layers.", "Text remains selectable and is never communicated only through z-depth.", "Focus and pointer activate the same restrained depth response."],
    performance: ["A fixed number of CSS layers; no canvas or filter stack.", "Motion is transform-only and disabled cleanly for reduced motion."],
    whenToUse: ["Feature openings, editorial covers and one-off campaign compositions."], whenNotToUse: ["Repeated card collections or text-dense documentation."], related: ["depth-hero", "parallax-section", "perspective-bento"],
  }),
  modernLayout({
    component: "FloatingColumns", slug: "floating-columns", name: "Floating Columns", family: "editorial",
    description: "Multiple media columns drift at different scroll rates while remaining a normal collection on touch.",
    tags: ["columns", "scroll", "portfolio", "editorial"], builtOn: ["useScroll", "MotionValues", "native grid"],
    usage: `<FloatingColumns columns={[{ id: "a", items: cards }, { id: "b", items: more }]} />`,
    primaryProp: { name: "columns", type: "FloatingColumn[]", description: "Small ordered columns with optional direction and speed intent." }, itemRange: "2–4 columns with 3–10 items each.", mobile: "Columns become a clean stacked or narrow grid with no floating scroll choreography.",
    accessibility: ["Each column remains ordinary DOM content in reading order.", "Hover/focus emphasis is supplemental and never moves focus away.", "Reduced motion retains a static multi-column layout."],
    performance: ["One scroll progress source drives all columns.", "No per-item pointer listeners or image preloading is introduced."],
    whenToUse: ["Photography, fashion and visual archives with a short curated set."], whenNotToUse: ["Long feeds or content where vertical reading order is critical."], related: ["masonry-gallery", "sticky-story", "horizontal-story"],
  }),
];

const spatialLayouts: LayoutEntry[] = [
  modernLayout({
    component: "PerspectiveBento", slug: "perspective-bento", name: "Perspective Bento", family: "spatial",
    description: "One shallow perspective plane gives a bento composition depth without independently tilting every cell.",
    tags: ["bento", "perspective", "2.5d", "hover"], builtOn: ["CSS perspective", "Motion", "direct CSS variables"],
    usage: `<PerspectiveBento items={features} columns={3} />`, primaryProp: { name: "items", type: "PerspectiveBentoItem[]", description: "Cells with explicit spans and stable content." }, itemRange: "4–12 cells.", mobile: "Perspective is removed and the bento becomes a normal responsive grid.",
    accessibility: ["The composition has one reading order and cells do not require spatial orientation.", "Focused cells receive the same local emphasis as pointer hover.", "Decorative perspective never carries selection state."], related: ["expandable-bento", "layered-editorial", "tilt-card"],
  }),
  modernLayout({
    component: "Curved3DGrid", slug: "curved-3d-grid", name: "Curved 3D Grid", family: "spatial",
    description: "A conventional content grid mapped onto a shallow curved plane with restrained local depth.",
    tags: ["3d", "grid", "spatial", "selection"], builtOn: ["CSS 3D transforms", "Motion", "native listbox semantics"],
    usage: `<Curved3DGrid items={products} columns={4} curvature={28} />`, primaryProp: { name: "items", type: "SpatialCollectionItem[]", description: "Recognizable cards or media with labels and optional metadata." }, itemRange: "4–20 items.", mobile: "Flattens to one or two columns; Arrow/Home/End selection remains available.",
    accessibility: ["Items use listbox/option semantics with a single active tab stop.", "Arrow, Home and End keys mirror pointer selection.", "The flat grid is complete and does not depend on camera orientation."], related: ["perspective-bento", "perspective-gallery", "spatial-carousel"],
  }),
  modernLayout({
    component: "HelixGallery", slug: "helix-gallery", name: "Helix Gallery", family: "spatial",
    description: "A finite media sequence arranged along a shallow helix, never requiring users to navigate a 3D scene.",
    tags: ["helix", "3d", "gallery", "experimental"], builtOn: ["CSS 3D transforms", "Motion", "native controls"],
    usage: `<HelixGallery items={projects} radius={150} pitch={1.4} spacing={0.8} />`, primaryProp: { name: "items", type: "SpatialCollectionItem[]", description: "Short labeled media items arranged around the selected item." }, itemRange: "3–9 items.", mobile: "Becomes a linear stack with touch swipe and explicit controls.",
    accessibility: ["The selected item is focusable and previous/next buttons are always present.", "Metadata is rendered in every item; depth is visual context only.", "Reduced motion removes rotation and opacity staging."], performance: ["CSS transforms avoid a WebGL context and use a bounded item count.", "Only supplied media loads; the layout does not clone frames."], whenToUse: ["A short art-directed collection where depth is a meaningful browsing metaphor."], whenNotToUse: ["Large catalogs, essential documentation or repeated page sections."], related: ["cylinder-gallery", "spatial-carousel", "perspective-gallery"],
  }),
  modernLayout({
    component: "CylinderGallery", slug: "cylinder-gallery", name: "Cylinder Gallery", family: "spatial",
    description: "A finite ring of media that rotates by drag, wheel or controls and settles on a clear active item.",
    tags: ["cylinder", "3d", "gallery", "snap"], builtOn: ["CSS 3D transforms", "Motion", "wheel/touch input"],
    usage: `<CylinderGallery items={projects} radius={170} snap />`, primaryProp: { name: "items", type: "SpatialCollectionItem[]", description: "Short media sequence with a recognizable active item." }, itemRange: "3–10 items.", mobile: "Uses a flat, vertically readable list with touch and button navigation.",
    accessibility: ["Active state is announced and reachable through Arrow/Home/End via the focused item.", "Wheel and drag are accelerators; buttons provide the complete path.", "The flat mobile fallback keeps all media and labels visible."], performance: ["No infinite rotation loop or WebGL canvas.", "A finite ring caps simultaneous 3D layers."], whenToUse: ["Small collections where a ring makes sequence and adjacency legible."], whenNotToUse: ["Infinite spinning showcases or large scanning lists."], related: ["helix-gallery", "spatial-carousel", "orbit-menu"],
  }),
  modernLayout({
    component: "DepthScrollGallery", slug: "depth-scroll-gallery", name: "Depth Scroll Gallery", family: "spatial",
    description: "Native scrolling moves through a stack of depth planes without trapping the page or hijacking the wheel.",
    tags: ["scroll", "depth", "gallery", "spatial"], builtOn: ["IntersectionObserver", "sticky positioning", "Motion"],
    usage: `<DepthScrollGallery items={projects} onIndexChange={setProject} />`, primaryProp: { name: "items", type: "SpatialCollectionItem[]", description: "Ordered media planes with labels and optional metadata." }, itemRange: "3–12 items.", mobile: "Sticky depth becomes a normal vertical gallery while page scroll remains native.",
    accessibility: ["Intersection state is supplemental; all items remain in DOM order.", "Previous/next buttons and Arrow keys provide direct navigation.", "No scroll lock or essential content hidden behind a plane."], performance: ["IntersectionObserver selects the active item; no scroll-frame React loop.", "Transforms and opacity are bounded to the visible collection."], whenToUse: ["A short visual story where depth should follow reading progress."], whenNotToUse: ["Long-form text or pages with several competing scroll narratives."], related: ["sticky-story", "horizontal-story", "spatial-card-tunnel"],
  }),
  modernLayout({
    component: "SpatialCardTunnel", slug: "spatial-card-tunnel", name: "Spatial Card Tunnel", family: "spatial",
    description: "A finite Z-axis collection that advances by explicit controls rather than an uncontrolled camera ride.",
    tags: ["tunnel", "z-axis", "cards", "experimental"], builtOn: ["CSS 3D transforms", "Motion", "native controls"],
    usage: `<SpatialCardTunnel items={documents} spacing={110} />`, primaryProp: { name: "items", type: "SpatialCollectionItem[]", description: "Small ordered cards with stable labels and content." }, itemRange: "3–10 cards.", mobile: "Flattens to a normal stack with the same controls and focus order.",
    accessibility: ["Every card remains a list item in DOM order; the selected card has the roving tab stop.", "Arrow, Home and End keys plus buttons move through the tunnel.", "Depth and opacity never become the only way to identify a card."], performance: ["The collection is intentionally bounded and uses transform-only staging.", "No camera loop, canvas or cloned DOM tree is created."], whenToUse: ["A short sequence of related product surfaces or documents."], whenNotToUse: ["Comparison grids, large feeds or content with no meaningful sequence."], related: ["depth-scroll-gallery", "draggable-card-stack", "cylinder-gallery"],
  }),
  modernLayout({
    component: "StackSpatial", slug: "stack-spatial", name: "Stack → Spatial", family: "spatial",
    description: "A familiar stack distributes into authored X/Y/Z planes while preserving each item identity.",
    tags: ["stack", "spatial", "morph", "2.5d"], builtOn: ["LayoutGroup", "CSS 3D transforms", "Motion"],
    usage: `<StackSpatial items={projects} expanded={expanded} onExpandedChange={setExpanded} />`, primaryProp: { name: "items", type: "SpatialCollectionItem[]", description: "Stable keyed items that can be read as a stack or spatial spread." }, itemRange: "3–12 items.", mobile: "Expanded mode becomes a normal responsive grid; the toggle and item order stay unchanged.",
    accessibility: ["One native toggle exposes the stack/spatial state with aria-pressed.", "The same keyed items remain rendered in both modes.", "Spatial arrangement is decorative and never required to reach content."], related: ["stack-grid", "draggable-card-stack", "spatial-card-tunnel"],
  }),
  modernLayout({
    component: "InfiniteSpatialCanvas", slug: "infinite-spatial-canvas", name: "Infinite Spatial Canvas", family: "spatial",
    description: "A bounded spatial browsing field for curated projects, notes or media with authored depth planes, clusters and orientation cues—not a whiteboard application.",
    tags: ["canvas", "pan", "zoom", "spatial", "depth", "signature"], builtOn: ["MotionValues", "inertia", "CSS transforms", "orientation map"],
    usage: `<InfiniteSpatialCanvas items={projects} bounds={{ left: -360, right: 360, top: -220, bottom: 220 }} />`, primaryProp: { name: "items", type: "SpatialCanvasItem[]", description: "Curated items with explicit coordinates and labels." }, itemRange: "6–30 curated items; use a dedicated data product for more.", mobile: "Pointer/touch drag remains available; keyboard arrows, zoom buttons and reset provide non-pointer control.",
    accessibility: ["Canvas items are ordinary focusable articles in DOM order.", "Arrow keys pan, +/- changes zoom and Home/0 resets the view.", "The orientation map, bounds and explicit controls keep spatial browsing from becoming a keyboard trap."], performance: ["Pan uses MotionValues and direct pointer updates instead of React per frame.", "Inertia is bounded and items use transform-only emphasis with a deliberately curated data model."], whenToUse: ["Creative indexes, spatial portfolios and small collections with meaningful relationships."], whenNotToUse: ["Collaborative whiteboards, unbounded maps or primary application navigation."], related: ["perspective-gallery", "stack-spatial", "orbit-menu"],
  }),
];

export const layouts: LayoutEntry[] = [...foundationalLayouts, ...editorialLayouts, ...spatialLayouts];

export function getLayout(slug: string): LayoutEntry | undefined {
  return layouts.find((entry) => entry.slug === slug);
}

export function filterLayouts(family: LayoutFamily | "all"): LayoutEntry[] {
  return family === "all" ? layouts : layouts.filter((entry) => entry.family === family);
}
