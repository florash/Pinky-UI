/**
 * A single global pointer listener shared by every Pinky primitive.
 *
 * Attaching one `pointermove` handler per component is the usual way this gets
 * written, and it scales badly: a page with a dozen magnetic elements ends up
 * running a dozen handlers per move event. Here we keep one listener, batch to
 * a frame, and fan the result out to subscribers.
 */

export type PointerSnapshot = {
  x: number;
  y: number;
  /** False before the first pointer event, or once the pointer leaves the window. */
  active: boolean;
  /** True for coarse pointers (touch), where proximity effects should stay off. */
  coarse: boolean;
};

type Subscriber = (snapshot: PointerSnapshot) => void;

const subscribers = new Set<Subscriber>();

const snapshot: PointerSnapshot = { x: 0, y: 0, active: false, coarse: false };

let listening = false;
let frame = 0;

function flush() {
  frame = 0;
  for (const subscriber of subscribers) subscriber(snapshot);
}

function schedule() {
  if (frame) return;
  frame = requestAnimationFrame(flush);
}

function handleMove(event: PointerEvent) {
  snapshot.x = event.clientX;
  snapshot.y = event.clientY;
  snapshot.active = true;
  snapshot.coarse = event.pointerType !== "mouse";
  schedule();
}

function handleLeave() {
  snapshot.active = false;
  schedule();
}

function start() {
  if (listening || typeof window === "undefined") return;
  listening = true;
  window.addEventListener("pointermove", handleMove, { passive: true });
  window.addEventListener("pointerdown", handleMove, { passive: true });
  document.addEventListener("pointerleave", handleLeave);
  window.addEventListener("blur", handleLeave);
}

function stop() {
  if (!listening) return;
  listening = false;
  window.removeEventListener("pointermove", handleMove);
  window.removeEventListener("pointerdown", handleMove);
  document.removeEventListener("pointerleave", handleLeave);
  window.removeEventListener("blur", handleLeave);
  if (frame) {
    cancelAnimationFrame(frame);
    frame = 0;
  }
}

export function subscribeToPointer(subscriber: Subscriber): () => void {
  subscribers.add(subscriber);
  start();
  if (snapshot.active) subscriber(snapshot);

  return () => {
    subscribers.delete(subscriber);
    if (subscribers.size === 0) stop();
  };
}
