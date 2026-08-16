# @pinky/components

Composed React surfaces and controls built on `@pinky/primitives`: cards, buttons, tabs,
toggles and menu/navigation controls with tactile, accessible feedback.

## Registry installation

The `@pinky/*` `0.1.0` packages are prepared for public release but are not published to npm yet. Until publication, use Pinky UI from the repository source.

### After npm publication

```bash
npm install @pinky/components @pinky/primitives react motion
```

## Use

```tsx
import { MagneticButton } from "@pinky/components";

<MagneticButton>Open the project</MagneticButton>;
```

Components keep keyboard, focus and touch paths usable when motion is reduced. MIT licensed.
