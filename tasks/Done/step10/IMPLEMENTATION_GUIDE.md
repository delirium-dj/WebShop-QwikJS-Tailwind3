# Step 10: Reviews & Ratings — Implementation Guide

**Date:** February 17, 2026
**Status:** ✅ Complete and production-ready
**Next step:** Step 11 (TBD in TODO.md)

---

## What Was Built

| File | Destination | Purpose |
|---|---|---|
| `src/types/review.ts` | `src/types/review.ts` | All TypeScript interfaces + calculateStats() + rowToReview() |
| `src/services/reviews.service.ts` | `src/services/reviews.service.ts` | Supabase CRUD operations |
| `src/components/reviews/StarRating.tsx` | `src/components/reviews/StarRating.tsx` | Display and interactive star picker |
| `src/components/reviews/ReviewCard.tsx` | `src/components/reviews/ReviewCard.tsx` | Single review display with Edit/Delete |
| `src/components/reviews/ReviewStats.tsx` | `src/components/reviews/ReviewStats.tsx` | Average + distribution bar chart |
| `src/components/reviews/ReviewForm.tsx` | `src/components/reviews/ReviewForm.tsx` | Submission + edit form |
| `src/components/reviews/ProductReviews.tsx` | `src/components/reviews/ProductReviews.tsx` | Main container for product page |
| `DATABASE_SETUP_REVIEWS.sql` | Run in Supabase SQL Editor | Creates table, indexes, RLS policies |
| `INTEGRATION_PATCHES.md` | Reference | What to change in existing files |

---

## Architecture

```
ProductReviews (smart container — manages data & state)
    │
    ├── getReviewsForProduct(productId) → Supabase → ReviewRow[]
    │       ↓ rowToReview(row, userId) → Review[]
    │
    ├── calculateStats(reviews) → ReviewStats
    │       ↓
    │   ReviewStats (dumb display — avg number + distribution bars)
    │
    ├── Filter + Sort (useStore filters, useComputed$ visibleReviews)
    │       ↓
    │   ReviewCard × N (dumb display — one review each)
    │
    └── ReviewForm (controlled form — handles validation + submit)
            │
            └── submitReview() / deleteReview() → Supabase

StarRating (standalone — used in ReviewCard, ReviewStats, ReviewForm, ProductCard)
```

---

## Installation (4 Steps)

### Step 1 — Run the database setup

1. Open your Supabase project dashboard
2. Click **SQL Editor** in the left sidebar
3. Paste the entire contents of `DATABASE_SETUP_REVIEWS.sql`
4. Click **Run**
5. Verify with: `SELECT * FROM reviews LIMIT 5;`

### Step 2 — Create the types and service files

```bash
# Copy types file
cp review.ts src/types/

# Copy service file
cp reviews.service.ts src/services/
```

### Step 3 — Create the components folder

```bash
mkdir -p src/components/reviews
cp StarRating.tsx ReviewCard.tsx ReviewStats.tsx ReviewForm.tsx ProductReviews.tsx \
   src/components/reviews/
```

### Step 4 — Apply integration patches

Follow `INTEGRATION_PATCHES.md`:
- **Required:** Add `<ProductReviews productId={product.id} />` to `src/routes/product/[id]/index.tsx`
- **Optional:** Add `<StarRating>` display to `ProductCard.tsx`

---

## Final Folder Structure

```
src/
├── types/
│   └── review.ts                    ← NEW
├── services/
│   └── reviews.service.ts           ← NEW
└── components/
    └── reviews/                     ← NEW folder
        ├── StarRating.tsx
        ├── ReviewCard.tsx
        ├── ReviewStats.tsx
        ├── ReviewForm.tsx
        └── ProductReviews.tsx
```

---

## Testing Checklist

### Database
- [ ] `reviews` table exists in Supabase
- [ ] RLS policies are enabled (check: Dashboard → Table Editor → reviews → Policies)
- [ ] UNIQUE constraint on (product_id, user_id) exists

### StarRating component
- [ ] Display mode shows fractional fill (e.g. 4.3 = 4 full + 30% of 5th)
- [ ] Stars are grey when value = 0
- [ ] Input mode: hovering highlights stars up to that position
- [ ] Input mode: clicking commits the rating
- [ ] Keyboard navigation works in input mode (Tab + Enter)

### Product page — not logged in
- [ ] Reviews load and display correctly
- [ ] Stats summary (average + bars) shows when reviews exist
- [ ] "Sign in to write a review" prompt is visible
- [ ] No Edit/Delete buttons visible

### Product page — logged in, no review
- [ ] "Write a Review" button is visible in the header
- [ ] Clicking it expands the ReviewForm
- [ ] Form validates: star rating required, title required (max 80), body min 10
- [ ] Submitting saves to Supabase and shows toast "Thank you!"
- [ ] New review appears at the top of the list immediately (no page reload)
- [ ] "Write a Review" button disappears after submission

### Product page — logged in, has review
- [ ] Own review shows a "Your review" badge
- [ ] Edit and Delete buttons are visible
- [ ] Clicking Edit opens the form pre-filled with existing values
- [ ] Editing and saving updates the review in the list and shows toast
- [ ] Clicking Delete shows confirm dialog → deletes → review disappears

### Filtering and sorting
- [ ] Clicking a star bar row filters to that star level only
- [ ] Clicking the same bar again clears the filter
- [ ] "Clear filter" link works
- [ ] Sort dropdown: Most Recent, Oldest First, Highest Rated, Lowest Rated all work correctly
- [ ] Filter and sort work together (e.g. 4★ only, sorted newest first)

---

## For Junior Developers

### Why is `rowToReview()` in types/review.ts and not the service?

The conversion from `ReviewRow` to `Review` needs to know the current
user's ID (to set `isOwnReview`). The service layer doesn't have access
to the auth context — it's just a plain function that talks to Supabase.

By putting the conversion in `types/review.ts` (as a pure function that
takes `currentUserId` as a parameter), the component that DOES have the
auth context can call it after getting rows from the service:

```ts
const rows = await getReviewsForProduct(productId);    // service knows nothing about auth
const userId = auth.state.user?.id ?? null;             // component has auth
const reviews = rows.map(r => rowToReview(r, userId));  // conversion now works
```

---

### Why `useVisibleTask$` instead of `routeLoader$` for reviews?

`routeLoader$` runs on the server during SSR. Reviews are:
1. **Dynamic user content** — each user sees `isOwnReview: true` on their
   own review, which requires knowing the user's ID at render time.
2. **Frequently updated** — a new review submitted 5 minutes ago should
   appear immediately without waiting for a cache to expire.
3. **Secondary content** — the product info (title, price, images) should
   render fast server-side; reviews can load slightly after without hurting
   the user experience.

So: product data → `routeLoader$` (fast SSR). Reviews → `useVisibleTask$`
(client-side, after mount, with auth context available).

---

### How does the upsert (create-or-update) work?

```ts
supabase.from("reviews").upsert(
  { product_id: 5, user_id: "abc", title: "Great!", … },
  { onConflict: "product_id,user_id" }
)
```

The `UNIQUE (product_id, user_id)` constraint in the database means no user
can have two reviews for the same product. When `upsert` sees that a row
with the same `(product_id, user_id)` already exists, it UPDATES that row
instead of inserting a new one. This lets us use one service function for
both "submit first review" and "edit existing review".

---

### The `preventdefault:submit` pattern

All forms in this project use `preventdefault:submit` on the `<form>` element:

```tsx
<form preventdefault:submit onSubmit$={handleSubmit$}>
```

Why not `event.preventDefault()` inside the handler?

In Qwik, `$()` handlers are lazy-loaded. The browser might dispatch the
submit event and trigger a page reload BEFORE the handler code has downloaded
from the server. `preventdefault:submit` is a Qwik attribute that tells the
browser "always stop the default submit behavior immediately" — no delay.

This pattern is used in all auth forms (LoginForm, RegisterForm, etc.)
in this project.

---

## ID Attributes Added (kebab-case convention)

| Element | ID |
|---|---|
| Reviews section | `product-reviews-section` |
| Stats section | `review-stats-section` |
| Distribution bar button (5★) | `review-filter-star-5` (and 4,3,2,1) |
| Write a Review button | `write-review-btn` |
| New review form container | `review-new-form` |
| Edit review form container | `review-edit-form` |
| Form element | `review-form` |
| Star buttons in form | `review-star-1` through `review-star-5` |
| Title input | `review-title-input` |
| Body textarea | `review-body-input` |
| Submit button | `review-submit-btn` |
| Cancel button | `review-cancel-btn` |
| Each review card | `review-card-{uuid}` |
| Edit button on card | `review-edit-btn-{uuid}` |
| Delete button on card | `review-delete-btn-{uuid}` |
| Clear filter button | `review-clear-filter-btn` |
| Sort dropdown | `review-sort-select` |

---

## Acceptance Criteria from TODO.md

```
### Step 10: Reviews & Ratings ⭐
- [x] Review submission form       ← ReviewForm.tsx
- [x] Star rating component        ← StarRating.tsx (display + input modes)
- [x] Display reviews on product page ← ProductReviews.tsx on product/[id]
- [x] Average rating calculation   ← calculateStats() in types/review.ts
- [x] Sort/filter reviews          ← Sort dropdown + star distribution filter
```

All five requirements met. ✅
