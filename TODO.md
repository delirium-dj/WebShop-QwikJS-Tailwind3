# TODO List

## Goals to implement

- [ ] **Qwik Link Integration**: Update navigation to use `Link` from `@builder.io/qwik-city` for SPA-like transitions.
- [ ] **Hydration Optimization**: Ensure client-only code only hydrates when necessary.
- [ ] **Server-Side Data Fetching**: Use Qwik's `routeLoader$` for products.

## Recommended Development Order (Step-by-Step)

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

### Step 2: Qwik Context Store for Cart 🛒

Why second? Provides proper state management foundation before adding more features.

#### What to implement:

- [ ] Global cart context using Qwik's createContextId and useContext
- [ ] Cart state interface (items, quantities, totals)
- [ ] Helper functions (addToCart, removeFromCart, updateQuantity, clearCart)
- [ ] Persist cart to localStorage
- [ ] Cart count badge in header

Benefits: Centralizes cart logic, prevents prop drilling, enables cart access anywhere

### Step 3: Enhanced Add to Cart with onClick$ ⚡

Why third? Leverages the context store you just built, adds proper Qwik event handling.

#### What to implement:

- [ ] Replace existing cart buttons with proper onClick$ handlers
- [ ] Add loading states during cart operations
- [ ] Success notifications/toasts
- [ ] Optimistic UI updates
- [ ] Prevent duplicate additions

Benefits: Better UX, proper Qwik reactivity, preparation for server actions

### Step 4: Cart Page/Drawer 🛍️

Why fourth? Users need to review their cart before checkout.

#### What to implement:

- [ ] Cart sidebar/drawer that slides in
- [ ] Cart page route (/cart)
- [ ] List all cart items with thumbnails
- [ ] Update quantities inline
- [ ] Remove items
- [ ] Show subtotal, taxes, shipping estimates
- [ ] Checkout button
- [ ] Empty cart state

Benefits: Completes the pre-checkout experience

### Step 5: Server-Side Data Fetching 🌐

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
- [ ] Social login (optional)

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
