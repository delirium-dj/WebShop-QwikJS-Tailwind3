// src/components/product/ProductCard.tsx (UPDATED with Cart Integration)
import { component$, $ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { useCart } from '~/contexts/cart';

type ProductCardProps = {
  id: number;
  title: string;
  price: number;
  image: string;
  discount?: number;
  rating?: number;
  stock?: number;
};

export const ProductCard = component$<ProductCardProps>(
  ({ id, title, price, image, discount, rating, stock }) => {
    // Access the global cart state and actions.
    const cart = useCart();
    
    // Derived state for pricing and stock status.
    const discountedPrice = discount ? price - (price * discount) / 100 : price;
    const isOutOfStock = stock !== undefined && stock <= 0;

    // Event Handler: Add item to cart
    // Qwik requires the $() wrapper to serialize this function for the client.
    const handleAddToCart = $((event: Event) => {
      // Vital: Stop the click from bubbling up to the <Link> component.
      // If we don't do this, clicking "Add to Cart" would also navigate the user to the product page.
      event.preventDefault();
      event.stopPropagation();
      
      // Call the global action to add the item.
      cart.actions.addItem({
        id,
        title,
        price,
        image,
        discount,
      }, 1); // Default quantity is 1

      // TODO for Step 3: Replace this console.log with a visible toast notification
      console.log(`Added "${title}" to cart!`);
    });

    return (
      <Link href={`/product/${id}`} class="block group">
        <div class="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
          {/* Product Image */}
          <div class="relative overflow-hidden bg-gray-100">
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
          </div>

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

            {/* Title */}
            <h3 class="text-lg font-semibold mb-2 line-clamp-2 min-h-[3.5rem]">
              {title}
            </h3>

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

            {/* Add to Cart Button */}
            <button
              onClick$={handleAddToCart}
              disabled={isOutOfStock}
              class={`w-full py-2 rounded-md font-medium transition-colors duration-200 ${
                isOutOfStock
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-black text-white hover:bg-gray-800'
              }`}
            >
              {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </Link>
    );
  }
);
