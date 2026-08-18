import { allAi, getAi } from "@pinky-ui/registry";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { RegistryDetailPage, type RegistryDetailRecord } from "@/components/registry/detail-page";
import { pageMetadata } from "@/lib/site";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return allAi.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = getAi(slug);
  return entry ? pageMetadata(entry.name, entry.description, `/ai/${entry.slug}`) : {};
}

export default async function AiDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const entry = getAi(slug);
  if (!entry) notFound();

  const related = entry.related
    .map((relatedSlug) => getAi(relatedSlug))
    .filter((item) => item !== undefined)
    .map((item) => ({ slug: item.slug, name: item.name, href: `/ai/${item.slug}` }));
  const sameFamily = allAi
    .filter((item) => item.family === entry.family && item.slug !== entry.slug)
    .map((item) => ({ slug: item.slug, name: item.name, href: `/ai/${item.slug}` }));

  const detail: RegistryDetailRecord = {
    slug: entry.slug,
    name: entry.name,
    description: entry.description,
    familyLabel: entry.family,
    collectionHref: "/ai",
    collectionLabel: "AI",
    status: entry.status,
    tags: entry.tags,
    builtOn: [],
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
    sameFamily,
    skill: null,
  };

  return <RegistryDetailPage entry={detail} />;
}
