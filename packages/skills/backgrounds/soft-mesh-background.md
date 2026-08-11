# Soft Mesh Background

## Purpose

`SoftMeshBackground` supplies a slow, themeable multi-stop atmosphere behind real content. Use it for Heroes, section intros and empty states that need warmth without an illustration.

Keep intensity around 0.35–0.7 and colors close enough to preserve foreground contrast. Avoid generic saturated SaaS gradients, stacking it with other ambient fields or placing it behind thin text without checking contrast.

It is pointer-transparent, static under reduced motion and pauses when offscreen. Mobile uses the same small fixed layer count, so never turn it into a particle system. Compose with calm typography and at most one local interactive effect.
