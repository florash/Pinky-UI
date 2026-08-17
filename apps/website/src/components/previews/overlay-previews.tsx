"use client";

import {
  AdaptivePopover,
  AnchoredInspector,
  ContextMenuSurface,
  CursorActionSurface,
  Dialog,
  EdgeDockedPanel,
  ExpandingActionSurface,
  FollowAnchorSurface,
  MorphingContextSurface,
  NestedSurfaceStack,
  PeekOverlay,
  SelectionToolbar,
  SharedContextSurface,
  SpotlightOverlay,
  Tooltip,
} from "@pinky-ui/systems";
import { useState, type ReactNode } from "react";

function DialogDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex min-h-11 items-center rounded-pill bg-ink-900 px-4 text-sm font-medium text-milk"
      >
        Open dialog
      </button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="Delete project?"
        description="This cannot be undone."
        footer={
          <>
            <button type="button" onClick={() => setOpen(false)} className="inline-flex min-h-11 items-center rounded-pill border border-line px-4 text-sm">
              Cancel
            </button>
            <button type="button" onClick={() => setOpen(false)} className="inline-flex min-h-11 items-center rounded-pill bg-ink-900 px-4 text-sm text-milk">
              Delete
            </button>
          </>
        }
      />
    </>
  );
}

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
  tooltip: (
    <Tooltip content="Copy to clipboard">
      <button type="button" className="inline-flex min-h-11 items-center rounded-pill border border-line bg-white px-4 text-sm">
        Hover or focus me
      </button>
    </Tooltip>
  ),
  dialog: <DialogDemo />,
};
