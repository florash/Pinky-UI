"use client";

import {
  BorderTravel,
  BlurReveal,
  ContentSwapMotion,
  CursorSpotlight,
  DepthShift,
  EdgeHighlight,
  HoverImagePreview,
  HoverImagePreviewItem,
  HoverTextReveal,
  KineticUnderline,
  LiquidLoader,
  MaskReveal,
  SpringReveal,
  SplitTextReveal,
  SurfaceCompression,
  StaggerReveal,
  TextScramble,
} from "@pinky/effects";
import {
  BlurRouteTransition,
  BubbleField,
  BubbleTransition,
  ClipRevealMenu,
  CompressingScrollNavigation,
  DepthHero,
  EdgeRailNavigation,
  EditorialIndexNavigation,
  ExpandableBottomNavigation,
  FloatingIslandNav,
  HoverExpandNavigation,
  InteractiveGradient,
  LayeredNavigationMenu,
  LiquidNavbar,
  LiquidWipeTransition,
  MagneticCtaHero,
  MorphingMegaNavigation,
  MorphMenu,
  NeighborShiftNavigation,
  SectionAwareNavigation,
  SlidingMegaPanel,
  SoftMeshBackground,
  SpotlightMegaMenu,
  SpotlightGrid,
  type NavigationGroup,
  type NavigationLink,
} from "@pinky/experiences";
import {
  ActionUndoBar,
  AnimatedNumber,
  AsyncButton,
  BeforeAfter,
  CircularProgressMorph,
  CommandPalette,
  ComparisonBars,
  DataLens,
  DragGhost,
  DragReorderGrid,
  DropIndicator,
  EdgeSwipePanel,
  ElasticSegmentedControl,
  ExpandableListRow,
  ExpandableMedia,
  FloatingMediaPlayer,
  HoldToConfirm,
  InlineEditMorph,
  InlineFeedback,
  InteractiveSparkline,
  LongPressAction,
  MorphLightbox,
  MorphSearch,
  MorphSelect,
  MultiStepProgress,
  ProgressiveDisclosure,
  PullToRefresh,
  RadialMeter,
  ReorderableList,
  RowSpotlight,
  SearchResultsMorph,
  ShimmerSurface,
  SkeletonMorph,
  SmartDropzone,
  SortableChips,
  StatusPill,
  Stepper,
  StickyDataHeader,
  SwipeActionRow,
  SwipeableTabs,
  TactileRange,
  TimelineScrubber,
  ToastProvider,
  useToast,
} from "@pinky/systems";
import { useState, type ReactNode } from "react";

import { COMPONENT_PREVIEWS } from "./component-previews";
import { LAYOUT_PREVIEWS } from "./layout-previews";
import { MODERN_LAYOUT_PREVIEWS } from "./modern-layout-previews";
import { SOFT_MEDIA_SOURCES, SoftSurface } from "./soft-surface";
import { PRODUCT_EXPANSION_PREVIEWS, WORKFLOW_EXPANSION_PREVIEWS } from "./product-expansion-previews";
import { COLLECTION_PREVIEWS } from "./collection-previews";
import { FORM_PREVIEWS } from "./forms-previews";

const SURFACE = "linear-gradient(150deg, var(--color-blush-100), var(--color-blush-200) 55%, var(--color-cloud-100))";

const chip = "rounded-xl bg-cloud-100 px-3 py-2 text-xs text-ink-700";

/**
 * Compact, card-sized previews for the effects family.
 *
 * Only the effects that can honestly show themselves inside a small static card
 * appear here. A viewport-level cursor layer or a scroll-driven story cannot,
 * and a fake stand-in would be worse than no preview — those keep the text card
 * and link out to the page where they can actually run.
 */
const EFFECT_PREVIEWS: Record<string, ReactNode> = {
  "cursor-spotlight": (
    <CursorSpotlight mode="container" radius={180} intensity={0.35} className="h-full w-full rounded-xl">
      <div className="grid h-full place-items-center rounded-xl bg-cloud-50 text-sm text-ink-700">
        Move across this panel
      </div>
    </CursorSpotlight>
  ),
  "hover-image-preview": (
    <HoverImagePreview className="w-full space-y-1">
      {["Case study 01", "Case study 02"].map((label, index) => (
        <HoverImagePreviewItem key={label} src={SOFT_MEDIA_SOURCES[index]!} as="div">
          <span className="block rounded-lg px-3 py-2 text-sm text-ink-700 hover:bg-blush-50">{label}</span>
        </HoverImagePreviewItem>
      ))}
    </HoverImagePreview>
  ),
  "lens-cursor": (
    <span aria-hidden className="block h-28 w-full overflow-hidden rounded-xl" style={{ backgroundImage: SURFACE }} />
  ),
  "blur-reveal": (
    <BlurReveal once={false}>
      <span className={chip}>Sharp content, soft arrival</span>
    </BlurReveal>
  ),
  "spring-reveal": (
    <SpringReveal direction="up" once={false}>
      <span className={chip}>A small physical settle</span>
    </SpringReveal>
  ),
  "mask-reveal": (
    <MaskReveal direction="up" once={false} trigger="hover">
      <button type="button" className={chip + " focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/20"}>A directional clip</button>
    </MaskReveal>
  ),
  "edge-highlight": (
    <EdgeHighlight className="rounded-xl bg-white p-4 ring-1 ring-line">
      <button type="button" className="w-full rounded-lg bg-cloud-50 px-3 py-4 text-left text-sm text-ink-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/20">
        Move toward an edge
      </button>
    </EdgeHighlight>
  ),
  "surface-compression": (
    <SurfaceCompression className="rounded-xl">
      <button type="button" className="w-full rounded-xl bg-ink-900 px-4 py-3 text-sm text-milk focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/20">
        Press the surface
      </button>
    </SurfaceCompression>
  ),
  "depth-shift": (
    <DepthShift className="min-h-28 rounded-xl bg-cloud-100 p-4" background={<span className="absolute inset-3 rounded-xl bg-blush-200/60" />} secondary={<span className="absolute inset-5 rounded-xl border border-white/80 bg-white/60" />}>
      <button type="button" className="relative block w-full rounded-xl bg-white p-4 text-left text-sm font-medium shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/20">Move across the planes</button>
    </DepthShift>
  ),
  "border-travel": (
    <BorderTravel className="rounded-xl bg-white p-4 ring-1 ring-line">
      <button type="button" className="block w-full rounded-lg bg-cloud-50 px-3 py-4 text-left text-sm text-ink-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/20">A short segment follows you</button>
    </BorderTravel>
  ),
  "content-swap-motion": <ContentSwapPreview />,
  "stagger-reveal": (
    <StaggerReveal className="flex flex-col gap-2">
      <span className={chip}>One considered step</span>
      <span className={chip}>Then a second</span>
      <span className={chip}>Then the whole shape</span>
    </StaggerReveal>
  ),
  "image-reveal": <span aria-hidden className="block h-28 w-full rounded-xl" style={{ backgroundImage: SURFACE }} />,
  "liquid-loader": (
    <div className="flex items-center gap-4">
      <LiquidLoader label="Saving" />
      <LiquidLoader label="Uploading" variant="pill" progress={0.62} />
    </div>
  ),
  "split-text-reveal": (
    <SplitTextReveal by="word" className="block text-center text-xl leading-snug">
      Stable words, moving in.
    </SplitTextReveal>
  ),
  "word-stagger": (
    <SplitTextReveal by="word" className="block text-center text-xl leading-snug">
      A word at a time.
    </SplitTextReveal>
  ),
  "character-stagger": (
    <SplitTextReveal by="character" className="block text-center text-xl leading-snug">
      Short titles only.
    </SplitTextReveal>
  ),
  "hover-text-reveal": <HoverTextReveal text="View project" hoverText="Open project →" className="text-xl" />,
  "text-scramble": (
    <p className="text-xl">
      <TextScramble text="Decode" trigger="hover" />
    </p>
  ),
  "kinetic-underline": <KineticUnderline className="text-xl">Read the note →</KineticUnderline>,
};

const EXPERIENCE_ITEMS = [
  { id: "studio", label: "Studio", href: "#studio", description: "A calm starting point" },
  { id: "work", label: "Work", href: "#work", description: "Selected interactions" },
  { id: "notes", label: "Notes", href: "#notes", description: "Writing and process" },
] satisfies NavigationLink[];

const NAVIGATION_ITEMS = [
  { id: "overview", label: "Overview", href: "#overview", description: "See the whole system", meta: "01" },
  { id: "collections", label: "Collections", href: "#collections", description: "Browse considered groups", meta: "02" },
  { id: "notes", label: "Notes", href: "#notes", description: "Read the reasoning", meta: "03" },
  { id: "about", label: "About", href: "#about", description: "Understand the point of view", meta: "04" },
] satisfies NavigationLink[];

const NAVIGATION_GROUPS = [
  {
    id: "components",
    label: "Components",
    meta: "01 / direct",
    description: "Small surfaces with a clear physical response.",
    links: [
      { id: "buttons", label: "Tactile buttons", href: "#buttons" },
      { id: "menus", label: "Menu triggers", href: "#menus" },
    ],
    preview: <span className="font-display text-lg font-semibold text-ink-900">Press, pull, settle.</span>,
  },
  {
    id: "layouts",
    label: "Layouts",
    meta: "02 / rhythm",
    description: "Compositions where geometry carries the relationship between items.",
    links: [
      { id: "editorial", label: "Editorial collections", href: "#editorial" },
      { id: "spatial", label: "Spatial surfaces", href: "#spatial" },
    ],
    preview: <span className="font-display text-lg font-semibold text-ink-900">Let the collection breathe.</span>,
  },
  {
    id: "systems",
    label: "Systems",
    meta: "03 / product",
    description: "Useful states for real product surfaces, forms and data.",
    links: [
      { id: "forms", label: "Forms", href: "#forms" },
      { id: "data", label: "Data views", href: "#data" },
    ],
    preview: <span className="font-display text-lg font-semibold text-ink-900">Read the state, then act.</span>,
  },
] satisfies NavigationGroup[];

const SECTION_AWARE_PREVIEW_SECTIONS = [
  { id: "preview-nav-intro", label: "Intro", href: "#preview-nav-intro" },
  { id: "preview-nav-material", label: "Material", href: "#preview-nav-material" },
  { id: "preview-nav-release", label: "Release", href: "#preview-nav-release" },
] satisfies NavigationLink[];

const DATA_POINTS = [
  { label: "Mon", value: 12 },
  { label: "Tue", value: 15 },
  { label: "Wed", value: 14 },
  { label: "Thu", value: 19 },
  { label: "Fri", value: 23 },
  { label: "Sat", value: 21 },
  { label: "Sun", value: 26 },
];

const SEARCH_ITEMS = [
  { id: "research", label: "Research interaction" },
  { id: "keyboard", label: "Test keyboard path" },
];

/**
 * Bounded experience compositions that remain truthful at card scale.
 *
 * Cursor-preview navigation needs real media, Morphing Hero needs a scroll
 * story, and shared-element navigation needs a destination. Those stay on the
 * family wall. The entries below use the real experience components in a
 * local, inspectable surface instead of drawing a miniature imitation.
 */
const EXPERIENCE_PREVIEWS: Record<string, ReactNode> = {
  "liquid-navbar": <LiquidNavbarPreview />,
  "hover-expand-navigation": <HoverExpandNavigation items={NAVIGATION_ITEMS} aria-label="Expanded preview navigation" />,
  "neighbor-shift-navigation": <NeighborShiftNavigation items={NAVIGATION_ITEMS} aria-label="Neighbor shift preview" />,
  "editorial-index-navigation": <EditorialIndexNavigation items={NAVIGATION_ITEMS} aria-label="Editorial preview index" />,
  "morphing-mega-navigation": <MorphingMegaNavigation groups={NAVIGATION_GROUPS} aria-label="Morphing preview navigation" />,
  "spotlight-mega-menu": <SpotlightMegaMenu groups={NAVIGATION_GROUPS} aria-label="Spotlight preview menu" />,
  "sliding-mega-panel": <SlidingMegaPanel groups={NAVIGATION_GROUPS} aria-label="Sliding preview panel" />,
  "layered-navigation-menu": <LayeredNavigationMenu groups={NAVIGATION_GROUPS} aria-label="Layered preview menu" />,
  "clip-reveal-menu": <ClipRevealMenu items={NAVIGATION_ITEMS} aria-label="Clip preview menu" />,
  "edge-rail-navigation": <EdgeRailNavigation items={NAVIGATION_ITEMS} aria-label="Edge preview rail" />,
  "section-aware-navigation": <SectionAwarePreview />,
  "expandable-bottom-navigation": <ExpandableBottomNavigation items={NAVIGATION_ITEMS.slice(0, 4)} aria-label="Expandable preview navigation" />,
  "compressing-scroll-navigation": <CompressingScrollPreview />,
  "morph-menu": (
    <MorphMenu
      trigger="Index"
      label="Preview navigation"
      maxWidth={420}
      items={EXPERIENCE_ITEMS.map((item) => ({
        ...item,
        href: `#${item.id}`,
        description: `Explore ${item.label.toLowerCase()}`,
      }))}
    />
  ),
  "floating-island-nav": (
    <FloatingIslandNav
      fixed={false}
      proximity={false}
      items={EXPERIENCE_ITEMS}
      defaultActiveId="work"
      aria-label="Preview sections"
    />
  ),
  "depth-hero": (
    <DepthHero
      className="min-h-36 w-full rounded-2xl bg-cloud-50 p-4"
      eyebrow={<span className="font-mono text-[0.6rem] tracking-[0.14em] text-ink-500 uppercase">Quiet systems</span>}
      title={<span className="mt-2 block text-2xl leading-tight">Depth without the camera trick.</span>}
      description={<span className="mt-2 block max-w-[15rem] text-xs leading-relaxed text-ink-700">Move nearby to feel the layers separate.</span>}
      artwork={<span className="absolute top-4 right-4 size-20 rounded-full bg-blush-200/70 blur-xl" />}
      foreground={<span className="absolute right-5 bottom-4 h-10 w-16 rotate-3 rounded-xl border border-white/70 bg-white/70" />}
    />
  ),
  "magnetic-cta-hero": (
    <MagneticCtaHero
      className="w-full rounded-2xl bg-blush-50 p-4"
      eyebrow={<span className="font-mono text-[0.6rem] tracking-[0.14em] text-ink-500 uppercase">Pinky workshop</span>}
      title={<span className="mt-2 block text-2xl leading-tight">Motion people can trust.</span>}
      primaryAction={{ label: "Read guide", href: "/skills/patterns/experience-composition" }}
      spotlight
    />
  ),
  "soft-mesh-background": (
    <SoftMeshBackground disabled className="min-h-32 w-full rounded-2xl bg-cloud-50 p-4">
      <ExperienceCopy label="Ambient, not dominant" />
    </SoftMeshBackground>
  ),
  "interactive-gradient": (
    <InteractiveGradient className="min-h-32 w-full rounded-2xl" radius={220} intensity={0.18}>
      <ExperienceCopy label="A local field" />
    </InteractiveGradient>
  ),
  "bubble-field": (
    <BubbleField disabled count={5} className="min-h-32 w-full rounded-2xl bg-cloud-50 p-4">
      <ExperienceCopy label="Capped soft orbs" />
    </BubbleField>
  ),
  "spotlight-grid": (
    <SpotlightGrid className="min-h-32 w-full rounded-2xl bg-white p-4" size={22} radius={220} intensity={0.2}>
      <ExperienceCopy label="Structure under light" />
    </SpotlightGrid>
  ),
  "bubble-transition": <TransitionPreview kind="bubble" />,
  "liquid-wipe-transition": <TransitionPreview kind="wipe" />,
  "blur-route-transition": <TransitionPreview kind="blur" />,
};

/** Product systems that can show their real state without requiring host media. */
const PRODUCT_PREVIEWS: Record<string, ReactNode> = {
  "morph-lightbox": (
    <MorphLightbox
      label="Preview media gallery"
      className="w-full grid-cols-3 gap-2"
      itemClassName="rounded-xl"
      items={[0, 1, 2].map((index) => ({
        id: `preview-media-${index}`,
        label: `Study ${index + 1}`,
        thumbnail: <SoftSurface index={index} className="h-24 w-full" />,
        media: <SoftSurface index={index} className="h-56 w-full" />,
        caption: "A supplied media surface.",
      }))}
    />
  ),
  "before-after": (
    <BeforeAfter
      className="h-28 w-full rounded-xl"
      before={<ComparisonSurface index={1} label="Before" />}
      after={<ComparisonSurface index={3} label="After" />}
    />
  ),
  "expandable-media": (
    <ExpandableMedia
      label="Expand the study"
      preview={<ComparisonSurface index={0} label="Inline study" />}
      expanded={<ComparisonSurface index={0} label="Expanded study" className="min-h-72" />}
      caption="The same surface can be inspected at a larger scale."
    />
  ),
  "floating-media-player": <FloatingPlayerPreview />,
  "elastic-segmented-control": (
    <ElasticSegmentedControl
      label="Preview format"
      items={[{ value: "quiet", label: "Quiet" }, { value: "soft", label: "Soft" }, { value: "bold", label: "Bold" }]}
    />
  ),
  "morph-select": (
    <MorphSelect
      label="Export quality"
      defaultValue="web"
      options={[{ value: "draft", label: "Draft · fast" }, { value: "web", label: "Web · balanced" }, { value: "archive", label: "Archive · lossless" }]}
    />
  ),
  "tactile-range": <TactileRange label="Intensity" defaultValue={58} formatValue={(value) => `${value}%`} />,
  "smart-dropzone": <SmartDropzone label="Choose a file" description="Local validation only" accept="image/*" />,
  "hold-to-confirm": <HoldToConfirm duration={850} onConfirm={() => undefined}>Hold to confirm</HoldToConfirm>,
  "inline-edit-morph": <InlineEditMorph label="Display name" defaultValue="Flora" />,
  "animated-number": <AnimatedNumberPreview />,
  "interactive-sparkline": (
    <InteractiveSparkline
      data={DATA_POINTS}
      label="Weekly views"
      summary="Seven points, rising overall."
      formatValue={(value) => `${value}k`}
      className="w-full"
    />
  ),
  "data-lens": (
    <DataLens
      items={DATA_POINTS}
      label="Inspect weekly views"
      renderLens={(item) => <span>{item.label}: {item.value}k</span>}
      className="h-28 w-full overflow-hidden rounded-xl bg-cloud-50"
    >
      <div className="flex h-full items-end gap-1.5 p-4">
        {DATA_POINTS.map((item) => <span key={item.label} className="flex-1 rounded-t-lg bg-blush-200" style={{ height: `${item.value * 3}%` }} />)}
      </div>
    </DataLens>
  ),
  "timeline-scrubber": (
    <TimelineScrubber
      label="Release timeline"
      stops={[{ id: "research", label: "Research" }, { id: "test", label: "Test" }, { id: "ship", label: "Ship" }]}
      className="w-full"
    />
  ),
  "radial-meter": <RadialMeter value={67} label="Completion" segments={4} size={92} />,
  "comparison-bars": (
    <ComparisonBars
      label="Plan comparison"
      items={[{ id: "current", label: "Current", value: 67 }, { id: "target", label: "Target", value: 84, color: "var(--color-cloud-300)" }]}
      formatValue={(value) => `${value}%`}
      className="w-full"
    />
  ),
};

const WORKFLOW_PREVIEWS: Record<string, ReactNode> = {
  "morph-toast": (
    <ToastProvider>
      <ToastTriggerPreview />
    </ToastProvider>
  ),
  "status-pill": (
    <div className="flex flex-wrap justify-center gap-2">
      <StatusPill label="Working" state="working" progress={42} />
      <StatusPill label="Ready" state="success" />
    </div>
  ),
  "inline-feedback": <InlineFeedback tone="success">Saved locally</InlineFeedback>,
  "action-undo-bar": <ActionUndoBar message="Task archived" onUndo={() => undefined} />,
  "morph-search": (
    <MorphSearch
      placeholder="Search tasks"
      results={<SearchResultsMorph items={SEARCH_ITEMS} renderItem={(item) => <div className="rounded-xl bg-cloud-50 p-3 text-sm">{item.label}</div>} />}
    />
  ),
  "command-palette": <CommandPalettePreview />,
  "search-results-morph": (
    <SearchResultsMorph
      items={SEARCH_ITEMS}
      renderItem={(item) => <div className="rounded-xl bg-cloud-50 px-3 py-2 text-sm">{item.label}</div>}
    />
  ),
  "skeleton-morph": <SkeletonPreview />,
  "shimmer-surface": (
    <div className="grid w-full gap-2">
      <ShimmerSurface className="h-3 w-2/3 rounded" />
      <ShimmerSurface className="h-3 w-full rounded" />
      <ShimmerSurface className="h-16 w-full rounded-xl" />
    </div>
  ),
  "multi-step-progress": <MultiStepProgress steps={[{ id: "one", label: "Plan", state: "completed" }, { id: "two", label: "Build", state: "current" }, { id: "three", label: "Ship", state: "upcoming" }]} />,
  "circular-progress-morph": (
    <div className="flex items-center justify-center gap-3">
      <CircularProgressMorph value={68} label="Upload progress" size={58} />
      <CircularProgressMorph state="success" label="Upload complete" size={58} />
    </div>
  ),
  "async-button": <AsyncButton onAction={() => new Promise((resolve) => window.setTimeout(resolve, 320))}>Save</AsyncButton>,
  "reorderable-list": <ReorderableListPreview />,
  "expandable-list-row": (
    <ExpandableListRow summary={<span className="text-sm font-medium">Invoice · #1042</span>}>
      <p className="text-xs text-ink-700">Due Friday · design review attached.</p>
    </ExpandableListRow>
  ),
  "swipe-action-row": (
    <SwipeActionRow actions={[{ label: "Archive", onAction: () => undefined }]}>
      <span className="text-sm">Team notes · updated 4m ago</span>
    </SwipeActionRow>
  ),
  "sticky-data-header": (
    <div className="h-28 w-full overflow-auto rounded-xl border border-line">
      <StickyDataHeader><div className="grid grid-cols-3 text-[0.65rem] font-semibold"><span>Project</span><span>Owner</span><span>Status</span></div></StickyDataHeader>
      {["Pinky UI", "Docs", "Skills"].map((name) => <div key={name} className="grid grid-cols-3 border-b border-line p-2 text-xs"><span>{name}</span><span>Flora</span><span>Ready</span></div>)}
    </div>
  ),
  "row-spotlight": (
    <div className="w-full space-y-1">
      <RowSpotlight><div className="grid grid-cols-3 text-xs"><span>Starter</span><span>$12</span><span>Good</span></div></RowSpotlight>
      <RowSpotlight><div className="grid grid-cols-3 text-xs"><span>Studio</span><span>$24</span><span>Best fit</span></div></RowSpotlight>
    </div>
  ),
  "drag-reorder-grid": <DragReorderPreview />,
  "drop-indicator": (
    <div className="w-full space-y-2">
      <div className="rounded-xl bg-cloud-50 p-3 text-sm">Task A</div>
      <DropIndicator position="between" label="Insert here" />
      <div className="rounded-xl bg-cloud-50 p-3 text-sm">Task B</div>
    </div>
  ),
  "drag-ghost": (
    <DragGhost>
      <div className="rounded-xl border border-line bg-white px-4 py-3 text-sm">Dragging preview</div>
    </DragGhost>
  ),
  "sortable-chips": <SortableChipsPreview />,
  "stepper": <Stepper steps={[{ id: "one", label: "Plan" }, { id: "two", label: "Build" }, { id: "three", label: "Review" }]} active={1} allowNavigation />,
  "progressive-disclosure": (
    <ProgressiveDisclosure label="Show advanced">
      <p className="mt-2 rounded-xl bg-cloud-50 p-3 text-xs text-ink-700">Cache duration · 30 days</p>
    </ProgressiveDisclosure>
  ),
  "swipeable-tabs": (
    <SwipeableTabs
      tabs={[{ id: "activity", label: "Activity", panel: <p className="text-sm text-ink-700">Three updates this week.</p> }, { id: "files", label: "Files", panel: <p className="text-sm text-ink-700">Eight shared files.</p> }]}
    />
  ),
  "pull-to-refresh": (
    <PullToRefresh onRefresh={() => undefined} actionLabel="Refresh" className="h-36 w-full overflow-auto rounded-xl border border-line">
      <div className="space-y-2 p-3">
        <p className="text-sm">Pull from the top.</p>
        <p className="text-xs text-ink-500">Resistance, armed threshold and an honest callback.</p>
      </div>
    </PullToRefresh>
  ),
  "edge-swipe-panel": (
    <EdgeSwipePanel label="Quick filters">
      <div className="space-y-2">
        <label className="flex items-center gap-2 rounded-xl bg-cloud-50 p-3 text-xs"><input type="checkbox" />Only ready items</label>
        <label className="flex items-center gap-2 rounded-xl bg-cloud-50 p-3 text-xs"><input type="checkbox" />Assigned to me</label>
      </div>
    </EdgeSwipePanel>
  ),
  "long-press-action": (
    <LongPressPreview />
  ),
};

function ExperienceCopy({ label }: { label: string }) {
  return (
    <div className="relative z-10 max-w-[13rem]">
      <p className="font-mono text-[0.6rem] tracking-[0.14em] text-ink-500 uppercase">{label}</p>
      <p className="mt-2 text-lg leading-tight">The content keeps the loudest voice.</p>
    </div>
  );
}

function ComparisonSurface({ index, label, className = "" }: { index: number; label: string; className?: string }) {
  return (
    <div className={`relative grid size-full min-h-28 place-items-center overflow-hidden ${className}`}>
      <SoftSurface index={index} className="absolute inset-0 size-full" />
      <span className="relative rounded-pill bg-white/75 px-3 py-1 font-mono text-[0.6rem] tracking-[0.1em] text-ink-700 uppercase">{label}</span>
    </div>
  );
}

function LiquidNavbarPreview() {
  const [active, setActive] = useState("work");
  return <LiquidNavbar items={EXPERIENCE_ITEMS} activeId={active} onActiveChange={setActive} aria-label="Preview sections" />;
}

function SectionAwarePreview() {
  return (
    <div className="w-full space-y-3">
      <SectionAwareNavigation sections={SECTION_AWARE_PREVIEW_SECTIONS} aria-label="Preview reading sections" />
      <div className="max-h-36 space-y-2 overflow-auto rounded-xl border border-line bg-white p-3">
        {SECTION_AWARE_PREVIEW_SECTIONS.map((section, index) => (
          <section key={section.id} id={section.id} className="min-h-20 rounded-lg bg-cloud-50 p-3">
            <p className="font-mono text-[0.6rem] tracking-[0.14em] text-ink-500 uppercase">0{index + 1}</p>
            <h3 className="mt-1 text-sm font-semibold text-ink-900">{section.label} leads the reading window.</h3>
          </section>
        ))}
      </div>
    </div>
  );
}

function CompressingScrollPreview() {
  const [compressed, setCompressed] = useState(false);
  return (
    <div className="w-full space-y-2">
      <CompressingScrollNavigation items={NAVIGATION_ITEMS.slice(0, 3)} compressed={compressed} title="Pinky / browse" aria-label="Preview scroll navigation" />
      <button type="button" onClick={() => setCompressed((value) => !value)} className="rounded-pill border border-line bg-white px-3 py-1.5 text-xs text-ink-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/20">
        {compressed ? "Restore header" : "Compress header"}
      </button>
    </div>
  );
}

function TransitionPreview({ kind }: { kind: "bubble" | "wipe" | "blur" }) {
  const [view, setView] = useState(0);
  const content = (
    <div className="relative min-h-24 overflow-hidden rounded-xl">
      <SoftSurface index={view} className="absolute inset-0 size-full" />
      <span className="relative block p-4 text-sm font-medium">Chapter {view + 1}</span>
    </div>
  );
  const transition = kind === "bubble"
    ? <BubbleTransition transitionKey={view} className="w-full">{content}</BubbleTransition>
    : kind === "wipe"
      ? <LiquidWipeTransition transitionKey={view} className="w-full">{content}</LiquidWipeTransition>
      : <BlurRouteTransition transitionKey={view} className="w-full">{content}</BlurRouteTransition>;
  return (
    <div className="w-full space-y-2">
      {transition}
      <button type="button" onClick={() => setView((value) => (value + 1) % 4)} className="rounded-pill border border-line bg-white px-3 py-1.5 text-xs">Next view</button>
    </div>
  );
}

function FloatingPlayerPreview() {
  const [mode, setMode] = useState<"inline" | "floating" | "closed">("inline");
  if (mode === "closed") return <button type="button" onClick={() => setMode("inline")} className="rounded-pill border border-line px-3 py-2 text-sm">Reopen player</button>;
  return (
    <FloatingMediaPlayer label="Lesson 01" mode={mode} onModeChange={setMode}>
      <div className="grid h-20 place-items-center bg-cloud-100 text-ink-700">Host media surface</div>
    </FloatingMediaPlayer>
  );
}

function AnimatedNumberPreview() {
  const [value, setValue] = useState(1249);
  return (
    <div className="flex items-center gap-3">
      <span className="font-display text-3xl font-semibold"><AnimatedNumber value={value} prefix="$" locale="en-US" /></span>
      <button type="button" onClick={() => setValue((current) => current === 1249 ? 1503 : 1249)} className="rounded-pill border border-line px-3 py-1.5 text-xs">Update</button>
    </div>
  );
}

function ToastTriggerPreview() {
  // The provider owns the capped stack and live region; this button only
  // supplies a truthful local action for a compact card.
  const { toast } = useToast();
  return <button type="button" onClick={() => toast({ title: "File saved", description: "The local action completed.", tone: "success" })} className="rounded-pill bg-ink-900 px-4 py-2 text-sm text-milk">Save project</button>;
}

function CommandPalettePreview() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="rounded-pill bg-ink-900 px-4 py-2 text-sm text-milk">Open commands</button>
      <CommandPalette open={open} onOpenChange={setOpen} items={[{ id: "new", label: "New document", group: "Create", onSelect: () => setOpen(false) }, { id: "settings", label: "Open settings", group: "Navigate", onSelect: () => setOpen(false) }]} />
    </>
  );
}

function SkeletonPreview() {
  const [loading, setLoading] = useState(true);
  return (
    <div className="w-full">
      <SkeletonMorph loading={loading} skeleton={<div className="grid gap-2"><ShimmerSurface className="h-3 w-2/3 rounded" /><ShimmerSurface className="h-14 rounded-xl" /></div>}>
        <div className="rounded-xl bg-cloud-50 p-3 text-sm">Project brief is ready.</div>
      </SkeletonMorph>
      <button type="button" onClick={() => setLoading((value) => !value)} className="mt-2 text-xs text-ink-500 underline">{loading ? "Show content" : "Show loading"}</button>
    </div>
  );
}

function ReorderableListPreview() {
  const [items, setItems] = useState([
    { id: "one", label: "Research" },
    { id: "two", label: "Prototype" },
    { id: "three", label: "Release" },
  ]);
  return <ReorderableList items={items} onReorder={setItems} renderItem={(item) => <span className="text-sm">{item.label}</span>} label="Preview tasks" />;
}

function DragReorderPreview() {
  const [items, setItems] = useState([
    { id: "one", label: "Pulse" },
    { id: "two", label: "Inbox" },
    { id: "three", label: "Notes" },
    { id: "four", label: "Health" },
  ]);
  return <DragReorderGrid items={items} onReorder={setItems} columns={2} label="Preview widgets" renderItem={(item) => <span className="text-xs">{item.label}</span>} />;
}

function SortableChipsPreview() {
  const [items, setItems] = useState([
    { id: "motion", label: "Motion" },
    { id: "a11y", label: "A11y" },
    { id: "depth", label: "Depth" },
  ]);
  return <SortableChips items={items} onReorder={setItems} label="Preview tags" />;
}

function LongPressPreview() {
  const [selected, setSelected] = useState(false);
  return (
    <div className="w-full">
      <LongPressAction onLongPress={() => setSelected(true)} onClick={() => setSelected((value) => !value)} className="w-full rounded-xl border border-line bg-white p-3 text-left text-sm">
        Hold or activate this task
      </LongPressAction>
      <span aria-live="polite" className="mt-2 block text-xs text-ink-500">{selected ? "Selected" : "Idle"}</span>
    </div>
  );
}

function ContentSwapPreview() {
  const [chapter, setChapter] = useState(0);
  const chapters = ["Arrival", "Material", "Release"];
  return (
    <div className="w-full space-y-2">
      <ContentSwapMotion value={chapter} direction={chapter === 0 ? "forward" : "backward"} className="min-h-16 rounded-xl bg-cloud-50 p-3">
        <div>
          <p className="font-mono text-[0.6rem] tracking-[0.14em] text-ink-500 uppercase">Chapter {chapter + 1}</p>
          <p className="mt-1 text-sm font-medium">{chapters[chapter]}</p>
        </div>
      </ContentSwapMotion>
      <button type="button" onClick={() => setChapter((value) => (value + 1) % chapters.length)} className="rounded-pill border border-line bg-white px-3 py-1.5 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/20">
        Swap content
      </button>
    </div>
  );
}

/**
 * Every slug that can render itself inline, from one place.
 *
 * Order matters only in that the maps do not overlap; each slug lives in
 * exactly one family map today.
 */
const ALL_PREVIEWS: Record<string, ReactNode> = {
  ...COMPONENT_PREVIEWS,
  ...LAYOUT_PREVIEWS,
  ...MODERN_LAYOUT_PREVIEWS,
  ...EFFECT_PREVIEWS,
  ...EXPERIENCE_PREVIEWS,
  ...PRODUCT_PREVIEWS,
  ...PRODUCT_EXPANSION_PREVIEWS,
  ...COLLECTION_PREVIEWS,
  ...FORM_PREVIEWS,
  ...WORKFLOW_PREVIEWS,
  ...WORKFLOW_EXPANSION_PREVIEWS,
};

export { hasExplorePreview } from "./preview-manifest";

/** Returns the live preview for a slug, or null when the item cannot show itself in a card. */
export function ExplorePreview({ slug }: { slug: string }) {
  const preview = ALL_PREVIEWS[slug];
  return preview ? <>{preview}</> : null;
}

/** Detail pages only mount a preview when the pattern has a real inline surface. */
export function ExploreDetailPreview({ slug }: { slug: string }) {
  const preview = ALL_PREVIEWS[slug];
  if (preview) return <>{preview}</>;
  return null;
}
