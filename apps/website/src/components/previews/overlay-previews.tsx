"use client";

import {
  AdaptivePopover,
  AnchoredInspector,
  ContextMenuSurface,
  CursorActionSurface,
  EdgeDockedPanel,
  ExpandingActionSurface,
  FollowAnchorSurface,
  MorphingContextSurface,
  NestedSurfaceStack,
  PeekOverlay,
  SelectionToolbar,
  SharedContextSurface,
  SpotlightOverlay,
} from "@pinky/systems";
import type { ReactNode } from "react";

const OVERLAY_INSPECTOR_ITEMS = [
  { id: "source", label: "Source surface", meta: "Canvas / 01", value: "Selected", description: "The inspector remains next to the source." },
  { id: "caption", label: "Caption layer", meta: "Content / 02", value: "Attached", description: "A short context value without a route change." },
  { id: "frame", label: "Frame study", meta: "Media / 03", value: "Ready", description: "The selected frame owns the nearby context." },
];

export const OVERLAY_PREVIEWS: Record<string, ReactNode> = {
  "anchored-inspector": <AnchoredInspector items={OVERLAY_INSPECTOR_ITEMS} />,
  "adaptive-popover": <AdaptivePopover title="Adaptive context">This surface flips and shifts inside its local boundary.</AdaptivePopover>,
  "context-menu-surface": <ContextMenuSurface />,
  "selection-toolbar": <SelectionToolbar />,
  "peek-overlay": <PeekOverlay />,
  "nested-surface-stack": <NestedSurfaceStack />,
  "spotlight-overlay": <SpotlightOverlay />,
  "cursor-action-surface": <CursorActionSurface />,
  "edge-docked-panel": <EdgeDockedPanel />,
  "expanding-action-surface": <ExpandingActionSurface />,
  "follow-anchor-surface": <FollowAnchorSurface />,
  "shared-context-surface": <SharedContextSurface />,
  "morphing-context-surface": <MorphingContextSurface />,
};
