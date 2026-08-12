import type { Preset, PropDef, Status } from "./types";

export type ExperienceFamily = "navigation" | "heroes" | "backgrounds" | "transitions" | "spatial";
export type ExperienceInteraction =
  | "selection"
  | "keyboard"
  | "pointer"
  | "focus"
  | "scroll"
  | "morph"
  | "ambient"
  | "route"
  | "depth";

export type ExperienceRegistryEntry = {
  slug: string;
  name: string;
  family: ExperienceFamily;
  description: string;
  status: Status;
  tags: string[];
  interactions: ExperienceInteraction[];
  builtOn: string[];
  importPath: 'import { COMPONENT } from "@pinky/experiences";';
  usage: string;
  props: PropDef[];
  presets: Preset[];
  demoPath: string;
  skill: string;
  accessibility: string[];
  reducedMotion: string;
  performance: string[];
  whenToUse: string[];
  whenNotToUse: string[];
  related: string[];
};

type ExperienceConfig = Omit<
  ExperienceRegistryEntry,
  "status" | "importPath" | "demoPath" | "skill" | "props" | "presets" | "accessibility" | "reducedMotion"
> & {
  component: string;
  primaryProp: PropDef;
  quietProps?: Record<string, number | string | boolean>;
  accessibility?: string[];
  reducedMotion?: string;
};

const entry = ({ component, primaryProp, quietProps = { disabled: true }, ...config }: ExperienceConfig): ExperienceRegistryEntry => ({
  ...config,
  // Every entry below has a live section in the website experience gallery.
  status: "ready",
  importPath: `import { ${component} } from "@pinky/experiences";` as ExperienceRegistryEntry["importPath"],
  usage: config.usage,
  props: [
    primaryProp,
    { name: "className", type: "string", description: "Styles the outer composition without changing its behaviour." },
    { name: "disabled", type: "boolean", defaultValue: "false", description: "Uses the static, readable composition." },
  ],
  presets: [
    { name: "Default", description: "The restrained Pinky production default.", props: {} },
    { name: "Quiet", description: "A flatter or lower-intensity treatment for dense pages.", props: quietProps },
  ],
  demoPath: `/experiences#${config.slug}`,
  skill: config.slug,
  accessibility: config.accessibility ?? [
    "Content remains in logical DOM order and motion never carries the only meaning.",
    "Interactive descendants retain native link or button semantics and visible focus.",
  ],
  reducedMotion: config.reducedMotion ?? "Spatial or continuous movement is removed while content, selection and controls remain available.",
});

export const navigationExperiences = [
  entry({
    component: "LiquidNavbar", family: "navigation", slug: "liquid-navbar", name: "Liquid Navbar",
    description: "A semantic navbar with a softly stretching spring active surface.",
    tags: ["navbar", "active-state", "responsive"], interactions: ["selection", "keyboard", "focus"], builtOn: ["spring vocabulary", "ResizeObserver"],
    usage: `<LiquidNavbar items={items} activeId={active} onActiveChange={setActive} />`,
    primaryProp: { name: "items", type: "LiquidNavbarItem[]", description: "Short destination or local-view items." }, quietProps: { disabled: true },
    accessibility: ["Uses a labelled nav with native links or buttons.", "Arrow, Home and End keys move focus and selection; active links expose aria-current."],
    performance: ["One measured indicator moves without changing layout.", "ResizeObserver updates geometry only when item sizes change."],
    whenToUse: ["Compact primary or section navigation"], whenNotToUse: ["Dense or multi-level application menus"], related: ["floating-island-nav", "fluid-tabs"],
  }),
  entry({
    component: "MorphMenu", family: "navigation", slug: "morph-menu", name: "Morph Menu",
    description: "A compact trigger that expands into a spatially continuous menu surface.",
    tags: ["menu", "overlay", "mobile"], interactions: ["morph", "keyboard", "focus"], builtOn: ["Morph", "shared layout"],
    usage: `<MorphMenu items={items} label="Site navigation" />`,
    primaryProp: { name: "items", type: "MorphMenuItem[]", description: "Semantic navigation destinations." }, quietProps: { disabled: true },
    accessibility: ["Escape closes the menu and focus is trapped while open.", "Closing restores trigger focus and releases body scroll."],
    performance: ["Reuses the existing shared-layout Morph primitive.", "No pointer or scroll loop is mounted."],
    whenToUse: ["Compact editorial and mobile navigation"], whenNotToUse: ["Links that should remain visible at all times"], related: ["shared-element-transition", "morph"],
  }),
  entry({
    component: "FloatingIslandNav", family: "navigation", slug: "floating-island-nav", name: "Floating Island Nav",
    description: "A compact elevated navigation island with optional proximity and scroll collapse.",
    tags: ["floating", "landing-page", "responsive"], interactions: ["selection", "scroll", "pointer"], builtOn: ["LiquidNavbar", "Magnetic", "shared scroll source"],
    usage: `<FloatingIslandNav items={items} collapseOnScroll proximity />`,
    primaryProp: { name: "collapseOnScroll", type: "boolean", defaultValue: "false", description: "Tucks the island away on deliberate downward scroll." }, quietProps: { collapseOnScroll: false, proximity: false },
    performance: ["Scroll state stays in MotionValues rather than React renders.", "Optional proximity reuses the Magnetic primitive."],
    whenToUse: ["Sparse landing-page navigation"], whenNotToUse: ["Pages already using a fixed dock or dense header"], related: ["liquid-navbar", "floating-dock"],
  }),
  entry({
    component: "CursorPreviewNav", family: "navigation", slug: "cursor-preview-nav", name: "Cursor Preview Nav",
    description: "A project index whose links reveal contextual preview media on hover or focus.",
    tags: ["portfolio", "preview", "editorial"], interactions: ["pointer", "focus", "keyboard"], builtOn: ["HoverImagePreview", "CursorTarget", "shared pointer store"],
    usage: `<CursorPreviewNav items={projects} />`,
    primaryProp: { name: "items", type: "CursorPreviewNavItem[]", description: "Labeled links with preview media." }, quietProps: { disabled: true },
    accessibility: ["Every destination remains a stable labeled anchor.", "Keyboard focus triggers the same contextual preview as hover."],
    performance: ["Reuses the capped preview and shared pointer architecture.", "No React state is written per pointer frame."],
    whenToUse: ["Portfolio and case-study indexes"], whenNotToUse: ["Utility navigation or image-heavy long lists"], related: ["hover-image-preview", "image-trail"],
  }),
] satisfies ExperienceRegistryEntry[];

export const heroExperiences = [
  entry({
    component: "MorphingHero", family: "heroes", slug: "morphing-hero", name: "Morphing Hero",
    description: "A Hero whose major title and media composition compresses with page progress.",
    tags: ["hero", "scroll", "handoff"], interactions: ["scroll", "morph"], builtOn: ["shared scroll source", "spring vocabulary"],
    usage: `<MorphingHero title="Make interfaces feel alive" media={<Artwork />} />`,
    primaryProp: { name: "media", type: "ReactNode", description: "The major visual that transforms with the Hero." }, quietProps: { disabled: true },
    performance: ["Scroll progress is a MotionValue with no per-frame React state.", "Transforms avoid layout work."],
    whenToUse: ["A Hero that hands visual context into the page"], whenNotToUse: ["Pages with another dominant scroll narrative"], related: ["shared-morph", "sticky-story"],
  }),
  entry({
    component: "DepthHero", family: "heroes", slug: "depth-hero", name: "Depth Hero",
    description: "A layered Hero with restrained spatial separation between content and artwork.",
    tags: ["hero", "parallax", "layers"], interactions: ["scroll", "depth"], builtOn: ["Parallax", "ParallaxLayer"],
    usage: `<DepthHero content={<Intro />} artwork={<Artwork />} background={<Mesh />} />`,
    primaryProp: { name: "artwork", type: "ReactNode", description: "The primary visual depth layer." }, quietProps: { disabled: true },
    performance: ["Composes the existing shared scroll source through Parallax.", "Uses a small fixed number of transform layers."],
    whenToUse: ["Creative or product Heroes with meaningful layers"], whenNotToUse: ["Text-dense pages or aggressive camera effects"], related: ["parallax-section", "soft-mesh-background"],
  }),
  entry({
    component: "MagneticCtaHero", family: "heroes", slug: "magnetic-cta-hero", name: "Magnetic CTA Hero",
    description: "A production Hero with one tactile primary action and optional local light.",
    tags: ["hero", "cta", "conversion"], interactions: ["pointer", "focus"], builtOn: ["Magnetic", "CursorSpotlight"],
    usage: `<MagneticCtaHero title="Ship softer interfaces" primaryAction={{ label: "Explore", href: "/components" }} />`,
    primaryProp: { name: "primaryAction", type: "HeroAction", description: "The single tactile anchor or button action." }, quietProps: { spotlight: false, disabled: true },
    performance: ["Uses the shared pointer source through existing primitives.", "Only the primary CTA moves and travel is capped."],
    whenToUse: ["Production landing pages with one clear CTA"], whenNotToUse: ["Dense action groups or destructive workflows"], related: ["magnetic-button", "cursor-spotlight"],
  }),
] satisfies ExperienceRegistryEntry[];

export const backgroundExperiences = [
  entry({
    component: "SoftMeshBackground", family: "backgrounds", slug: "soft-mesh-background", name: "Soft Mesh Background",
    description: "A slow themeable three-stop atmospheric background.",
    tags: ["ambient", "gradient", "themeable"], interactions: ["ambient"], builtOn: ["useInView", "Motion transforms"],
    usage: `<SoftMeshBackground colors={["#fff8f7", "#edf4ff", "#fff"]}>{content}</SoftMeshBackground>`,
    primaryProp: { name: "intensity", type: "number", defaultValue: "0.62", description: "Opacity budget for the ambient color fields." }, quietProps: { intensity: 0.35 },
    performance: ["A fixed three-layer DOM cost.", "Continuous movement pauses while offscreen."],
    whenToUse: ["Warm Hero and section atmosphere"], whenNotToUse: ["Surfaces where moving color harms contrast"], related: ["interactive-gradient", "ambient-backgrounds"],
  }),
  entry({
    component: "InteractiveGradient", family: "backgrounds", slug: "interactive-gradient", name: "Interactive Gradient",
    description: "A gentle local gradient field driven by shared pointer infrastructure.",
    tags: ["gradient", "pointer", "hero"], interactions: ["pointer", "ambient"], builtOn: ["CursorSpotlight", "shared pointer store"],
    usage: `<InteractiveGradient radius={520} intensity={0.2}>{content}</InteractiveGradient>`,
    primaryProp: { name: "radius", type: "number", defaultValue: "460", description: "Diameter of the quiet responsive color field." }, quietProps: { intensity: 0.12 },
    performance: ["No React state is updated per pointer frame.", "The existing shared pointer source is reused."],
    whenToUse: ["Bounded Hero or feature backgrounds"], whenNotToUse: ["Text whose contrast changes under the field"], related: ["cursor-spotlight", "spotlight-grid"],
  }),
  entry({
    component: "BubbleField", family: "backgrounds", slug: "bubble-field", name: "Bubble Field",
    description: "A capped deterministic field of slowly drifting soft orbs.",
    tags: ["ambient", "orbs", "friendly"], interactions: ["ambient", "pointer"], builtOn: ["shared pointer store", "useInView", "MotionValues"],
    usage: `<BubbleField count={10} pointerResponse>{content}</BubbleField>`,
    primaryProp: { name: "count", type: "number", defaultValue: "10", description: "Requested bubble count, capped at eighteen and reduced on mobile." }, quietProps: { count: 6, pointerResponse: false },
    performance: ["Deterministic SSR placement with a hard eighteen-node cap.", "Movement pauses offscreen and mobile lowers density."],
    whenToUse: ["Friendly campaign and empty-state atmosphere"], whenNotToUse: ["Data-dense screens or multiple fields per page"], related: ["soft-mesh-background", "cursor-blob"],
  }),
  entry({
    component: "SpotlightGrid", family: "backgrounds", slug: "spotlight-grid", name: "Spotlight Grid",
    description: "A quiet structural grid revealed by a local pointer spotlight.",
    tags: ["grid", "developer", "spotlight"], interactions: ["pointer", "ambient"], builtOn: ["CursorSpotlight", "CSS gradients"],
    usage: `<SpotlightGrid size={28} intensity={0.18}>{content}</SpotlightGrid>`,
    primaryProp: { name: "size", type: "number", defaultValue: "28", description: "Spacing of the decorative grid lines." }, quietProps: { intensity: 0.1 },
    performance: ["The grid is two CSS gradients rather than repeated nodes.", "Pointer response uses the shared spotlight source."],
    whenToUse: ["Developer, docs and structured product sections"], whenNotToUse: ["Neon styling or body-copy-heavy surfaces"], related: ["interactive-gradient", "cursor-spotlight"],
  }),
] satisfies ExperienceRegistryEntry[];

export const transitionExperiences = [
  entry({
    component: "SharedElementTransition", family: "transitions", slug: "shared-element-transition", name: "Shared Element Transition",
    description: "A semantic route link or accessible Morph surface with shared visual identity.",
    tags: ["shared-layout", "route", "detail"], interactions: ["route", "morph", "focus"], builtOn: ["Morph", "layoutId", "View Transitions enhancement"],
    usage: `<SharedElementTransition name="project-cover" href="/work/pinky">{cover}</SharedElementTransition>`,
    primaryProp: { name: "name", type: "string", description: "Stable identity shared by source and destination." }, quietProps: { disabled: true },
    accessibility: ["Route mode remains a real anchor.", "In-place detail mode inherits Escape, focus trap and focus restoration from Morph."],
    performance: ["Transforms one meaningful surface rather than the whole page.", "View Transition naming is progressive enhancement."],
    whenToUse: ["Thumbnail-to-detail continuity"], whenNotToUse: ["Unrelated page changes or many simultaneous shared objects"], related: ["morph", "blur-route-transition"],
  }),
  entry({
    component: "BubbleTransition", family: "transitions", slug: "bubble-transition", name: "Bubble Transition",
    description: "A soft circular cover and reveal originating from a trigger or point.",
    tags: ["transition", "origin", "circular"], interactions: ["route", "focus"], builtOn: ["clip-path", "Motion"],
    usage: `<BubbleTransition transitionKey={view} origin={triggerRef}>{content}</BubbleTransition>`,
    primaryProp: { name: "origin", type: '"center" | coordinates | RefObject', defaultValue: '"center"', description: "The meaningful initiation point for the reveal." }, quietProps: { disabled: true },
    performance: ["One temporary overlay is mounted per transition.", "No liquid simulation or filter stack is used."],
    whenToUse: ["Occasional local mode or campaign changes"], whenNotToUse: ["Frequent product navigation that should be immediate"], related: ["liquid-wipe-transition", "blur-route-transition"],
  }),
  entry({
    component: "LiquidWipeTransition", family: "transitions", slug: "liquid-wipe-transition", name: "Liquid Wipe Transition",
    description: "A short two-layer soft wipe between keyed views.",
    tags: ["transition", "wipe", "expressive"], interactions: ["route", "focus"], builtOn: ["transforms", "AnimatePresence"],
    usage: `<LiquidWipeTransition transitionKey={chapter} direction="right">{content}</LiquidWipeTransition>`,
    primaryProp: { name: "direction", type: '"left" | "right" | "up" | "down"', defaultValue: '"right"', description: "The direction that matches the content relationship." }, quietProps: { disabled: true },
    performance: ["Two transform-only temporary layers.", "No SVG displacement or real-time fluid simulation."],
    whenToUse: ["Occasional branded chapter changes"], whenNotToUse: ["Every route in a utility application"], related: ["bubble-transition", "blur-route-transition"],
  }),
  entry({
    component: "BlurRouteTransition", family: "transitions", slug: "blur-route-transition", name: "Blur Route Transition",
    description: "A minimal fade, low blur and focus-aware handoff between keyed views.",
    tags: ["route", "blur", "production"], interactions: ["route", "focus"], builtOn: ["AnimatePresence", "useMotionEnabled"],
    usage: `<BlurRouteTransition transitionKey={pathname}>{page}</BlurRouteTransition>`,
    primaryProp: { name: "blur", type: "number", defaultValue: "5", description: "Small blur radius used during the handoff." }, quietProps: { duration: 0.18, blur: 3 },
    accessibility: ["The keyed region receives focus after a content change when requested.", "Content remains mounted in a predictable region with no focus trap."],
    reducedMotion: "AnimatePresence is bypassed and new content is rendered and focused immediately.",
    performance: ["Short, low-radius blur limits paint cost.", "Reduced motion avoids the transition lifecycle entirely."],
    whenToUse: ["Routine production route or tab transitions"], whenNotToUse: ["Large persistent surfaces on low-power devices"], related: ["shared-element-transition", "page-transition-etiquette"],
  }),
] satisfies ExperienceRegistryEntry[];

export const spatialExperiences = [
  entry({
    component: "PerspectiveGallery", family: "spatial", slug: "perspective-gallery", name: "Perspective Gallery",
    description: "A selectable gallery with shallow, readable spatial depth.",
    tags: ["gallery", "perspective", "media"], interactions: ["selection", "keyboard", "depth"], builtOn: ["CSS perspective", "Motion transforms"],
    usage: `<PerspectiveGallery items={projects} onActiveChange={setProject} />`,
    primaryProp: { name: "items", type: "PerspectiveGalleryItem[]", description: "A short selectable media collection." }, quietProps: { disabled: true },
    accessibility: ["Exposes listbox and option semantics with selected state.", "Arrow, Home and End keys change selection without pointer input."],
    performance: ["CSS transforms provide depth without a 3D runtime.", "Mobile and reduced motion flatten the scene."],
    whenToUse: ["Curated visual collections"], whenNotToUse: ["Large scanning-heavy galleries"], related: ["spatial-carousel", "parallax-section"],
  }),
  entry({
    component: "FloatingWindowStack", family: "spatial", slug: "floating-window-stack", name: "Floating Window Stack",
    description: "A selectable stack of overlapping product windows with quiet focus depth.",
    tags: ["windows", "product-preview", "stack"], interactions: ["selection", "focus", "depth"], builtOn: ["Motion transforms", "CSS stacking"],
    usage: `<FloatingWindowStack windows={screens} activeId={active} onActiveChange={setActive} />`,
    primaryProp: { name: "windows", type: "FloatingWindow[]", description: "Two to four labeled product surfaces." }, quietProps: { disabled: true },
    accessibility: ["Window selectors are labeled buttons with pressed state.", "Content order remains stable regardless of visual z-index."],
    performance: ["A small fixed surface stack uses transforms and opacity.", "Mobile and reduced motion remove overlap."],
    whenToUse: ["SaaS or portfolio product previews"], whenNotToUse: ["Interactive fake desktops or essential hidden forms"], related: ["draggable-card-stack", "perspective-gallery"],
  }),
  entry({
    component: "SpatialCarousel", family: "spatial", slug: "spatial-carousel", name: "Spatial Carousel",
    description: "A sequential carousel where adjacent slides recede instead of only translating.",
    tags: ["carousel", "depth", "sequential"], interactions: ["selection", "keyboard", "depth"], builtOn: ["CSS perspective", "Motion transforms"],
    usage: `<SpatialCarousel items={slides} loop />`,
    primaryProp: { name: "items", type: "SpatialCarouselItem[]", description: "A short labeled sequence of slide content." }, quietProps: { disabled: true },
    accessibility: ["Previous/next controls and Arrow, Home and End keys are supported.", "Slides and current labels expose carousel semantics and polite announcements."],
    performance: ["Only transform, scale and opacity express depth.", "No Three.js runtime; mobile and reduced motion flatten the scene."],
    whenToUse: ["Short curated visual sequences"], whenNotToUse: ["Autoplay or long-form essential content"], related: ["perspective-gallery", "card-fan"],
  }),
  entry({
    component: "OrbitMenu", family: "spatial", slug: "orbit-menu", name: "Orbit Menu",
    description: "A practical configurable arc of actions around a central trigger.",
    tags: ["menu", "radial", "actions"], interactions: ["keyboard", "focus", "depth"], builtOn: ["Motion transforms", "spring vocabulary"],
    usage: `<OrbitMenu items={actions} startAngle={-165} endAngle={-15} />`,
    primaryProp: { name: "items", type: "OrbitMenuItem[]", description: "Two to five labeled links or actions in logical order." }, quietProps: { disabled: true },
    accessibility: ["Logical DOM order supports Arrow keys, Home, End and Escape.", "Opening focuses the first item; closing restores trigger focus."],
    performance: ["A small item cap is recommended and movement is transform-only.", "Mobile and reduced motion switch to a linear layout."],
    whenToUse: ["Compact related creative-tool actions"], whenNotToUse: ["Primary navigation, dense menus or unlabeled destructive actions"], related: ["morph-menu", "floating-dock"],
  }),
] satisfies ExperienceRegistryEntry[];

export const experiences = {
  navigation: navigationExperiences,
  heroes: heroExperiences,
  backgrounds: backgroundExperiences,
  transitions: transitionExperiences,
  spatial: spatialExperiences,
};

export const allExperiences = [
  ...navigationExperiences,
  ...heroExperiences,
  ...backgroundExperiences,
  ...transitionExperiences,
  ...spatialExperiences,
];

export function getExperience(slug: string) {
  return allExperiences.find((item) => item.slug === slug);
}

export function filterExperiences(family: ExperienceFamily | "all" = "all", query = "") {
  const needle = query.trim().toLowerCase();
  return allExperiences.filter((item) => {
    if (family !== "all" && item.family !== family) return false;
    if (!needle) return true;
    return [item.name, item.description, ...item.tags, ...item.interactions].join(" ").toLowerCase().includes(needle);
  });
}
