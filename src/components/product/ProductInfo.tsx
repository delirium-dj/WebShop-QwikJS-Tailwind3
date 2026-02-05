// src/components/product/ProductInfo.tsx (UPDATED with Cart Integration)
import { component$, useSignal, $ } from '@builder.io/qwik';
import { useCart } from '~/contexts/cart';
import { QuantitySelector } from './QuantitySelector';

type ProductInfoProps = {
  id: number;
  title: string;
  price: number;
  discount?: number;
  rating?: number;
  reviews?: number;
  description?: string;
  stock?: number;
  sizes?: string[];
  colors?: string[];
  category?: string;
  specifications?: Record<string, string>;
  features?: string[];
  image: string; // Added for cart
};

export const ProductInfo = component$<ProductInfoProps>((props) => {
  const cart = useCart();
  
  const selectedSize = useSignal<string | undefined>(props.sizes?.[0]);
  const selectedColor = useSignal<string | undefined>(props.colors?.[0]);
  const quantity = useSignal(1);
  const isAdding = useSignal(false);

  const discountedPrice = props.discount
    ? props.price - (props.price * props.discount) / 100
    : props.price;

  const isOutOfStock = props.stock !== undefined && props.stock <= 0;

  const handleAddToCart = $(async () => {
    isAdding.value = true;

    try {
      await cart.actions.addItem({
        id: props.id,
        title: props.title,
        price: props.price,
        image: props.image,
        discount: props.discount,
        selectedSize: selectedSize.value,
        selectedColor: selectedColor.value,
      }, quantity.value);

      // Success feedback
      console.log(`Added ${quantity.value}x "${props.title}" to cart!`);
      
      // Optional: Reset quantity after adding
      // quantity.value = 1;
    } finally {
      isAdding.value = false;
    }
  });

  const handleBuyNow = $(async () => {
    // Add to cart first
    await handleAddToCart();
    
    // TODO: Navigate to cart/checkout in Step 7
    window.location.href = '/cart';
  });

  return (
    <div class="space-y-6">
      {/* Category */}
      {props.category && (
        <div class="text-sm text-gray-500 uppercase tracking-wide">
          {props.category}
        </div>
      )}

      {/* Title */}
      <h1 class="text-3xl font-bold text-gray-900">{props.title}</h1>

      {/* Rating & Reviews */}
      {props.rating && (
        <div class="flex items-center gap-4">
          <div class="flex items-center">
            <div class="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  class={`w-5 h-5 ${
                    i < Math.floor(props.rating!)
                      ? 'fill-current'
                      : 'fill-gray-300'
                  }`}
                  viewBox="0 0 20 20"
                >
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
            </div>
            <span class="ml-2 text-gray-700 font-medium">
              {props.rating.toFixed(1)}
            </span>
          </div>
          {props.reviews && (
            <span class="text-gray-500">({props.reviews} reviews)</span>
          )}
        </div>
      )}

      {/* Price */}
      <div class="border-t border-b py-4">
        {props.discount && props.discount > 0 ? (
          <div class="space-y-2">
            <div class="flex items-center gap-4">
              <span class="text-3xl font-bold text-red-600">
                ${discountedPrice.toFixed(2)}
              </span>
              <span class="text-xl text-gray-500 line-through">
                ${props.price.toFixed(2)}
              </span>
              <span class="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                Save {props.discount}%
              </span>
            </div>
            <p class="text-sm text-green-600 font-medium">
              You save ${(props.price - discountedPrice).toFixed(2)}
            </p>
          </div>
        ) : (
          <span class="text-3xl font-bold text-gray-900">
            ${props.price.toFixed(2)}
          </span>
        )}
      </div>

      {/* Stock Status */}
      <div>
        {isOutOfStock ? (
          <div class="flex items-center gap-2 text-red-600">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd"
              />
            </svg>
            <span class="font-semibold">Out of Stock</span>
          </div>
        ) : props.stock && props.stock < 10 ? (
          <div class="flex items-center gap-2 text-orange-600">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clip-rule="evenodd"
              />
            </svg>
            <span class="font-semibold">Only {props.stock} left in stock!</span>
          </div>
        ) : (
          <div class="flex items-center gap-2 text-green-600">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              />
            </svg>
            <span class="font-semibold">In Stock</span>
          </div>
        )}
      </div>

      {/* Description */}
      {props.description && (
        <div class="prose max-w-none">
          <p class="text-gray-700 leading-relaxed">{props.description}</p>
        </div>
      )}

      {/* Size Selector */}
      {props.sizes && props.sizes.length > 0 && (
        <div>
          <label class="block text-sm font-semibold text-gray-900 mb-3">
            Size
          </label>
          <div class="flex flex-wrap gap-2">
            {props.sizes.map((size) => (
              <button
                key={size}
                onClick$={() => (selectedSize.value = size)}
                class={`px-6 py-3 border-2 rounded-md font-medium transition-all ${
                  selectedSize.value === size
                    ? 'border-black bg-black text-white'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Color Selector */}
      {props.colors && props.colors.length > 0 && (
        <div>
          <label class="block text-sm font-semibold text-gray-900 mb-3">
            Color: <span class="font-normal">{selectedColor.value}</span>
          </label>
          <div class="flex flex-wrap gap-3">
            {props.colors.map((color) => (
              <button
                key={color}
                onClick$={() => (selectedColor.value = color)}
                class={`w-12 h-12 rounded-full border-2 transition-all ${
                  selectedColor.value === color
                    ? 'border-black ring-2 ring-offset-2 ring-black'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                style={`background-color: ${color.toLowerCase()}`}
                aria-label={color}
                title={color}
              />
            ))}
          </div>
        </div>
      )}

      {/* Quantity Selector */}
      <div>
        <label class="block text-sm font-semibold text-gray-900 mb-3">
          Quantity
        </label>
        {/* 
          Using QuantitySelector with two-way binding concept
          onChange$ is a PropFunction (Qwik's way of passing callbacks).
          The optimizer automatically wraps this arrow function in a QRL.
        */}
        <QuantitySelector
          initialQuantity={1}
          max={props.stock || 99}
          onChange$={(qty) => (quantity.value = qty)}
        />
      </div>

      {/* Action Buttons */}
      <div class="flex gap-4">
        <button
          onClick$={handleAddToCart}
          disabled={isOutOfStock || isAdding.value}
          class={`flex-1 py-4 rounded-md font-semibold text-lg transition-colors ${
            isOutOfStock || isAdding.value
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-black text-white hover:bg-gray-800'
          }`}
        >
          {isAdding.value ? 'Adding...' : isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </button>
        <button
          onClick$={handleBuyNow}
          disabled={isOutOfStock || isAdding.value}
          class={`flex-1 py-4 rounded-md font-semibold text-lg transition-colors ${
            isOutOfStock || isAdding.value
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gray-900 text-white hover:bg-black border-2 border-black'
          }`}
        >
          Buy Now
        </button>
      </div>

      {/* Features */}
      {props.features && props.features.length > 0 && (
        <div class="border-t pt-6">
          <h3 class="text-lg font-semibold mb-4">Key Features</h3>
          <ul class="space-y-2">
            {props.features.map((feature, index) => (
              <li key={index} class="flex items-start gap-2">
                <svg
                  class="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span class="text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Specifications */}
      {props.specifications && Object.keys(props.specifications).length > 0 && (
        <div class="border-t pt-6">
          <h3 class="text-lg font-semibold mb-4">Specifications</h3>
          <dl class="grid grid-cols-1 gap-3">
            {Object.entries(props.specifications).map(([key, value]) => (
              <div
                key={key}
                class="flex justify-between py-2 border-b border-gray-200"
              >
                <dt class="text-gray-600 font-medium">{key}</dt>
                <dd class="text-gray-900">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </div>
  );
});
