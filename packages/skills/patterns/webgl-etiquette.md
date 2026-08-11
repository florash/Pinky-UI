# WebGL Etiquette

Use WebGL only when actual geometry, camera depth or curved surfaces add meaning that CSS cannot provide. Do not use it to recreate a normal grid or a handful of cards.

Keep heavy spatial dependencies optional, lazy-load scenes, cap DPR, pause offscreen work, clean resources and always ship a non-WebGL fallback.
