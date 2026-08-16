# @pinky/layouts

Interactive arrangements for collections: galleries, grids, stacks, editorial compositions and
spatial layouts where the arrangement itself carries meaning.

## Registry installation

The `@pinky/*` `0.1.0` packages are prepared for public release but are not published to npm yet. Until publication, use Pinky UI from the repository source.

### After npm publication

```bash
npm install @pinky/layouts @pinky/primitives react motion
```

## Use

```tsx
import { CardFan } from "@pinky/layouts";

<CardFan>
  <article>Arrival</article>
  <article>Commons</article>
</CardFan>;
```

Use the layouts with real content and provide a readable fallback for touch and reduced motion.
MIT licensed.
