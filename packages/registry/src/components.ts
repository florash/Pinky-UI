import type { RegistryEntry } from "./types";

export const components: RegistryEntry[] = [
  {
    slug: "basic-card",
    name: "Basic Card",
    description: "A title, an optional description, an optional footer — the structural card the rest of the family builds on.",
    status: "ready",
    category: "cards",
    interactions: [],
    tags: ["card", "structural", "content"],
    builtOn: [],
    importPath: 'import { BasicCard } from "@pinky-ui/components";',
    usage: `<BasicCard
  title="Studio plan"
  description="Everything a small team needs."
  footer={<PrimaryButton>Choose plan</PrimaryButton>}
/>`,
    props: [
      { name: "title", type: "ReactNode", description: "Required." },
      { name: "description", type: "ReactNode", description: "Optional supporting text." },
      { name: "footer", type: "ReactNode", description: "Optional region below the description — a button row, a price, a byline." },
      { name: "radius", type: '"md" | "lg" | "xl" | "2xl"', defaultValue: '"xl"', description: "Corner radius from the shape scale." },
      { name: "padded", type: "boolean", defaultValue: "true", description: "Inner content padding." },
      { name: "shadow", type: '"neutral" | "pink"', defaultValue: '"neutral"', description: "Shadow token pair. Structural cards should stay neutral." },
      { name: "as", type: "ElementType", defaultValue: '"div"', description: "Pass Link from next/link to make the whole card navigable." },
      { name: "href", type: "string", description: "Only meaningful when as renders an anchor." },
      { name: "onClick", type: "() => void", description: "Makes the card a click target; adds the focus-visible ring automatically." },
    ],
    presets: [
      { name: "Default", description: "Title and description.", props: {} },
      { name: "Compact", description: "Smaller radius, no footer room implied.", props: { radius: "md" } },
    ],
    accessibility: [
      "A plain <div> unless onClick/href is passed — then it's a real focusable, clickable surface with a focus-visible ring equivalent to its hover state, not the browser default outline.",
      "Title renders as an h3; nest inside a page's own heading hierarchy accordingly.",
    ],
    reducedMotion: "The only motion is the hover shadow transition, which is a colour/opacity change, not a transform — nothing to disable under prefers-reduced-motion: reduce.",
    whenToUse: [
      "Any content that's fundamentally title + description + optional action",
      "The starting point before reaching for a more specific structural card",
    ],
    whenNotToUse: ["Content with its own top-level media — use Media Card or Horizontal Card instead"],
    related: ["media-card", "horizontal-card", "list-card"],
    skill: "basic-card",
  },
  {
    slug: "media-card",
    name: "Media Card",
    description: "An image or video fills the top edge-to-edge, with title, description and footer below.",
    status: "ready",
    category: "cards",
    interactions: [],
    tags: ["card", "structural", "media", "image"],
    builtOn: [],
    importPath: 'import { MediaCard } from "@pinky-ui/components";',
    usage: `<MediaCard
  media={<img src="/cover.jpg" alt="" />}
  title="Field notes"
  description="Three weeks in the studio."
/>`,
    props: [
      { name: "media", type: "ReactNode", description: "Required. An <img>, <video> or any block-level media — fills the slot via object-cover." },
      { name: "title", type: "ReactNode", description: "Required." },
      { name: "description", type: "ReactNode", description: "Optional." },
      { name: "footer", type: "ReactNode", description: "Optional." },
      { name: "mediaAspect", type: '"video" | "square" | "portrait"', defaultValue: '"video"', description: "Aspect ratio of the media slot." },
      { name: "padded", type: "boolean", defaultValue: "true", description: "Applies to the text content only — the media slot is always edge-to-edge." },
      { name: "radius", type: '"md" | "lg" | "xl" | "2xl"', defaultValue: '"xl"', description: "Corner radius from the shape scale." },
      { name: "shadow", type: '"neutral" | "pink"', defaultValue: '"neutral"', description: "Shadow token pair." },
      { name: "as", type: "ElementType", defaultValue: '"div"', description: "Pass Link from next/link to make the whole card navigable." },
      { name: "href", type: "string", description: "Only meaningful when as renders an anchor." },
    ],
    presets: [
      { name: "Default", description: "16:9 media.", props: {} },
      { name: "Square", description: "For avatars or square photography.", props: { mediaAspect: "square" } },
    ],
    accessibility: [
      "The media slot has no built-in alt text — that belongs on the <img> the caller passes in.",
      "Same focus-visible rule as Basic Card once onClick/href is present.",
    ],
    reducedMotion: "No transform-based motion; the hover shadow is a colour/opacity change only.",
    whenToUse: ["Article previews, product cards, anything photography-led"],
    whenNotToUse: ["Media that should sit beside text rather than above it — use Horizontal Card"],
    related: ["basic-card", "horizontal-card"],
    skill: "media-card",
  },
  {
    slug: "horizontal-card",
    name: "Horizontal Card",
    description: "Media on the left, content on the right — stacks to media-on-top below a configurable breakpoint.",
    status: "ready",
    category: "cards",
    interactions: [],
    tags: ["card", "structural", "media", "row", "responsive"],
    builtOn: [],
    importPath: 'import { HorizontalCard } from "@pinky-ui/components";',
    usage: `<HorizontalCard
  media={<img src="/avatar.jpg" alt="" />}
  title="Mira Odaka"
  description="Product design, six years."
/>`,
    props: [
      { name: "media", type: "ReactNode", description: "Required." },
      { name: "title", type: "ReactNode", description: "Required." },
      { name: "description", type: "ReactNode", description: "Optional." },
      { name: "footer", type: "ReactNode", description: "Optional." },
      { name: "mediaWidth", type: '"sm" | "md" | "lg"', defaultValue: '"md"', description: "Width of the media column once the layout is a row." },
      { name: "stackBelow", type: '"sm" | "md"', defaultValue: '"sm"', description: "Breakpoint below which media stacks on top of a full-width content block instead of sitting beside it." },
      { name: "radius", type: '"md" | "lg" | "xl" | "2xl"', defaultValue: '"xl"', description: "Corner radius from the shape scale." },
      { name: "padded", type: "boolean", defaultValue: "true", description: "Inner content padding." },
      { name: "shadow", type: '"neutral" | "pink"', defaultValue: '"neutral"', description: "Shadow token pair." },
    ],
    presets: [
      { name: "Default", description: "Row above sm, stacked below.", props: {} },
      { name: "Wide media", description: "More room for the image.", props: { mediaWidth: "lg" } },
    ],
    accessibility: ["Same focus-visible rule as Basic Card once onClick/href is present."],
    reducedMotion: "No transform-based motion; the hover shadow is a colour/opacity change only.",
    whenToUse: ["Profile rows, search results, list items that need a thumbnail beside text"],
    whenNotToUse: ["Media that's the point of the card, not an accent — use Media Card"],
    related: ["basic-card", "media-card"],
    skill: "horizontal-card",
  },
  {
    slug: "list-card",
    name: "List Card",
    description: "A card whose body is a divided list of rows rather than prose.",
    status: "ready",
    category: "cards",
    interactions: [],
    tags: ["card", "structural", "list", "rows"],
    builtOn: [],
    importPath: 'import { ListCard } from "@pinky-ui/components";',
    usage: `<ListCard
  title="Recent activity"
  items={activity.map((entry) => ({ id: entry.id, content: entry.summary }))}
/>`,
    props: [
      { name: "title", type: "ReactNode", description: "Optional heading above the list." },
      { name: "items", type: "ListCardItem[]", description: "Required. Each needs an id and content; rows are divided automatically." },
      { name: "footer", type: "ReactNode", description: "Optional region below the list." },
      { name: "emptyMessage", type: "ReactNode", defaultValue: '"Nothing here yet."', description: "Shown instead of the list when items is empty." },
      { name: "radius", type: '"md" | "lg" | "xl" | "2xl"', defaultValue: '"xl"', description: "Corner radius from the shape scale." },
      { name: "padded", type: "boolean", defaultValue: "true", description: "Horizontal padding on the title, rows and footer." },
      { name: "shadow", type: '"neutral" | "pink"', defaultValue: '"neutral"', description: "Shadow token pair." },
    ],
    presets: [
      { name: "Default", description: "Titled list.", props: {} },
      { name: "Compact", description: "Smaller radius for a dense sidebar.", props: { radius: "md" } },
    ],
    accessibility: [
      "Renders a real <ul>/<li> structure — a screen reader announces it as a list with its item count.",
      "Not focusable as a whole; interactivity belongs to whatever's inside each row's content.",
    ],
    reducedMotion: "No motion of its own.",
    whenToUse: ["Settings groups, short activity feeds, anything that's naturally items rather than a paragraph"],
    whenNotToUse: ["Long or virtualised lists — this renders every row eagerly"],
    related: ["basic-card"],
    skill: "list-card",
  },
  {
    slug: "profile-card",
    name: "Profile Card",
    description: "Avatar, name, subtitle, a tag group and an optional action region.",
    status: "ready",
    category: "cards",
    interactions: [],
    tags: ["card", "structural", "profile", "avatar"],
    builtOn: [],
    importPath: 'import { ProfileCard } from "@pinky-ui/components";',
    usage: `<ProfileCard
  avatarSrc="/mira.jpg"
  name="Mira Odaka"
  subtitle="Product design, six years"
  tags={["Design systems", "Motion", "Figma"]}
/>`,
    props: [
      { name: "avatarSrc", type: "string", description: "A photo URL. Takes priority over initials when both are given." },
      { name: "avatarAlt", type: "string", description: "Alt text for avatarSrc." },
      { name: "initials", type: "string", description: "Shown in a plain circle when there's no avatarSrc. Falls back to a generic silhouette when neither is given." },
      { name: "name", type: "ReactNode", description: "Required." },
      { name: "subtitle", type: "ReactNode", description: "Optional." },
      { name: "tags", type: "string[]", description: "Optional tag group, rendered as pills." },
      { name: "maxTags", type: "number", defaultValue: "3", description: "Tags beyond this count collapse into a single +N pill." },
      { name: "actions", type: "ReactNode", description: "Optional region below the tags — a button row, a follow toggle." },
      { name: "radius", type: '"md" | "lg" | "xl" | "2xl"', defaultValue: '"xl"', description: "Corner radius from the shape scale." },
      { name: "padded", type: "boolean", defaultValue: "true", description: "Inner content padding." },
      { name: "shadow", type: '"neutral" | "pink"', defaultValue: '"neutral"', description: "Shadow token pair. Structural cards should stay neutral." },
      { name: "as", type: "ElementType", defaultValue: '"div"', description: "Pass Link from next/link to make the whole card navigable." },
      { name: "href", type: "string", description: "Only meaningful when as renders an anchor." },
      { name: "onClick", type: "() => void", description: "Makes the card a click target; adds the focus-visible ring automatically." },
    ],
    presets: [
      { name: "Default", description: "Photo avatar with tags.", props: {} },
      { name: "Initials", description: "No photo on hand yet.", props: {} },
    ],
    accessibility: [
      "A plain <div> unless onClick/href is passed — then it's a real focusable, clickable surface with a focus-visible ring equivalent to its hover state.",
      "The avatar image's alt text comes from avatarAlt; initials and the fallback silhouette are decorative (aria-hidden) since the name text beside them already carries the identity.",
    ],
    reducedMotion: "The only motion is the hover shadow transition, which is a colour/opacity change, not a transform — nothing to disable under prefers-reduced-motion: reduce.",
    whenToUse: ["Team member tiles, author bylines, search results for people"],
    whenNotToUse: ["A list of many rows in a row-dense layout — use List Card or Horizontal Card instead"],
    related: ["horizontal-card", "basic-card"],
    skill: "profile-card",
  },
  {
    slug: "stat-card",
    name: "Stat Card",
    description: "A headline number with a label, an optional up/down/flat trend, and a mini-chart slot.",
    status: "ready",
    category: "cards",
    interactions: [],
    tags: ["card", "structural", "data", "metric"],
    builtOn: [],
    importPath: 'import { StatCard } from "@pinky-ui/components";',
    usage: `<StatCard
  label="Monthly active users"
  value="48,203"
  trend={{ direction: "up", label: "12.4% this week" }}
/>`,
    props: [
      { name: "label", type: "ReactNode", description: "Required." },
      { name: "value", type: "ReactNode", description: "Required. The headline number — rendered with tabular figures so it doesn't reflow as it updates." },
      { name: "trend", type: '{ direction: "up" | "down" | "flat"; label: string }', description: "Optional. Direction is carried by the arrow's shape and by label's text, never by colour alone." },
      { name: "description", type: "ReactNode", description: "Optional supporting text below the trend." },
      { name: "chart", type: "ReactNode", description: "Optional mini-chart slot next to the value — this component doesn't draw one itself." },
      { name: "radius", type: '"md" | "lg" | "xl" | "2xl"', defaultValue: '"xl"', description: "Corner radius from the shape scale." },
      { name: "padded", type: "boolean", defaultValue: "true", description: "Inner content padding." },
      { name: "shadow", type: '"neutral" | "pink"', defaultValue: '"neutral"', description: "Shadow token pair. Structural cards should stay neutral." },
    ],
    presets: [
      { name: "Default", description: "Label and value only.", props: {} },
      { name: "With trend", description: "Adds the up/down/flat indicator.", props: {} },
    ],
    accessibility: [
      "Not focusable as a whole — a stat is something a page shows, not something it navigates from.",
      "Trend direction is never colour-only: an arrow glyph and a text label (e.g. \"12.4% this week\") both carry it.",
    ],
    reducedMotion: "No motion of its own.",
    whenToUse: ["Dashboards, KPI rows, anything reporting a single tracked number"],
    whenNotToUse: ["Several related metrics that need to be compared side by side in one chart — use a systems chart component instead"],
    related: ["basic-card"],
    skill: "stat-card",
  },
  {
    slug: "pricing-card",
    name: "Pricing Card",
    description: "Price, period, a feature list and a CTA, with an opt-in highlighted/recommended state.",
    status: "ready",
    category: "cards",
    interactions: [],
    tags: ["card", "structural", "pricing", "commerce"],
    builtOn: [],
    importPath: 'import { PricingCard } from "@pinky-ui/components";',
    usage: `<PricingCard
  name="Studio"
  price="$24"
  period="/mo"
  features={["Unlimited projects", "Priority support"]}
  footer={<PrimaryButton>Choose plan</PrimaryButton>}
  highlight
/>`,
    props: [
      { name: "name", type: "ReactNode", description: "Required." },
      { name: "price", type: "ReactNode", description: "Required." },
      { name: "period", type: "ReactNode", description: "e.g. \"/mo\" — rendered right after price." },
      { name: "description", type: "ReactNode", description: "Optional." },
      { name: "features", type: "ReactNode[]", description: "Optional. Rendered as a checkmarked list." },
      { name: "footer", type: "ReactNode", description: "The CTA region — usually a button." },
      { name: "highlight", type: "boolean", defaultValue: "false", description: "The recommended-plan treatment: a soft-pink surface and badge. Reuses the family's pink accent, no new hue." },
      { name: "radius", type: '"md" | "lg" | "xl" | "2xl"', defaultValue: '"xl"', description: "Corner radius from the shape scale." },
      { name: "padded", type: "boolean", defaultValue: "true", description: "Inner content padding." },
      { name: "shadow", type: '"neutral" | "pink"', defaultValue: '"neutral"', description: "Shadow token pair. Ignored when highlight is true (highlight always uses the pink pair)." },
      { name: "as", type: "ElementType", defaultValue: '"div"', description: "Pass Link from next/link to make the whole card navigable." },
      { name: "href", type: "string", description: "Only meaningful when as renders an anchor." },
      { name: "onClick", type: "() => void", description: "Makes the card a click target; adds the focus-visible ring automatically." },
    ],
    presets: [
      { name: "Default", description: "Standard tier.", props: {} },
      { name: "Highlighted", description: "The recommended tier in a pricing row.", props: { highlight: true } },
    ],
    accessibility: [
      "A plain <div> unless onClick/href is passed — then it's a real focusable, clickable surface with a focus-visible ring equivalent to its hover state.",
      "The \"Recommended\" badge is real text, not a colour swatch, so it survives without the pink accent too.",
    ],
    reducedMotion: "The only motion is the hover shadow transition, which is a colour/opacity change, not a transform — nothing to disable under prefers-reduced-motion: reduce.",
    whenToUse: ["Pricing tables, plan comparisons"],
    whenNotToUse: ["A single plan with no comparison context — Basic Card is simpler"],
    related: ["basic-card"],
    skill: "pricing-card",
  },
  {
    slug: "form-card",
    name: "Form Card",
    description: "A form's visual container — title area, field slot, action footer. Never renders a <form> itself.",
    status: "ready",
    category: "cards",
    interactions: [],
    tags: ["card", "structural", "form"],
    builtOn: [],
    importPath: 'import { FormCard } from "@pinky-ui/components";',
    usage: `<FormCard title="Sign in" footer={<PrimaryButton>Continue</PrimaryButton>}>
  <TextField label="Email" />
  <TextField label="Password" type="password" />
</FormCard>`,
    props: [
      { name: "title", type: "ReactNode", description: "Optional." },
      { name: "description", type: "ReactNode", description: "Optional." },
      { name: "children", type: "ReactNode", description: "Required. The field area." },
      { name: "footer", type: "ReactNode", description: "The action region below the fields — usually a submit button." },
      { name: "radius", type: '"md" | "lg" | "xl" | "2xl"', defaultValue: '"xl"', description: "Corner radius from the shape scale." },
      { name: "padded", type: "boolean", defaultValue: "true", description: "Inner content padding." },
      { name: "shadow", type: '"neutral" | "pink"', defaultValue: '"neutral"', description: "Shadow token pair. Structural cards should stay neutral." },
    ],
    presets: [{ name: "Default", description: "Titled form container.", props: {} }],
    accessibility: [
      "Renders a plain <div>, never a <form> — the caller owns the real <form> element, so composing this inside a page that already has one never nests two forms.",
      "Not focusable as a whole; every field inside owns its own label and focus behavior.",
    ],
    reducedMotion: "No motion of its own.",
    whenToUse: ["Sign-in/sign-up panels, settings forms, any grouped set of fields with one submit action"],
    whenNotToUse: ["A single inline field with no surrounding form structure — that doesn't need a card at all"],
    related: ["basic-card"],
    skill: "form-card",
  },
  {
    slug: "notification-card",
    name: "Notification Card",
    description: "Icon, title, description, an optional close button and actions, in four semantic states.",
    status: "ready",
    category: "cards",
    interactions: [],
    tags: ["card", "structural", "notification", "alert", "status"],
    builtOn: [],
    importPath: 'import { NotificationCard } from "@pinky-ui/components";',
    usage: `<NotificationCard
  variant="success"
  title="Changes saved"
  description="Your profile is up to date."
  onDismiss={() => setVisible(false)}
/>`,
    props: [
      { name: "variant", type: '"info" | "success" | "warning" | "error"', defaultValue: '"info"', description: "Four semantic states within the family's three-hue palette — see the component's own doc comment for how they stay distinguishable." },
      { name: "icon", type: "ReactNode", description: "Overrides the variant's default icon." },
      { name: "title", type: "ReactNode", description: "Required." },
      { name: "description", type: "ReactNode", description: "Optional." },
      { name: "onDismiss", type: "() => void", description: "Renders a close button when given." },
      { name: "actions", type: "ReactNode", description: "Optional region below the description." },
      { name: "radius", type: '"md" | "lg" | "xl" | "2xl"', defaultValue: '"xl"', description: "Corner radius from the shape scale." },
      { name: "padded", type: "boolean", defaultValue: "true", description: "Inner content padding." },
      { name: "shadow", type: '"neutral" | "pink"', defaultValue: '"neutral"', description: "Shadow token pair." },
    ],
    presets: [
      { name: "Info", description: "Default state.", props: {} },
      { name: "Error", description: "Heavier border, distinct icon — never colour alone.", props: { variant: "error" } },
    ],
    accessibility: [
      "role=\"alert\" for warning/error, role=\"status\" for info/success, so assistive tech announces the right urgency.",
      "Semantic meaning is never colour-only: each variant has its own icon shape, and warning/error — the pair sharing the pink accent — are further told apart by border weight.",
    ],
    reducedMotion: "No motion of its own; the dismiss button's hover is a colour/opacity change only.",
    whenToUse: ["Inline feedback after an action, form-level errors, status banners"],
    whenNotToUse: ["A transient toast that should disappear on its own — this component has no auto-dismiss timer"],
    related: ["basic-card"],
    skill: "notification-card",
  },
  {
    slug: "empty-state-card",
    name: "Empty State Card",
    description: "A centered icon/illustration slot, title, description and a guidance button for empty content areas.",
    status: "ready",
    category: "cards",
    interactions: [],
    tags: ["card", "structural", "empty-state"],
    builtOn: [],
    importPath: 'import { EmptyStateCard } from "@pinky-ui/components";',
    usage: `<EmptyStateCard
  title="No projects yet"
  description="Create your first project to get started."
  action={<PrimaryButton>New project</PrimaryButton>}
/>`,
    props: [
      { name: "icon", type: "ReactNode", description: "An illustration or icon, sized by the caller — no built-in artwork." },
      { name: "title", type: "ReactNode", description: "Required." },
      { name: "description", type: "ReactNode", description: "Optional." },
      { name: "action", type: "ReactNode", description: "The guidance CTA — usually a button." },
      { name: "radius", type: '"md" | "lg" | "xl" | "2xl"', defaultValue: '"xl"', description: "Corner radius from the shape scale." },
      { name: "padded", type: "boolean", defaultValue: "true", description: "Inner content padding." },
      { name: "shadow", type: '"neutral" | "pink"', defaultValue: '"neutral"', description: "Shadow token pair." },
    ],
    presets: [{ name: "Default", description: "Title, description and a CTA.", props: {} }],
    accessibility: [
      "Not focusable as a whole; the action button carries its own accessible name.",
      "The icon slot has no built-in alt text — a caller passing an <img> or decorative SVG owns its own accessible treatment.",
    ],
    reducedMotion: "No motion of its own.",
    whenToUse: ["A list, table or dashboard section with genuinely no content yet"],
    whenNotToUse: ["An error or failed-load state — that's Notification Card's job"],
    related: ["basic-card", "notification-card"],
    skill: "empty-state-card",
  },
  {
    slug: "jelly-card",
    name: "Jelly Card",
    description: "A soft elastic surface that responds naturally to pointer movement.",
    status: "ready",
    category: "cards",
    interactions: ["jelly", "depth", "glow"],
    tags: ["card", "elastic", "hover", "spring"],
    builtOn: ["jelly", "spring", "glow"],
    importPath: 'import { JellyCard } from "@pinky-ui/components";',
    usage: `<JellyCard elasticity={0.35} intensity={0.18}>
  <ProfileCard />
</JellyCard>`,
    props: [
      {
        name: "elasticity",
        type: "number",
        defaultValue: "0.35",
        description: "0 settles calmly, 1 wobbles visibly on release.",
      },
      {
        name: "intensity",
        type: "number",
        defaultValue: "0.18",
        description: "How far the surface leans and drifts toward the pointer.",
      },
      {
        name: "hoverScale",
        type: "number",
        defaultValue: "1.02",
        description: "Scale while hovered. Pinky keeps this at or under 1.04.",
      },
      {
        name: "radius",
        type: '"md" | "lg" | "xl" | "2xl"',
        defaultValue: '"xl"',
        description: "Corner radius from the shape scale.",
      },
      {
        name: "glow",
        type: "boolean",
        defaultValue: "true",
        description: "Soft light that follows the pointer across the surface.",
      },
      {
        name: "elevated",
        type: "boolean",
        defaultValue: "true",
        description: "Applies Pinky's atmospheric shadow.",
      },
      {
        name: "padded",
        type: "boolean",
        defaultValue: "true",
        description: "Turn off for edge-to-edge media inside the card.",
      },
      {
        name: "className",
        type: "string",
        description: "Applied to the outer element, so grid and flex placement work as expected.",
      },
      {
        name: "surfaceClassName",
        type: "string",
        description: "Applied to the inner surface, for padding, background or text overrides.",
      },
      {
        name: "disabled",
        type: "boolean",
        defaultValue: "false",
        description: "Renders the static surface with no pointer response.",
      },
    ],
    presets: [
      {
        name: "Soft",
        description: "The default. Gentle lean, quiet settle.",
        props: { elasticity: 0.35, intensity: 0.18, hoverScale: 1.02 },
      },
      {
        name: "Subtle",
        description: "Barely there. Good for dense grids.",
        props: { elasticity: 0.15, intensity: 0.08, hoverScale: 1.01 },
      },
      {
        name: "Elastic",
        description: "More lean, more overshoot.",
        props: { elasticity: 0.65, intensity: 0.28, hoverScale: 1.03 },
      },
      {
        name: "Playful",
        description: "Maximum wobble. One per screen, at most.",
        props: { elasticity: 0.9, intensity: 0.4, hoverScale: 1.04 },
      },
    ],
    accessibility: [
      "Renders a plain container — any semantics you put inside are preserved.",
      "Effects are transform-only, so surrounding layout never shifts.",
      "Pointer response is skipped entirely for touch input; content stays fully usable.",
      "Interactive children keep their own focus outlines and hit areas.",
    ],
    reducedMotion:
      "With prefers-reduced-motion: reduce, the card renders as a static surface. No lean, drift, scale or pointer glow — the styling, shadow and content are unchanged.",
    whenToUse: [
      "Feature cards and product highlights",
      "Portfolio and case-study tiles",
      "A small number of hero surfaces that should feel alive",
    ],
    whenNotToUse: [
      "Forms and input-heavy panels",
      "Dense data tables",
      "Long repeated lists, where per-item motion becomes noise",
      "Anything wrapping a critical destructive action",
    ],
    related: ["glow-border", "magnetic-button"],
    skill: "jelly-card",
  },
  {
    slug: "magnetic-button",
    name: "Magnetic Button",
    description: "A button that leans toward the pointer as it approaches.",
    status: "ready",
    category: "buttons",
    interactions: ["magnetic"],
    tags: ["button", "pointer", "proximity", "cta"],
    builtOn: ["magnetic", "spring"],
    importPath: 'import { MagneticButton } from "@pinky-ui/components";',
    usage: `<MagneticButton variant="primary" strength={0.4}>
  Explore components
</MagneticButton>`,
    props: [
      {
        name: "variant",
        type: '"primary" | "soft" | "ghost"',
        defaultValue: '"primary"',
        description: "Visual weight of the button.",
      },
      {
        name: "size",
        type: '"sm" | "md" | "lg"',
        defaultValue: '"md"',
        description: "Control height and padding.",
      },
      {
        name: "strength",
        type: "number",
        defaultValue: "0.4",
        description: "Fraction of the pointer offset that is followed.",
      },
      {
        name: "range",
        type: "number",
        defaultValue: "110",
        description: "Proximity field around the button, in px.",
      },
      {
        name: "maxOffset",
        type: "number",
        defaultValue: "8",
        description: "Hard cap on travel, in px.",
      },
      {
        name: "wrapperClassName",
        type: "string",
        description:
          "Layout classes for the magnetic wrapper. `className` styles the button itself.",
      },
    ],
    presets: [
      {
        name: "Default",
        description: "Balanced pull for primary actions.",
        props: { strength: 0.4, range: 110, maxOffset: 8 },
      },
      {
        name: "Whisper",
        description: "Noticeable only once you are close.",
        props: { strength: 0.25, range: 70, maxOffset: 5 },
      },
      {
        name: "Wide field",
        description: "Reacts from far away — good for isolated hero buttons.",
        props: { strength: 0.35, range: 180, maxOffset: 10 },
      },
    ],
    accessibility: [
      "Renders a real <button>; every native attribute and event is forwarded.",
      "Ref forwarding is supported for focus management.",
      "The magnetic wrapper never moves the button's hit area away from its label.",
      "Keyboard focus shows the global focus ring; the effect requires no pointer.",
      "Disabled buttons opt out of magnetism as well as clicks.",
    ],
    reducedMotion:
      "With prefers-reduced-motion: reduce, the button does not move at all. Hover and focus styling still change, so the affordance is unchanged.",
    whenToUse: [
      "Primary calls to action with space around them",
      "Hero and landing-page actions",
      "Sparse toolbars where a little life is welcome",
    ],
    whenNotToUse: [
      "Dense button groups, where overlapping fields fight each other",
      "Destructive actions that should feel deliberate",
      "Inside tables or list rows",
    ],
    related: ["jelly-card", "glow-border"],
    skill: "magnetic-button",
  },
  {
    slug: "glow-border",
    name: "Glow Border",
    description: "A border that lights up where the pointer is.",
    status: "ready",
    category: "effects",
    interactions: ["glow"],
    tags: ["border", "light", "gradient", "focus"],
    builtOn: ["glow"],
    importPath: 'import { GlowBorder } from "@pinky-ui/components";',
    usage: `<GlowBorder radius="xl">
  <article className="rounded-xl border border-line bg-white p-6">
    Pricing
  </article>
</GlowBorder>`,
    props: [
      {
        name: "radius",
        type: '"md" | "lg" | "xl" | "2xl" | "pill"',
        defaultValue: '"xl"',
        description: "Must match the radius of the content it wraps.",
      },
      {
        name: "thickness",
        type: "number",
        defaultValue: "1.5",
        description: "Border thickness in px.",
      },
      {
        name: "size",
        type: "number",
        defaultValue: "260",
        description: "Diameter of the travelling light pool, in px.",
      },
      {
        name: "intensity",
        type: "number",
        defaultValue: "1",
        description: "Peak brightness, 0–1.",
      },
      { name: "from", type: "string", defaultValue: "blush-300", description: "Inner light colour." },
      { name: "to", type: "string", defaultValue: "cloud-300", description: "Outer light colour." },
      {
        name: "range",
        type: "number",
        defaultValue: "80",
        description: "Distance outside the element where the light fades in, in px.",
      },
      {
        name: "active",
        type: "boolean",
        defaultValue: "false",
        description: "Keeps the border lit — use for selected or focused states.",
      },
    ],
    presets: [
      {
        name: "Default",
        description: "Blush into milk blue.",
        props: { thickness: 1.5, size: 260, intensity: 1 },
      },
      {
        name: "Hairline",
        description: "Thin and restrained, for dense layouts.",
        props: { thickness: 1, size: 180, intensity: 0.7 },
      },
      {
        name: "Selected",
        description: "Permanently lit, for the chosen item in a set.",
        props: { thickness: 2, size: 320, intensity: 1, active: true },
      },
    ],
    accessibility: [
      "The lit ring is decorative: aria-hidden and pointer-events: none.",
      "Never used as the only signal for a selected state — pair it with text, aria-selected or aria-current.",
      "Adds no layout box of its own, so it cannot shift content.",
    ],
    reducedMotion:
      "With prefers-reduced-motion: reduce, the light stops following the pointer and the ring simply stays unlit unless `active` is set.",
    whenToUse: [
      "Pricing and plan cards",
      "Selected states in a set of options",
      "Framing a single hero surface",
    ],
    whenNotToUse: [
      "Every card on a page — the effect stops meaning anything",
      "As the sole indicator of selection or focus",
      "Around low-contrast text where the light reduces legibility",
    ],
    related: ["jelly-card", "fluid-tabs"],
    skill: "glow-border",
  },
  {
    slug: "fluid-tabs",
    name: "Fluid Tabs",
    description: "Tabs whose indicator flows from one item to the next.",
    status: "ready",
    category: "navigation",
    interactions: ["morph"],
    tags: ["tabs", "navigation", "indicator", "layout"],
    builtOn: ["spring"],
    importPath: 'import { FluidTabs } from "@pinky-ui/components";',
    usage: `<FluidTabs
  aria-label="Views"
  items={[
    { id: "preview", label: "Preview", content: <Preview /> },
    { id: "code", label: "Code", content: <Code /> },
  ]}
/>`,
    props: [
      {
        name: "items",
        type: "FluidTabItem[]",
        description: "Each item needs an id and a label; content is optional.",
      },
      {
        name: "value",
        type: "string",
        description: "Controlled selection. Omit to let the component own it.",
      },
      { name: "defaultValue", type: "string", description: "Initial selection when uncontrolled." },
      { name: "onValueChange", type: "(value: string) => void", description: "Selection callback." },
      {
        name: "variant",
        type: '"solid" | "bare"',
        defaultValue: '"solid"',
        description: "Whether the tabs sit on a visible track.",
      },
      {
        name: "size",
        type: '"sm" | "md"',
        defaultValue: '"md"',
        description: "Control height and type size.",
      },
      {
        name: "fill",
        type: "boolean",
        defaultValue: "false",
        description: "Stretches tabs to fill the available width.",
      },
      {
        name: "aria-label",
        type: "string",
        defaultValue: '"Tabs"',
        description: "Names the tablist for assistive technology.",
      },
    ],
    presets: [
      { name: "Solid", description: "On a soft track. The default.", props: { variant: "solid" } },
      { name: "Bare", description: "Floating directly on the page.", props: { variant: "bare" } },
      { name: "Compact", description: "For toolbars and card headers.", props: { size: "sm" } },
    ],
    accessibility: [
      "Implements the ARIA tabs pattern: role=tablist, role=tab, role=tabpanel.",
      "Roving tab stop — one Tab press enters the set, arrows move within it.",
      "Arrow Left/Right/Up/Down cycle, Home and End jump to the ends.",
      "Panels are labelled by their tab and are focusable, so keyboard users reach the content.",
      "Disabled tabs are skipped by keyboard navigation.",
      "Selection is conveyed by aria-selected, never by the indicator alone.",
    ],
    reducedMotion:
      "With prefers-reduced-motion: reduce, the indicator jumps directly to the selected tab and panels swap without a transition.",
    whenToUse: [
      "Switching between a handful of peer views",
      "Preview / code toggles",
      "Filtering a gallery",
    ],
    whenNotToUse: [
      "Sequential steps — use a stepper",
      "More than about seven items, where a select is kinder",
      "Navigation between pages — use links",
    ],
    related: ["magnetic-button", "gooey-menu"],
    discovery: {
      role: "canonical",
      note: "Canonical tab navigation with tablist and tabpanel semantics.",
    },
    skill: "fluid-tabs",
  },
  {
    slug: "pill-nav",
    name: "Pill Nav",
    description: "Real navigation links with a shared pill background that slides to whichever one is current.",
    status: "ready",
    category: "navigation",
    interactions: ["morph"],
    tags: ["navigation", "indicator", "links", "route"],
    builtOn: ["spring"],
    importPath: 'import { PillNav } from "@pinky-ui/components";',
    usage: `<PillNav
  aria-label="Main"
  items={[
    { id: "explore", label: "Explore", href: "/explore", active: pathname === "/explore" },
    { id: "docs", label: "Docs", href: "/docs", active: pathname === "/docs" },
  ]}
/>`,
    props: [
      {
        name: "items",
        type: "PillNavItem[]",
        description: "Each item is a link (href) or a trigger (onClick, for a dropdown); active is supplied by the caller's own router.",
      },
      {
        name: "size",
        type: '"sm" | "md"',
        defaultValue: '"md"',
        description: "Control height and type size.",
      },
      {
        name: "scrollable",
        type: "boolean",
        defaultValue: "false",
        description: "Horizontal scroll for a narrow track. Leave off unless the row can genuinely overflow — an explicit overflow-x forces overflow-y to compute as auto too, clipping any item's dropdown panel.",
      },
      {
        name: "aria-label",
        type: "string",
        defaultValue: '"Navigation"',
        description: "Names the nav landmark for assistive technology.",
      },
    ],
    presets: [
      { name: "Default", description: "Standard header height.", props: {} },
      { name: "Compact", description: "For a shrunken sticky header state.", props: { size: "sm" } },
    ],
    accessibility: [
      "Renders real <a> or <button> elements — never a div with a click handler.",
      "aria-current=\"page\" marks the active link; trigger items expose aria-expanded and aria-haspopup for their dropdown.",
      "The active state and its indicator both come from the caller's router, so back/forward navigation and direct links land on the correct pill without extra wiring.",
    ],
    reducedMotion:
      "With prefers-reduced-motion: reduce, the pill jumps directly to the active item instead of sliding and stretching.",
    whenToUse: [
      "A primary site or app navigation bar with a handful of top-level destinations",
      "Route-based navigation where the current page should read as a persistent, moving highlight",
    ],
    whenNotToUse: [
      "Switching between peer views without a URL change — use Fluid Tabs",
      "More than about seven destinations, where the pill row stops reading as a set",
    ],
    related: ["fluid-tabs", "gooey-menu"],
    discovery: {
      role: "canonical",
      note: "Link-based primary navigation; Fluid Tabs remains the canonical route for controlled-value tab panels.",
    },
    skill: "pill-nav",
  },
  {
    slug: "liquid-card",
    name: "Liquid Card",
    description: "A translucent surface where light gathers under the pointer.",
    status: "ready",
    category: "cards",
    interactions: ["liquid", "glow", "depth"],
    tags: ["glass", "translucent", "refraction", "surface"],
    builtOn: ["liquid-surface", "glow"],
    importPath: 'import { LiquidCard } from "@pinky-ui/components";',
    usage: `<LiquidCard intensity={0.2} blur={18} tint="cloud">
  <FeatureSummary />
</LiquidCard>`,
    props: [
      { name: "intensity", type: "number", defaultValue: "0.2", description: "Strength of the highlight and edge refraction, 0–1." },
      { name: "blur", type: "number", defaultValue: "18", description: "Backdrop blur in px. 0 makes the card opaque and free." },
      { name: "tint", type: '"clear" | "cloud" | "blush"', defaultValue: '"clear"', description: "Colour wash carried by the surface." },
      { name: "depth", type: "number", defaultValue: "0.12", description: "Apparent thickness — how far light travels through it." },
      { name: "radius", type: '"lg" | "xl" | "2xl"', defaultValue: '"2xl"', description: "Corner radius from the shape scale." },
      { name: "padded", type: "boolean", defaultValue: "true", description: "Turn off for edge-to-edge media." },
      { name: "disabled", type: "boolean", defaultValue: "false", description: "Renders the static surface with no pointer response." },
    ],
    presets: [
      { name: "Clear", description: "Neutral glass. The default.", props: { tint: "clear", blur: 18, intensity: 0.2 } },
      { name: "Soft", description: "Less blur, gentler light — safest over busy backgrounds.", props: { tint: "clear", blur: 10, intensity: 0.14 } },
      { name: "Cloud", description: "Cool milk-blue wash.", props: { tint: "cloud", blur: 18, intensity: 0.24 } },
      { name: "Blush", description: "Warm pink wash for a single hero surface.", props: { tint: "blush", blur: 18, intensity: 0.24 } },
    ],
    accessibility: [
      "Text sits on a tinted backing rather than raw transparency, so contrast survives whatever is behind the card.",
      "The highlight and edge layers are aria-hidden and non-interactive.",
      "Nothing moves: the surface is safe next to text and needs no pointer.",
      "Semantics inside the card are untouched.",
    ],
    reducedMotion:
      "With prefers-reduced-motion: reduce, the light stops following the pointer. The tint, blur and edge remain, so the card looks identical at rest.",
    whenToUse: [
      "One or two premium feature surfaces per screen",
      "Cards floating over imagery or a coloured field",
      "Pricing or product highlights that need to feel expensive",
    ],
    whenNotToUse: [
      "Dashboards and dense grids — backdrop blur is the most expensive thing on this list",
      "Long text-heavy blocks, where translucency costs legibility",
      "Over unpredictable user content where contrast cannot be guaranteed",
    ],
    related: ["jelly-card", "spotlight-card", "glow-border"],
    skill: "liquid-card",
  },
  {
    slug: "morph-card",
    name: "Morph Card",
    description: "A card that expands into its own detail view without a cut.",
    status: "ready",
    category: "cards",
    interactions: ["morph", "depth"],
    tags: ["expand", "dialog", "shared layout", "detail"],
    builtOn: ["morph", "spring"],
    importPath: 'import { MorphCard } from "@pinky-ui/components";',
    usage: `<MorphCard label="Mira Odaka" expandedContent={<Details />}>
  <Preview />
</MorphCard>`,
    props: [
      { name: "expandedContent", type: "ReactNode", description: "What the card becomes when expanded." },
      { name: "label", type: "string", description: "Accessible name for the expanded dialog. Required." },
      { name: "open", type: "boolean", description: "Controlled open state. Omit to let the card own it." },
      { name: "onOpenChange", type: "(open: boolean) => void", description: "Called when the card opens or closes." },
      { name: "maxWidth", type: "number", defaultValue: "620", description: "Width of the expanded panel, in px." },
      { name: "radius", type: '"lg" | "xl" | "2xl"', defaultValue: '"2xl"', description: "Corner radius from the shape scale." },
    ],
    presets: [
      { name: "Compact", description: "Detail panel stays close to the card's size.", props: { maxWidth: 460 } },
      { name: "Default", description: "Comfortable reading width.", props: { maxWidth: 620 } },
      { name: "Wide", description: "For media or two-column detail.", props: { maxWidth: 820 } },
    ],
    accessibility: [
      "The collapsed card is a real button with aria-expanded and aria-haspopup=dialog.",
      "The expanded panel is role=dialog with aria-modal and the name you pass as `label`.",
      "Escape closes it, and clicking the scrim closes it.",
      "Tab is trapped inside the panel while open.",
      "Focus moves to the panel's first focusable element on open and returns to the card on close.",
      "Background scrolling is locked while expanded.",
    ],
    reducedMotion:
      "With prefers-reduced-motion: reduce, the shared layout animation is dropped: the panel simply appears at its final size. Every behaviour — focus, Escape, the trap — is unchanged.",
    whenToUse: [
      "Product card to product detail",
      "Profile card to full profile",
      "Media card to expanded view",
    ],
    whenNotToUse: [
      "Destructive confirmations — use a plain, unambiguous dialog",
      "Long forms, which deserve their own page",
      "Content that must be linkable; a dialog has no URL",
    ],
    related: ["jelly-card", "liquid-card", "fluid-tabs"],
    skill: "morph-card",
  },
  {
    slug: "floating-dock",
    name: "Floating Dock",
    description: "A compact contextual dock whose active destination expands with its label and whose pointer response stays an optional desktop enhancement.",
    status: "ready",
    category: "navigation",
    interactions: ["proximity", "magnetic", "depth"],
    tags: ["dock", "toolbar", "magnify", "nav"],
    builtOn: ["proximity", "spring"],
    importPath: 'import { FloatingDock } from "@pinky-ui/components";',
    usage: `<FloatingDock
  items={items}
  magnification={1.35}
  distance={120}
/>`,
    props: [
      { name: "items", type: "DockItem[]", description: "Each needs an id, a label and an icon; href or onSelect makes it actionable." },
      { name: "magnification", type: "number", defaultValue: "1.35", description: "Scale of the item under the pointer." },
      { name: "distance", type: "number", defaultValue: "120", description: "Falloff distance in px." },
      { name: "labels", type: "boolean", defaultValue: "true", description: "Show the label above the nearest item." },
      { name: "aria-label", type: "string", defaultValue: '"Dock"', description: "Names the navigation landmark." },
    ],
    presets: [
      { name: "Subtle", description: "Barely swells. Good beside content.", props: { magnification: 1.18, distance: 90 } },
      { name: "Default", description: "Clear response without theatre.", props: { magnification: 1.35, distance: 120 } },
      { name: "Playful", description: "A statement dock, alone on the page.", props: { magnification: 1.6, distance: 160 } },
    ],
    accessibility: [
      "Renders a nav landmark with a list of real links or buttons.",
      "Every item carries a permanent visually-hidden label — the hover label is decoration, not the accessible name.",
      "Fully operable by Tab and Enter with no pointer proximity involved.",
      "Active items expose aria-current (links) or aria-pressed (buttons), and the active label remains visible for touch users.",
      "Magnification is skipped for touch, while the active destination remains named in the surface.",
    ],
    reducedMotion:
      "With prefers-reduced-motion: reduce, items never scale or lift and the hover label stays hidden. The dock is a plain, fully functional row of icons.",
    whenToUse: [
      "A small set of primary destinations or tools",
      "Persistent app-level navigation on wide screens",
      "Demo and portfolio interfaces",
    ],
    whenNotToUse: [
      "More than about eight items",
      "Primary navigation on mobile, where proximity has no meaning",
      "Anywhere the icons are not genuinely recognisable without labels",
    ],
    related: ["gooey-menu", "magnetic-button"],
    skill: "floating-dock",
  },
  {
    slug: "gooey-menu",
    name: "Gooey Menu",
    description: "A section switcher whose selected surface stretches between items with a restrained shared-origin connection.",
    status: "ready",
    category: "navigation",
    interactions: ["liquid", "morph", "elastic"],
    tags: ["menu", "gooey", "nav", "indicator"],
    builtOn: ["spring"],
    importPath: 'import { GooeyMenu } from "@pinky-ui/components";',
    usage: `<GooeyMenu
  aria-label="Sections"
  items={sections}
  onValueChange={setSection}
/>`,
    props: [
      { name: "items", type: "GooeyMenuItem[]", description: "Each needs an id and a label; href renders a link." },
      { name: "value", type: "string", description: "Controlled selection." },
      { name: "defaultValue", type: "string", description: "Initial selection when uncontrolled." },
      { name: "onValueChange", type: "(value: string) => void", description: "Selection callback." },
      { name: "stickiness", type: "number", defaultValue: "1", description: "How far the trailing shape lags. 0 disables the goo." },
      { name: "aria-label", type: "string", defaultValue: '"Sections"', description: "Names the navigation landmark." },
    ],
    presets: [
      { name: "Subtle", description: "Almost a plain indicator.", props: { stickiness: 0.4 } },
      { name: "Default", description: "Visible stretch, still quick.", props: { stickiness: 1 } },
      { name: "Playful", description: "Long trailing blob.", props: { stickiness: 1.6 } },
    ],
    accessibility: [
      "Renders a nav landmark with real links or buttons — the goo is one aria-hidden layer behind them.",
      "Labels sit above the filtered layer, so text stays perfectly crisp.",
      "Selection is conveyed by aria-current for links and aria-pressed for buttons, never by the connected surface alone.",
      "Standard Tab order; no custom key handling to learn.",
    ],
    reducedMotion:
      "With prefers-reduced-motion: reduce, the blur-and-contrast layer is dropped entirely and the indicator moves instantly to the selected item.",
    whenToUse: [
      "Section switchers with three to five items",
      "Playful marketing and portfolio navigation",
      "Filter bars where a little personality is welcome",
    ],
    whenNotToUse: [
      "Dense application chrome",
      "Long lists of items — the blob has to travel too far",
      "Anywhere the selection must be readable at a glance from across a room",
    ],
    related: ["fluid-tabs", "floating-dock"],
    skill: "gooey-menu",
  },
  {
    slug: "spotlight-card",
    name: "Spotlight Card",
    description: "A card lit under the pointer, with nothing moving.",
    status: "ready",
    category: "cards",
    interactions: ["glow"],
    tags: ["light", "surface", "grid", "calm"],
    builtOn: ["spotlight", "glow"],
    importPath: 'import { SpotlightCard } from "@pinky-ui/components";',
    usage: `<SpotlightCard size={300} intensity={0.5}>
  <Feature />
</SpotlightCard>`,
    props: [
      { name: "size", type: "number", defaultValue: "300", description: "Diameter of the light pool, in px." },
      { name: "intensity", type: "number", defaultValue: "0.5", description: "Peak brightness, 0–1." },
      { name: "color", type: "string", defaultValue: "blush-100", description: "Any CSS colour." },
      { name: "radius", type: '"lg" | "xl" | "2xl"', defaultValue: '"xl"', description: "Corner radius from the shape scale." },
      { name: "padded", type: "boolean", defaultValue: "true", description: "Turn off for edge-to-edge media." },
    ],
    presets: [
      { name: "Subtle", description: "A hint of warmth.", props: { size: 240, intensity: 0.3 } },
      { name: "Soft", description: "The default.", props: { size: 300, intensity: 0.5 } },
      { name: "Cloud", description: "Cool light instead of warm.", props: { color: "var(--color-cloud-100)", intensity: 0.6 } },
    ],
    accessibility: [
      "The light layer is aria-hidden and non-interactive.",
      "No movement at all, so it is safe in dense layouts and beside text.",
      "Never used as the only signal of state — pair it with real styling.",
    ],
    reducedMotion:
      "With prefers-reduced-motion: reduce, the light stops tracking the pointer. Nothing else changes, because nothing else moved.",
    whenToUse: [
      "Grids of many cards, where per-card motion would be noise",
      "Documentation and content surfaces",
      "Anywhere Jelly Card would be too much",
    ],
    whenNotToUse: [
      "As a hero surface — it is deliberately quiet",
      "Over photography, where the light gets lost",
    ],
    related: ["glow-border", "jelly-card", "liquid-card"],
    skill: "spotlight-card",
  },
  {
    slug: "tilt-card",
    name: "Tilt Card",
    description: "A rigid card that turns to face the pointer.",
    status: "ready",
    category: "cards",
    interactions: ["depth", "glow"],
    tags: ["3d", "perspective", "parallax", "glare"],
    builtOn: ["tilt", "parallax", "spring"],
    importPath: 'import { TiltCard } from "@pinky-ui/components";',
    usage: `<TiltCard max={4} glare foreground={<Badge />}>
  <Cover />
</TiltCard>`,
    props: [
      { name: "foreground", type: "ReactNode", description: "Content that floats above the face on its own parallax layer." },
      { name: "max", type: "number", defaultValue: "4", description: "Maximum rotation per axis, in degrees." },
      { name: "glare", type: "boolean", defaultValue: "true", description: "Specular highlight that follows the pointer." },
      { name: "parallax", type: "number", defaultValue: "0.6", description: "How far the foreground separates from the face." },
      { name: "radius", type: '"lg" | "xl" | "2xl"', defaultValue: '"xl"', description: "Corner radius from the shape scale." },
    ],
    presets: [
      { name: "Subtle", description: "Just enough to catch the light.", props: { max: 2.5, parallax: 0.3 } },
      { name: "Soft", description: "The default.", props: { max: 4, parallax: 0.6 } },
      { name: "Playful", description: "A single showcase card.", props: { max: 7, parallax: 1 } },
    ],
    accessibility: [
      "Transform-only, so surrounding layout never shifts.",
      "The glare and parallax layers are decorative and non-interactive.",
      "Skipped entirely for touch input.",
      "Keep rotation low: large tilts make body text genuinely harder to read.",
    ],
    reducedMotion:
      "With prefers-reduced-motion: reduce, the card stays flat and the glare is not rendered.",
    whenToUse: [
      "Media covers, album art, product shots",
      "Cards with a badge or title that benefits from separation",
      "One showcase surface in a section",
    ],
    whenNotToUse: [
      "Text-heavy cards",
      "Grids where several would tilt at once",
      "Small cards, where the rotation reads as a wobble",
    ],
    related: ["jelly-card", "spotlight-card"],
    skill: "tilt-card",
  },
  {
    slug: "elastic-toggle",
    name: "Elastic Toggle",
    description: "A preference switch whose track and thumb redistribute together and settle with an explicit On/Off state.",
    status: "ready",
    category: "controls",
    interactions: ["elastic", "jelly"],
    tags: ["switch", "toggle", "form", "control"],
    builtOn: ["spring"],
    importPath: 'import { ElasticToggle } from "@pinky-ui/components";',
    usage: `<ElasticToggle
  label="Reduced motion"
  onCheckedChange={setEnabled}
/>`,
    props: [
      { name: "checked", type: "boolean", description: "Controlled state. Omit to let the toggle own it." },
      { name: "defaultChecked", type: "boolean", defaultValue: "false", description: "Initial state when uncontrolled." },
      { name: "onCheckedChange", type: "(checked: boolean) => void", description: "Called on every change." },
      { name: "label", type: "string", description: "Visible label. Without it, pass aria-label." },
      { name: "stretch", type: "number", defaultValue: "0.5", description: "How much the thumb deforms while travelling, 0–1." },
      { name: "disabled", type: "boolean", defaultValue: "false", description: "Disables the control." },
    ],
    presets: [
      { name: "Subtle", description: "Almost no deformation.", props: { stretch: 0.2 } },
      { name: "Soft", description: "The default.", props: { stretch: 0.5 } },
      { name: "Playful", description: "Rubbery. Use once.", props: { stretch: 1 } },
    ],
    accessibility: [
      "role=switch with aria-checked — announced as on/off, not as a checkbox.",
      "Operable with Space and Enter; the visible label toggles it too.",
      "State is carried by position and colour, never by the animation alone.",
      "Disabled state is conveyed to assistive technology and blocks interaction.",
    ],
    reducedMotion:
      "With prefers-reduced-motion: reduce, the thumb moves instantly with no stretch. The control reads and behaves identically.",
    whenToUse: [
      "Settings and preference panels",
      "Instant-effect options with no save step",
    ],
    whenNotToUse: [
      "Anything needing a confirm step — use a checkbox and a submit",
      "Destructive switches, where playfulness undercuts the weight of the action",
    ],
    related: ["ripple-button", "fluid-tabs"],
    skill: "elastic-toggle",
  },
  {
    slug: "ripple-button",
    name: "Ripple Button",
    description: "A button that answers where it was pressed.",
    status: "ready",
    category: "buttons",
    interactions: ["elastic", "liquid"],
    tags: ["button", "press", "ripple", "feedback"],
    builtOn: ["press-spring"],
    importPath: 'import { RippleButton } from "@pinky-ui/components";',
    usage: `<RippleButton variant="primary">
  Save changes
</RippleButton>`,
    props: [
      { name: "variant", type: '"primary" | "soft" | "ghost"', defaultValue: '"primary"', description: "Visual weight, shared with Magnetic Button." },
      { name: "size", type: '"sm" | "md" | "lg"', defaultValue: '"md"', description: "Control height and padding." },
      { name: "pressScale", type: "number", defaultValue: "0.96", description: "Scale at full press." },
      { name: "rippleColor", type: "string", defaultValue: "rgba(255,255,255,0.5)", description: "Colour of the expanding surface." },
    ],
    presets: [
      { name: "Subtle", description: "Compression only, faint ripple.", props: { pressScale: 0.98, rippleColor: "rgba(255,255,255,0.3)" } },
      { name: "Soft", description: "The default.", props: { pressScale: 0.96 } },
      { name: "Playful", description: "Deeper compression.", props: { pressScale: 0.93 } },
    ],
    accessibility: [
      "A real <button> with every native attribute forwarded.",
      "Keyboard activation produces the same compression and a centred ripple, so Space and a click feel alike.",
      "Ripples are aria-hidden and cannot intercept clicks.",
      "Disabled buttons produce no ripple and no press response.",
    ],
    reducedMotion:
      "With prefers-reduced-motion: reduce, there is no compression and no ripple — only the standard hover and focus styling.",
    whenToUse: [
      "Form submits and primary actions",
      "Dense toolbars where magnetism would fight neighbouring buttons",
      "Touch-first interfaces, where press feedback matters most",
    ],
    whenNotToUse: [
      "Isolated hero CTAs — Magnetic Button suits those better",
      "Anywhere a Material-style ripple would clash with the surrounding design",
    ],
    related: ["magnetic-button", "elastic-toggle"],
    skill: "ripple-button",
  },
];
