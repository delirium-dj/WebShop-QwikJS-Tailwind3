# TASK: Implement Reactive Shop Filtering & Sorting

## 🎯 Objective

Enable fully functional sorting and filtering on the `/shop` route by refactoring the current static logic into a reactive Qwik pattern. Currently, the dropdown changes the signal, but the product grid does not update because it uses a static variable instead of a computed one.

## 🛠 Required Changes

### 1. Refactor to `useComputed$`

In `src/routes/shop/index.tsx`, the `filteredProducts` calculation is currently a static variable that only runs once during initial render.

- **Action**: Import `useComputed$` from `@builder.io/qwik`.
- **Action**: Wrap the `getFilteredProducts` logic inside a `useComputed$(() => { ... })`.
- **Action**: Update the template to use `filteredProducts.value.map(...)`.
- **Why**: This allows Qwik to track the dependency on `sortBy.value` and `selectedCategory.value`, triggering a selective UI update whenever they change.

### 2. Connect Remaining Sidebar Filters

The following filters in the sidebar are currently "placeholders":

- **Price Range**: Implement logic to filter products based on the checked price buckets.
- **In Stock Only**: Implement logic to filter out products where `inStock` is false.
- **Junior Note**: Make sure to explain "Why" the filter is being applied in the comments.

### 3. Proper Cart Integration

The `handleAddToCart$` function currently uses a browser `alert()`.

- **Action**: Import `useCart` from `~/contexts/cart`.
- **Action**: Update `handleAddToCart$` to use `cart.actions.addItem()` so it actually adds products to the persistent cart.

### 4. URL State Synchronization (Bonus)

- **Action**: Use `useLocation()` and `useNavigate()` to ensure that selecting a category or sort option updates the URL (e.g., `/shop?sort=price-low`). This makes the user's view shareable and survives page refreshes.

## 📋 Acceptance Criteria

- [x] Changing the Sort Dropdown immediately re-orders the product grid.
- [x] Selecting a Category in the sidebar updates the results.
- [x] "Clear Filters" button successfully resets all UI states.
- [x] Adding to cart from the shop page uses the real Cart System (toasts + persistence).
- [x] No full-page reloads occur during these interactions.
