import { allEffects } from "@pinky/registry";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { RegistryDetailPage, type RegistryDetailRecord } from "@/components/registry/detail-page";
import { getSkill } from "@/lib/skills";
import { pageMetadata } from "@/lib/site";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return allEffects.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = allEffects.find((item) => item.slug === slug);
  return entry ? pageMetadata(entry.name, entry.description, `/effects/${entry.slug}`) : {};
}

export default async function EffectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const entry = allEffects.find((item) => item.slug === slug);
  if (!entry) notFound();

  const skill = await getSkill(entry.family, entry.skill);
  const componentName = entry.usage.match(/^<([A-Za-z0-9]+)/)?.[1] ?? entry.name.replace(/\s+/g, "");
  const related = allEffects
    .filter((item) => item.family === entry.family && item.slug !== entry.slug)
    .slice(0, 4)
    .map((item) => ({ slug: item.slug, name: item.name, href: `/effects/${item.slug}` }));
  const canonical = entry.discovery?.canonicalSlug
    ? allEffects.find((item) => item.slug === entry.discovery?.canonicalSlug)
    : undefined;

  const detail: RegistryDetailRecord = {
    slug: entry.slug,
    name: entry.name,
    description: entry.description,
    familyLabel: entry.family,
    collectionHref: "/effects",
    collectionLabel: "Effects",
    status: "ready",
    tags: [entry.family],
    builtOn: [],
    importPath: `import { ${componentName} } from "${entry.importPath}";`,
    usage: entry.usage,
    props: [],
    presets: [],
    accessibility: ["Motion never carries the only meaning; the underlying content remains in the DOM.", "Pair pointer effects with an equivalent focus or keyboard state where the target is interactive."],
    reducedMotion: "The effect resolves to a static readable state when motion is reduced.",
    performance: [],
    whenToUse: entry.whenToUse,
    whenNotToUse: entry.whenNotToUse,
    related,
    discovery: entry.discovery ? {
      role: entry.discovery.role,
      note: entry.discovery.note,
      canonical: canonical ? { name: canonical.name, href: `/effects/${canonical.slug}` } : undefined,
    } : undefined,
    skill: skill ? { kind: entry.family, slug: skill.slug, body: skill.body } : null,
  };

  return <RegistryDetailPage entry={detail} />;
}
