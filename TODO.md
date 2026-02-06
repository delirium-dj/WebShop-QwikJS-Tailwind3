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

### Step 5.1: Install Vite Image Tools

#### What to implement:

- [ ] Install Vite Image Tools
- [ ] Configure Vite Image Tools
- [ ] Implement image loading and optimization (AVIF, WebP, JPEG - in that preferred order)
- [ ] Implement image lazy loading
- [ ] Implement image placeholders
- [ ] Implement image error handling
- [ ] Implement image aspect ratio

### Step 5.2: Product Images

#### What to implement:

- [ ] Implement product images
- [ ] AI should generate 5 images for each product or use existing images from Unsplash or similar image service
- [ ] Ensure that we have 10 random products for MVP with at least 2 images each and maximum of 5 images per product
- [ ] Implement image gallery with zoom
- [ ] Make sure that the images are responsive and work on all devices
- [ ] Make sure that the images are optimized for performance
- [ ] Make sure that images have product at the center of the image

### Step 5.3: Server-Side Data Fetching 🌐

Why fifth? Improves performance and SEO, enables dynamic product data.

#### What to implement:

- [ ] Use Qwik's routeLoader$ for products
- [ ] Implement server-side filtering/sorting
- [ ] Add pagination via server loader
- [ ] Cache product data appropriately
- [ ] Error handling for failed fetches

Benefits: Faster initial loads, better SEO, scalable data management

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
