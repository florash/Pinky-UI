import { allExperiences, getExperience } from "@pinky/registry";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { RegistryDetailPage, type RegistryDetailRecord } from "@/components/registry/detail-page";
import { getSkill } from "@/lib/skills";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return allExperiences.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = getExperience(slug);
  return entry ? { title: entry.name, description: entry.description } : {};
}

export default async function ExperienceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const entry = getExperience(slug);
  if (!entry) notFound();

  const skill = await getSkill(entry.family, entry.skill);
  const related = entry.related
    .map((relatedSlug) => getExperience(relatedSlug))
    .filter((item) => item !== undefined)
    .map((item) => ({ slug: item.slug, name: item.name, href: `/experiences/${item.slug}` }));

  const detail: RegistryDetailRecord = {
    slug: entry.slug,
    name: entry.name,
    description: entry.description,
    familyLabel: entry.family,
    collectionHref: "/experiences",
    collectionLabel: "Experiences",
    status: entry.status,
    tags: entry.tags,
    builtOn: entry.builtOn,
    importPath: entry.importPath,
    usage: entry.usage,
    props: entry.props,
    presets: entry.presets,
    accessibility: entry.accessibility,
    reducedMotion: entry.reducedMotion,
    performance: entry.performance,
    whenToUse: entry.whenToUse,
    whenNotToUse: entry.whenNotToUse,
    related,
    skill: skill ? { kind: entry.family, slug: skill.slug, body: skill.body } : null,
  };

  return <RegistryDetailPage entry={detail} />;
}
