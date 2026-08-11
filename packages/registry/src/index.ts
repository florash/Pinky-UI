import { components } from "./components";
import { layouts } from "./layouts";
import { primitives } from "./primitives";
import type { Category, Interaction, RegistryEntry } from "./types";

export * from "./types";
export * from "./layouts";
export * from "./effects";
export * from "./experiences";
export * from "./systems";
export * from "./workflows";
export { components, primitives, layouts };

export function getComponent(slug: string): RegistryEntry | undefined {
  return components.find((entry) => entry.slug === slug);
}

/** Only these have an implementation behind them and a live preview. */
export function readyComponents(): RegistryEntry[] {
  return components.filter((entry) => entry.status === "ready");
}

export type ComponentFilter = {
  query?: string;
  category?: Category | "all";
  interaction?: Interaction | "all";
};

export function filterComponents(
  entries: RegistryEntry[],
  { query = "", category = "all", interaction = "all" }: ComponentFilter,
): RegistryEntry[] {
  const needle = query.trim().toLowerCase();

  return entries.filter((entry) => {
    if (category !== "all" && entry.category !== category) return false;
    if (interaction !== "all" && !entry.interactions.includes(interaction)) return false;
    if (!needle) return true;

    return [entry.name, entry.description, ...entry.tags, ...entry.interactions]
      .join(" ")
      .toLowerCase()
      .includes(needle);
  });
}
