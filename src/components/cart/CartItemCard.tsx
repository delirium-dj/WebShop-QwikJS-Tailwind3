// src/components/cart/CartItemCard.tsx
import { component$, $, type PropFunction } from '@builder.io/qwik';
import type { CartItem } from '~/contexts/cart';

type CartItemCardProps = {
  item: CartItem;
  onUpdateQuantity$: PropFunction<(id: number, quantity: number) => void>;
  onRemove$: PropFunction<(id: number) => void>;
};

/**
 * Cart Item Card Component
 * Displays a single item in the cart with controls
 */
export const CartItemCard = component$<CartItemCardProps>(
  ({ item, onUpdateQuantity$, onRemove$ }) => {
    const itemPrice = item.discount
      ? item.price - (item.price * item.discount) / 100
      : item.price;
    const itemTotal = itemPrice * item.quantity;

    const handleQuantityChange = $(async (newQuantity: number) => {
      if (newQuantity > 0 && newQuantity <= 99) {
        await onUpdateQuantity$(item.id, newQuantity);
      }
    });

    const handleRemove = $(async () => {
      await onRemove$(item.id);
    });

    return (
      <div class="flex gap-4 p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors">
        {/* Product Image */}
        <div class="flex-shrink-0">
          <img
            src={item.image}
            alt={item.title}
            width={96}
            height={96}
            class="w-24 h-24 object-cover rounded-md"
          />
        </div>

        {/* Product Details */}
        <div class="flex-1 flex flex-col justify-between">
          <div>
            <h3 class="font-semibold text-gray-900 mb-1">{item.title}</h3>

            {/* Variants */}
            {(item.selectedSize || item.selectedColor) && (
              <div class="flex gap-4 text-sm text-gray-600 mb-2">
                {item.selectedSize && (
                  <span>
                    Size: <strong>{item.selectedSize}</strong>
                  </span>
                )}
                {item.selectedColor && (
                  <span>
                    Color: <strong>{item.selectedColor}</strong>
                  </span>
                )}
              </div>
            )}

            {/* Price */}
            <div class="flex items-center gap-2">
              {item.discount && item.discount > 0 ? (
                <>
                  <span class="text-lg font-bold text-red-600">
                    ${itemPrice.toFixed(2)}
                  </span>
                  <span class="text-sm text-gray-500 line-through">
                    ${item.price.toFixed(2)}
                  </span>
                  <span class="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                    -{item.discount}%
                  </span>
                </>
              ) : (
                <span class="text-lg font-bold text-gray-900">
                  ${item.price.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          {/* Quantity Controls */}
          <div class="flex items-center justify-between mt-2">
            <div class="flex items-center border border-gray-300 rounded-md">
              <button
                onClick$={async () => await handleQuantityChange(item.quantity - 1)}
                class="px-3 py-1 text-gray-600 hover:bg-gray-100 transition"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <input
                type="number"
                value={item.quantity}
                onInput$={async (e) => {
                  const value = parseInt((e.target as HTMLInputElement).value);
                  await handleQuantityChange(value || 1);
                }}
                min="1"
                max="99"
                class="w-12 text-center border-x border-gray-300 py-1 focus:outline-none"
              />
              <button
                onClick$={async () => await handleQuantityChange(item.quantity + 1)}
                class="px-3 py-1 text-gray-600 hover:bg-gray-100 transition"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            {/* Remove Button */}
            <button
              onClick$={handleRemove}
              class="text-red-600 hover:text-red-800 text-sm font-medium transition"
              aria-label="Remove item"
            >
              Remove
            </button>
          </div>
        </div>

        {/* Item Total */}
        <div class="flex-shrink-0 text-right">
          <p class="text-lg font-bold text-gray-900">
            ${itemTotal.toFixed(2)}
          </p>
        </div>
      </div>
    );
  }
);
