# @pinky-ui/experiences

Page-scale interaction experiences for navigation, heroes, backgrounds, transitions and spatial
UI. These compositions are built from Pinky primitives and effects rather than a separate theme.

## Registry installation

The `@pinky-ui/*` `0.1.0` packages are prepared for public release but are not published to npm yet. Until publication, use Pinky UI from the repository source.

### After npm publication

```bash
npm install @pinky-ui/experiences @pinky-ui/effects @pinky-ui/primitives react motion
```

## Use

```tsx
import { MorphMenu } from "@pinky-ui/experiences";

<MorphMenu items={items} />;
```

Keep destinations and focus semantics clear; motion should support wayfinding, not delay it. MIT
licensed.
