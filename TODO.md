# TODO List

## Goals to implement

- [ ] **Qwik Link Integration**: Update navigation to use `Link` from `@builder.io/qwik-city` for SPA-like transitions.
- [ ] **Hydration Optimization**: Ensure client-only code only hydrates when necessary.
- [ ] **Server-Side Data Fetching**: Use Qwik's `routeLoader$` for products.

## Recommended Development Order (Step-by-Step)

### Step 0: Hamburger Menu ⚡ (COMPLETED ✅)

Why first? This is a critical missing piece for an e-commerce site. Users need to view full product information.

#### What to implement:

- [x] Hamburger menu for mobile devices
- [x] It should be sticky, over the whole screen, slightly transparent and blured background
- [x] It should have categories, search bar, and cart icon
- [x] It should have a close button to close the menu on the exact same place it was opened

Benefits: Completes the core shopping flow (browse → view → add to cart)

### Step 1: Product Details Page ⭐ (COMPLETED ✅)

Why first? This is a critical missing piece for an e-commerce site. Users need to view full product information.

#### What to implement:

- [x] Dynamic route for individual products (/product/[id])
- [x] Product image gallery with zoom
- [x] Full product description
- [x] Price and availability display
- [x] Size/color/variant selectors (if applicable)
- [x] Quantity selector
- [x] Add to cart button
- [x] Related products section
- [x] Breadcrumb navigation

Benefits: Completes the core shopping flow (browse → view → add to cart)

### Step 2: Qwik Context Store for Cart 🛒 (COMPLETED ✅)

Why second? Provides proper state management foundation before adding more features.

#### What to implement:

- [x] Global cart context using Qwik's createContextId and useContext
- [x] Cart state interface (items, quantities, totals)
- [x] Helper functions (addToCart, removeFromCart, updateQuantity, clearCart)
- [x] Persist cart to localStorage
- [x] Cart count badge in header
- [x] Cart Item Card component
- [x] Cart Page (/cart) implementation

Benefits: Centralizes cart logic, prevents prop drilling, enables cart access anywhere

### Step 3: Enhanced Add to Cart with onClick$ ⚡ (COMPLETED ✅)

Why third? Leverages the context store you just built, adds proper Qwik event handling.

#### What to implement:

- [x] Replace existing cart buttons with proper onClick$ handlers
- [x] Add loading states during cart operations
- [x] Success notifications/toasts (integrated in Product Page and Home)
- [x] Optimistic UI updates
- [x] Prevent duplicate additions
- [x] **BUG FIX**: Prevent navigation when clicking "Add to Cart" on Home Page.
- [x] **BUG FIX**: Support multiple variants of the same product in cart.

Benefits: Better UX, proper Qwik reactivity, preparation for server actions

### Step 4: Cart Page/Drawer 🛍️ (COMPLETED ✅)

Why fourth? Users need to review their cart before checkout.

#### What to implement:

- [x] Cart sidebar/drawer that slides in
- [x] Cart page route (/cart)
- [x] List all cart items with thumbnails
- [x] Update quantities inline
- [x] Remove items
- [x] Show subtotal, taxes, shipping estimates
- [x] Checkout button
- [x] Empty cart state

Benefits: Completes the pre-checkout experience

### Step 5.1: Install Vite Image Tools (COMPLETED ✅)

#### What to implement:

- [x] Install Vite Image Tools
- [x] Configure Vite Image Tools
- [x] Implement image loading and optimization (AVIF, WebP, JPEG - in that preferred order)
- [x] Implement image lazy loading
- [x] Implement image placeholders
- [x] Implement image error handling
- [x] Implement image aspect ratio

### Step 5.2: Product Images (COMPLETED ✅)

#### What to implement:

- [x] Implement product images with optimization
- [x] Integrate `ProductImage` component with auto-optimization (AVIF/WebP)
- [x] Implement `ProductCard` with hover effects and quick actions
- [x] Implement `ImageGallery` with thumbnail navigation and zoom functionality
- [x] Use `ProductImage` for responsive, lazy-loaded images
- [x] Handle missing images with placeholders
- [x] Optimize images for performance and SEO
- [x] Added an `.npmrc` file to allow sharp (the image processing engine) to run its build scripts, which is required by `pnpm 10`.

### Step 5.3: Server-Side Data Fetching 🌐

Why fifth? Improves performance and SEO, enables dynamic product data.

#### What to implement:

- [ ] Use Qwik's routeLoader$ for products
- [ ] Implement server-side filtering/sorting
- [ ] Add pagination via server loader
- [ ] Cache product data appropriately
- [ ] Error handling for failed fetches

Benefits: Faster initial loads, better SEO, scalable data management

### Step 5.4: Netlify Deployment Fix (COMPLETED ✅)

#### What to implement:

- [x] Resolved Netlify `ENOENT` Error by implementing a post-build renaming script.
- [x] Created `scripts/fix-netlify-build.js` to rename virtual modules starting with `@` to `_`.
- [x] Integrated fix script into `package.json` build pipeline.
- [x] Fixed several build-blocking ESLint and TypeScript errors in product components.

### Step 6: User Authentication System 🔐

Why sixth? Required before implementing checkout and order history.

#### What to implement:

- [ ] Login/Register pages
- [ ] Session management (using server-side sessions or JWT)
- [ ] Protected routes
- [ ] User profile page
- [ ] Password reset flow
- [ ] Social logins (Google [a must have], Microsoft [optional], LinkedIn [optional], GitHub [optional], GitLab [optional])

Benefits: Enables personalized features, order tracking, saved addresses

### Step 7: Checkout Flow 💳

Why seventh? The ultimate goal of an e-commerce site.

#### What to implement:

- [ ] Multi-step checkout (Shipping → Payment → Review)
- [ ] Address form with validation
- [ ] Payment integration (Stripe, PayPal, etc.)
- [ ] Order summary
- [ ] Order confirmation page
- [ ] Email confirmation (via server action)

Benefits: Completes the purchase funnel

### Step 8: User Dashboard & Order History 📊

#### What to implement:

- [ ] User dashboard route
- [ ] Order history with status
- [ ] Order details page
- [ ] Track shipments
- [ ] Reorder functionality
- [ ] Saved addresses management

### Step 9: Wishlist Feature ❤️

#### What to implement:

- [ ] Wishlist context/store
- [ ] Add to wishlist button on products
- [ ] Wishlist page
- [ ] Move items from wishlist to cart

### Step 10: Reviews & Ratings ⭐

#### What to implement:

- [ ] Review submission form
- [ ] Star rating component
- [ ] Display reviews on product page
- [ ] Average rating calculation
- [ ] Sort/filter reviews

## Completed

- [x] Basic project structure and routing.
- [x] Home page with Featured Products.
- [x] Product Card component.
- [x] Tailwind CSS integration.
- [x] Integrated `AddToCartButton` with loading/success states and toast notifications.
- [x] Fixed cart removal logic to support product variants (size/color).
- [x] Cleaned up product page UI (removed low-stock warnings).
- [x] Resolved build-blocking serialization errors in Toast Context.
- [x] Redesigned mobile header: Added persistent Cart icon and badge next to hamburger menu.
- [x] Refactored icon system: Created reusable `CartIcon` and `CartCountBadge` components.
- [x] Enhanced mobile menu navigation with integrated cart state notification.
- [x] Implemented Step 4: Full Cart Drawer and Enhanced /cart page with quantity controls and totals.
- [x] Implemented Step 5.1: Installed and configured `vite-plugin-image-optimizer` with support for AVIF, WebP, and SVGO.
- [x] Implemented Step 5.2: Created `ProductImage`, `ProductCard`, and `ImageGallery` components with built-in optimization.
- [x] Implemented Step 5.4: Created a permanent fix for Netlify Edge Function bundling errors by renaming virtual modules post-build.
- [x] Fixed code-style and type-safety issues in `ProductCard`, `ProductImage`, and `ImageGallery` to ensure a clean production build.
- [x] Cleaned up strict ESLint warnings in `image.utils.ts` (unused variables).

## Session Summary (2026-02-07)

### What's Finished

- **Netlify Build Fix**: Implemented a robust workaround for the Netlify Edge Function `ENOENT` error. The fix renames `@qwik-city-*` modules to `_qwik-city-*` post-build and updates imports.
- **Project Pipeline**: Automated the build fix in `package.json`.
- **Clean Build**: Resolved all remaining TypeScript and ESLint errors blocking the production build.

### The "Wall"

- Netlify CLI's file tracing agent has a known issue with files starting with `@` symbols in certain environments, causing them to be skipped or incorrectly resolved during Edge Function bundling.

### Next Steps

1. **Push & Deploy**: Push the fix to master and verify the Netlify build.
2. **Step 5.3**: Implement Qwik `routeLoader$` for server-side product data fetching.
3. **Step 6**: Begin User Authentication System.

---

## Session Summary (2026-02-09)

### What's Finished ✅

- **Created AI Context System**: 
  - Generated comprehensive `AI.md` (1,100+ lines) with full project documentation
  - Created skill workflow `.github/skills/workflows/update-ai-context.md` for auto-updates
  - Created supporting guides: `AI-QUICK-START.md`, `AI-CONTEXT-SETUP.md`, `README-AI-CONTEXT.md`

- **Extended Mock Product Data**:
  - Expanded `src/data/mockProducts.ts` from 4 to 16 products
  - Added `createdAt` timestamps to all products for sorting
  - Created new helper function: `getLatestProducts(count)` to fetch most recent products

- **Synced Homepage Data**:
  - Updated `src/routes/index.tsx` to use `getLatestProducts()` from mockProducts
  - Changed from hardcoded product data to dynamic data from mockProducts.ts
  - Homepage now displays 4 most recently added products

### The "Wall" 🚧

- No blocking issues encountered
- All tasks completed successfully

### Next Steps 📋

1. **Step 5.3**: Implement full server-side data fetching with `routeLoader$`
2. **Step 6**: Begin User Authentication System (Login/Register)
3. **Step 7**: Checkout Flow Implementation
4. **Maintain AI Context**: Keep `AI.md` updated as features are added using the update workflow
