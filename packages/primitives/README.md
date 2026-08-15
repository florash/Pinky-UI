# @pinky/primitives

Composable interaction behaviours for Pinky UI: magnetic pull, jelly response, tilt, morph,
liquid surfaces, proximity, spotlight, parallax and shared press/motion helpers.

## Install

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
