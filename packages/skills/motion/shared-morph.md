# Shared Morph

## Purpose

Use Pinky’s existing `Morph` primitive for a shared-element transition from a trigger surface into an expanded dialog. It is the single morph system for thumbnail-to-detail, card-to-panel and avatar-to-profile flows.

Use it when the same object clearly persists across states and the expanded surface has a focused task. Do not build a second layout-ID system or morph unrelated page regions. For a normal route change, a simple transition is clearer.

Keep the expanded state a real dialog with Escape, focus management and a return path. Reduced motion removes the travel while preserving the open/close behavior. The trigger must remain a native button or an equivalent semantic control.
