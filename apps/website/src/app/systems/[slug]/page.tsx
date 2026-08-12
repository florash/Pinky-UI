import { allProductSystems, getProductSystem } from "@pinky/registry";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { RegistryDetailPage, type RegistryDetailRecord } from "@/components/registry/detail-page";
import { getSkill } from "@/lib/skills";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return allProductSystems.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = getProductSystem(slug);
  return entry ? { title: entry.name, description: entry.description } : {};
}

export default async function SystemDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const entry = getProductSystem(slug);
  if (!entry) notFound();

  const skill = await getSkill(entry.family, entry.skill);
  const related = entry.related
    .map((relatedSlug) => getProductSystem(relatedSlug))
    .filter((item) => item !== undefined)
    .map((item) => ({ slug: item.slug, name: item.name, href: `/systems/${item.slug}` }));

  const detail: RegistryDetailRecord = {
    slug: entry.slug,
    name: entry.name,
    description: entry.description,
    familyLabel: entry.family,
    collectionHref: `/${entry.family}`,
    collectionLabel: entry.family,
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
