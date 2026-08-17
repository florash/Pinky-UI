"use client";

import { usePressSpring } from "@pinky-ui/primitives";
import { motion, useTransform } from "motion/react";
import { forwardRef, type ReactNode } from "react";

import { cn } from "../../utils/cn";
import { DISABLED, FOCUS_RING, useEngagement } from "./internal";

export type SplitActionButtonProps = {
  children: ReactNode;
  onAction?: () => void;
  onMenu?: () => void;
  /** Names the secondary target. Icon-only controls need their own name. */
  menuLabel?: string;
  /** Reflected on the caret so a menu it opens is announced correctly. */
  menuOpen?: boolean;
  disabled?: boolean;
  className?: string;
};

/**
 * Construction: one shell, two chambers, divided by a single hairline —
 * `[ Create ][ ⌄ ]`.
 *
 * Motion signature — **independent chambers**. Alone in this family the button
 * has two press targets, so the signature is that they never move together:
 * hovering the caret lifts only the caret, pressing it depresses only the
 * caret, and the primary action stays exactly where it was. The shared shell
 * holds them together visually while the depth keeps them separate to the hand.
 *
 * They are two real `<button>` elements, not one button with a click-position
 * test — which is the only way the caret can carry `aria-haspopup` and
 * `aria-expanded` for the menu it opens while the primary action stays a plain
 * action.
 */
export const SplitActionButton = forwardRef<HTMLDivElement, SplitActionButtonProps>(
  function SplitActionButton(
    { children, onAction, onMenu, menuLabel = "More actions", menuOpen, disabled, className },
    ref,
  ) {
    const primary = useEngagement();
    const caret = useEngagement();
    const primaryPress = usePressSpring({ scale: 1, disabled });
    const caretPress = usePressSpring({ scale: 1, disabled });

    const primaryY = useTransform(
      [primary.value, primaryPress.pressed],
      ([hover, pressed]: number[]) => (hover ?? 0) * -1.5 + (pressed ?? 0) * 2.5,
    );
    const caretY = useTransform([caret.value, caretPress.pressed], ([hover, pressed]: number[]) =>
      (hover ?? 0) * -1.5 + (pressed ?? 0) * 2.5,
    );
    const caretRotate = useTransform(caret.value, [0, 1], [0, 180]);

    const chamber =
      "relative inline-flex h-11 items-center justify-center text-sm font-medium text-ink-900 transition-[background-color] duration-200 motion-reduce:transition-none";

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex overflow-hidden rounded-pill border border-[color:var(--color-line)] bg-white",
          "[box-shadow:var(--depth-raised-sm),var(--edge-light)]",
          className,
        )}
      >
        <motion.button
          type="button"
          disabled={disabled}
          onClick={onAction}
          style={{ y: primaryY }}
          className={cn(chamber, "px-6 hover:bg-blush-50", FOCUS_RING, DISABLED)}
          {...primary.handlers}
          {...primaryPress.handlers}
        >
          {children}
        </motion.button>

        {/* The divider belongs to the shell, not to either chamber. */}
        <span aria-hidden className="my-2 w-px shrink-0 bg-[color:var(--color-line-strong)]" />

        <motion.button
          type="button"
          disabled={disabled}
          onClick={onMenu}
          aria-label={menuLabel}
          aria-haspopup="menu"
          aria-expanded={menuOpen ?? false}
          style={{ y: caretY }}
          className={cn(chamber, "w-11 hover:bg-blush-50", FOCUS_RING, DISABLED)}
          {...caret.handlers}
          {...caretPress.handlers}
        >
          <motion.span aria-hidden style={{ rotate: caretRotate }} className="block text-xs leading-none">
            ⌄
          </motion.span>
        </motion.button>
      </div>
    );
  },
);
