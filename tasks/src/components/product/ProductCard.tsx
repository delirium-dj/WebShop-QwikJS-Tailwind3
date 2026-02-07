/**
 * ProductCard Component
 * 
 * A card component for displaying products in grid/list views.
 * Shows product image, title, price, and quick action buttons.
 * 
 * For Junior Developers:
 * - This component is typically used in product listing pages
 * - It displays a compact view of product information
 * - Uses the ProductImage component to show the product's primary image
 * - Includes hover effects for better user experience
 * - Can be clicked to navigate to the product detail page
 * 
 * Usage example:
 * <ProductCard product={product} />
 */

import { component$, $ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import type { ProductImage as ProductImageType } from '../../types/image.types';
import { ProductImage } from './ProductImage';
import { getPrimaryImage } from '../../utils/image.utils';

/**
 * Product interface (this would typically be in a separate types file)
 */
interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  images: ProductImageType[];
  category?: string;
  rating?: number;
  inStock?: boolean;
}

/**
 * Component props interface
 */
interface ProductCardProps {
  // The product object to display
  product: Product;
  
  // Additional CSS classes
  class?: string;
  
  // Whether to show the "Add to Cart" button
  showAddToCart?: boolean;
  
  // Callback when "Add to Cart" is clicked
  onAddToCart$?: (productId: string) => void;
}

/**
 * ProductCard Component
 * 
 * Displays a product in a card format with image, details, and actions
 */
export const ProductCard = component$<ProductCardProps>((props) => {
  const {
    product,
    class: className = '',
    showAddToCart = true,
    onAddToCart$,
  } = props;

  // Get the primary product image
  const primaryImage = getPrimaryImage(product.images);

  // Calculate discount percentage if there's an original price
  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  /**
   * Handle add to cart button click
   */
  const handleAddToCart$ = $((event: Event) => {
    // Prevent the link navigation when clicking the button
    event.preventDefault();
    event.stopPropagation();
    
    if (onAddToCart$) {
      onAddToCart$(product.id);
    }
  });

  return (
    <div
      class={`
        product-card group relative bg-white rounded-lg shadow-md overflow-hidden
        transition-all duration-300 hover:shadow-xl
        ${className}
      `}
    >
      {/* Product link wrapper */}
      <Link
        href={`/products/${product.slug}`}
        class="block"
      >
        {/* Image section */}
        <div class="relative aspect-square bg-gray-100">
          {primaryImage ? (
            <ProductImage
              image={primaryImage}
              size="small"
              class="w-full h-full transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div class="w-full h-full flex items-center justify-center text-gray-400">
              <svg
                class="w-16 h-16"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          )}

          {/* Discount badge */}
          {discountPercentage > 0 && (
            <div class="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
              -{discountPercentage}%
            </div>
          )}

          {/* Out of stock overlay */}
          {!product.inStock && (
            <div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span class="bg-white text-gray-800 px-4 py-2 rounded-lg font-semibold">
                Out of Stock
              </span>
            </div>
          )}

          {/* Quick view button (appears on hover) */}
          <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <button
              class="bg-white text-gray-800 px-4 py-2 rounded-lg font-semibold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
              onClick$={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // Quick view functionality would go here
              }}
            >
              Quick View
            </button>
          </div>
        </div>

        {/* Product details section */}
        <div class="p-4">
          {/* Category */}
          {product.category && (
            <p class="text-xs text-gray-500 uppercase tracking-wide mb-1">
              {product.category}
            </p>
          )}

          {/* Product name */}
          <h3 class="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>

          {/* Rating (if available) */}
          {product.rating && (
            <div class="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, index) => (
                <svg
                  key={index}
                  class={`w-4 h-4 ${
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
              <span class="text-sm text-gray-600 ml-1">
                ({product.rating.toFixed(1)})
              </span>
            </div>
          )}

          {/* Price section */}
          <div class="flex items-center gap-2 mb-3">
            <span class="text-2xl font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span class="text-sm text-gray-500 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Add to cart button */}
          {showAddToCart && product.inStock && (
            <button
              class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              onClick$={handleAddToCart$}
              disabled={!product.inStock}
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              Add to Cart
            </button>
          )}
        </div>
      </Link>

      {/* Wishlist button */}
      <button
        class="absolute top-4 left-4 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-md transition-all z-10"
        onClick$={(e) => {
          e.preventDefault();
          e.stopPropagation();
          // Wishlist functionality would go here
        }}
        aria-label="Add to wishlist"
      >
        <svg
          class="w-5 h-5 text-gray-600 hover:text-red-600 transition-colors"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </button>
    </div>
  );
});
