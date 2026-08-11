# Ambient vs Interactive Motion

## Purpose

Ambient motion sets atmosphere without claiming a target; interactive motion responds to a meaningful hover, focus, press or scroll relationship. Keep those roles visually distinct.

Cursor blobs, soft spotlights and slow background shifts are ambient. Cursor text, magnetic targets, hover previews and underlines are interactive. Do not let an ambient layer look like a control, and do not add a second interactive response when the first already explains the action.

Ambient layers are optional, pointer-transparent and removable on touch/reduced motion. Interactive states need keyboard equivalents, stable semantics and a static fallback.
