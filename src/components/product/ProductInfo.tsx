// src/components/product/ProductInfo.tsx (UPDATED with Enhanced Add to Cart)
import { component$, useSignal, $ } from "@builder.io/qwik";
import { useCart } from "~/contexts/cart";
import { QuantitySelector } from "./QuantitySelector";
import { AddToCartButton } from "~/components/cart/AddToCartButton";

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

/**
 * Product Info Component
 * Displays detailed product information on the product detail page.
 *
 * Features:
 * - Size and color selection
 * - Quantity selector
 * - Enhanced Add to Cart button with toast notifications
 * - Buy Now button for quick checkout
 * - Stock status indicators
 * - Product features and specifications
 */
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

  /**
   * Buy Now Handler
   * Adds the product to cart and immediately navigates to the cart page.
   */
  const handleBuyNow = $(async () => {
    isAdding.value = true;

    try {
      await cart.actions.addItem(
        {
          id: props.id,
          title: props.title,
          price: props.price,
          image: props.image,
          discount: props.discount,
          selectedSize: selectedSize.value,
          selectedColor: selectedColor.value,
        },
        quantity.value,
      );

      // Navigate to cart page
      window.location.href = "/cart";
    } finally {
      isAdding.value = false;
    }
  });

  return (
    <div class="space-y-6">
      {/* Category */}
      {props.category && (
        <div class="text-sm uppercase tracking-wide text-gray-500">
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
                  class={`h-5 w-5 ${
                    i < Math.floor(props.rating!)
                      ? "fill-current"
                      : "fill-gray-300"
                  }`}
                  viewBox="0 0 20 20"
                >
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
            </div>
            <span class="ml-2 font-medium text-gray-700">
              {props.rating.toFixed(1)}
            </span>
          </div>
          {props.reviews && (
            <span class="text-gray-500">({props.reviews} reviews)</span>
          )}
        </div>
      )}

      {/* Price */}
      <div class="border-b border-t py-4">
        {props.discount && props.discount > 0 ? (
          <div class="space-y-2">
            <div class="flex items-center gap-4">
              <span class="text-3xl font-bold text-red-600">
                ${discountedPrice.toFixed(2)}
              </span>
              <span class="text-xl text-gray-500 line-through">
                ${props.price.toFixed(2)}
              </span>
              <span class="rounded-full bg-red-500 px-3 py-1 text-sm font-semibold text-white">
                Save {props.discount}%
              </span>
            </div>
            <p class="text-sm font-medium text-green-600">
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
            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd"
              />
            </svg>
            <span class="font-semibold">Out of Stock</span>
          </div>
        ) : (
          <div class="flex items-center gap-2 text-green-600">
            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
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
          <p class="leading-relaxed text-gray-700">{props.description}</p>
        </div>
      )}

      {/* Size Selector */}
      {props.sizes && props.sizes.length > 0 && (
        <div>
          <label class="mb-3 block text-sm font-semibold text-gray-900">
            Size
          </label>
          <div class="flex flex-wrap gap-2">
            {props.sizes.map((size) => (
              <button
                id={`size-btn-${size}`}
                key={size}
                onClick$={() => (selectedSize.value = size)}
                class={`rounded-md border-2 px-6 py-3 font-medium transition-all ${
                  selectedSize.value === size
                    ? "border-black bg-black text-white"
                    : "border-gray-300 hover:border-gray-400"
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
          <label class="mb-3 block text-sm font-semibold text-gray-900">
            Color: <span class="font-normal">{selectedColor.value}</span>
          </label>
          <div class="flex flex-wrap gap-3">
            {props.colors.map((color) => (
              <button
                id={`color-btn-${color.toLowerCase()}`}
                key={color}
                onClick$={() => (selectedColor.value = color)}
                class={`h-12 w-12 rounded-full border-2 transition-all ${
                  selectedColor.value === color
                    ? "border-black ring-2 ring-black ring-offset-2"
                    : "border-gray-300 hover:border-gray-400"
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
        <label class="mb-3 block text-sm font-semibold text-gray-900">
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

      {/* 
          Action Buttons:
          - Enhanced Add to Cart button with loading states and toast notifications
          - Buy Now button for quick checkout (navigates to cart immediately)
      */}
      <div class="flex gap-4">
        {/* Enhanced Add to Cart Button */}
        <div class="flex-1">
          <AddToCartButton
            product={{
              id: props.id,
              title: props.title,
              price: props.price,
              image: props.image,
              discount: props.discount,
              selectedSize: selectedSize.value,
              selectedColor: selectedColor.value,
            }}
            quantity={quantity.value}
            variant="primary"
            size="lg"
            fullWidth
            disabled={isOutOfStock}
          />
        </div>

        {/* Buy Now Button */}
        <button
          id="buy-now-btn"
          onClick$={handleBuyNow}
          disabled={isOutOfStock || isAdding.value}
          class={`flex-1 rounded-md py-4 text-lg font-semibold transition-colors ${
            isOutOfStock || isAdding.value
              ? "cursor-not-allowed bg-gray-200 text-gray-400"
              : "border-2 border-black bg-gray-900 text-white hover:bg-black"
          }`}
        >
          Buy Now
        </button>
      </div>

      {/* Features */}
      {props.features && props.features.length > 0 && (
        <div class="border-t pt-6">
          <h3 class="mb-4 text-lg font-semibold">Key Features</h3>
          <ul class="space-y-2">
            {props.features.map((feature, index) => (
              <li key={index} class="flex items-start gap-2">
                <svg
                  class="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600"
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
          <h3 class="mb-4 text-lg font-semibold">Specifications</h3>
          <dl class="grid grid-cols-1 gap-3">
            {Object.entries(props.specifications).map(([key, value]) => (
              <div
                key={key}
                class="flex justify-between border-b border-gray-200 py-2"
              >
                <dt class="font-medium text-gray-600">{key}</dt>
                <dd class="text-gray-900">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </div>
  );
});
