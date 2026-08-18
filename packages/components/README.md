# @pinky-ui/components

Composed React surfaces and controls built on `@pinky-ui/primitives`: cards, buttons, tabs,
toggles and menu/navigation controls with tactile, accessible feedback.

## Registry installation

The `@pinky-ui/*` `0.1.0` packages are prepared for public release but are not published to npm yet. Until publication, use Pinky UI from the repository source.

### After npm publication

```bash
npm install @pinky-ui/components @pinky-ui/primitives react motion
```

## Use

```tsx
import { MagneticButton } from "@pinky-ui/components";

<MagneticButton>Open the project</MagneticButton>;
```

Components keep keyboard, focus and touch paths usable when motion is reduced. MIT licensed.
