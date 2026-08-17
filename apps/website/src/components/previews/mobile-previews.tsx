"use client";

import {
  ActionSheet,
  AuthCompletionMorph,
  BottomSearchSheet,
  LongPressContextMenu,
  PinchZoomImage,
  BottomToastStack,
  CardStackBrowse,
  ContextualBottomBar,
  ContentAwareSheet,
  DetentSheet,
  ExpandInPlaceCard,
  FloatingActionIsland,
  FloatingDockNavigation,
  FloatingMediaControls,
  FloatingTabBar,
  FocusLiftField,
  FocusRailMobile,
  FullscreenMediaMorph,
  HoldToRevealActions,
  KeyboardAwareComposer,
  InlineSearchReveal,
  LongPressSelection,
  MobileSelectionBar,
  MobileUndoBar,
  MobileValidationMorph,
  MorphingBottomNavigation,
  ProgressiveMobileForm,
  ProgressiveAuthSurface,
  QuickActionSheet,
  SearchFilterMorph,
  ScrollCompactBottomNav,
  SearchMorphHeader,
  StickyBottomCTA,
  SwipeActions,
  SwipeBackGesture,
  SwipeDismissCardSheet,
  SwipeMediaInspector,
  SwipeToConfirm,
  ThumbReachMenu,
  WheelPicker,
} from "@pinky-ui/systems";
import { useEffect, useRef, useState, type ReactNode } from "react";

function ContextualBottomBarPreview() {
  const [selected, setSelected] = useState(0);
  return <div className="w-full space-y-3"><div className="grid gap-2 sm:grid-cols-3">{["Brief", "Notes", "Assets"].map((label, index) => <button key={label} type="button" aria-pressed={selected > index} onClick={() => setSelected((value) => value > index ? 0 : index + 1)} className="min-h-10 rounded-xl border border-line bg-cloud-50 px-3 py-2 text-left text-xs text-ink-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/20">{label}</button>)}</div><ContextualBottomBar selectedCount={selected} onClearSelection={() => setSelected(0)} /></div>;
}

function StickyBottomCTAPreview() {
  const [pending, setPending] = useState(false);
  const timer = useRef<number | null>(null);
  useEffect(() => () => { if (timer.current) window.clearTimeout(timer.current); }, []);
  return <div className="min-h-36 rounded-[18px] bg-cloud-50 p-4"><p className="max-w-[18rem] text-sm leading-relaxed text-ink-700">The action stays with the reading surface while the next decision is nearby.</p><StickyBottomCTA label="Continue" description="Ready for the next step" pending={pending} onAction={() => { setPending(true); if (timer.current) window.clearTimeout(timer.current); timer.current = window.setTimeout(() => setPending(false), 700); }} /></div>;
}

function ActionSheetPreview() {
  const [open, setOpen] = useState(false);
  return <div><button type="button" onClick={() => setOpen(true)} className="min-h-10 rounded-full bg-ink-900 px-4 text-sm text-milk">Open photo actions</button><ActionSheet open={open} onOpenChange={setOpen} title="Photo" actions={[{ id: "share", label: "Share", onAction: () => {} }, { id: "save", label: "Save to library", onAction: () => {} }, { id: "delete", label: "Delete", tone: "destructive", onAction: () => {} }]} /></div>;
}

function WheelPickerPreview() {
  const [hour, setHour] = useState("9");
  return <WheelPicker label="Hour" value={hour} onValueChange={setHour} options={Array.from({ length: 12 }, (_, index) => ({ value: String(index + 1), label: String(index + 1) }))} className="mx-auto w-24" />;
}

const SAMPLE_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23eaf6fd'/%3E%3Ccircle cx='120' cy='110' r='90' fill='%23f4c7d7' fill-opacity='.8'/%3E%3Ccircle cx='300' cy='190' r='100' fill='%23c8e4f7' fill-opacity='.9'/%3E%3C/svg%3E";

function LongPressContextMenuPreview() {
  return <div className="flex min-h-32 items-center justify-center rounded-2xl bg-cloud-50 p-6"><LongPressContextMenu label="Photo actions" actions={[{ id: "share", label: "Share", onAction: () => {} }, { id: "save", label: "Save to library", onAction: () => {} }, { id: "delete", label: "Delete", tone: "destructive", onAction: () => {} }]}><div className="grid size-24 place-items-center rounded-2xl bg-white text-xs text-ink-500 shadow-soft">Hold me</div></LongPressContextMenu></div>;
}

function PinchZoomImagePreview() {
  const [open, setOpen] = useState(false);
  return <div><button type="button" onClick={() => setOpen(true)} className="min-h-10 rounded-full bg-ink-900 px-4 text-sm text-milk">Open image</button>{open ? <div className="fixed inset-0 z-[90] bg-ink-900/80" onClick={() => setOpen(false)}><div className="h-full" onClick={(event) => event.stopPropagation()}><PinchZoomImage src={SAMPLE_IMAGE} alt="Sample product photo" onDismiss={() => setOpen(false)} className="h-full w-full" /></div></div> : null}</div>;
}

function SwipeBackPreview() {
  const [screen, setScreen] = useState<"detail" | "list">("detail");
  return <div className="relative h-40 overflow-hidden rounded-xl border border-line bg-cloud-50">{screen === "detail" ? <SwipeBackGesture onBack={() => setScreen("list")} behind={<div className="grid size-full place-items-center bg-cloud-100 text-sm text-ink-500">Project list</div>} className="size-full"><div className="grid size-full place-items-center text-sm">Swipe from the left edge</div></SwipeBackGesture> : <button type="button" onClick={() => setScreen("detail")} className="grid size-full place-items-center text-sm text-ink-700">List — tap to reopen</button>}</div>;
}

export const MOBILE_PREVIEWS: Record<string, ReactNode> = {
  "morphing-bottom-navigation": <MorphingBottomNavigation />,
  "floating-dock-navigation": <FloatingDockNavigation />,
  "thumb-reach-menu": <ThumbReachMenu />,
  "bottom-search-sheet": <BottomSearchSheet />,
  "search-filter-morph": <SearchFilterMorph />,
  "inline-search-reveal": <InlineSearchReveal />,
  "detent-sheet": <DetentSheet />,
  "content-aware-sheet": <ContentAwareSheet title="Details" expandedContent="More context arrives only after the reader asks for it."><p className="text-sm leading-relaxed text-ink-700">A compact summary that owns its own next detail.</p></ContentAwareSheet>,
  "swipe-dismiss-card-sheet": <SwipeDismissCardSheet title="Preview card" />,
  "long-press-selection": <LongPressSelection />,
  "swipe-actions": <SwipeActions />,
  "focus-lift-field": <FocusLiftField />,
  "mobile-validation-morph": <MobileValidationMorph />,
  "progressive-mobile-form": <ProgressiveMobileForm />,
  "card-stack-browse": <CardStackBrowse />,
  "expand-in-place-card": <ExpandInPlaceCard />,
  "focus-rail-mobile": <FocusRailMobile />,
  "fullscreen-media-morph": <FullscreenMediaMorph />,
  "swipe-media-inspector": <SwipeMediaInspector />,
  "floating-media-controls": <FloatingMediaControls />,
  "bottom-toast-stack": <BottomToastStack />,
  "mobile-undo-bar": <MobileUndoBar />,
  "quick-action-sheet": <QuickActionSheet />,
  "hold-to-reveal-actions": <HoldToRevealActions />,
  "action-sheet": <ActionSheetPreview />,
  "wheel-picker": <WheelPickerPreview />,
  "swipe-back": <SwipeBackPreview />,
  "long-press-context-menu": <LongPressContextMenuPreview />,
  "pinch-zoom-image": <PinchZoomImagePreview />,
  "floating-tab-bar": <FloatingTabBar />,
  "contextual-bottom-bar": <ContextualBottomBarPreview />,
  "scroll-compact-bottom-nav": <ScrollCompactBottomNav />,
  "sticky-bottom-cta": <StickyBottomCTAPreview />,
  "floating-action-island": <FloatingActionIsland />,
  "swipe-to-confirm": <SwipeToConfirm />,
  "search-morph-header": <SearchMorphHeader />,
  "keyboard-aware-composer": <KeyboardAwareComposer />,
  "mobile-selection-bar": <MobileSelectionBar />,
  "progressive-auth-surface": <ProgressiveAuthSurface />,
  "auth-completion-morph": <AuthCompletionMorph />,
};
