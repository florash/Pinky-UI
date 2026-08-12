import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";

import { EXPLORE_PREVIEW_SLUGS } from "@/components/previews/preview-manifest";

/**
 * Skills live as markdown in `packages/skills` and are read from disk at build
 * time. That directory is the single source of truth: the website renders it,
 * and a future CLI or agent integration reads the same files. Nothing is copied
 * into the site.
 *
 * The working directory differs between `next dev apps/website` (repo root) and
 * running inside the app directory, so the root is resolved by looking rather
 * than by assuming.
 */
const CANDIDATES = [
  path.join(process.cwd(), "packages", "skills"),
  path.join(process.cwd(), "..", "..", "packages", "skills"),
  path.join(process.cwd(), "..", "packages", "skills"),
];

let cachedRoot: Promise<string | null> | null = null;

function skillsRoot(): Promise<string | null> {
  cachedRoot ??= (async () => {
    for (const candidate of CANDIDATES) {
      try {
        await access(candidate);
        return candidate;
      } catch {
        // Try the next candidate.
      }
    }
    return null;
  })();

  return cachedRoot;
}

export const SKILL_KINDS = [
  "components",
  "layouts",
  "primitives",
  "cursor",
  "motion",
  "text",
  "scroll",
  "navigation",
  "heroes",
  "backgrounds",
  "transitions",
  "spatial",
  "media",
  "forms",
  "data",
  "feedback",
  "search",
  "loading",
  "lists",
  "drag",
  "onboarding",
  "mobile",
  "patterns",
] as const;
export type SkillKind = (typeof SKILL_KINDS)[number];

/** Public skill paths that moved folders without changing their guidance. */
export const SKILL_ROUTE_ALIASES = [
  { from: "/skills/motion/shared-morph", to: "/skills/patterns/shared-morph", kind: "patterns" as const, slug: "shared-morph" },
] as const;

export function skillRouteAlias(kind: string, slug: string) {
  return SKILL_ROUTE_ALIASES.find((alias) => alias.from === `/skills/${kind}/${slug}`);
}

export type Skill = {
  kind: SkillKind;
  slug: string;
  title: string;
  /** First paragraph under "## Purpose", or the first paragraph found. */
  summary: string;
  body: string;
};

export type SkillPreviewClass = "LIVE" | "COMPOSABLE" | "CONCEPTUAL" | "BROKEN";

const EXPLORE_PREVIEW_SET = new Set<string>(EXPLORE_PREVIEW_SLUGS);

export function classifySkillPreview(kind: SkillKind, slug: string): SkillPreviewClass {
  if (hasSkillLivePreview(kind, slug) || EXPLORE_PREVIEW_SET.has(slug)) return "LIVE";
  if (kind === "patterns") return "CONCEPTUAL";
  return "COMPOSABLE";
}

export const KIND_LABEL: Record<SkillKind, string> = {
  components: "Components",
  layouts: "Layouts",
  primitives: "Primitives",
  cursor: "Cursor",
  motion: "Motion",
  text: "Text",
  scroll: "Scroll",
  navigation: "Navigation",
  heroes: "Heroes",
  backgrounds: "Backgrounds",
  transitions: "Transitions",
  spatial: "Spatial",
  media: "Media",
  forms: "Forms",
  data: "Data",
  feedback: "Feedback",
  search: "Search",
  loading: "Loading",
  lists: "Lists",
  drag: "Drag",
  onboarding: "Onboarding",
  mobile: "Mobile",
  patterns: "Patterns",
};

export const KIND_BLURB: Record<SkillKind, string> = {
  components: "When to reach for a component, and when to reach for a different one.",
  layouts: "How to arrange a collection, and how many items each arrangement can carry.",
  primitives: "The reusable behaviours, and the judgment each one needs.",
  cursor: "Pointer enhancements with keyboard, touch and restraint guidance.",
  motion: "Entrances, morphs and loaders that preserve readable content.",
  text: "Text motion that supports hierarchy without compromising language.",
  scroll: "Scroll relationships that keep native flow and performance intact.",
  navigation: "Animated wayfinding that never delays location or destination clarity.",
  heroes: "Page-opening compositions with one intentional signature interaction.",
  backgrounds: "Ambient surfaces that stay quiet, legible and inexpensive.",
  transitions: "State and route handoffs that preserve focus and navigation semantics.",
  spatial: "Depth patterns that flatten gracefully and keep reading order stable.",
  media: "Media inspection and playback patterns with honest loading and touch behaviour.",
  forms: "Tactile controls that preserve labels, focus, validation and precision.",
  data: "Lightweight data interactions with stable textual interpretations.",
  feedback: "Messages, status and recovery surfaces chosen by consequence and context.",
  search: "Keyboard-first finding and command interactions that preserve focus.",
  loading: "Loading and progress feedback that communicates time without noise.",
  lists: "Product lists and rows with disclosure, focus and mobile actions.",
  drag: "Reordering systems where pointer movement always has an accessible alternative.",
  onboarding: "Teaching surfaces that respect attention, skip paths and product context.",
  mobile: "Touch-first patterns with explicit controls and gesture etiquette.",
  patterns: "System-level guidance: density, restraint, reduced motion, composition.",
};

export const SKILL_PUBLIC_GROUPS = [
  { label: "Components", description: "Pieces with a direct surface or control response.", kinds: ["components"] },
  { label: "Layouts", description: "Collection arrangements where geometry carries meaning.", kinds: ["layouts"] },
  { label: "Experiences", description: "Navigation, heroes, atmosphere and transitions.", kinds: ["navigation", "heroes", "backgrounds", "transitions", "spatial"] },
  { label: "Systems", description: "Media, product controls and workflows with real state.", kinds: ["media", "forms", "data", "feedback", "search", "loading", "lists", "drag", "onboarding", "mobile"] },
  { label: "Effects", description: "Cursor, motion, text and scroll as expressive layers.", kinds: ["cursor", "motion", "text", "scroll"] },
  { label: "Primitives", description: "One reusable behaviour at a time.", kinds: ["primitives"] },
  { label: "Patterns", description: "Restraint, composition and accessibility guidance.", kinds: ["patterns"] },
] as const satisfies ReadonlyArray<{ label: string; description: string; kinds: readonly SkillKind[] }>;

export const FEATURED_SKILLS = [
  { kind: "components", slug: "magnetic-button", eyebrow: "Component · proximity", liveLabel: "Move close to the action" },
  { kind: "primitives", slug: "morph", eyebrow: "Primitive · geometry", liveLabel: "Open the same surface" },
  { kind: "components", slug: "ripple-button", eyebrow: "Component · press", liveLabel: "Press feedback" },
  { kind: "navigation", slug: "morph-menu", eyebrow: "Experience · navigation", liveLabel: "Open the compact menu" },
  { kind: "cursor", slug: "magnetic-cursor-target", eyebrow: "Effect · cursor", liveLabel: "Approach the target" },
  { kind: "layouts", slug: "gallery-list-morph", eyebrow: "Layout · collection", liveLabel: "Switch the collection" },
  { kind: "media", slug: "morph-lightbox", eyebrow: "System · media", liveLabel: "Expand a study" },
  { kind: "scroll", slug: "sticky-story", eyebrow: "Effect · scroll", liveLabel: "Scroll the story" },
] as const satisfies ReadonlyArray<{ kind: SkillKind; slug: string; eyebrow: string; liveLabel: string }>;

export const DIRECT_PREVIEW_SKILLS = [
  { kind: "components", slug: "magnetic-button", eyebrow: "Input · proximity", liveLabel: "Move close to the action", signature: "approach → capped pull", span: "wide" },
  { kind: "primitives", slug: "morph", eyebrow: "Shape · geometry", liveLabel: "Open the same surface", signature: "resting surface → more room", span: "wide" },
  { kind: "patterns", slug: "tactile-press", eyebrow: "Input · depth", liveLabel: "Compare three press constructions", signature: "lift → contact → settle", span: "wide" },
  { kind: "navigation", slug: "menu-trigger-motion", eyebrow: "Navigation · trigger", liveLabel: "Compare three close marks", signature: "mark → stateful close", span: "wide" },
  { kind: "components", slug: "extruded-button", eyebrow: "Input · material", liveLabel: "Collapse the visible thickness", signature: "lift → collapse" },
  { kind: "components", slug: "layered-button", eyebrow: "Input · layers", liveLabel: "Separate the rear planes", signature: "separate → recombine" },
  { kind: "components", slug: "inset-button", eyebrow: "Input · recess", liveLabel: "Bring the recess toward flush", signature: "recess → flush → deeper" },
  { kind: "components", slug: "directional-button", eyebrow: "Input · semantics", liveLabel: "Follow the action direction", signature: "meaningful arrow travel" },
  { kind: "components", slug: "double-ring-button", eyebrow: "Input · proximity", liveLabel: "Approach the outer ring", signature: "near field → ring response" },
  { kind: "navigation", slug: "bracket-menu", eyebrow: "Navigation · geometry", liveLabel: "Converge the frame", signature: "brackets → framed close" },
  { kind: "navigation", slug: "split-rail", eyebrow: "Navigation · structure", liveLabel: "Part the two rails", signature: "counter-slide → recombine" },
  { kind: "navigation", slug: "text-menu", eyebrow: "Navigation · type", liveLabel: "Draw the rule and swap the word", signature: "rule draw → word travel" },
  { kind: "components", slug: "ripple-button", eyebrow: "Input · press", liveLabel: "Press feedback", signature: "contact → bounded wave" },
  { kind: "navigation", slug: "morph-menu", eyebrow: "Navigation · compact", liveLabel: "Open the compact menu", signature: "trigger → navigation surface" },
  { kind: "cursor", slug: "magnetic-cursor-target", eyebrow: "Cursor · proximity", liveLabel: "Approach the target", signature: "near field → target pull" },
  { kind: "layouts", slug: "gallery-list-morph", eyebrow: "Shape · collection", liveLabel: "Switch the collection", signature: "grid → list continuity" },
  { kind: "media", slug: "morph-lightbox", eyebrow: "Shape · media", liveLabel: "Expand a study", signature: "thumbnail → inspection" },
  { kind: "scroll", slug: "sticky-story", eyebrow: "Scroll · relationship", liveLabel: "Scroll the story", signature: "reading step → visual state" },
] as const satisfies ReadonlyArray<{
  kind: SkillKind;
  slug: string;
  eyebrow: string;
  liveLabel: string;
  signature: string;
  span?: "wide";
}>;

export function hasSkillLivePreview(kind: SkillKind, slug: string) {
  return DIRECT_PREVIEW_SKILLS.some((entry) => entry.kind === kind && entry.slug === slug);
}

export function skillPublicGroup(kind: SkillKind) {
  return SKILL_PUBLIC_GROUPS.find((group) => group.kinds.some((candidate) => candidate === kind))?.label ?? "Skills";
}

function parse(kind: SkillKind, slug: string, raw: string): Skill {
  const title = raw.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? slug;

  const purpose = raw.split(/^##\s+Purpose\s*$/m)[1];
  const source = purpose ?? raw.replace(/^#\s+.+$/m, "");
  const summary =
    source
      .split("\n\n")
      .map((block) => block.trim())
      .find((block) => block.length > 0 && !block.startsWith("#") && !block.startsWith("```")) ?? "";

  return { kind, slug, title, summary: summary.replace(/\n/g, " "), body: raw };
}

export async function getSkill(kind: SkillKind, slug: string): Promise<Skill | null> {
  const root = await skillsRoot();
  if (!root) return null;
  // macOS resource-fork sidecars can appear beside markdown files on the
  // portable workspace. They are filesystem metadata, never public skills.
  if (slug.startsWith("._")) return null;

  try {
    const raw = await readFile(path.join(root, kind, `${slug}.md`), "utf8");
    return parse(kind, slug, raw);
  } catch {
    return null;
  }
}

export async function listSkills(kind: SkillKind): Promise<Skill[]> {
  const root = await skillsRoot();
  if (!root) return [];

  let files: string[];
  try {
    files = await readdir(path.join(root, kind));
  } catch {
    return [];
  }

  const skills = await Promise.all(
    files
      .filter((file) => file.endsWith(".md") && !file.startsWith("._"))
      .map((file) => getSkill(kind, file.replace(/\.md$/, ""))),
  );

  return skills
    .filter((skill): skill is Skill => skill !== null)
    .sort((a, b) => a.title.localeCompare(b.title));
}

export async function listAllSkills(): Promise<Record<SkillKind, Skill[]>> {
  const groups = await Promise.all(SKILL_KINDS.map(listSkills));
  return Object.fromEntries(
    SKILL_KINDS.map((kind, index) => [kind, groups[index] ?? []]),
  ) as Record<SkillKind, Skill[]>;
}
