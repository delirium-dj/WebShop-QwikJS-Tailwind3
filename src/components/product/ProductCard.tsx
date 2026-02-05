// src/components/product/ProductCard.tsx (UPDATED with Enhanced Add to Cart)
import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { AddToCartButton } from '~/components/cart/AddToCartButton';

type ProductCardProps = {
  id: number;
  title: string;
  price: number;
  image: string;
  discount?: number;
  rating?: number;
  stock?: number;
};

/**
 * Product Card Component
 * Displays a single product with image, details, and enhanced add-to-cart functionality.
 * 
 * Features:
 * - Hover effects for better interactivity
 * - Discount badges
 * - Star ratings
 * - Enhanced Add to Cart button with loading states and toast notifications
 */
export const ProductCard = component$<ProductCardProps>(
  ({ id, title, price, image, discount, rating, stock }) => {
    // Derived state for pricing and stock status.
    const discountedPrice = discount ? price - (price * discount) / 100 : price;
    const isOutOfStock = stock !== undefined && stock <= 0;

    return (
      <div class="block group border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
        {/* Product Image - Clickable Link */}
        <Link href={`/product/${id}`} class="block relative overflow-hidden bg-gray-100">
          <img
            src={image}
            alt={title}
            width={400}
            height={400}
            class="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Discount Badge */}
          {discount && discount > 0 && (
            <div class="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              -{discount}%
            </div>
          )}

          {/* Out of Stock Badge */}
          {isOutOfStock && (
            <div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span class="bg-white text-black px-4 py-2 rounded-md font-semibold">
                Out of Stock
              </span>
            </div>
          )}
        </Link>

        {/* Product Info */}
        <div class="p-4">
          {/* Rating */}
          {rating && (
            <div class="flex items-center mb-2">
              <div class="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    class={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-current' : 'fill-gray-300'}`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <span class="text-sm text-gray-600 ml-2">({rating.toFixed(1)})</span>
            </div>
          )}

          {/* Title - Clickable Link */}
          <Link href={`/product/${id}`} class="block">
            <h3 class="text-lg font-semibold mb-2 line-clamp-2 min-h-[3.5rem] text-gray-900 group-hover:text-black">
              {title}
            </h3>
          </Link>

          {/* Price */}
          <div class="mb-4">
            {discount && discount > 0 ? (
              <div class="flex items-center gap-2">
                <span class="text-xl font-bold text-red-600">
                  ${discountedPrice.toFixed(2)}
                </span>
                <span class="text-sm text-gray-500 line-through">
                  ${price.toFixed(2)}
                </span>
              </div>
            ) : (
              <span class="text-xl font-bold text-gray-900">
                ${price.toFixed(2)}
              </span>
            )}
          </div>

          {/* 
              Enhanced Add to Cart Button:
              - Shows loading spinner while adding
              - Displays success checkmark after adding
              - Shows toast notification with product details
              - Prevents event bubbling to avoid navigation
          */}
          <AddToCartButton
            product={{
              id,
              title,
              price,
              image,
              discount,
            }}
            quantity={1}
            variant="primary"
            fullWidth
            disabled={isOutOfStock}
          />
        </div>
      </div>
    );
  }
);
