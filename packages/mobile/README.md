# @pinky-ui/mobile

Native-feeling mobile primitives: a Dynamic Island-style status pill, a generic drag-to-dismiss
gesture wrapper, and a glass layer for nav bars and sheets. The first slice of a larger mobile
family — gesture, feed and AI-chat groups are on the way.

## Registry installation

The `@pinky-ui/*` `0.1.0` packages are prepared for public release but are not published to npm yet. Until publication, use Pinky UI from the repository source, or `npx pinky-ui add <slug>` once the CLI is published.

### After npm publication

```bash
npm install @pinky-ui/mobile @pinky-ui/primitives react motion
```

## Use

```tsx
import { DynamicIslandLayer, DragToDismiss, GlassLayer } from "@pinky-ui/mobile";

<DynamicIslandLayer compact={<span>2 downloads</span>} expanded={<DownloadProgress />} />;

<DragToDismiss onDismiss={closePhoto} onProgress={(p) => setBackdropOpacity(1 - p)}>
  <PhotoViewer src={photo} />
</DragToDismiss>;

<GlassLayer edge="bottom" tint="clear">
  <TabBar />
</GlassLayer>;
```

Every surface respects `safe-area-inset-*`, keeps touch targets at 44×44 or larger, and renders a
complete static state with `prefers-reduced-motion: reduce` — gestures are the enhancement, never
the only path. MIT licensed.
