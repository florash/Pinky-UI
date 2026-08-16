# @pinky/effects

Cursor, motion, text and scroll effects for Pinky UI. Effects are expressive layers that keep
content, native interaction and performance in charge.

## Registry installation

The `@pinky/*` `0.1.0` packages are prepared for public release but are not published to npm yet. Until publication, use Pinky UI from the repository source.

### After npm publication

```bash
npm install @pinky/effects @pinky/primitives react motion
```

## Use

```tsx
import { CursorSpotlight } from "@pinky/effects";

<CursorSpotlight>
  <section>Readable content</section>
</CursorSpotlight>;
```

Effects include reduced-motion paths and should not be the only way a state is understood. MIT
licensed.
