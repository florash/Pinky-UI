"use client";


import {
  BlurRouteTransition,
  BubbleField,
  BubbleTransition,
  ClipRevealMenu,
  CompressingScrollNavigation,
  CursorPreviewNav,
  DepthHero,
  EdgeRailNavigation,
  EditorialIndexNavigation,
  ExpandableBottomNavigation,
  FloatingIslandNav,
  FloatingWindowStack,
  HoverExpandNavigation,
  InteractiveGradient,
  LayeredNavigationMenu,
  LiquidNavbar,
  LiquidWipeTransition,
  MagneticCtaHero,
  MorphingMegaNavigation,
  MorphingHero,
  MorphMenu,
  NeighborShiftNavigation,
  OrbitMenu,
  PerspectiveGallery,
  SectionAwareNavigation,
  SharedElementTransition,
  SoftMeshBackground,
  SpatialCarousel,
  SlidingMegaPanel,
  SpotlightMegaMenu,
  SpotlightGrid,
  type NavigationGroup,
  type NavigationLink,
} from "@pinky-ui/experiences";
import { allExperiences, type ExperienceFamily } from "@pinky-ui/registry";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { LazyMount } from "@/components/site/lazy-mount";
import { RegistryCatalogue } from "@/components/site/registry-catalogue";

const FAMILY_LINKS: Array<{ family: ExperienceFamily; label: string; href: string }> = [
  { family: "navigation", label: "Navigation", href: "/navigation" },
  { family: "heroes", label: "Heroes", href: "/heroes" },
  { family: "backgrounds", label: "Backgrounds", href: "/backgrounds" },
  { family: "transitions", label: "Transitions", href: "/transitions" },
  // Kept as a secondary wall for existing routes; public Layouts → Spatial is
  // the canonical home for collection arrangements.
  { family: "spatial", label: "Spatial · experimental", href: "/spatial" },
];

/** Demo surfaces, not photography — the experience is the subject. */
const IMAGES = [
  "linear-gradient(150deg, var(--color-blush-100), var(--color-blush-200) 55%, var(--color-cloud-100))",
  "linear-gradient(160deg, var(--color-cloud-100), var(--color-cloud-200) 60%, var(--color-white))",
  "linear-gradient(140deg, var(--color-white), var(--color-blush-100) 48%, var(--color-cloud-200))",
  "linear-gradient(170deg, var(--color-blush-50), var(--color-cloud-100) 52%, var(--color-blush-200))",
] as const;

const NAVIGATION_EXPANSION_ITEMS = [
  { id: "overview", label: "Overview", href: "#overview", description: "See the whole system", meta: "01" },
  { id: "collections", label: "Collections", href: "#collections", description: "Browse considered groups", meta: "02" },
  { id: "notes", label: "Notes", href: "#notes", description: "Read the reasoning", meta: "03" },
  { id: "about", label: "About", href: "#about", description: "Understand the point of view", meta: "04" },
] satisfies NavigationLink[];

const NAVIGATION_EXPANSION_GROUPS = [
  {
    id: "components",
    label: "Components",
    meta: "01 / direct",
    description: "Small surfaces with a clear physical response.",
    links: [{ id: "buttons", label: "Tactile buttons", href: "#buttons" }, { id: "menus", label: "Menu triggers", href: "#menus" }],
    preview: <span className="font-display text-lg font-semibold text-ink-900">Press, pull, settle.</span>,
  },
  {
    id: "layouts",
    label: "Layouts",
    meta: "02 / rhythm",
    description: "Compositions where geometry carries the relationship between items.",
    links: [{ id: "editorial", label: "Editorial collections", href: "#editorial" }, { id: "spatial", label: "Spatial surfaces", href: "#spatial" }],
    preview: <span className="font-display text-lg font-semibold text-ink-900">Let the collection breathe.</span>,
  },
  {
    id: "systems",
    label: "Systems",
    meta: "03 / product",
    description: "Useful states for real product surfaces, forms and data.",
    links: [{ id: "forms", label: "Forms", href: "#forms" }, { id: "data", label: "Data views", href: "#data" }],
    preview: <span className="font-display text-lg font-semibold text-ink-900">Read the state, then act.</span>,
  },
] satisfies NavigationGroup[];

const NAVIGATION_READING_SECTIONS = [
  { id: "navigation-demo-intro", label: "Intro", href: "#navigation-demo-intro" },
  { id: "navigation-demo-material", label: "Material", href: "#navigation-demo-material" },
  { id: "navigation-demo-release", label: "Release", href: "#navigation-demo-release" },
] satisfies NavigationLink[];

function Surface({ image, className }: { image: string; className?: string }) {
  return <span aria-hidden className={className} style={{ backgroundImage: image, display: "block" }} />;
}

export function ExperiencesShowcase({ family = "all" }: { family?: ExperienceFamily | "all" }) {
  const visible = (candidate: ExperienceFamily) => family === "all" || family === candidate;
  const title = family === "all" ? "Experience-level UI" : FAMILY_LINKS.find((item) => item.family === family)?.label;
  const catalogueItems = family === "all" ? allExperiences : allExperiences.filter((item) => item.family === family);
  const catalogueLabel = family === "all" ? "experiences" : `${title ?? family} experiences`.toLowerCase();

  return (
    <div className="relative overflow-hidden pb-28">
      <SoftMeshBackground className="border-b border-line/70">
        <header className="mx-auto max-w-[76rem] px-5 py-20 sm:px-8 sm:py-28">
          <p className="font-mono text-[0.6875rem] tracking-[0.18em] text-ink-500 uppercase">
            {title}
          </p>
          <h1 className="mt-4 max-w-3xl text-section text-balance-tight">
            Shape the whole experience, quietly.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-700">
            Navigation, Heroes, ambient backgrounds, page transitions and spatial interfaces—built
            from Pinky&apos;s shared motion, pointer, scroll and morph systems.
          </p>
          <nav aria-label="Experience families" className="mt-9 flex flex-wrap gap-2">
            <Link href="/experiences" className={chip(family === "all")}>All</Link>
            {FAMILY_LINKS.map((item) => (
              <Link key={item.family} href={item.href} className={chip(family === item.family)}>
                {item.label}
              </Link>
            ))}
            <Link href="/effects" className={chip(false)}>2.6 Effects</Link>
            <a href="#browse-all" className={chip(false)}>Browse all {catalogueItems.length}</a>
          </nav>
        </header>
      </SoftMeshBackground>

      {visible("navigation") ? <NavigationSection /> : null}
      {visible("heroes") ? <HeroesSection /> : null}
      {visible("backgrounds") ? <BackgroundsSection /> : null}
      {visible("transitions") ? <TransitionsSection /> : null}
      {visible("spatial") ? <SpatialSection /> : null}
      <RegistryCatalogue id="browse-all" items={catalogueItems} hrefPrefix="/experiences" label={catalogueLabel} />
    </div>
  );
}

function NavigationSection() {
  const [active, setActive] = useState("work");
  const navItems = [
    { id: "studio", label: "Studio" },
    { id: "work", label: "Work" },
    { id: "notes", label: "Notes" },
    { id: "about", label: "About" },
  ];
  return (
    <ExperienceSection id="navigation" eyebrow="01 · Navigation" title="Wayfinding stays clear before it moves.">
      <div className="grid gap-6 lg:grid-cols-2">
        <DemoFrame id="liquid-navbar" label="Liquid Navbar" description="A real small landing-page navigation with a measured, spring active surface.">
          <div className="flex min-h-52 flex-col justify-between rounded-2xl bg-cloud-50 p-5">
            <div className="flex items-center justify-between gap-4">
              <span className="font-display font-semibold">Still / Form</span>
              <div id="morph-menu" className="scroll-mt-24">
                <MorphMenu
                  trigger="Index"
                  items={navItems.map((item) => ({ ...item, href: `#nav-${item.id}`, description: `Explore ${item.label.toLowerCase()}` }))}
                />
              </div>
            </div>
            <LiquidNavbar items={navItems} activeId={active} onActiveChange={setActive} aria-label="Still Form sections" />
          </div>
        </DemoFrame>

        <DemoFrame id="floating-island-nav" label="Floating Island Nav" description="The same selection language in a Pinky-specific elevated island.">
          <div className="grid min-h-52 place-items-center rounded-2xl bg-blush-50 p-5">
            <FloatingIslandNav
              fixed={false}
              items={navItems}
              activeId={active}
              onActiveChange={setActive}
              proximity
              aria-label="Portfolio sections"
            />
          </div>
        </DemoFrame>
      </div>

      <DemoFrame id="cursor-preview-nav" label="Cursor Preview Nav" description="Portfolio entries keep stable labels while useful media appears on hover or focus." className="mt-6">
        <CursorPreviewNav
          items={[
            { id: "house", label: "House of Quiet", href: "#house", image: IMAGES[0], description: "Identity · spatial design" },
            { id: "field", label: "Field Notes", href: "#field", image: IMAGES[1], description: "Editorial · digital archive" },
            { id: "room", label: "Room for Work", href: "#room", image: IMAGES[2], description: "Product · workplace" },
          ]}
        />
      </DemoFrame>

      <NavigationExpansionSection />
    </ExperienceSection>
  );
}

function NavigationExpansionSection() {
  return (
    <div className="mt-6 space-y-6">
      <div className="flex items-end justify-between gap-4 border-t border-line pt-8">
        <div>
          <Eyebrow>Navigation expansion · 12 canonical structures</Eyebrow>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-700">Each surface keeps its own relationship: reflow, layered context, anchored reveal, rail expansion or reading progress. The catalogue below is complete; the previews stay intentionally compact.</p>
        </div>
        <Link href="/skills/navigation/hover-expand-navigation" className="hidden shrink-0 text-sm text-ink-700 underline decoration-line-strong underline-offset-4 sm:block">Open a skill</Link>
      </div>

      <NavigationDemoGroup id="reflow-index" title="Reflow & index" description="Rows and reading indexes explain hierarchy by changing their own spacing.">
        <DemoFrame id="hover-expand-navigation" label="Hover Expand Navigation" description="The engaged destination opens enough room for context while its neighbours yield space.">
          <HoverExpandNavigation items={NAVIGATION_EXPANSION_ITEMS} aria-label="Hover expand navigation demo" />
        </DemoFrame>
        <DemoFrame id="neighbor-shift-navigation" label="Neighbor Shift Navigation" description="The active destination gains width inside one compact strip; the row does the explaining.">
          <NeighborShiftNavigation items={NAVIGATION_EXPANSION_ITEMS} aria-label="Neighbor shift navigation demo" />
        </DemoFrame>
        <DemoFrame id="editorial-index-navigation" label="Editorial Index Navigation" description="A numbered reading index uses typography and one traveling rule instead of a card wall.">
          <EditorialIndexNavigation items={NAVIGATION_EXPANSION_ITEMS} aria-label="Editorial index navigation demo" />
        </DemoFrame>
      </NavigationDemoGroup>

      <NavigationDemoGroup id="mega-menus" title="Mega menus" description="Contextual surfaces open beside their trigger while the parent destination stays understandable.">
        <DemoFrame id="morphing-mega-navigation" label="Morphing Mega Navigation" description="The header grows into its own contextual index, keeping the trigger and surface spatially related.">
          <MorphingMegaNavigation groups={NAVIGATION_EXPANSION_GROUPS} aria-label="Morphing mega navigation demo" />
        </DemoFrame>
        <DemoFrame id="spotlight-mega-menu" label="Spotlight Mega Menu" description="One group at a time owns a contextual preview, with the next destinations still visible.">
          <SpotlightMegaMenu groups={NAVIGATION_EXPANSION_GROUPS} aria-label="Spotlight mega menu demo" />
        </DemoFrame>
        <DemoFrame id="sliding-mega-panel" label="Sliding Mega Panel" description="The open frame remains stable while ordered groups change inside it.">
          <SlidingMegaPanel groups={NAVIGATION_EXPANSION_GROUPS} aria-label="Sliding mega panel demo" />
        </DemoFrame>
        <DemoFrame id="layered-navigation-menu" label="Layered Navigation Menu" description="The parent index stays behind a contextual layer instead of disappearing into a new page.">
          <LayeredNavigationMenu groups={NAVIGATION_EXPANSION_GROUPS} aria-label="Layered navigation menu demo" />
        </DemoFrame>
      </NavigationDemoGroup>

      <NavigationDemoGroup id="anchored-reveals" title="Anchored reveals" description="Compact destinations expand from a local edge without covering the page in a generic overlay.">
        <DemoFrame id="clip-reveal-menu" label="Clip Reveal Menu" description="A compact destination list reveals from its local trigger edge and closes cleanly.">
          <ClipRevealMenu items={NAVIGATION_EXPANSION_ITEMS} aria-label="Clip reveal menu demo" />
        </DemoFrame>
        <DemoFrame id="edge-rail-navigation" label="Edge Rail Navigation" description="A narrow rail gives labels room when approached or focused, without covering the page.">
          <div className="flex min-h-56 items-start rounded-2xl bg-cloud-50 p-4"><EdgeRailNavigation items={NAVIGATION_EXPANSION_ITEMS} aria-label="Edge rail navigation demo" /></div>
        </DemoFrame>
      </NavigationDemoGroup>

      <NavigationDemoGroup id="reading-state" title="Reading state" description="These structures respond to section visibility or scroll position while keeping destinations present.">
        <DemoFrame id="section-aware-navigation" label="Section-Aware Navigation" description="The local index follows the section entering the reading window instead of polling the whole page.">
          <SectionAwareNavigationDemo />
        </DemoFrame>
        <DemoFrame id="compressing-scroll-navigation" label="Compressing Scroll Navigation" description="The header gives reading space back after scroll but keeps its destinations present.">
          <CompressingScrollNavigationDemo />
        </DemoFrame>
      </NavigationDemoGroup>

      <NavigationDemoGroup id="mobile-navigation" title="Mobile navigation" description="A touch-first pattern that expands the selected destination without hiding the route." single>
        <DemoFrame id="expandable-bottom-navigation" label="Expandable Bottom Navigation" description="The selected mobile destination opens into a label while peers remain compact.">
          <div className="flex min-h-32 items-end justify-center rounded-2xl bg-cloud-50 p-4"><ExpandableBottomNavigation items={NAVIGATION_EXPANSION_ITEMS.slice(0, 4)} aria-label="Expandable bottom navigation demo" /></div>
        </DemoFrame>
      </NavigationDemoGroup>
    </div>
  );
}

function NavigationDemoGroup({
  id,
  title,
  description,
  single = false,
  children,
}: {
  id: string;
  title: string;
  description: string;
  single?: boolean;
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={`${id}-title`} className="space-y-4 border-t border-line pt-7 first:border-t-0 first:pt-0">
      <div className="max-w-2xl">
        <h3 id={`${id}-title`} className="font-display text-lg font-semibold tracking-tight text-ink-900">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-ink-600">{description}</p>
      </div>
      <div className={single ? "max-w-2xl" : "grid gap-6 lg:grid-cols-2"}>{children}</div>
    </section>
  );
}

function SectionAwareNavigationDemo() {
  return (
    <div className="space-y-3">
      <SectionAwareNavigation sections={NAVIGATION_READING_SECTIONS} aria-label="Section-aware navigation demo" />
      <div className="max-h-40 space-y-2 overflow-auto rounded-xl border border-line bg-white p-3">
        {NAVIGATION_READING_SECTIONS.map((section, index) => (
          <section key={section.id} id={section.id} className="min-h-24 rounded-lg bg-cloud-50 p-3">
            <Eyebrow>0{index + 1}</Eyebrow>
            <h3 className="mt-1 text-sm font-semibold">{section.label} leads the reading window.</h3>
          </section>
        ))}
      </div>
    </div>
  );
}

function CompressingScrollNavigationDemo() {
  const [compressed, setCompressed] = useState(false);
  return (
    <div className="space-y-3">
      <CompressingScrollNavigation items={NAVIGATION_EXPANSION_ITEMS.slice(0, 3)} compressed={compressed} title="Pinky / browse" aria-label="Compressing scroll navigation demo" />
      <button type="button" onClick={() => setCompressed((value) => !value)} className="rounded-pill border border-line bg-white px-3 py-1.5 text-xs text-ink-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/20">{compressed ? "Restore header" : "Compress header"}</button>
    </div>
  );
}

function HeroesSection() {
  return (
    <ExperienceSection id="heroes" eyebrow="02 · Heroes" title="One signature interaction is enough.">
      <DemoFrame id="morphing-hero" label="Morphing Hero" description="Scroll turns one large visual statement into a calmer persistent surface.">
        <MorphingHero
          height="115vh"
          eyebrow={<Eyebrow>Independent design practice</Eyebrow>}
          title={<span className="block max-w-3xl text-4xl leading-[1.04] sm:text-6xl">Spaces for slower, better work.</span>}
          description={<p className="mt-4 max-w-xl text-ink-700">A meaningful compression, with no pinned scroll takeover.</p>}
          actions={<a href="#depth-hero" className="mt-5 inline-flex rounded-pill bg-ink-900 px-5 py-3 text-sm text-milk">See the layers</a>}
          media={<Surface image={IMAGES[1]} className="h-[42vh] min-h-72 w-full" />}
          compactLabel={<span className="rounded-pill bg-white/85 px-3 py-1.5 text-xs shadow-soft">Studio 01</span>}
        />
      </DemoFrame>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <DemoFrame id="depth-hero" label="Depth Hero" description="A few pixels of separation between atmosphere, artwork and content.">
          <DepthHero
            className="min-h-[430px] rounded-2xl bg-cloud-50 p-7 sm:p-10"
            eyebrow={<Eyebrow>Quiet systems</Eyebrow>}
            title={<span className="mt-3 block max-w-md text-4xl leading-tight">Depth without the camera trick.</span>}
            description={<p className="mt-4 max-w-md text-ink-700">Four restrained layers, flattened for mobile and reduced motion.</p>}
            actions={<a href="#spatial" className="mt-6 inline-flex rounded-pill border border-line bg-white px-4 py-2.5 text-sm">Explore spatial UI</a>}
            artwork={<div className="absolute top-10 right-[8%] size-48 rounded-full bg-blush-200/70 blur-2xl" />}
            foreground={<div className="absolute right-[12%] bottom-10 h-28 w-40 rotate-3 rounded-3xl border border-white/60 bg-white/70 shadow-lift" />}
          />
        </DemoFrame>

        <DemoFrame id="magnetic-cta-hero" label="Magnetic CTA Hero" description="Production copy, one tactile action and one low-intensity spotlight.">
          <MagneticCtaHero
            className="min-h-[430px] rounded-2xl bg-blush-50 p-7 sm:p-10"
            eyebrow={<Eyebrow>Pinky workshop</Eyebrow>}
            title={<span className="mt-3 block text-4xl leading-tight">Design motion people can trust.</span>}
            description={<p className="mt-4 max-w-md text-ink-700">Start with semantics. Add the smallest response that explains the relationship.</p>}
            primaryAction={{ label: "Read the motion guide", href: "/skills/patterns/experience-composition" }}
            secondaryAction={{ label: "View components", href: "/components" }}
          />
        </DemoFrame>
      </div>
    </ExperienceSection>
  );
}

function BackgroundsSection() {
  const copy = (
    <div className="p-7 sm:p-9">
      <Eyebrow>Ambient, not dominant</Eyebrow>
      <h3 className="mt-3 max-w-md text-3xl">The content keeps the loudest voice.</h3>
      <p className="mt-4 max-w-lg leading-relaxed text-ink-700">Each field has a static fallback, bounded cost and enough quiet space for real text.</p>
    </div>
  );
  return (
    <ExperienceSection id="backgrounds" eyebrow="03 · Backgrounds" title="Atmosphere that knows it is behind the content.">
      <div className="grid gap-6 lg:grid-cols-2">
        {/*
          Each of these animates continuously once mounted. Four of them starting
          at page load is a cost the visitor pays long before scrolling here, so
          they wait until they are actually near the viewport.
        */}
        <DemoFrame id="soft-mesh-background" label="Soft Mesh Background" description="Three slow themeable fields pause when this section leaves view.">
          <LazyMount minHeight={288} className="rounded-2xl bg-cloud-50/40">
            <SoftMeshBackground className="min-h-72 rounded-2xl">{copy}</SoftMeshBackground>
          </LazyMount>
        </DemoFrame>
        <DemoFrame id="interactive-gradient" label="Interactive Gradient" description="A shared pointer source moves a broad, low-intensity local field.">
          <LazyMount minHeight={288} className="rounded-2xl bg-cloud-50/40">
            <InteractiveGradient className="min-h-72 rounded-2xl">{copy}</InteractiveGradient>
          </LazyMount>
        </DemoFrame>
        <DemoFrame id="bubble-field" label="Bubble Field" description="Ten deterministic orbs—not a particle engine—with optional gentle repulsion.">
          <LazyMount minHeight={288} className="rounded-2xl bg-cloud-50/40">
            <BubbleField count={10} pointerResponse className="min-h-72 rounded-2xl bg-cloud-50">{copy}</BubbleField>
          </LazyMount>
        </DemoFrame>
        <DemoFrame id="spotlight-grid" label="Spotlight Grid" description="A local light reveals structure without becoming a neon cyber grid.">
          <LazyMount minHeight={288} className="rounded-2xl bg-cloud-50/40">
            <SpotlightGrid className="min-h-72 rounded-2xl bg-white">{copy}</SpotlightGrid>
          </LazyMount>
        </DemoFrame>
      </div>
    </ExperienceSection>
  );
}

function TransitionsSection() {
  const [view, setView] = useState(0);
  const next = () => setView((value) => value + 1);
  return (
    <ExperienceSection id="transitions" eyebrow="04 · Transitions" title="Continuity without making people wait.">
      <DemoFrame id="shared-element-transition" label="Shared Element Transition" description="Open the project surface: the source itself expands using Pinky's existing Morph architecture.">
        <SharedElementTransition
          name="quiet-room"
          label="Quiet Room project"
          className="block w-full overflow-hidden rounded-2xl bg-white text-left shadow-soft"
          expandedClassName="overflow-hidden bg-white"
          expanded={<div><Surface image={IMAGES[0]} className="h-64 w-full" /><div className="p-6"><Eyebrow>Case study</Eyebrow><h3 className="mt-3 text-3xl">Quiet Room</h3><p className="mt-3 text-ink-700">A shared surface keeps the source and detail spatially related. Press Escape to return.</p></div></div>}
        >
          <div className="grid gap-5 sm:grid-cols-[220px_1fr] sm:items-center"><Surface image={IMAGES[0]} className="h-44 w-full" /><div className="p-5 sm:p-0 sm:pr-6"><Eyebrow>Open project</Eyebrow><h3 className="mt-2 text-2xl">Quiet Room</h3></div></div>
        </SharedElementTransition>
      </DemoFrame>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <DemoFrame id="bubble-transition" label="Bubble Transition" description="The content genuinely changes beneath a soft circular cover.">
          <TransitionDemo onNext={next} label="Change view">
            <BubbleTransition transitionKey={view} className="min-h-48">{viewContent(view)}</BubbleTransition>
          </TransitionDemo>
        </DemoFrame>
        <DemoFrame id="liquid-wipe-transition" label="Liquid Wipe Transition" description="Two transform layers create an expressive, short chapter handoff.">
          <TransitionDemo onNext={next} label="Next chapter">
            <LiquidWipeTransition transitionKey={view} className="min-h-48">{viewContent(view + 1)}</LiquidWipeTransition>
          </TransitionDemo>
        </DemoFrame>
        <DemoFrame id="blur-route-transition" label="Blur Route Transition" description="The calm production default, with focus transfer after change.">
          <TransitionDemo onNext={next} label="Next note">
            <BlurRouteTransition transitionKey={view} className="min-h-48">{viewContent(view + 2)}</BlurRouteTransition>
          </TransitionDemo>
        </DemoFrame>
      </div>
    </ExperienceSection>
  );
}

function SpatialSection() {
  const galleryItems = IMAGES.slice(0, 3).map((image, index) => ({
    id: `space-${index}`,
    label: ["Soft concrete", "Shared studio", "Working room"][index] ?? `Space ${index + 1}`,
    content: <MediaCard image={image} title={["Soft concrete", "Shared studio", "Working room"][index] ?? `Space ${index + 1}`} />,
  }));
  return (
    <ExperienceSection id="spatial" eyebrow="05 · Spatial" title="Depth is hierarchy, not a camera ride.">
      <DemoFrame id="perspective-gallery" label="Perspective Gallery" description="Choose real media cards with click, focus or Arrow keys; mobile flattens the scene.">
        <PerspectiveGallery items={galleryItems} className="min-h-[360px]" />
      </DemoFrame>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <DemoFrame id="floating-window-stack" label="Floating Window Stack" description="Three product surfaces focus and recede without pretending to be an operating system.">
          <FloatingWindowStack
            windows={[
              { id: "insight", title: "Weekly insight", content: <WindowContent tone="blush" title="42% calmer handoffs" /> },
              { id: "library", title: "Motion library", content: <WindowContent tone="cloud" title="19 experience patterns" /> },
              { id: "checks", title: "Accessibility checks", content: <WindowContent tone="ink" title="Keyboard paths passing" /> },
            ]}
          />
        </DemoFrame>
        <DemoFrame id="orbit-menu" label="Orbit Menu" description="A labeled action arc with a compact linear fallback and focus restoration.">
          <div className="grid min-h-[430px] place-items-center rounded-2xl bg-cloud-50">
            <OrbitMenu
              items={[
                { id: "save", label: "Save", icon: "↓" },
                { id: "share", label: "Share", icon: "↗" },
                { id: "copy", label: "Copy", icon: "□" },
                { id: "more", label: "More", icon: "···" },
              ]}
            />
          </div>
        </DemoFrame>
      </div>

      <DemoFrame id="spatial-carousel" label="Spatial Carousel" description="Adjacent slides recede in depth; controls and live labels remain explicit." className="mt-6">
        <SpatialCarousel items={galleryItems} />
      </DemoFrame>
    </ExperienceSection>
  );
}

function ExperienceSection({ id, eyebrow, title, children }: { id: string; eyebrow: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="mx-auto max-w-[76rem] scroll-mt-24 px-5 pt-28 sm:px-8 sm:pt-32">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-4 max-w-3xl text-section text-balance-tight">{title}</h2>
      <div className="mt-10">{children}</div>
    </section>
  );
}

function DemoFrame({ id, label, description, className = "", children }: { id: string; label: string; description: string; className?: string; children: ReactNode }) {
  return (
    <article id={id} className={`scroll-mt-24 rounded-[28px] border border-line bg-white/72 p-4 shadow-soft sm:p-6 ${className}`}>
      <div className="mb-5">
        <h3 className="text-xl">{label}</h3>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-700">{description}</p>
      </div>
      {children}
    </article>
  );
}

function TransitionDemo({ onNext, label, children }: { onNext: () => void; label: string; children: ReactNode }) {
  return <div className="rounded-2xl bg-cloud-50 p-4"><button type="button" onClick={onNext} className="mb-4 rounded-pill bg-ink-900 px-4 py-2 text-sm text-milk">{label}</button>{children}</div>;
}

function viewContent(value: number) {
  const index = ((value % 3) + 3) % 3;
  const content = [
    ["Listen first", "Find the quiet signal before adding movement."],
    ["Shape one response", "Let one interaction explain the relationship."],
    ["Release quickly", "Return attention to the content, not the transition."],
  ][index] ?? ["Listen first", "Find the quiet signal."];
  return <div className="rounded-xl bg-white p-5"><Eyebrow>View {index + 1}</Eyebrow><h4 className="mt-3 font-display text-xl font-semibold">{content[0]}</h4><p className="mt-2 text-sm leading-relaxed text-ink-700">{content[1]}</p></div>;
}

function MediaCard({ image, title }: { image: string; title: string }) {
  return <div className="w-64 overflow-hidden rounded-[22px] bg-white shadow-lift sm:w-72"><Surface image={image} className="h-52 w-full" /><div className="p-4"><p className="font-display font-semibold">{title}</p><p className="mt-1 text-xs text-ink-500">Spatial study · 2026</p></div></div>;
}

function WindowContent({ tone, title }: { tone: "blush" | "cloud" | "ink"; title: string }) {
  const colors = { blush: "bg-blush-50", cloud: "bg-cloud-50", ink: "bg-blush-100" };
  return <div className={`${colors[tone]} min-h-52 p-6`}><p className="font-mono text-xs tracking-[0.14em] uppercase opacity-60">Live overview</p><p className="mt-7 font-display text-3xl font-semibold">{title}</p><div className="mt-8 grid grid-cols-3 gap-2"><span className="h-12 rounded-lg bg-white/80" /><span className="h-12 rounded-lg bg-white/80" /><span className="h-12 rounded-lg bg-white/80" /></div></div>;
}

function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="font-mono text-[0.6875rem] tracking-[0.18em] text-ink-500 uppercase">{children}</p>;
}

function chip(active: boolean) {
  return `rounded-pill border px-4 py-2 text-sm transition-colors ${active ? "border-ink-900 bg-ink-900 text-milk" : "border-line bg-white/65 text-ink-700 hover:bg-white"}`;
}
