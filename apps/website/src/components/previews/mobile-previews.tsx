"use client";

import {
  AuthCompletionMorph,
  BottomSearchSheet,
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
  SwipeDismissCardSheet,
  SwipeMediaInspector,
  SwipeToConfirm,
  ThumbReachMenu,
} from "@pinky/systems";
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
