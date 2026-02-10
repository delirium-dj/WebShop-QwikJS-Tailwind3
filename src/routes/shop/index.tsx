/**
 * Shop Page Example
 * 
 * This page demonstrates how to use ProductCard components to display
 * multiple products in a responsive grid layout.
 * 
 * For Junior Developers:
 * - This shows a typical product listing/shop page
 * - ProductCard components are displayed in a responsive grid
 * - The grid adjusts: 1 column on mobile, 2 on tablet, 4 on desktop
 * - Includes filtering and sorting (simulated with mock data)
 * 
 * Route: /shop
 */

import { component$, useSignal, $ } from '@builder.io/qwik';
import { routeLoader$ } from '@builder.io/qwik-city';
import { ProductCard } from '~/components/product';
import { getAllProducts } from '~/services/api/products';
import { mapApiProductsToProducts } from '~/utils/product-mapper';

/**
 * routeLoader$ - Fetches all products on the server
 */
export const useShopProducts = routeLoader$(async () => {
  // Fetch from the real API (FakeStore)
  const apiProducts = await getAllProducts();
  
  // Transform the data to our internal format
  if (apiProducts && apiProducts.length > 0) {
    return mapApiProductsToProducts(apiProducts);
  }

  // Fallback to empty if both fail
  return [];
});

/**
 * Shop Page Component
 */
export default component$(() => {
  // Consume data from routeLoader$
  const productsSignal = useShopProducts();
  
  // Signals for filters and sorting
  const selectedCategory = useSignal('all');
  const sortBy = useSignal('featured');
  const showFilters = useSignal(false);

  // Get unique categories from products
  const categories = ['all', ...new Set(productsSignal.value.map((p) => p.category))];

  /**
   * Filter and sort products based on user selections
   */
  const getFilteredProducts = () => {
    let filtered = [...productsSignal.value];

    // Filter by category
    if (selectedCategory.value !== 'all') {
      filtered = filtered.filter((p) => p.category === selectedCategory.value);
    }

    // Sort products
    switch (sortBy.value) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        // 'featured' - keep original order
        break;
    }

    return filtered;
  };

  const filteredProducts = getFilteredProducts();

  /**
   * Handle add to cart from ProductCard
   */
  const handleAddToCart$ = $((productId: string) => {
    console.log('Adding product to cart:', productId);
    // In a real app, this would update your cart store/context
    alert(`Product ${productId} added to cart!`);
  });

  return (
    <div class="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div class="bg-white border-b">
        <div class="max-w-7xl mx-auto px-4 py-8">
          <h1 class="text-4xl font-bold text-gray-900 mb-2">Shop</h1>
          <p class="text-gray-600">
            Browse our collection of premium products
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div class="max-w-7xl mx-auto px-4 py-8">
        <div class="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters (Desktop) */}
          <aside class={`
            lg:w-64 lg:flex-shrink-0
            ${showFilters.value ? 'block' : 'hidden lg:block'}
          `}>
            <div class="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 class="text-xl font-bold mb-4">Filters</h2>

              {/* Category Filter */}
              <div class="mb-6">
                <h3 class="font-semibold mb-3">Category</h3>
                <div class="space-y-2">
                  {categories.map((category) => (
                    <label
                      key={category}
                      class="flex items-center cursor-pointer hover:text-blue-600"
                    >
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory.value === category}
                        onChange$={() => (selectedCategory.value = category)}
                        class="mr-2"
                      />
                      <span class="capitalize">
                        {category}
                        {category === 'all' && ` (${productsSignal.value.length})`}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range (Example - not functional in this demo) */}
              <div class="mb-6">
                <h3 class="font-semibold mb-3">Price Range</h3>
                <div class="space-y-2">
                  <label class="flex items-center cursor-pointer">
                    <input type="checkbox" class="mr-2" />
                    <span>Under $50</span>
                  </label>
                  <label class="flex items-center cursor-pointer">
                    <input type="checkbox" class="mr-2" />
                    <span>$50 - $100</span>
                  </label>
                  <label class="flex items-center cursor-pointer">
                    <input type="checkbox" class="mr-2" />
                    <span>$100 - $200</span>
                  </label>
                  <label class="flex items-center cursor-pointer">
                    <input type="checkbox" class="mr-2" />
                    <span>$200+</span>
                  </label>
                </div>
              </div>

              {/* In Stock Filter */}
              <div class="mb-6">
                <label class="flex items-center cursor-pointer">
                  <input type="checkbox" class="mr-2" />
                  <span class="font-semibold">In Stock Only</span>
                </label>
              </div>

              {/* Clear Filters Button */}
              <button
                class="w-full bg-gray-200 hover:bg-gray-300 py-2 rounded-lg font-semibold transition-colors"
                onClick$={() => {
                  selectedCategory.value = 'all';
                  sortBy.value = 'featured';
                }}
              >
                Clear Filters
              </button>
            </div>
          </aside>

          {/* Product Grid */}
          <div class="flex-1">
            {/* Toolbar */}
            <div class="bg-white rounded-lg shadow-md p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Results count */}
              <p class="text-gray-600">
                Showing <span class="font-semibold">{filteredProducts.length}</span>{' '}
                products
              </p>

              {/* Sort and Filter Toggle */}
              <div class="flex items-center gap-4">
                {/* Mobile Filter Toggle */}
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
                  onChange$={(e) => (sortBy.value = (e.target as HTMLSelectElement).value)}
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
            {filteredProducts.length > 0 ? (
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    showAddToCart={true}
                    onAddToCart$={handleAddToCart$}
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
                  onClick$={() => {
                    selectedCategory.value = 'all';
                    sortBy.value = 'featured';
                  }}
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Pagination (Example - not functional in this demo) */}
            {filteredProducts.length > 0 && (
              <div class="mt-8 flex justify-center">
                <nav class="flex items-center gap-2">
                  <button class="px-4 py-2 border-2 border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                    Previous
                  </button>
                  <button class="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold">
                    1
                  </button>
                  <button class="px-4 py-2 border-2 border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                    2
                  </button>
                  <button class="px-4 py-2 border-2 border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                    3
                  </button>
                  <button class="px-4 py-2 border-2 border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                    Next
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});
