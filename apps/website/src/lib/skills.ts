import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";

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
  "patterns",
] as const;
export type SkillKind = (typeof SKILL_KINDS)[number];

export type Skill = {
  kind: SkillKind;
  slug: string;
  title: string;
  /** First paragraph under "## Purpose", or the first paragraph found. */
  summary: string;
  body: string;
};

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
  patterns: "System-level guidance: density, restraint, reduced motion, composition.",
};

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
      .filter((file) => file.endsWith(".md"))
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
