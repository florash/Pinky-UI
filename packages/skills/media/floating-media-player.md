# Floating Media Player

## Purpose

`FloatingMediaPlayer` supplies inline, minimized and closed layout states around a host media player. Use it when a short lesson, demo or podcast should remain available while nearby content is read.

Do not use it as a streaming platform player, force minimization, cover mobile controls or resurrect a player after close. Play state belongs to the host; the component only exposes hooks and layout controls.

Minimize, restore, close and play/pause controls are labeled buttons. Mobile placement stays inside viewport margins and reduced motion changes layout immediately. Pause media when closed and clean up streams in the host implementation.
