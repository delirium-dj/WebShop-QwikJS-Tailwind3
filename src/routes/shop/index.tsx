/**
 * Shop Page - Reactive Filtering & Sorting
 * 
 * This page displays all products with real-time filtering and sorting capabilities.
 * 
 * For Junior Developers:
 * - This page uses Qwik's `useComputed$` to make filters reactive
 * - When you change a filter, the product grid automatically updates
 * - No page reloads needed - everything happens instantly on the client
 * - The products are loaded from the server using `routeLoader$` for SSR
 * 
 * Key Qwik Concepts:
 * - `routeLoader$` = Runs on server, fetches data before page renders
 * - `useSignal` = Creates reactive state (like React's useState)
 * - `useComputed$` = Creates derived/computed values that auto-update
 * - `$()` wrapper = Tells Qwik this function can be lazy-loaded
 * 
 * Route: /shop
 */

import { 
  component$, 
  useSignal, 
  useComputed$,
  $,
} from '@builder.io/qwik';
import { routeLoader$, useLocation, useNavigate } from '@builder.io/qwik-city';
import { ProductCard } from '~/components/product/ProductCard';
import { getAllProducts, type ApiProduct } from '~/services/api/products';
import { useCart } from '~/contexts/cart';

/**
 * Server-side data loader
 * 
 * This runs on the server BEFORE the page renders.
 * It fetches all products from the FakeStore API.
 * 
 * Benefits:
 * - Better SEO (search engines see the products)
 * - Faster initial page load (no client-side fetch delay)
 * - Works even if JavaScript is disabled
 */
export const useProductsData = routeLoader$(async () => {
  try {
    // Fetch all products from the API
    const products = await getAllProducts();
    
    // Extract unique categories from all products
    // This creates an array like ['electronics', 'jewelery', 'men\'s clothing', ...]
    const categories = Array.from(
      new Set(products.map((p: ApiProduct) => p.category))
    ).sort();
    
    return {
      products,
      categories,
    };
  } catch (error) {
    console.error('Failed to load shop products:', error);
    // Return empty data on error instead of crashing the page
    return {
      products: [],
      categories: [],
    };
  }
});

/**
 * Price range type definition
 * Defines the minimum and maximum price for a range
 */
interface PriceRange {
  min: number;
  max: number;
  label: string;
}

/**
 * Available price ranges for filtering
 * Users can select which price buckets to show
 */
const PRICE_RANGES: PriceRange[] = [
  { min: 0, max: 50, label: 'Under $50' },
  { min: 50, max: 100, label: '$50 - $100' },
  { min: 100, max: 200, label: '$100 - $200' },
  { min: 200, max: Infinity, label: '$200+' },
];

/**
 * Main Shop Page Component
 */
export default component$(() => {
  // Load products from server
  const productsSignal = useProductsData();
  const { products, categories } = productsSignal.value;

  // Get routing utilities for URL state management
  const location = useLocation();
  const nav = useNavigate();
  
  // Get cart context for add-to-cart functionality
  const cart = useCart();

  // ============================================
  // REACTIVE STATE (Signals)
  // ============================================
  // These are like React's useState but more efficient
  // When they change, only the parts of the UI that use them update
  
  /**
   * Currently selected category
   * Initialized from URL query param if present (e.g., ?category=electronics)
   */
  const selectedCategory = useSignal<string>(
    location.url.searchParams.get('category') || 'all'
  );

  /**
   * Currently selected sort option
   * Initialized from URL query param if present (e.g., ?sort=price-low)
   */
  const sortBy = useSignal<string>(
    location.url.searchParams.get('sort') || 'featured'
  );

  /**
   * Selected price ranges
   * Multiple ranges can be selected at once
   * Example: [0, 2] means "Under $50" and "$100 - $200" are selected
   */
  const selectedPriceRanges = useSignal<number[]>([]);

  /**
   * Whether to show only in-stock products
   */
  const inStockOnly = useSignal<boolean>(false);

  /**
   * Whether the mobile filter sidebar is visible
   */
  const showFilters = useSignal<boolean>(false);

  // ============================================
  // COMPUTED VALUES (useComputed$)
  // ============================================
  // These automatically recalculate when their dependencies change
  // This is the KEY to making the filters reactive!

  /**
   * Filtered and sorted products
   * 
   * This is a COMPUTED value that automatically updates when:
   * - selectedCategory changes
   * - sortBy changes
   * - selectedPriceRanges changes
   * - inStockOnly changes
   * 
   * The power of useComputed$:
   * - Only recalculates when dependencies change
   * - Automatically triggers UI updates
   * - No manual state management needed
   * 
   * Note: We use the product type from the API response
   */
  const filteredProducts = useComputed$(() => {
    // Start with all products
    let filtered = [...products];

    // ============================================
    // FILTER 1: Category
    // ============================================
    // Why: Users want to see only specific product categories
    if (selectedCategory.value !== 'all') {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory.value
      );
    }

    // ============================================
    // FILTER 2: Price Range
    // ============================================
    // Why: Users have budget constraints and want to see relevant products
    if (selectedPriceRanges.value.length > 0) {
      filtered = filtered.filter((product) => {
        // Check if product price falls within any selected range
        return selectedPriceRanges.value.some((rangeIndex) => {
          const range = PRICE_RANGES[rangeIndex];
          return product.price >= range.min && product.price < range.max;
        });
      });
    }

    // ============================================
    // FILTER 3: In Stock Only
    // ============================================
    // Why: No point showing products users can't buy
    // Note: FakeStore API doesn't have an inStock field, so this filter won't do anything
    // In a real app with inventory data, this would filter out unavailable products
    if (inStockOnly.value) {
      filtered = filtered.filter((product) => {
        // Check if the product has an inStock property (optional in ApiProduct)
        // If it doesn't exist, we assume it's in stock
        return !('inStock' in product) || product.inStock !== false;
      });
    }

    // ============================================
    // SORTING
    // ============================================
    // Why: Different users have different priorities when shopping
    switch (sortBy.value) {
      case 'price-low':
        // Cheapest first - for budget-conscious shoppers
        filtered.sort((a, b) => a.price - b.price);
        break;
      
      case 'price-high':
        // Most expensive first - for premium shoppers
        filtered.sort((a, b) => b.price - a.price);
        break;
      
      case 'name':
        // Alphabetical - easier to find specific items
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      
      case 'rating':
        // Highest rated first - quality-conscious shoppers
        filtered.sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0));
        break;
      
      default:
        // 'featured' - keep original order (often curated by business)
        break;
    }

    return filtered;
  });

  // ============================================
  // EVENT HANDLERS
  // ============================================
  // These are wrapped in $() so Qwik can lazy-load them

  /**
   * Handle category selection
   * Updates both the state and the URL
   */
  const handleCategoryChange$ = $((category: string) => {
    selectedCategory.value = category;
    updateURL();
  });

  /**
   * Handle sort option change
   * Updates both the state and the URL
   */
  const handleSortChange$ = $((sort: string) => {
    sortBy.value = sort;
    updateURL();
  });

  /**
   * Handle price range checkbox toggle
   */
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

  /**
   * Handle in-stock filter toggle
   */
  const handleInStockToggle$ = $(() => {
    inStockOnly.value = !inStockOnly.value;
  });

  /**
   * Clear all filters and reset to defaults
   */
  const handleClearFilters$ = $(() => {
    selectedCategory.value = 'all';
    sortBy.value = 'featured';
    selectedPriceRanges.value = [];
    inStockOnly.value = false;
    updateURL();
  });

  /**
   * Update the URL with current filter state
   * 
   * Why: Makes the current view shareable and survives page refresh
   * Example: /shop?category=electronics&sort=price-low
   */
  const updateURL = $(() => {
    const params = new URLSearchParams();
    
    if (selectedCategory.value !== 'all') {
      params.set('category', selectedCategory.value);
    }
    
    if (sortBy.value !== 'featured') {
      params.set('sort', sortBy.value);
    }
    
    const queryString = params.toString();
    const newUrl = queryString ? `/shop?${queryString}` : '/shop';
    
    // Navigate without reloading the page
    nav(newUrl);
  });

  /**
   * Handle add to cart from ProductCard
   * 
   * This integrates with the real cart system instead of using alert()
   */
  const handleAddToCart$ = $((product: ApiProduct) => {
    // Add product to cart
    // Note: The cart expects specific fields, we transform ApiProduct to match
    cart.actions.addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
    });

    // The toast notification is automatically shown by the cart context!
  });

  // ============================================
  // RENDER
  // ============================================

  return (
    <div class="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div class="bg-white border-b">
        <div class="max-w-7xl mx-auto px-4 py-8">
          <h1 class="text-4xl font-bold text-gray-900 mb-2">Shop</h1>
          <p class="text-gray-600">
            Browse our collection of {products.length} premium products
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div class="max-w-7xl mx-auto px-4 py-8">
        <div class="flex flex-col lg:flex-row gap-8">
          {/* ============================================
              SIDEBAR FILTERS (Desktop & Mobile)
              ============================================ */}
          <aside
            class={`
              lg:w-64 lg:flex-shrink-0
              ${showFilters.value ? 'block' : 'hidden lg:block'}
            `}
          >
            <div class="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-xl font-bold">Filters</h2>
                {/* Mobile close button */}
                <button
                  class="lg:hidden text-gray-500 hover:text-gray-700"
                  onClick$={() => (showFilters.value = false)}
                  aria-label="Close filters"
                >
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Category Filter */}
              <div class="mb-6">
                <h3 class="font-semibold mb-3">Category</h3>
                <div class="space-y-2">
                  {/* "All" option */}
                  <label class="flex items-center cursor-pointer hover:text-blue-600">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory.value === 'all'}
                      onChange$={() => handleCategoryChange$('all')}
                      class="mr-2"
                    />
                    <span class="capitalize">All ({products.length})</span>
                  </label>
                  
                  {/* Individual categories */}
                  {categories.map((category) => {
                    const count = products.filter((p: ApiProduct) => p.category === category).length;
                    return (
                      <label
                        key={category}
                        class="flex items-center cursor-pointer hover:text-blue-600"
                      >
                        <input
                          type="radio"
                          name="category"
                          checked={selectedCategory.value === category}
                          onChange$={() => handleCategoryChange$(category)}
                          class="mr-2"
                        />
                        <span class="capitalize">
                          {category} ({count})
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Price Range Filter */}
              <div class="mb-6">
                <h3 class="font-semibold mb-3">Price Range</h3>
                <div class="space-y-2">
                  {PRICE_RANGES.map((range, index) => (
                    <label
                      key={index}
                      class="flex items-center cursor-pointer hover:text-blue-600"
                    >
                      <input
                        type="checkbox"
                        checked={selectedPriceRanges.value.includes(index)}
                        onChange$={() => handlePriceRangeToggle$(index)}
                        class="mr-2"
                      />
                      <span>{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* In Stock Filter */}
              <div class="mb-6">
                <label class="flex items-center cursor-pointer hover:text-blue-600">
                  <input
                    type="checkbox"
                    checked={inStockOnly.value}
                    onChange$={handleInStockToggle$}
                    class="mr-2"
                  />
                  <span class="font-semibold">In Stock Only</span>
                </label>
              </div>

              {/* Clear Filters Button */}
              <button
                class="w-full bg-gray-200 hover:bg-gray-300 py-2 rounded-lg font-semibold transition-colors"
                onClick$={handleClearFilters$}
              >
                Clear Filters
              </button>
            </div>
          </aside>

          {/* ============================================
              PRODUCT GRID
              ============================================ */}
          <div class="flex-1">
            {/* Toolbar */}
            <div class="bg-white rounded-lg shadow-md p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Results count */}
              <p class="text-gray-600">
                Showing{' '}
                <span class="font-semibold">{filteredProducts.value.length}</span> of{' '}
                <span class="font-semibold">{products.length}</span> products
              </p>

              {/* Sort and Filter Toggle */}
              <div class="flex items-center gap-4">
                {/* Mobile Filter Toggle Button */}
                <button
                  class="lg:hidden bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
                  onClick$={() => (showFilters.value = !showFilters.value)}
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                    />
                  </svg>
                  Filters
                </button>

                {/* Sort Dropdown */}
                <select
                  class="border-2 border-gray-300 rounded-lg px-4 py-2 font-semibold focus:border-blue-600 focus:outline-none"
                  value={sortBy.value}
                  onChange$={(e) => handleSortChange$((e.target as HTMLSelectElement).value)}
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.value.length > 0 ? (
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.value.map((product) => (
                  <ProductCard
                    key={product.id}
                    // ApiProduct from FakeStore API is compatible with ProductCard
                    // rating is { rate, count } in API but ProductCard expects just a number
                    // We pass the whole product and let ProductCard handle the conversion
                    product={product as any}
                    showAddToCart={true}
                    onAddToCart$={$(() => handleAddToCart$(product))}
                  />
                ))}
              </div>
            ) : (
              /* No Results Message */
              <div class="bg-white rounded-lg shadow-md p-12 text-center">
                <svg
                  class="w-24 h-24 mx-auto mb-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 class="text-2xl font-bold text-gray-900 mb-2">
                  No products found
                </h3>
                <p class="text-gray-600 mb-6">
                  Try adjusting your filters or search criteria
                </p>
                <button
                  class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  onClick$={handleClearFilters$}
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});
