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
    component: "HoverExpandNavigation", family: "navigation", slug: "hover-expand-navigation", name: "Hover Expand Navigation",
    description: "A destination row where the engaged item opens enough room for its context while neighbours yield space.",
    tags: ["navigation", "hover", "context"], interactions: ["pointer", "focus", "selection", "keyboard"], builtOn: ["flex reflow", "layout interpolation"],
    usage: `<HoverExpandNavigation items={items} />`,
    primaryProp: { name: "items", type: "NavigationLink[]", description: "Destinations with short optional descriptions." },
    accessibility: ["Destinations remain native links with a clear current state.", "Focus engages the same contextual expansion as pointer hover; touch keeps the selected item open."],
    reducedMotion: "The item description remains available without layout interpolation; selection and focus stay visible.",
    performance: ["Only the small navigation row participates in layout animation.", "No pointer listener runs outside the navigation surface."],
    whenToUse: ["Short editorial or portfolio navigation where context helps scanning"], whenNotToUse: ["Large information architectures or dense utility menus"], related: ["cursor-preview-nav", "editorial-index-navigation"],
  }),
  entry({
    component: "NeighborShiftNavigation", family: "navigation", slug: "neighbor-shift-navigation", name: "Neighbor Shift Navigation",
    description: "A compact navigation strip whose active destination gains real width and makes adjacent destinations move around it.",
    tags: ["navigation", "active-state", "neighbor-response"], interactions: ["pointer", "focus", "selection", "keyboard"], builtOn: ["flex reflow", "spring vocabulary"],
    usage: `<NeighborShiftNavigation items={items} />`,
    primaryProp: { name: "items", type: "NavigationLink[]", description: "A short set of peer destinations." },
    accessibility: ["The active destination uses aria-current and every item remains a native link.", "Keyboard focus changes the same active state as pointer focus."],
    reducedMotion: "Width changes snap to their readable active state while the selected destination remains explicit.",
    performance: ["The response is limited to one flex row.", "No continuous pointer tracking or cloned navigation surfaces are mounted."],
    whenToUse: ["Small peer sets with one clearly current destination"], whenNotToUse: ["More than seven destinations or multi-level navigation"], related: ["liquid-navbar", "hover-expand-navigation"],
  }),
  entry({
    component: "EditorialIndexNavigation", family: "navigation", slug: "editorial-index-navigation", name: "Editorial Index Navigation",
    description: "A typography-led numbered index with a traveling rule that keeps the current destination legible.",
    tags: ["editorial", "index", "rule"], interactions: ["pointer", "focus", "selection", "keyboard"], builtOn: ["semantic ordered list", "active indicator"],
    usage: `<EditorialIndexNavigation items={items} />`,
    primaryProp: { name: "items", type: "NavigationLink[]", description: "Numbered destinations with optional metadata and descriptions." },
    accessibility: ["The ordered list preserves reading order and links retain native semantics.", "Current state is expressed with aria-current and never depends on the traveling rule alone."],
    reducedMotion: "The rule and text settle immediately while numbering, current state and descriptions remain unchanged.",
    performance: ["Only one short indicator and the active label receive motion.", "The index has no viewport or pointer loop."],
    whenToUse: ["Long-form editorial, case-study and chapter navigation"], whenNotToUse: ["Compact application chrome or rapidly changing filters"], related: ["cursor-preview-nav", "section-aware-navigation"],
  }),
  entry({
    component: "MorphingMegaNavigation", family: "navigation", slug: "morphing-mega-navigation", name: "Morphing Mega Navigation",
    description: "A primary navigation surface that grows into its own contextual index instead of dropping a detached mega menu.",
    tags: ["mega-menu", "morph", "primary-navigation"], interactions: ["morph", "keyboard", "focus", "selection"], builtOn: ["shared surface", "AnimatePresence"],
    usage: `<MorphingMegaNavigation groups={groups} />`,
    primaryProp: { name: "groups", type: "NavigationGroup[]", description: "Intent-led groups with related destination links." },
    accessibility: ["The trigger exposes aria-expanded and aria-controls; group choices expose pressed state.", "Escape closes the surface and restores trigger focus."],
    reducedMotion: "The contextual surface opens and closes without height travel; group changes remain readable and keyboard accessible.",
    performance: ["Only one contextual panel is mounted while open.", "The surface uses bounded layout and opacity changes rather than a viewport-wide effect."],
    whenToUse: ["Primary navigation with a small number of meaningful destination groups"], whenNotToUse: ["Utility menus that need instant direct links or very large taxonomies"], related: ["morph-menu", "spotlight-mega-menu", "sliding-mega-panel"],
  }),
  entry({
    component: "SpotlightMegaMenu", family: "navigation", slug: "spotlight-mega-menu", name: "Spotlight Mega Menu",
    description: "A two-pane menu that gives one focused navigation group a contextual preview and clear next destinations.",
    tags: ["mega-menu", "preview", "two-pane"], interactions: ["pointer", "focus", "keyboard", "selection"], builtOn: ["contextual preview", "tablist"],
    usage: `<SpotlightMegaMenu groups={groups} />`,
    primaryProp: { name: "groups", type: "NavigationGroup[]", description: "Groups with links and optional preview content." },
    accessibility: ["The trigger and panel are labelled, and group controls expose selected state.", "Hover and focus update the same preview; links stay available without preview media."],
    reducedMotion: "The preview swaps without opacity travel while the active group and links remain explicit.",
    performance: ["Only the selected group's preview is rendered in the spotlight pane.", "There is no global pointer position subscription."],
    whenToUse: ["Portfolio, product or editorial navigation where one preview aids choice"], whenNotToUse: ["Simple site navigation with no meaningful contextual content"], related: ["cursor-preview-nav", "morphing-mega-navigation", "layered-navigation-menu"],
  }),
  entry({
    component: "SlidingMegaPanel", family: "navigation", slug: "sliding-mega-panel", name: "Sliding Mega Panel",
    description: "A stable open menu surface whose internal group content slides directionally as the user browses.",
    tags: ["mega-menu", "directional", "panel"], interactions: ["selection", "keyboard", "focus", "morph"], builtOn: ["AnimatePresence", "direction-aware content"],
    usage: `<SlidingMegaPanel groups={groups} />`,
    primaryProp: { name: "groups", type: "NavigationGroup[]", description: "Ordered groups that share one open panel." },
    accessibility: ["The group selector exposes the current group and links keep a stable reading order.", "Escape closes and focus returns to the opener."],
    reducedMotion: "Directional travel is removed and the next group renders immediately with its current state announced by structure.",
    performance: ["The outer panel remains mounted while only its content changes.", "Transition direction is derived from the selected index, not pointer velocity."],
    whenToUse: ["Large but ordered navigation groups that benefit from a stable frame"], whenNotToUse: ["Menus with unrelated destinations or a need for simultaneous group comparison"], related: ["morphing-mega-navigation", "spotlight-mega-menu", "clip-reveal-menu"],
  }),
  entry({
    component: "LayeredNavigationMenu", family: "navigation", slug: "layered-navigation-menu", name: "Layered Navigation Menu",
    description: "A layered menu where the base index stays present behind a context layer, preserving spatial relationship during selection.",
    tags: ["menu", "layers", "context"], interactions: ["selection", "keyboard", "focus", "morph"], builtOn: ["stacked surfaces", "layout interpolation"],
    usage: `<LayeredNavigationMenu groups={groups} />`,
    primaryProp: { name: "groups", type: "NavigationGroup[]", description: "Base destinations with contextual child links." },
    accessibility: ["Both base and contextual destinations remain in DOM order with labelled controls.", "The selected group is exposed through aria-selected and focus rings remain visible."],
    reducedMotion: "Layer offsets snap to their final position while base and contextual links remain simultaneously available.",
    performance: ["The depth effect is two bounded surfaces, not a 3D scene.", "Only the active context layer changes content."],
    whenToUse: ["Navigation where users need to retain a sense of the parent category"], whenNotToUse: ["Very small menus or deeply nested application trees"], related: ["spotlight-mega-menu", "morphing-mega-navigation"],
  }),
  entry({
    component: "ClipRevealMenu", family: "navigation", slug: "clip-reveal-menu", name: "Clip Reveal Menu",
    description: "An anchored navigation panel that reveals from its trigger edge while keeping the destination list compact.",
    tags: ["menu", "clip", "anchored"], interactions: ["morph", "keyboard", "focus", "selection"], builtOn: ["clip-path", "AnimatePresence"],
    usage: `<ClipRevealMenu items={items} />`,
    primaryProp: { name: "items", type: "NavigationLink[]", description: "Direct destinations for an anchored menu." },
    accessibility: ["The trigger exposes expanded and controls relationships.", "Escape closes the menu, outside clicks close it, and the opener regains focus."],
    reducedMotion: "The clip reveal is replaced by an immediate visible panel without hiding destinations.",
    performance: ["The reveal is one clipped surface with transform and opacity.", "Outside-click handling is scoped to the menu root and cleaned on close."],
    whenToUse: ["Compact contextual menus attached to a visible trigger"], whenNotToUse: ["Primary navigation requiring simultaneous category comparison"], related: ["morph-menu", "sliding-mega-panel"],
  }),
  entry({
    component: "EdgeRailNavigation", family: "navigation", slug: "edge-rail-navigation", name: "Edge Rail Navigation",
    description: "A narrow edge rail that gives icons room to become labels when the user focuses or approaches it.",
    tags: ["rail", "responsive", "edge"], interactions: ["pointer", "focus", "selection", "keyboard"], builtOn: ["width interpolation", "icon slot"],
    usage: `<EdgeRailNavigation items={items} />`,
    primaryProp: { name: "items", type: "NavigationLink[]", description: "Destinations with optional icons for the collapsed rail." },
    accessibility: ["Labels remain in the DOM and are exposed to assistive technology even when visually collapsed.", "Focus expands the rail, so keyboard users receive the same context as pointer users."],
    reducedMotion: "The rail switches between compact and expanded widths without travel; labels remain readable.",
    performance: ["One rail surface changes width; no viewport overlay is created.", "Icons fall back to deterministic initials when no icon is provided."],
    whenToUse: ["Persistent tool or section navigation at a desktop edge"], whenNotToUse: ["Mobile-first primary navigation or essential labels that cannot be visually collapsed"], related: ["floating-dock", "expandable-bottom-navigation"],
  }),
  entry({
    component: "SectionAwareNavigation", family: "navigation", slug: "section-aware-navigation", name: "Section-Aware Navigation",
    description: "A local section index whose active indicator follows the content currently entering the reading window.",
    tags: ["section", "scroll", "reading"], interactions: ["scroll", "selection", "keyboard", "focus"], builtOn: ["IntersectionObserver", "shared indicator"],
    usage: `<SectionAwareNavigation sections={sections} />`,
    primaryProp: { name: "sections", type: "NavigationLink[]", description: "Anchors whose ids correspond to readable page sections." },
    accessibility: ["Each item is a native anchor with aria-current=location for the visible section.", "The indicator is supplemental; labels and anchor targets remain usable without scripting."],
    reducedMotion: "The indicator changes position immediately while section state and anchor behavior remain intact.",
    performance: ["IntersectionObserver replaces scroll polling.", "The observer watches only the supplied section elements and disconnects on unmount."],
    whenToUse: ["Long editorial, documentation or case-study pages"], whenNotToUse: ["Short pages or interfaces where a persistent local index adds noise"], related: ["editorial-index-navigation", "sticky-story"],
  }),
  entry({
    component: "ExpandableBottomNavigation", family: "navigation", slug: "expandable-bottom-navigation", name: "Expandable Bottom Navigation",
    description: "A mobile-first bottom navigation where the selected destination opens into a labelled action without changing the rail footprint.",
    tags: ["mobile", "bottom-nav", "selection"], interactions: ["selection", "keyboard", "focus", "morph"], builtOn: ["flex reflow", "active label"],
    usage: `<ExpandableBottomNavigation items={items} fixed />`,
    primaryProp: { name: "items", type: "NavigationLink[]", description: "Three to five mobile destinations with optional icons." }, quietProps: { fixed: false },
    accessibility: ["Current destination uses aria-current and every item remains a labelled anchor.", "The selected label is supplemental; icon or text labels remain available to assistive technology."],
    reducedMotion: "The selected label appears without width animation while current state remains explicit.",
    performance: ["Only the selected label changes width.", "The fixed mode uses one bounded safe-area-aware surface rather than a full-screen layer."],
    whenToUse: ["Mobile primary navigation with three to five destinations"], whenNotToUse: ["Desktop information architecture or more than five peer destinations"], related: ["floating-dock", "edge-rail-navigation"],
  }),
  entry({
    component: "CompressingScrollNavigation", family: "navigation", slug: "compressing-scroll-navigation", name: "Compressing Scroll Navigation",
    description: "A header that reduces its vertical footprint after deliberate scroll while remaining present and readable.",
    tags: ["scroll", "header", "responsive"], interactions: ["scroll", "selection", "keyboard", "focus"], builtOn: ["rAF scroll source", "hysteresis"],
    usage: `<CompressingScrollNavigation items={items} compactAfter={96} />`,
    primaryProp: { name: "items", type: "NavigationLink[]", description: "Header destinations that remain available in both heights." }, quietProps: { compactAfter: 160 },
    accessibility: ["The header and destination nav remain present in DOM order at both sizes.", "The compact state never removes the only labels or keyboard targets."],
    reducedMotion: "Height and scale switch immediately, with the full navigation still available after compression.",
    performance: ["Scroll work is coalesced through requestAnimationFrame and uses hysteresis to avoid thrashing.", "Listeners are removed on unmount and controlled mode avoids an unnecessary scroll subscription."],
    whenToUse: ["Long pages where a persistent header should give reading space back"], whenNotToUse: ["Short pages or headers whose full height carries essential context"], related: ["floating-island-nav", "section-aware-navigation"],
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
