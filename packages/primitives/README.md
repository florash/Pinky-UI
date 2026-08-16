# @pinky/primitives

Composable interaction behaviours for Pinky UI: magnetic pull, jelly response, tilt, morph,
liquid surfaces, proximity, spotlight, parallax and shared press/motion helpers.

## Registry installation

The `@pinky/*` `0.1.0` packages are prepared for public release but are not published to npm yet. Until publication, use Pinky UI from the repository source.

### After npm publication

```bash
npm install @pinky/primitives react motion
```

## Use

```tsx
import { Magnetic } from "@pinky/primitives";

<Magnetic strength={0.4}>
  <button type="button">Explore</button>
</Magnetic>;
```

The package preserves native focus and activation paths and includes reduced-motion fallbacks.
See the Pinky UI repository and its `/docs` guide for composition guidance. MIT licensed.
