/**
 * ============================================================
 * STAR RATING COMPONENT
 * File: src/components/reviews/StarRating.tsx
 * ============================================================
 *
 * Renders a row of 5 stars. Works in two distinct modes:
 *
 *  "display" — Read-only. Shows a filled/fractional star row for a
 *              numeric rating value (e.g. 4.3 fills 4 full stars +
 *              30% of the 5th). Used in ReviewStats, ReviewCard,
 *              and ProductCard.
 *
 *  "input"   — Interactive. Clickable stars for the review submission
 *              form. Hovering previews the rating; clicking commits it.
 *              The parent component owns the value via a signal.
 *
 * ── FOR JUNIOR DEVELOPERS ─────────────────────────────────────
 * "display" mode uses a CSS clip-width trick for fractional stars:
 *   - Two overlapping SVGs (grey underneath, gold on top)
 *   - The gold one is clipped to `width: {fillPercent}%`
 *   - e.g. 30% fill → only the left 30% of the star is gold
 *
 * "input" mode is a "controlled" component — the parent owns the
 * selected value and passes it as a prop. When the user clicks, we
 * call onChange$() and the parent updates its signal.
 * This is the same idea as <input value={x} onChange={(e) => setX(e.target.value)} />
 * ──────────────────────────────────────────────────────────────
 *
 * Usage — display (read-only, supports fractional values):
 * ```tsx
 * <StarRating value={4.3} mode="display" size="sm" />
 * ```
 *
 * Usage — input (clickable, integer 0–5):
 * ```tsx
 * <StarRating
 *   value={selectedRating.value}
 *   mode="input"
 *   size="lg"
 *   onChange$={(rating) => { selectedRating.value = rating; }}
 * />
 * ```
 */

import { component$, useSignal, $ } from "@builder.io/qwik";
import type { StarRating as StarRatingValue } from "~/types/review";

// ─────────────────────────────────────────────────────────────────────────────
// PROPS
// ─────────────────────────────────────────────────────────────────────────────

interface StarRatingProps {
  /**
   * The numeric rating to display or the currently selected rating.
   * - "display" mode: fractional OK (e.g. 4.3)
   * - "input" mode:   0 (nothing selected) or 1–5 (committed)
   */
  value: number;

  /**
   * "display" — read-only, decorative
   * "input"   — clickable stars for a form
   * Default: "display"
   */
  mode?: "display" | "input";

  /**
   * Size variant:
   *   "xs" → 12 px  (ProductCard — very compact)
   *   "sm" → 16 px  (ReviewCard)
   *   "md" → 20 px  (ReviewStats header)  ← default
   *   "lg" → 28 px  (ReviewForm picker)
   */
  size?: "xs" | "sm" | "md" | "lg";

  /**
   * Called when the user clicks a star in "input" mode.
   * Receives the chosen star value (1–5).
   * Required in "input" mode, ignored in "display" mode.
   */
  onChange$?: (rating: StarRatingValue) => void;

  /** Extra CSS classes for outer wrapper positioning */
  class?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// SHARED STAR PATH — the same SVG path used for both filled and empty stars
// ─────────────────────────────────────────────────────────────────────────────

/** The Heroicons solid star path — reused in both SVGs to stay DRY */
const STAR_PATH =
  "M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.006z";

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export const StarRating = component$<StarRatingProps>((props) => {
  const { value, mode = "display", size = "md", onChange$ } = props;

  // ── Size maps ────────────────────────────────────────────────────────────
  const sizeClasses: Record<string, string> = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-7 h-7",
  };
  const gapClasses: Record<string, string> = {
    xs: "gap-0.5",
    sm: "gap-0.5",
    md: "gap-1",
    lg: "gap-1.5",
  };
  const starSize = sizeClasses[size] ?? "w-5 h-5";
  const gap = gapClasses[size] ?? "gap-1";

  // ─────────────────────────────────────────────────────────────────────────
  // DISPLAY MODE — fractional read-only stars
  // ─────────────────────────────────────────────────────────────────────────
  if (mode === "display") {
    return (
      <div
        class={`flex items-center ${gap} ${props.class ?? ""}`}
        role="img"
        aria-label={`Rating: ${value} out of 5 stars`}
      >
        {([1, 2, 3, 4, 5] as StarRatingValue[]).map((star) => {
          /**
           * How fractional fill works:
           *   value=4.3, star=5 → fill = clamp(4.3 - 4, 0, 1) = 0.3 → 30%
           *   value=4.3, star=4 → fill = clamp(4.3 - 3, 0, 1) = 1.0 → 100%
           *   value=4.3, star=1 → fill = clamp(4.3 - 0, 0, 1) = 1.0 → 100%
           */
          const rawFill = value - (star - 1);
          const fillPercent = Math.round(Math.min(1, Math.max(0, rawFill)) * 100);

          return (
            <span
              key={star}
              class={`relative inline-block ${starSize} flex-shrink-0`}
            >
              {/* Layer 1: grey (empty) star — always visible */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class={`${starSize} text-gray-200 absolute inset-0`}
                aria-hidden="true"
              >
                <path fill-rule="evenodd" d={STAR_PATH} clip-rule="evenodd" />
              </svg>

              {/* Layer 2: gold (filled) star — clipped to fillPercent% width */}
              <span
                class="absolute inset-0 overflow-hidden"
                style={{ width: `${fillPercent}%` }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class={`${starSize} text-amber-400`}
                  aria-hidden="true"
                >
                  <path fill-rule="evenodd" d={STAR_PATH} clip-rule="evenodd" />
                </svg>
              </span>
            </span>
          );
        })}
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // INPUT MODE — clickable stars
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * hovered — which star the mouse is currently over (0 = none).
   * Only used in input mode. Resets to 0 on mouse-leave.
   */
  const hovered = useSignal(0);

  /**
   * The visual fill comes from the hover preview if hovering,
   * otherwise from the committed value (the `value` prop).
   */
  const activeValue = hovered.value > 0 ? hovered.value : value;

  const handleClick$ = $((star: StarRatingValue) => {
    if (onChange$) onChange$(star);
    hovered.value = 0; // clear hover state after click
  });

  return (
    <div
      class={`flex items-center ${gap} ${props.class ?? ""}`}
      role="radiogroup"
      aria-label="Select star rating"
      onMouseLeave$={() => (hovered.value = 0)}
    >
      {([1, 2, 3, 4, 5] as StarRatingValue[]).map((star) => {
        const isFilled = star <= activeValue;
        const isHovered = hovered.value > 0 && star <= hovered.value;

        return (
          <button
            key={star}
            id={`review-star-${star}`}
            type="button"
            role="radio"
            aria-checked={star === value}
            aria-label={`${star} star${star !== 1 ? "s" : ""}`}
            onClick$={() => handleClick$(star)}
            onMouseEnter$={() => (hovered.value = star)}
            class={[
              starSize,
              "flex-shrink-0 focus:outline-none",
              "focus-visible:ring-2 focus-visible:ring-amber-400 rounded",
              "transition-transform duration-100",
              // Scale up on hover for tactile feedback
              isHovered ? "scale-125" : "scale-100",
            ].join(" ")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class={[
                starSize,
                "transition-colors duration-100",
                isFilled ? "text-amber-400" : "text-gray-200",
              ].join(" ")}
              aria-hidden="true"
            >
              <path fill-rule="evenodd" d={STAR_PATH} clip-rule="evenodd" />
            </svg>
          </button>
        );
      })}
    </div>
  );
});
