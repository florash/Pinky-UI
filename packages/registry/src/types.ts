/**
 * The registry is the single source of truth about what Pinky UI contains.
 *
 * The website reads it to build the gallery, the detail pages, search and
 * filtering; a future CLI and the agent skills will read the same records, so
 * component metadata never has to be written twice.
 */

export const CATEGORIES = [
  "cards",
  "buttons",
  "navigation",
  "controls",
  "surfaces",
  "effects",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const INTERACTIONS = [
  "jelly",
  "liquid",
  "magnetic",
  "morph",
  "glow",
  "depth",
  "elastic",
  "proximity",
] as const;

export type Interaction = (typeof INTERACTIONS)[number];

/** `ready` means implemented and usable today. Nothing else may claim to be. */
export type Status = "ready" | "in-progress";

export type PropDef = {
  name: string;
  type: string;
  defaultValue?: string;
  description: string;
};

export type Preset = {
  name: string;
  description: string;
  props: Record<string, number | string | boolean>;
};

export type RegistryEntry = {
  slug: string;
  name: string;
  /** One line. Used in cards, search results and page metadata. */
  description: string;
  status: Status;
  category: Category;
  interactions: Interaction[];
  tags: string[];
  /** Primitives this component is built from — the composability story. */
  builtOn: string[];
  importPath: string;
  usage: string;
  props: PropDef[];
  presets: Preset[];
  accessibility: string[];
  reducedMotion: string;
  whenToUse: string[];
  whenNotToUse: string[];
  related: string[];
  /**
   * Slug of the agent skill in `packages/skills/components`. The website reads
   * that markdown directly, so guidance lives in exactly one place.
   */
  skill?: string;
};

export type PrimitiveEntry = {
  slug: string;
  name: string;
  description: string;
  status: Status;
  usage: string;
};
