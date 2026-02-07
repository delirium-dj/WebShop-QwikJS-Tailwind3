/**
 * Product Detail Page Example
 * 
 * This is an example page showing how to use all the product image components
 * together in a real product detail page.
 * 
 * For Junior Developers:
 * - This page demonstrates best practices for displaying product details
 * - It uses the ImageGallery component for the main product images
 * - It includes product information, pricing, and action buttons
 * - The layout is responsive and works on all screen sizes
 * 
 * Route: /products/[slug]/
 */

import { component$, useSignal, $ } from '@builder.io/qwik';
import { routeLoader$ } from '@builder.io/qwik-city';
import { ImageGallery } from '~/components/product';
import { getProductBySlug } from '~/data/mockProducts';

/**
 * Route loader to fetch product data
 * In a real app, this would fetch from a database or API
 */
export const useProductData = routeLoader$(async ({ params }) => {
  const slug = params.slug;
  const product = getProductBySlug(slug);
  
  if (!product) {
    throw new Error('Product not found');
  }
  
  return product;
});

/**
 * Product Detail Page Component
 */
export default component$(() => {
  // Load product data from route loader
  const productSignal = useProductData();
  const product = productSignal.value;

  // Signals for interactive features
  const quantity = useSignal(1);
  const selectedSize = useSignal('M');
  const selectedColor = useSignal('Black');

  /**
   * Handle add to cart
   */
  const handleAddToCart$ = $(() => {
    console.log('Adding to cart:', {
      productId: product.id,
      quantity: quantity.value,
      size: selectedSize.value,
      color: selectedColor.value,
    });
    // In a real app, this would dispatch to your cart store/context
    alert(`Added ${quantity.value} item(s) to cart!`);
  });

  /**
   * Handle quantity change
   */
  const updateQuantity$ = $((change: number) => {
    const newQuantity = quantity.value + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      quantity.value = newQuantity;
    }
  });

  // Calculate discount percentage
  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div class="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb navigation */}
      <nav class="mb-6 text-sm">
        <ol class="flex items-center gap-2 text-gray-600">
          <li>
            <a href="/" class="hover:text-blue-600">Home</a>
          </li>
          <li>/</li>
          <li>
            <a href="/shop" class="hover:text-blue-600">Shop</a>
          </li>
          <li>/</li>
          <li>
            <a href={`/shop?category=${product.category}`} class="hover:text-blue-600">
              {product.category}
            </a>
          </li>
          <li>/</li>
          <li class="text-gray-900 font-semibold">{product.name}</li>
        </ol>
      </nav>

      {/* Main product section */}
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left side - Image Gallery */}
        <div class="lg:sticky lg:top-8 lg:h-fit">
          <ImageGallery 
            images={product.images}
            enableZoom={true}
            layout="vertical"
          />
        </div>

        {/* Right side - Product Information */}
        <div class="space-y-6">
          {/* Product Title */}
          <div>
            <p class="text-sm text-gray-500 uppercase tracking-wide mb-2">
              {product.category}
            </p>
            <h1 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              {product.name}
            </h1>
            
            {/* Rating */}
            {product.rating && (
              <div class="flex items-center gap-2">
                <div class="flex items-center">
                  {[...Array(5)].map((_, index) => (
                    <svg
                      key={index}
                      class={`w-5 h-5 ${
                        index < Math.floor(product.rating!)
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span class="text-sm text-gray-600">
                  {product.rating.toFixed(1)} (124 reviews)
                </span>
              </div>
            )}
          </div>

          {/* Price */}
          <div class="border-t border-b border-gray-200 py-4">
            <div class="flex items-center gap-4">
              <span class="text-4xl font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <>
                  <span class="text-xl text-gray-500 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                  <span class="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">
                    Save {discountPercentage}%
                  </span>
                </>
              )}
            </div>
            
            {/* Stock status */}
            <div class="mt-2">
              {product.inStock ? (
                <p class="text-green-600 font-semibold flex items-center gap-2">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  In Stock
                </p>
              ) : (
                <p class="text-red-600 font-semibold">Out of Stock</p>
              )}
            </div>
          </div>

          {/* Product Description */}
          <div>
            <h2 class="text-xl font-bold mb-3">Description</h2>
            <p class="text-gray-700 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Size Selection (example) */}
          <div>
            <label class="block text-sm font-semibold text-gray-900 mb-2">
              Size
            </label>
            <div class="flex gap-2">
              {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
                <button
                  key={size}
                  class={`
                    px-4 py-2 border-2 rounded-lg font-semibold transition-all
                    ${selectedSize.value === size
                      ? 'border-blue-600 bg-blue-50 text-blue-600'
                      : 'border-gray-300 hover:border-gray-400'
                    }
                  `}
                  onClick$={() => (selectedSize.value = size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection (example) */}
          <div>
            <label class="block text-sm font-semibold text-gray-900 mb-2">
              Color
            </label>
            <div class="flex gap-3">
              {[
                { name: 'Black', hex: '#000000' },
                { name: 'White', hex: '#FFFFFF' },
                { name: 'Blue', hex: '#3B82F6' },
                { name: 'Red', hex: '#EF4444' },
              ].map((color) => (
                <button
                  key={color.name}
                  class={`
                    w-10 h-10 rounded-full border-2 transition-all
                    ${selectedColor.value === color.name
                      ? 'border-blue-600 ring-2 ring-blue-200'
                      : 'border-gray-300 hover:border-gray-400'
                    }
                  `}
                  style={{ backgroundColor: color.hex }}
                  onClick$={() => (selectedColor.value = color.name)}
                  aria-label={color.name}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Quantity Selector */}
          <div>
            <label class="block text-sm font-semibold text-gray-900 mb-2">
              Quantity
            </label>
            <div class="flex items-center gap-4">
              <div class="flex items-center border-2 border-gray-300 rounded-lg">
                <button
                  class="px-4 py-2 hover:bg-gray-100 transition-colors"
                  onClick$={() => updateQuantity$(-1)}
                  disabled={quantity.value <= 1}
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                  </svg>
                </button>
                <span class="px-6 py-2 font-semibold">{quantity.value}</span>
                <button
                  class="px-4 py-2 hover:bg-gray-100 transition-colors"
                  onClick$={() => updateQuantity$(1)}
                  disabled={quantity.value >= 10}
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
              <span class="text-sm text-gray-600">Maximum 10 per order</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div class="space-y-3">
            <button
              class={`
                w-full py-4 rounded-lg font-semibold text-lg transition-all
                flex items-center justify-center gap-3
                ${product.inStock
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }
              `}
              onClick$={handleAddToCart$}
              disabled={!product.inStock}
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>

            <button class="w-full border-2 border-gray-300 py-4 rounded-lg font-semibold text-lg hover:border-gray-400 transition-all flex items-center justify-center gap-3">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              Add to Wishlist
            </button>
          </div>

          {/* Features */}
          <div class="border-t border-gray-200 pt-6">
            <h3 class="font-semibold mb-4">Product Features</h3>
            <ul class="space-y-2">
              {[
                'Free shipping on orders over $50',
                '30-day money-back guarantee',
                '1-year warranty included',
                'Secure payment processing',
              ].map((feature) => (
                <li key={feature} class="flex items-center gap-2 text-gray-700">
                  <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
});
