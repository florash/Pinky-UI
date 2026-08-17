import { allWorkflowSystems, getWorkflowSystem } from "@pinky-ui/registry";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { RegistryDetailPage, type RegistryDetailRecord } from "@/components/registry/detail-page";
import { getSkill } from "@/lib/skills";
import { pageMetadata } from "@/lib/site";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return allWorkflowSystems.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = getWorkflowSystem(slug);
  return entry ? pageMetadata(entry.name, entry.description, `/workflows/${entry.slug}`) : {};
}

export default async function WorkflowDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const entry = getWorkflowSystem(slug);
  if (!entry) notFound();

  const skill = await getSkill(entry.family, entry.skill);
  const related = allWorkflowSystems
    .filter((item) => item.family === entry.family && item.slug !== entry.slug)
    .slice(0, 4)
    .map((item) => ({ slug: item.slug, name: item.name, href: `/workflows/${item.slug}` }));
  const canonical = entry.discovery?.canonicalSlug
    ? allWorkflowSystems.find((item) => item.slug === entry.discovery?.canonicalSlug)
    : undefined;

  const detail: RegistryDetailRecord = {
    slug: entry.slug,
    name: entry.name,
    description: entry.description,
    familyLabel: entry.family,
    collectionHref: "/workflows",
    collectionLabel: "Workflows",
    status: entry.status,
    tags: entry.tags,
    builtOn: entry.builtOn,
    importPath: entry.importPath,
    usage: entry.usage,
    props: [],
    presets: [],
    accessibility: entry.accessibility,
    reducedMotion: entry.reducedMotion,
    performance: entry.performance,
    whenToUse: entry.whenToUse,
    whenNotToUse: entry.whenNotToUse,
    related,
    sameFamily: related,
    discovery: entry.discovery ? {
      role: entry.discovery.role,
      note: entry.discovery.note,
      canonical: canonical ? { name: canonical.name, href: `/workflows/${canonical.slug}` } : undefined,
    } : undefined,
    skill: skill ? { kind: entry.family, slug: skill.slug, body: skill.body } : null,
  };

  return <RegistryDetailPage entry={detail} />;
}
