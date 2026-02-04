// src/components/product/ProductCard.tsx
import { component$, $ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';

// Defines the properties this component expects.
type ProductCardProps = {
  id: number;
  title: string;
  price: number;
  image: string;
  discount?: number; // Optional percentage (e.g., 20)
  rating?: number;   // Optional star rating (e.g., 4.5)
  stock?: number;    // Optional stock quantity
};

/**
 * ProductCard Component
 * Purpose: A reusable card that displays a summary of a product.
 * It's used in grids on the home page and shop page.
 */
export const ProductCard = component$<ProductCardProps>(
  ({ id, title, price, image, discount, rating, stock }) => {
    // Derived state for the UI:
    // We calculate the final price if a discount is active.
    const discountedPrice = discount ? price - (price * discount) / 100 : price;
    // Check if we should disable the card features.
    const isOutOfStock = stock !== undefined && stock <= 0;

    // Event Handler:
    // We use $((...)) to create a QRL (Qwik URL) for the event listener. 
    // This allows Qwik to only download this function when the user actually clicks.
    const handleAddToCart = $((event: Event) => {
      // Since the whole card is a <Link>, we stop the click from navigating 
      // when the user just wants to add to the cart.
      event.preventDefault();
      event.stopPropagation();
      
      // Placeholder for Step 3:
      console.log('Add to cart clicked for product:', id);
      alert(`Added "${title}" to cart! (Cart functionality coming in Step 3)`);
    });

    return (
      <Link href={`/product/${id}`} class="block group">
        <div class="border border-gray-100 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-black/5 transition-all duration-500 bg-white">
          {/* Visual Container */}
          <div class="relative overflow-hidden bg-gray-50 aspect-square">
            <img
              src={image}
              alt={title}
              width={400}
              height={400}
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            
            {/* Promo Badges */}
            {discount && discount > 0 && (
              <div class="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-black uppercase tracking-tighter shadow-lg">
                -{discount}%
              </div>
            )}

            {/* Inventory Overlay */}
            {isOutOfStock && (
              <div class="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                <span class="bg-black text-white px-6 py-2 rounded-xl text-sm font-black uppercase tracking-widest shadow-xl">
                  Sold Out
                </span>
              </div>
            )}
          </div>

          {/* Content Container */}
          <div class="p-6">
            {/* Social Proof (Ratings) */}
            {rating && (
              <div class="flex items-center mb-3">
                <div class="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      class={`w-3.5 h-3.5 ${i < Math.floor(rating) ? 'fill-current' : 'fill-gray-200'}`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <span class="text-[10px] font-black text-gray-400 ml-1.5 uppercase tracking-widest">{rating.toFixed(1)}</span>
              </div>
            )}

            {/* Product Meta */}
            <h3 class="text-gray-900 font-bold text-lg mb-1 line-clamp-1 group-hover:text-black transition-colors">
              {title}
            </h3>

            {/* Price Visualization */}
            <div class="mb-5 flex items-center gap-2">
              {discount && discount > 0 ? (
                <>
                  <span class="text-xl font-black text-red-600 tracking-tight">
                    ${discountedPrice.toFixed(2)}
                  </span>
                  <span class="text-xs text-gray-400 line-through font-bold">
                    ${price.toFixed(2)}
                  </span>
                </>
              ) : (
                <span class="text-xl font-black text-gray-900 tracking-tight">
                  ${price.toFixed(2)}
                </span>
              )}
            </div>

            {/* Interactive Element */}
            <button
              onClick$={handleAddToCart}
              disabled={isOutOfStock}
              class={`w-full py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all duration-300 ${
                isOutOfStock
                  ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                  : 'bg-black text-white hover:bg-gray-800 shadow-lg hover:translate-y-[-2px] active:translate-y-0'
              }`}
            >
              {isOutOfStock ? 'Unavailable' : 'Add to Bag'}
            </button>
          </div>
        </div>
      </Link>
    );
  }
);

