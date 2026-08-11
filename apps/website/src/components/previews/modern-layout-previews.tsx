/* eslint-disable @next/next/no-img-element */
"use client";

import {
  BrokenOffsetGrid,
  CinematicHorizontalGallery,
  Curved3DGrid,
  CylinderGallery,
  DepthScrollGallery,
  EditorialMosaic,
  FloatingColumns,
  GalleryListMorph,
  HelixGallery,
  InfiniteSpatialCanvas,
  LayeredEditorial,
  PerspectiveBento,
  SpatialCardTunnel,
  SplitScreenGallery,
  StackSpatial,
} from "@pinky/layouts";
import type { ReactNode } from "react";

const PHOTOS = [
  "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1100&q=82",
  "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1100&q=82",
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1100&q=82",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1100&q=82",
];

const ALT = [
  "Curved concrete architecture",
  "Sunlit shared studio",
  "Glass-walled working room",
  "Long communal table",
];

function Photo({ index, className = "h-full w-full object-cover", alt }: { index: number; className?: string; alt?: string }) {
  return <img loading="lazy" src={PHOTOS[index % PHOTOS.length]} alt={alt ?? ALT[index % ALT.length]} className={className} />;
}

function PhotoTile({ index, title, className = "" }: { index: number; title: string; className?: string }) {
  return <figure className={`relative h-full min-h-32 overflow-hidden bg-cloud-100 ${className}`}><Photo index={index} /><figcaption className="absolute inset-x-3 bottom-3 rounded-pill bg-ink-900/75 px-3 py-1.5 text-xs text-milk">{title}</figcaption></figure>;
}

const EDITORIAL_ITEMS = [
  { id: "concrete", label: "Concrete / 01", meta: "Material study", featured: true, content: <Photo index={0} /> },
  { id: "studio", label: "Studio / 02", meta: "Working places", content: <Photo index={1} /> },
  { id: "glass", label: "Glass / 03", meta: "Light study", content: <Photo index={2} /> },
  { id: "table", label: "Table / 04", meta: "Shared rituals", content: <Photo index={3} /> },
  { id: "threshold", label: "Threshold / 05", meta: "An edge condition", span: 2 as const, content: <Photo index={1} /> },
];

const COLLECTION_ITEMS = [
  { id: "one", label: "Open plan", meta: "01 / 04", content: <PhotoTile index={0} title="Open plan" /> },
  { id: "two", label: "Shared studio", meta: "02 / 04", content: <PhotoTile index={1} title="Shared studio" /> },
  { id: "three", label: "Quiet room", meta: "03 / 04", content: <PhotoTile index={2} title="Quiet room" /> },
  { id: "four", label: "Long table", meta: "04 / 04", content: <PhotoTile index={3} title="Long table" /> },
];

function SplitMedia({ index, alt }: { index: number; alt: string }) {
  return <Photo index={index} alt={alt} className="h-64 w-full object-cover sm:h-80" />;
}

function SmallSpatialCard({ index, title }: { index: number; title: string }) {
  return <div className="relative"><Photo index={index} className="h-40 w-full object-cover" /><div className="flex items-center justify-between gap-3 p-4"><span className="font-display text-sm font-semibold">{title}</span><span className="font-mono text-[0.65rem] text-ink-500">0{index + 1}</span></div></div>;
}

export const MODERN_LAYOUT_PREVIEWS: Record<string, ReactNode> = {
  "editorial-mosaic": <EditorialMosaic items={EDITORIAL_ITEMS} columns={3} className="w-full max-w-3xl" />,
  "split-screen-gallery": <SplitScreenGallery items={[
    { id: "split-1", label: "The room as instrument", meta: "Material / rhythm", primary: <SplitMedia index={0} alt="Curved concrete architecture" />, secondary: <SplitMedia index={1} alt="Sunlit shared studio" /> },
    { id: "split-2", label: "Light finds a surface", meta: "Atmosphere / trace", primary: <SplitMedia index={2} alt="Glass-walled working room" />, secondary: <SplitMedia index={3} alt="Long communal table" /> },
  ]} className="w-full max-w-3xl" />,
  "cinematic-horizontal-gallery": <CinematicHorizontalGallery items={COLLECTION_ITEMS.map((item) => ({ ...item, width: "min(74vw, 520px)" }))} className="w-full max-w-4xl" />,
  "gallery-list-morph": <GalleryListMorph items={COLLECTION_ITEMS.map((item) => ({ id: item.id, title: item.label, meta: item.meta, media: <Photo index={Number(item.id === "one" ? 0 : item.id === "two" ? 1 : item.id === "three" ? 2 : 3)} className="h-full w-full object-cover" /> }))} className="w-full max-w-2xl" />,
  "broken-offset-grid": <BrokenOffsetGrid items={[
    { id: "offset-a", label: "A / arrival", meta: "entry", offset: 18, content: <PhotoTile index={0} title="A / arrival" /> },
    { id: "offset-b", label: "B / pause", meta: "threshold", offset: -8, content: <PhotoTile index={2} title="B / pause" /> },
    { id: "offset-c", label: "C / gather", meta: "commons", span: 2, offset: 26, content: <PhotoTile index={3} title="C / gather" /> },
    { id: "offset-d", label: "D / work", meta: "focus", offset: -12, content: <PhotoTile index={1} title="D / work" /> },
  ]} columns={3} className="w-full max-w-3xl" />,
  "layered-editorial": <LayeredEditorial title="A room for ideas" description="A layered editorial composition keeps the headline readable while the image, annotation and quiet background occupy their own planes." media={<Photo index={1} className="h-64 w-full object-cover sm:h-80" />} background={<div className="absolute inset-8 rounded-full bg-blush-200/70 blur-3xl" />} foreground={<span className="block rounded-pill bg-ink-900 px-4 py-2 font-mono text-xs text-milk shadow-lift">Field note / 06</span>} caption="The image stays legible at rest. Depth is an invitation, not a requirement." className="w-full max-w-3xl" />,
  "perspective-bento": <PerspectiveBento items={[
    { id: "bento-1", label: "Material", span: 2, content: <PhotoTile index={0} title="Material" /> },
    { id: "bento-2", label: "Light", content: <PhotoTile index={2} title="Light" /> },
    { id: "bento-3", label: "Collective", content: <PhotoTile index={3} title="Collective" /> },
    { id: "bento-4", label: "Quiet", span: 2, content: <PhotoTile index={1} title="Quiet" /> },
  ]} columns={3} className="w-full max-w-3xl" />,
  "floating-columns": <FloatingColumns columns={[
    { id: "column-one", label: "Surface", direction: "up", items: [<Photo key="surface-1" index={0} className="h-48 w-full object-cover" />, <Photo key="surface-2" index={2} className="h-64 w-full object-cover" />] },
    { id: "column-two", label: "Gathering", direction: "down", speed: 0.75, items: [<Photo key="gathering-1" index={1} className="h-64 w-full object-cover" />, <Photo key="gathering-2" index={3} className="h-48 w-full object-cover" />] },
    { id: "column-three", label: "Trace", direction: "up", speed: 1.2, items: [<Photo key="trace-1" index={3} className="h-52 w-full object-cover" />, <Photo key="trace-2" index={0} className="h-72 w-full object-cover" />] },
  ]} className="w-full max-w-3xl" />,
  "curved-3d-grid": <Curved3DGrid items={COLLECTION_ITEMS.map((item) => ({ id: item.id, label: item.label, meta: item.meta, content: <PhotoTile index={Number(item.id === "one" ? 0 : item.id === "two" ? 1 : item.id === "three" ? 2 : 3)} title={item.label} /> }))} columns={4} className="w-full max-w-3xl" />,
  "helix-gallery": <HelixGallery items={COLLECTION_ITEMS.map((item, index) => ({ id: item.id, label: item.label, meta: item.meta, content: <SmallSpatialCard index={index} title={item.label} /> }))} className="w-full max-w-xl" />,
  "cylinder-gallery": <CylinderGallery items={COLLECTION_ITEMS.map((item, index) => ({ id: item.id, label: item.label, meta: item.meta, content: <SmallSpatialCard index={index} title={item.label} /> }))} className="w-full max-w-xl" />,
  "depth-scroll-gallery": <DepthScrollGallery items={COLLECTION_ITEMS.map((item, index) => ({ id: item.id, label: item.label, meta: item.meta, content: <Photo index={index} className="h-64 w-full object-cover sm:h-80" /> }))} className="w-full max-w-2xl" />,
  "spatial-card-tunnel": <SpatialCardTunnel items={COLLECTION_ITEMS.map((item, index) => ({ id: item.id, label: item.label, meta: item.meta, content: <SmallSpatialCard index={index} title={item.label} /> }))} className="w-full max-w-2xl" />,
  "stack-spatial": <StackSpatial items={COLLECTION_ITEMS.map((item, index) => ({ id: item.id, label: item.label, meta: item.meta, content: <SmallSpatialCard index={index} title={item.label} /> }))} className="w-full max-w-2xl" />,
  "infinite-spatial-canvas": <InfiniteSpatialCanvas items={[
    { id: "canvas-1", label: "Arrival", x: 36, y: 36, meta: "01", content: <Photo index={0} className="h-36 w-full object-cover" /> },
    { id: "canvas-2", label: "Commons", x: 340, y: 70, meta: "02", content: <Photo index={1} className="h-40 w-full object-cover" /> },
    { id: "canvas-3", label: "Threshold", x: 110, y: 250, meta: "03", content: <Photo index={2} className="h-32 w-full object-cover" /> },
    { id: "canvas-4", label: "Work table", x: 420, y: 290, meta: "04", content: <Photo index={3} className="h-36 w-full object-cover" /> },
  ]} height={470} bounds={{ left: -80, right: 80, top: -80, bottom: 80 }} className="w-full max-w-3xl" />,
};
