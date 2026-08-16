import { allEffects, allExperiences, allProductSystems, allWorkflowSystems, components, layouts } from "@pinky/registry";
import type { MetadataRoute } from "next";

import { hasComponentPreview, hasLayoutPreview } from "@/components/previews/preview-manifest";
import { listAllSkills, SKILL_KINDS, SKILL_ROUTE_ALIASES } from "@/lib/skills";
import { absoluteSiteUrl, PUBLIC_INDEXABLE_ROUTES } from "@/lib/site";

export const dynamic = "force-static";

function uniquePaths(paths: Iterable<string>) {
  const aliases = new Set<string>(SKILL_ROUTE_ALIASES.map((alias) => alias.from));
  return [...new Set(paths)].filter((pathname) => {
    return pathname.startsWith("/") && !pathname.includes("?") && !pathname.includes("#") && !aliases.has(pathname);
  });
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const skills = await listAllSkills();
  const skillPaths = SKILL_KINDS.flatMap((kind) =>
    skills[kind].map((skill) => `/skills/${kind}/${skill.slug}`),
  );
  const componentPaths = components
    .filter((entry) => entry.status === "ready" && hasComponentPreview(entry.slug))
    .map((entry) => `/components/${entry.slug}`);
  const layoutPaths = layouts
    .filter((entry) => entry.status === "ready" && hasLayoutPreview(entry.slug))
    .map((entry) => `/layouts/${entry.slug}`);
  const effectPaths = allEffects.map((entry) => `/effects/${entry.slug}`);
  const experiencePaths = allExperiences
    .filter((entry) => entry.status === "ready")
    .map((entry) => `/experiences/${entry.slug}`);
  const systemPaths = allProductSystems.map((entry) => `/systems/${entry.slug}`);
  const workflowPaths = allWorkflowSystems.map((entry) => `/workflows/${entry.slug}`);

  return uniquePaths([
    ...PUBLIC_INDEXABLE_ROUTES,
    ...componentPaths,
    ...layoutPaths,
    ...effectPaths,
    ...experiencePaths,
    ...systemPaths,
    ...workflowPaths,
    ...skillPaths,
  ]).map((pathname) => ({ url: absoluteSiteUrl(pathname) }));
}
