# @pinky/systems

Product interaction systems for media, forms, data, collections, overlays and workflows. The
package covers stateful UI patterns such as validation, selection, charts, sheets and feedback.

## Registry installation

The `@pinky/*` `0.1.0` packages are prepared for public release but are not published to npm yet. Until publication, use Pinky UI from the repository source.

### After npm publication

```bash
npm install @pinky/systems @pinky/primitives react motion
```

## Use

```tsx
import { ValidationField } from "@pinky/systems";

<ValidationField label="Email" />;
```

Systems keep semantic controls, keyboard alternatives, touch fallbacks and reduced-motion states
in the public interaction. MIT licensed.
