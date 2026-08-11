"use client";

/* eslint-disable @next/next/no-img-element */

import { LensCursor } from "@pinky/effects";
import type { ProductFamily } from "@pinky/registry";
import {
  AnimatedNumber,
  BeforeAfter,
  ComparisonBars,
  DataLens,
  ElasticSegmentedControl,
  ExpandableMedia,
  FloatingMediaPlayer,
  HoldToConfirm,
  HoverVideoScrubber,
  ImageSequence,
  InlineEditMorph,
  InteractiveSparkline,
  MorphLightbox,
  MorphSelect,
  RadialMeter,
  SmartDropzone,
  TactileRange,
  TimelineScrubber,
} from "@pinky/systems";
import Link from "next/link";
import { useState, type ReactNode } from "react";

const IMAGES = [
  "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1100&q=82",
  "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1100&q=82",
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1100&q=82",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1100&q=82",
] as const;

const FAMILIES: Array<{ family: ProductFamily; label: string; href: string }> = [
  { family: "media", label: "Media", href: "/media" },
  { family: "forms", label: "Forms", href: "/forms" },
  { family: "data", label: "Data", href: "/data" },
];

export function SystemsShowcase({ family = "media" }: { family?: ProductFamily }) {
  return <div className="pb-28"><header className="border-b border-line bg-[linear-gradient(135deg,var(--color-blush-50),var(--color-cloud-50))]"><div className="mx-auto max-w-[76rem] px-5 py-20 sm:px-8 sm:py-28"><Eyebrow>Milestone 2.8 · {family}</Eyebrow><h1 className="mt-5 max-w-4xl text-display text-balance-tight">Interaction for real content and products.</h1><p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-700">Media inspection, tactile form controls and lightweight data interaction—without replacing native semantics or pulling in a platform-sized dependency.</p><nav aria-label="Product interaction families" className="mt-9 flex flex-wrap gap-2">{FAMILIES.map((item) => <Link key={item.family} href={item.href} className={chip(family === item.family)}>{item.label}</Link>)}<Link href="/explore" className={chip(false)}>Explore everything</Link></nav></div></header>{family === "media" ? <MediaSection /> : family === "forms" ? <FormsSection /> : <DataSection />}</div>;
}

function MediaSection() {
  const [playerMode, setPlayerMode] = useState<"inline" | "floating" | "closed">("inline");
  return <Section eyebrow="01 · Media" title="Inspect, compare and continue—without an autoplay wall.">
    <Demo id="morph-lightbox" title="Morph Lightbox" copy="A photography grid where the chosen thumbnail becomes the focused collection surface."><MorphLightbox items={IMAGES.slice(0, 3).map((src, index) => ({ id: `photo-${index}`, label: ["Soft concrete", "Shared studio", "Working room"][index] ?? `Photo ${index + 1}`, thumbnail: <figure><img loading="lazy" src={src} alt={["Curved concrete architecture", "Sunlit shared studio", "Glass-walled working room"][index]} className="h-56 w-full object-cover" /><figcaption className="p-4 text-sm">Open study {index + 1}</figcaption></figure>, media: <img src={src} alt={["Curved concrete architecture", "Sunlit shared studio", "Glass-walled working room"][index]} className="max-h-[68vh] w-full object-contain" />, caption: "Spatial study · 2026" }))} /></Demo>
    <div className="mt-6 grid gap-6 lg:grid-cols-2"><Demo id="before-after" title="Before / After" copy="A real redesign comparison using one native range across aligned visuals."><BeforeAfter className="aspect-[4/3]" before={<div className="grid size-full place-items-center bg-slate-200 p-8 text-center text-slate-600"><div><p className="text-sm uppercase">Before</p><p className="mt-4 font-serif text-4xl">A rigid dashboard</p><div className="mt-7 grid grid-cols-3 gap-2"><i className="h-20 bg-slate-400" /><i className="h-20 bg-slate-400" /><i className="h-20 bg-slate-400" /></div></div></div>} after={<div className="grid size-full place-items-center bg-blush-50 p-8 text-center"><div><Eyebrow>After</Eyebrow><p className="mt-4 font-display text-4xl font-semibold">A quieter workspace</p><div className="mt-7 grid grid-cols-3 gap-2"><i className="h-20 rounded-2xl bg-white shadow-soft" /><i className="h-20 rounded-2xl bg-cloud-100" /><i className="h-20 rounded-2xl bg-white shadow-soft" /></div></div></div>} /></Demo>
      <Demo id="hover-video-scrubber" title="Hover Video Scrubber" copy="Move or drag across the reel; keyboard arrows seek and Space toggles playback."><HoverVideoScrubber src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" poster={IMAGES[3]} label="Botanical product reel" preload="metadata" className="aspect-video bg-ink-900" /></Demo></div>
    <div className="mt-6 grid gap-6 lg:grid-cols-2"><Demo id="image-sequence" title="Image Sequence" copy="A bounded process sequence with drag, touch and keyboard frame selection."><ImageSequence frames={[...IMAGES]} alt={(index) => `Workspace process frame ${index + 1}`} preloadCount={2} className="aspect-video" /></Demo><Demo id="expandable-media" title="Expandable Media" copy="An article diagram expands in place rather than joining a gallery modal."><ExpandableMedia label="Pinky interaction architecture" caption="Shared sources feed primitives, experiences and product systems." preview={<ArchitectureDiagram compact />} expanded={<ArchitectureDiagram />} /></Demo></div>
    <div className="mt-6 grid gap-6 lg:grid-cols-2"><Demo id="floating-media-player" title="Floating Media Player" copy="Explicit minimize, restore and close states around a host-owned player.">{playerMode === "closed" ? <button type="button" onClick={() => setPlayerMode("inline")} className="rounded-pill bg-ink-900 px-4 py-2 text-sm text-milk">Reopen lesson</button> : <FloatingMediaPlayer label="Motion with restraint · lesson 01" mode={playerMode} onModeChange={setPlayerMode}><div className="grid aspect-video place-items-center bg-ink-900 text-center text-milk"><div><span className="text-4xl">▶</span><p className="mt-3 text-sm text-white/65">Host media surface</p></div></div></FloatingMediaPlayer>}</Demo><Demo id="media-lens" title="Media Lens · reused" copy="The existing Lens Cursor already covers restrained image magnification, so 2.8 composes it instead of cloning it."><LensCursor src={IMAGES[0]} zoom={1.7} className="overflow-hidden rounded-[22px]"><img loading="lazy" src={IMAGES[0]} alt="Curved concrete facade available for magnified inspection" className="h-72 w-full object-cover" /></LensCursor></Demo></div>
  </Section>;
}

function FormsSection() {
  const [format, setFormat] = useState("photo"); const [intensity, setIntensity] = useState(42); const [confirmed, setConfirmed] = useState(false); const [files, setFiles] = useState<string[]>([]);
  return <Section eyebrow="02 · Forms" title="Feedback and focus before flourish."><div className="grid gap-6 lg:grid-cols-2"><Demo id="elastic-segmented-control" title="Elastic Segmented Control" copy="Compact product modes with radio semantics and arrow-key selection."><ElasticSegmentedControl label="Media format" value={format} onValueChange={setFormat} items={[{ value: "photo", label: "Photo" }, { value: "video", label: "Video" }, { value: "audio", label: "Audio" }]} /><p className="mt-5 text-sm text-ink-500">Selected: {format}</p></Demo><Demo id="morph-select" title="Morph Select" copy="A short labeled listbox with arrows, Enter, Escape and typeahead."><MorphSelect label="Export quality" options={[{ value: "draft", label: "Draft · fast" }, { value: "web", label: "Web · balanced" }, { value: "archive", label: "Archive · lossless" }]} defaultValue="web" /></Demo>
      <Demo id="tactile-range" title="Tactile Range" copy="A native precision control with a quiet spring thumb and visible value."><TactileRange label="Motion intensity" value={intensity} onValueChange={setIntensity} formatValue={(value) => `${value}%`} /></Demo><Demo id="smart-dropzone" title="Smart Dropzone" copy="Select local image files and validate them—no fake backend upload claim."><SmartDropzone label="Choose project images" description="PNG, JPEG or WebP · local validation only" accept="image/*" multiple onFiles={(accepted) => setFiles(accepted.map((file) => file.name))} />{files.length ? <p className="text-sm text-ink-700">Ready locally: {files.join(", ")}</p> : null}</Demo>
      <Demo id="hold-to-confirm" title="Hold to Confirm" copy="Reserved for a rare consequential action; early release cancels."><div className="flex items-center gap-4"><HoldToConfirm onConfirm={() => setConfirmed(true)}>Delete draft project</HoldToConfirm><span aria-live="polite" className="text-sm text-ink-700">{confirmed ? "Confirmed for demo." : "Not confirmed."}</span></div></Demo><Demo id="inline-edit-morph" title="Inline Edit Morph" copy="A profile value becomes a focused editor; Enter saves and Escape cancels."><div className="flex items-center justify-between gap-4 rounded-2xl bg-cloud-50 p-5"><div><Eyebrow>Profile</Eyebrow><p className="mt-2 text-sm text-ink-500">Display name</p></div><InlineEditMorph label="Display name" defaultValue="Flora He" validate={(value) => value.trim().length < 2 ? "Use at least two characters." : null} /></div></Demo></div></Section>;
}

const METRICS = [{ label: "Mon", value: 12 }, { label: "Tue", value: 15 }, { label: "Wed", value: 14 }, { label: "Thu", value: 19 }, { label: "Fri", value: 23 }, { label: "Sat", value: 21 }, { label: "Sun", value: 26 }];

function DataSection() {
  const [period, setPeriod] = useState(0); const values = [1249, 1503, 1684];
  return <Section eyebrow="03 · Data" title="Motion explains change; text preserves meaning."><div className="grid gap-6 lg:grid-cols-3"><Demo id="animated-number" title="Animated Number" copy="Locale-aware visual interpolation with one stable screen-reader value."><p className="font-display text-5xl font-semibold"><AnimatedNumber value={values[period] ?? 1249} prefix="$" locale="en-US" /></p><button type="button" onClick={() => setPeriod((period + 1) % values.length)} className="mt-6 rounded-pill border border-line px-4 py-2 text-sm">Update quarter</button></Demo><Demo id="radial-meter" title="Radial Meter" copy="A soft semantic meter, not a speedometer dashboard."><RadialMeter value={67 + period * 6} label="Completion" segments={4} /></Demo><Demo id="comparison-bars" title="Comparison Bars" copy="A small dataset sharing one honest baseline."><ComparisonBars label="Current and target" items={[{ id: "current", label: "Current", value: 67 }, { id: "target", label: "Target", value: 84, color: "var(--color-cloud-300)" }]} formatValue={(value) => `${value}%`} /></Demo></div>
    <div className="mt-6 grid gap-6 lg:grid-cols-2"><Demo id="interactive-sparkline" title="Interactive Sparkline" copy="Pointer, touch and Arrow keys inspect the same textual trend points."><InteractiveSparkline data={METRICS} label="Weekly project views" summary="Seven daily project-view values, rising overall from 12 to 26." formatValue={(value) => `${value}k views`} /></Demo><Demo id="data-lens" title="Data Lens" copy="The inspector wraps custom chart content without coupling to its rendering system."><DataLens items={METRICS} label="Inspect weekly revenue" renderLens={(item) => <span><strong>{item.label}</strong><br />${item.value}k</span>} className="overflow-hidden rounded-2xl bg-cloud-50"><div className="flex h-56 items-end gap-2 p-6">{METRICS.map((item) => <i key={item.label} className="flex-1 rounded-t-xl bg-blush-200" style={{ height: `${item.value * 3}%` }} />)}</div></DataLens></Demo></div>
    <Demo id="timeline-scrubber" title="Timeline Scrubber" copy="A product milestone controller that can also drive media or custom content." className="mt-6"><TimelineScrubber stops={[{ id: "research", label: "Research", description: "Find the meaningful interaction." }, { id: "prototype", label: "Prototype", description: "Test keyboard and touch first." }, { id: "release", label: "Release", description: "Ship the smallest useful motion." }]} /></Demo>
  </Section>;
}

function ArchitectureDiagram({ compact = false }: { compact?: boolean }) { return <div className={`grid place-items-center bg-cloud-50 p-6 ${compact ? "min-h-64" : "min-h-[60vh]"}`}><div className="grid w-full max-w-2xl gap-4 sm:grid-cols-3"><div className="rounded-2xl bg-white p-5 shadow-soft"><Eyebrow>Sources</Eyebrow><p className="mt-3 font-semibold">Pointer · Scroll</p></div><div className="rounded-2xl bg-blush-100 p-5"><Eyebrow>Primitives</Eyebrow><p className="mt-3 font-semibold">Morph · Spring</p></div><div className="rounded-2xl bg-ink-900 p-5 text-milk"><Eyebrow>Systems</Eyebrow><p className="mt-3 font-semibold">Media · Forms · Data</p></div></div></div>; }
function Section({ eyebrow, title, children }: { eyebrow: string; title: string; children: ReactNode }) { return <main className="mx-auto max-w-[76rem] px-5 pt-24 sm:px-8 sm:pt-28"><Eyebrow>{eyebrow}</Eyebrow><h2 className="mt-4 max-w-3xl text-section text-balance-tight">{title}</h2><div className="mt-10">{children}</div></main>; }
function Demo({ id, title, copy, children, className = "" }: { id: string; title: string; copy: string; children: ReactNode; className?: string }) { return <article id={id} className={`scroll-mt-24 rounded-[28px] border border-line bg-white/75 p-5 shadow-soft sm:p-6 ${className}`}><h3 className="text-xl">{title}</h3><p className="mt-2 mb-6 text-sm leading-relaxed text-ink-700">{copy}</p>{children}</article>; }
function Eyebrow({ children }: { children: ReactNode }) { return <p className="font-mono text-[0.6875rem] tracking-[0.18em] text-ink-500 uppercase">{children}</p>; }
function chip(active: boolean) { return `rounded-pill border px-4 py-2 text-sm ${active ? "border-ink-900 bg-ink-900 text-milk" : "border-line bg-white/70 text-ink-700"}`; }
