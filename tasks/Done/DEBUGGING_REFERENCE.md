# Quick Debugging Reference - Reactive Shop Filters

## 🐛 Common Issues & Solutions

### Issue 1: Grid Doesn't Update When Filter Changes

**Symptom**: You click a filter but the product grid stays the same.

**Most Common Cause**: Forgetting `.value` when using signals in the template.

```typescript
// ❌ WRONG
{filteredProducts.map((product) => ...)}

// ✅ CORRECT
{filteredProducts.value.map((product) => ...)}
```

**Why**: Signals are objects, not values. You must access `.value` to get the actual data.

---

### Issue 2: Sort Dropdown Doesn't Work

**Symptom**: Changing the sort dropdown doesn't reorder products.

**Check 1**: Make sure you're updating the signal correctly
```typescript
// ❌ WRONG
onChange$={(e) => sortBy = e.target.value}

// ✅ CORRECT
onChange$={(e) => handleSortChange$((e.target as HTMLSelectElement).value)}
```

**Check 2**: Verify the sort logic in `useComputed$`
```typescript
const filteredProducts = useComputed$(() => {
  let filtered = [...products];
  
  // This must access sortBy.value to track dependency
  switch (sortBy.value) { // ← Must use .value!
    case 'price-low':
      filtered.sort((a, b) => a.price - b.price);
      break;
  }
  
  return filtered;
});
```

---

### Issue 3: Add to Cart Doesn't Work

**Symptom**: Clicking "Add to Cart" does nothing or shows an error.

**Check 1**: Cart context is imported and used
```typescript
// At top of file
import { useCart } from '~/contexts/cart';

// In component
const cart = useCart();

// In handler
const handleAddToCart$ = $((product: Product) => {
  cart.actions.addItem({ ... }); // ← Must have cart.actions
});
```

**Check 2**: Product structure matches cart requirements
```typescript
// Cart expects these fields:
{
  id: string | number,
  title: string,
  price: number,
  image: string,
  quantity: number,
  variant: { size: string, color: string }
}
```

**Check 3**: Handler is wrapped with $()
```typescript
// ❌ WRONG
<ProductCard onAddToCart={(product) => handleAddToCart(product)} />

// ✅ CORRECT
<ProductCard onAddToCart$={$(() => handleAddToCart$(product))} />
```

---

### Issue 4: URL Doesn't Update

**Symptom**: Filters change but URL stays `/shop`.

**Check 1**: `updateURL` is being called
```typescript
const handleCategoryChange$ = $((category: string) => {
  selectedCategory.value = category;
  updateURL(); // ← Must call this!
});
```

**Check 2**: `useNavigate` is imported and used
```typescript
import { useNavigate } from '@builder.io/qwik-city';

const nav = useNavigate();

const updateURL = $(() => {
  const params = new URLSearchParams();
  // ... build params
  nav(`/shop?${params.toString()}`); // ← Navigate to new URL
});
```

---

### Issue 5: Filters Don't Work After Page Refresh

**Symptom**: You set filters, refresh the page, filters reset.

**Solution**: Initialize signals from URL params
```typescript
const selectedCategory = useSignal<string>(
  location.url.searchParams.get('category') || 'all'
  // ↑ Reads from URL on page load
);

const sortBy = useSignal<string>(
  location.url.searchParams.get('sort') || 'featured'
  // ↑ Reads from URL on page load
);
```

---

### Issue 6: TypeScript Errors with Product Type

**Symptom**: `Property 'X' does not exist on type 'Product'`

**Solution**: Verify your Product type includes all fields
```typescript
// In ~/types/product.ts
export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating?: {
    rate: number;
    count: number;
  };
  // Add any custom fields
  inStock?: boolean;
  originalPrice?: number;
  isFeatured?: boolean;
}
```

---

### Issue 7: Price Range Filter Not Working

**Symptom**: Checking price ranges doesn't filter products.

**Check 1**: `selectedPriceRanges` is used in `useComputed$`
```typescript
const filteredProducts = useComputed$(() => {
  let filtered = [...products];
  
  // Must access .value to track dependency
  if (selectedPriceRanges.value.length > 0) {
    filtered = filtered.filter((product) => {
      return selectedPriceRanges.value.some((rangeIndex) => {
        const range = PRICE_RANGES[rangeIndex];
        return product.price >= range.min && product.price < range.max;
      });
    });
  }
  
  return filtered;
});
```

**Check 2**: Checkbox handler toggles correctly
```typescript
const handlePriceRangeToggle$ = $((rangeIndex: number) => {
  const current = selectedPriceRanges.value;
  if (current.includes(rangeIndex)) {
    // Remove if already selected
    selectedPriceRanges.value = current.filter((i) => i !== rangeIndex);
  } else {
    // Add if not selected
    selectedPriceRanges.value = [...current, rangeIndex];
  }
});
```

---

### Issue 8: Clear Filters Button Doesn't Work

**Symptom**: Clicking "Clear Filters" doesn't reset everything.

**Solution**: Make sure ALL filter signals are reset
```typescript
const handleClearFilters$ = $(() => {
  selectedCategory.value = 'all';
  sortBy.value = 'featured';
  selectedPriceRanges.value = []; // ← Reset array
  inStockOnly.value = false;
  updateURL(); // ← Update URL too!
});
```

---

### Issue 9: Mobile Filter Sidebar Won't Open/Close

**Symptom**: Clicking filter button on mobile does nothing.

**Check 1**: `showFilters` signal is used correctly
```typescript
const showFilters = useSignal<boolean>(false);

// In button
onClick$={() => (showFilters.value = !showFilters.value)}

// In sidebar
class={`${showFilters.value ? 'block' : 'hidden lg:block'}`}
```

**Check 2**: Breakpoint classes are correct
```typescript
// Mobile: hidden unless showFilters is true
// Desktop (lg): always visible
class={`
  lg:w-64 lg:flex-shrink-0
  ${showFilters.value ? 'block' : 'hidden lg:block'}
`}
```

---

### Issue 10: Products Array is Empty

**Symptom**: No products show, even without filters.

**Check 1**: `routeLoader$` is working
```typescript
export const useProductsData = routeLoader$(async () => {
  console.log('Loading products...'); // Debug log
  const products = await getAllProducts();
  console.log('Loaded:', products.length); // Should show count
  return { products, categories: [...] };
});
```

**Check 2**: Service layer is working
```typescript
// In ~/services/api/products.service.ts
export async function getAllProducts(): Promise<Product[]> {
  try {
    const response = await fetch('https://fakestoreapi.com/products');
    if (!response.ok) throw new Error('API error');
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return []; // Return empty array on error
  }
}
```

---

## 🔍 Debugging Checklist

When filters don't work, check in this order:

1. [ ] Are you using `.value` when accessing signals in the template?
2. [ ] Is `useComputed$` accessing signals with `.value` (for tracking)?
3. [ ] Are event handlers wrapped with `$()`?
4. [ ] Is the cart context imported and available?
5. [ ] Are URL params being read on initial load?
6. [ ] Is `updateURL()` being called when filters change?
7. [ ] Are all dependencies installed (`pnpm install`)?
8. [ ] Is the dev server running without errors?
9. [ ] Are there any console errors in browser DevTools?
10. [ ] Is TypeScript showing any errors in your IDE?

---

## 🛠️ Debugging Commands

```bash
# Check for TypeScript errors
pnpm exec tsc --noEmit

# Check for linting issues
pnpm lint

# Clear build cache and restart
rm -rf dist/ .qwik/
pnpm dev

# Check if service is reachable
curl https://fakestoreapi.com/products
```

---

## 💡 Pro Tips

1. **Use Browser DevTools**: Open Console to see any JavaScript errors
2. **Add Debug Logs**: Temporarily add `console.log` in `useComputed$`
3. **Check Network Tab**: Verify API calls are succeeding
4. **Use Qwik DevTools**: Install Qwik browser extension for signal inspection
5. **Test Incrementally**: Test one filter at a time, not all at once

---

## 📞 Still Stuck?

If you've tried everything above:

1. Check the browser console for errors
2. Verify your Product type matches the API response
3. Make sure all imports resolve correctly
4. Try creating a minimal test case
5. Check that your Qwik version is up to date (`pnpm list @builder.io/qwik`)

---

**Remember**: The most common issue is forgetting `.value` when accessing signals! ✨
