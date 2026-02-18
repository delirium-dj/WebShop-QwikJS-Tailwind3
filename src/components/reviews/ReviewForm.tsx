/**
 * ============================================================
 * REVIEW FORM COMPONENT
 * File: src/components/reviews/ReviewForm.tsx
 * ============================================================
 *
 * The form a logged-in user fills in to submit or edit a review.
 *
 * Fields:
 *   1. Star rating picker (interactive StarRating in "input" mode)
 *   2. Review title (short headline)
 *   3. Review body (multi-line textarea)
 *   4. Submit / Update button
 *   5. Cancel button (when editing an existing review)
 *
 * ── FOR JUNIOR DEVELOPERS ─────────────────────────────────────
 * This component is CONTROLLED — all form state lives in a
 * useStore() inside this component. The parent doesn't track
 * form field values; it only knows when the form is submitted
 * (via the onSubmit$ callback).
 *
 * Form submission flow:
 *   1. User clicks stars → formState.rating updates
 *   2. User types title/body → formState.title/body update
 *   3. User clicks "Submit" → handleSubmit$() runs
 *   4. handleSubmit$() validates the data locally
 *   5. If valid → calls onSubmit$(formData)
 *   6. Parent handles the Supabase call and refreshes the list
 *
 * IMPORTANT: We use preventdefault:submit on the <form> element.
 * In Qwik, calling event.preventDefault() inside a $() handler
 * can be too slow because the handler is lazy-loaded. The browser
 * might reload the page before the code downloads!
 * preventdefault:submit stops the browser instantly at the DOM level.
 * ──────────────────────────────────────────────────────────────
 */

import { component$, useStore, $ } from "@builder.io/qwik";
import type { QRL } from "@builder.io/qwik";
import type { ReviewFormData, StarRating } from "~/types/review";
import type { Review } from "~/types/review";
import { StarRating as StarRatingComponent } from "./StarRating";

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const TITLE_MAX = 80;  // characters — keeps titles concise
const BODY_MAX  = 2000; // characters

// ─────────────────────────────────────────────────────────────────────────────
// PROPS
// ─────────────────────────────────────────────────────────────────────────────

interface ReviewFormProps {
  /**
   * If provided, the form is in "edit" mode and will be pre-filled
   * with this review's current values. The submit button will say "Update".
   * If null/undefined, the form is in "new" mode (empty fields, "Submit" button).
   */
  existingReview?: Review | null;

  /**
   * Called when the user submits valid form data.
   * The parent component calls the service and refreshes the list.
   */
  onSubmit$: QRL<(data: ReviewFormData) => Promise<void>>;

  /**
   * Called when the user clicks "Cancel" on an edit form.
   * The parent hides the form.
   */
  onCancel$?: QRL<() => void>;

  /** Whether the parent is currently saving (disables submit button) */
  isSubmitting?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// LOCAL FORM STATE
// ─────────────────────────────────────────────────────────────────────────────

interface FormState {
  rating: number;   // 0 = not yet chosen; 1–5 = selected
  title: string;
  body: string;
  errors: {
    rating: string;
    title: string;
    body: string;
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export const ReviewForm = component$<ReviewFormProps>((props) => {
  const { existingReview, onSubmit$, onCancel$, isSubmitting = false } = props;
  const isEditing = !!existingReview;

  /**
   * formState — all local form data and validation errors.
   * Pre-filled if editing an existing review.
   */
  const formState = useStore<FormState>({
    rating: existingReview?.rating ?? 0,
    title:  existingReview?.title  ?? "",
    body:   existingReview?.body   ?? "",
    errors: { rating: "", title: "", body: "" },
  });

  // ── Validation ───────────────────────────────────────────────────────────

  /**
   * validate — checks all fields and populates formState.errors.
   * Returns true if the form is valid, false otherwise.
   *
   * Why validate client-side?
   * - Instant feedback (no round-trip to the server)
   * - Supabase will also enforce constraints server-side (safety net)
   */
  const validate$ = $(() => {
    let valid = true;
    formState.errors = { rating: "", title: "", body: "" };

    if (formState.rating < 1 || formState.rating > 5) {
      formState.errors.rating = "Please select a star rating.";
      valid = false;
    }

    if (!formState.title.trim()) {
      formState.errors.title = "Please add a short title for your review.";
      valid = false;
    } else if (formState.title.trim().length > TITLE_MAX) {
      formState.errors.title = `Title must be ${TITLE_MAX} characters or fewer.`;
      valid = false;
    }

    if (!formState.body.trim()) {
      formState.errors.body = "Please write your review.";
      valid = false;
    } else if (formState.body.trim().length < 10) {
      formState.errors.body = "Review must be at least 10 characters.";
      valid = false;
    } else if (formState.body.trim().length > BODY_MAX) {
      formState.errors.body = `Review must be ${BODY_MAX} characters or fewer.`;
      valid = false;
    }

    return valid;
  });

  /**
   * handleSubmit$ — called when the form is submitted.
   * Validates first, then calls the parent's onSubmit$ callback.
   */
  const handleSubmit$ = $(async () => {
    const isValid = await validate$();
    if (!isValid) return;

    await onSubmit$({
      rating: formState.rating as StarRating,
      title:  formState.title.trim(),
      body:   formState.body.trim(),
    });

    // Reset form on successful new submission (editing keeps the form visible
    // momentarily while the parent closes it)
    if (!isEditing) {
      formState.rating = 0;
      formState.title  = "";
      formState.body   = "";
    }
  });

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div
      id={isEditing ? "review-edit-form" : "review-new-form"}
      class="bg-blue-50 rounded-2xl border border-blue-100 p-5 space-y-4"
    >
      {/* Form heading */}
      <h3 class="font-semibold text-gray-900 text-base">
        {isEditing ? "Edit Your Review" : "Write a Review"}
      </h3>

      {/*
        IMPORTANT: preventdefault:submit is required in Qwik.
        Regular event.preventDefault() inside $() is too slow — the browser
        may submit the form and reload the page before the code downloads.
        This attribute stops the browser at the DOM level immediately.
      */}
      <form
        id="review-form"
        preventdefault:submit
        onSubmit$={handleSubmit$}
        class="space-y-4"
        noValidate
      >
        {/* ── 1. STAR RATING PICKER ── */}
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Your Rating
            <span class="text-red-500 ml-0.5">*</span>
          </label>
          <StarRatingComponent
            value={formState.rating}
            mode="input"
            size="lg"
            onChange$={(rating) => {
              formState.rating = rating;
              formState.errors.rating = "";
            }}
          />
          {formState.errors.rating && (
            <p class="mt-1 text-xs text-red-500" role="alert">
              {formState.errors.rating}
            </p>
          )}
        </div>

        {/* ── 2. TITLE ── */}
        <div>
          <label
            for="review-title-input"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Review Title
            <span class="text-red-500 ml-0.5">*</span>
          </label>
          <input
            id="review-title-input"
            type="text"
            value={formState.title}
            onInput$={(e) => {
              formState.title = (e.target as HTMLInputElement).value;
              formState.errors.title = "";
            }}
            maxLength={TITLE_MAX}
            placeholder="Summarise your experience in a few words"
            class={[
              "w-full px-3 py-2 text-sm rounded-lg border bg-white",
              "focus:outline-none focus:ring-2 focus:ring-blue-500",
              "placeholder:text-gray-400 transition-colors",
              formState.errors.title
                ? "border-red-400 focus:ring-red-400"
                : "border-gray-300",
            ].join(" ")}
            aria-required="true"
            aria-describedby={formState.errors.title ? "review-title-error" : undefined}
          />
          <div class="flex justify-between mt-1">
            {formState.errors.title ? (
              <p id="review-title-error" class="text-xs text-red-500" role="alert">
                {formState.errors.title}
              </p>
            ) : (
              <span />
            )}
            <span class="text-xs text-gray-400 ml-auto">
              {formState.title.length}/{TITLE_MAX}
            </span>
          </div>
        </div>

        {/* ── 3. REVIEW BODY ── */}
        <div>
          <label
            for="review-body-input"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Your Review
            <span class="text-red-500 ml-0.5">*</span>
          </label>
          <textarea
            id="review-body-input"
            value={formState.body}
            onInput$={(e) => {
              formState.body = (e.target as HTMLTextAreaElement).value;
              formState.errors.body = "";
            }}
            maxLength={BODY_MAX}
            rows={4}
            placeholder="Tell others about your experience with this product…"
            class={[
              "w-full px-3 py-2 text-sm rounded-lg border bg-white resize-none",
              "focus:outline-none focus:ring-2 focus:ring-blue-500",
              "placeholder:text-gray-400 transition-colors",
              formState.errors.body
                ? "border-red-400 focus:ring-red-400"
                : "border-gray-300",
            ].join(" ")}
            aria-required="true"
            aria-describedby={formState.errors.body ? "review-body-error" : undefined}
          />
          <div class="flex justify-between mt-1">
            {formState.errors.body ? (
              <p id="review-body-error" class="text-xs text-red-500" role="alert">
                {formState.errors.body}
              </p>
            ) : (
              <span />
            )}
            <span class="text-xs text-gray-400 ml-auto">
              {formState.body.length}/{BODY_MAX}
            </span>
          </div>
        </div>

        {/* ── 4. ACTION BUTTONS ── */}
        <div class="flex items-center gap-3 pt-1">
          {/* Submit / Update */}
          <button
            id="review-submit-btn"
            type="submit"
            disabled={isSubmitting}
            class={[
              "px-5 py-2.5 text-sm font-medium text-white rounded-lg transition-all",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
              isSubmitting
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 active:scale-95",
            ].join(" ")}
          >
            {isSubmitting
              ? "Saving…"
              : isEditing
                ? "Update Review"
                : "Submit Review"}
          </button>

          {/* Cancel — shown in edit mode */}
          {isEditing && onCancel$ && (
            <button
              id="review-cancel-btn"
              type="button"
              onClick$={onCancel$}
              class="px-4 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
});
