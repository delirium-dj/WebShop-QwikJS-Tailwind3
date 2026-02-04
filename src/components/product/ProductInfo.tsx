// src/components/product/ProductInfo.tsx
import { component$, useSignal, $ } from '@builder.io/qwik';
import { QuantitySelector } from './QuantitySelector';

// Define the data structure for the product information passed to this component.
type ProductInfoProps = {
  id: number;
  title: string;
  price: number;
  discount?: number;     // Optional percentage discount
  rating?: number;       // Average rating (0-5)
  reviews?: number;      // Total number of reviews
  description?: string;
  stock?: number;        // Inventory count
  sizes?: string[];      // Available sizes
  colors?: string[];     // Available colors
  category?: string;     // Product category name
  specifications?: Record<string, string>; // Dynamic key-value pairs for technical specs
  features?: string[];   // List of bullet points
};

/**
 * ProductInfo Component
 * Purpose: Handles the technical and commercial details of a product.
 * It manages local selection state (size, color, quantity) and displays pricing logic.
 */
export const ProductInfo = component$<ProductInfoProps>((props) => {
  // Local State Management (Signals):
  // We use useSignal for simple reactive values that update the UI when they change.
  // We initialize these with the first available option.
  const selectedSize = useSignal<string | undefined>(props.sizes?.[0]);
  const selectedColor = useSignal<string | undefined>(props.colors?.[0]);
  const quantity = useSignal(1);

  // Derived Values:
  // We calculate the final price if a discount is applied.
  const discountedPrice = props.discount
    ? props.price - (props.price * props.discount) / 100
    : props.price;

  // Simple check for availability styling.
  const isOutOfStock = props.stock !== undefined && props.stock <= 0;

  // Event Handlers (using $ for Qwik serialization):
  // Qwik needs to serialize these functions so they can be "resumed" on the client.
  
  const handleAddToCart = $(() => {
    // Note for Junior: This is a placeholder. 
    // In Step 3, we will connect this to a global 'Cart Context'.
    console.log('Adding to cart:', {
      id: props.id,
      title: props.title,
      quantity: quantity.value,
      size: selectedSize.value,
      color: selectedColor.value,
    });
    alert(
      `Added ${quantity.value}x "${props.title}" to cart!\n` +
        (selectedSize.value ? `Size: ${selectedSize.value}\n` : '') +
        (selectedColor.value ? `Color: ${selectedColor.value}\n` : '') +
        '(Full cart functionality coming in Step 3)'
    );
  });

  const handleBuyNow = $(() => {
    // Placeholder for Step 7: Checkout integration.
    alert('Buy Now feature coming in Step 7 (Checkout Flow)');
  });

  return (
    <div class="space-y-6">
      {/* Category Tag */}
      {props.category && (
        <div class="text-sm text-gray-400 uppercase font-bold tracking-widest">
          {props.category}
        </div>
      )}

      {/* Product Title */}
      <h1 class="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
        {props.title}
      </h1>

      {/* Ratings Section */}
      {props.rating && (
        <div class="flex items-center gap-2">
          <div class="flex items-center">
            <div class="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  class={`w-5 h-5 ${
                    i < Math.floor(props.rating!)
                      ? 'fill-current'
                      : 'fill-gray-200'
                  }`}
                  viewBox="0 0 20 20"
                >
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
            </div>
            <span class="ml-2 text-gray-900 font-bold">
              {props.rating.toFixed(1)}
            </span>
          </div>
          {props.reviews && (
            <span class="text-gray-400 text-sm">
              • {props.reviews} Verified Reviews
            </span>
          )}
        </div>
      )}

      {/* Pricing Information */}
      <div class="py-6 border-y border-gray-100">
        {props.discount && props.discount > 0 ? (
          <div class="space-y-2">
            <div class="flex items-baseline gap-4">
              <span class="text-4xl font-black text-red-600">
                ${discountedPrice.toFixed(2)}
              </span>
              <span class="text-xl text-gray-400 line-through decoration-2">
                ${props.price.toFixed(2)}
              </span>
              <span class="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                -{props.discount}% OFF
              </span>
            </div>
          </div>
        ) : (
          <span class="text-4xl font-black text-gray-900">
            ${props.price.toFixed(2)}
          </span>
        )}
      </div>

      {/* Inventory Feedback */}
      <div>
        {isOutOfStock ? (
          <div class="flex items-center gap-2 text-red-500 font-bold bg-red-50 px-4 py-2 rounded-lg w-fit">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            Currently Unavailable
          </div>
        ) : props.stock && props.stock < 10 ? (
          <div class="flex items-center gap-2 text-orange-600 font-bold bg-orange-50 px-4 py-2 rounded-lg w-fit italic">
             Hurry! Only {props.stock} left in stock
          </div>
        ) : (
          <div class="flex items-center gap-2 text-emerald-600 font-bold bg-emerald-50 px-4 py-2 rounded-lg w-fit">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
            </svg>
            Ready to Ship
          </div>
        )}
      </div>

      {/* Product Narrative */}
      {props.description && (
        <p class="text-gray-600 leading-relaxed text-lg italic">
          "{props.description}"
        </p>
      )}

      {/* Variant Selection: Sizes */}
      {props.sizes && props.sizes.length > 0 && (
        <div class="space-y-3">
          <label class="text-xs font-black text-gray-400 uppercase tracking-widest">
            Select Size
          </label>
          <div class="flex flex-wrap gap-2">
            {props.sizes.map((size) => (
              <button
                key={size}
                onClick$={() => (selectedSize.value = size)}
                class={`px-6 py-2.5 border-2 rounded-xl font-bold transition-all duration-200 ${
                  selectedSize.value === size
                    ? 'border-black bg-black text-white shadow-lg scale-105'
                    : 'border-gray-200 text-gray-600 hover:border-gray-900'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Variant Selection: Colors */}
      {props.colors && props.colors.length > 0 && (
        <div class="space-y-3">
          <label class="text-xs font-black text-gray-400 uppercase tracking-widest">
            Choose Color: <span class="text-gray-900 lowercase">{selectedColor.value}</span>
          </label>
          <div class="flex flex-wrap gap-4">
            {props.colors.map((color) => (
              <button
                key={color}
                onClick$={() => (selectedColor.value = color)}
                class={`w-10 h-10 rounded-full border-2 transition-all duration-300 ring-offset-2 hover:scale-110 ${
                  selectedColor.value === color
                    ? 'border-black ring-2 ring-black'
                    : 'border-transparent'
                }`}
                style={`background-color: ${color.toLowerCase()}`}
                title={color}
              />
            ))}
          </div>
        </div>
      )}

      {/* Purchase Controls */}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
        <div class="flex flex-col gap-2">
          <label class="text-xs font-black text-gray-400 uppercase tracking-widest">
            Quantity
          </label>
        <QuantitySelector
          initialQuantity={1}
          max={props.stock || 99}
          onChange$={(qty) => (quantity.value = qty)}
        />
        </div>
        
        <div class="flex flex-col justify-end gap-3">
          <button
            onClick$={handleAddToCart}
            disabled={isOutOfStock}
            class={`w-full py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all duration-300 active:scale-95 ${
              isOutOfStock
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-black text-white hover:bg-gray-900 shadow-xl hover:shadow-black/20'
            }`}
          >
            {isOutOfStock ? 'Sold Out' : 'Add to Bag'}
          </button>
          
          <button
            onClick$={handleBuyNow}
            disabled={isOutOfStock}
            class={`w-full py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all duration-300 border-2 active:scale-95 ${
              isOutOfStock
                ? 'bg-transparent text-gray-300 border-gray-200 cursor-not-allowed'
                : 'bg-white text-black border-black hover:bg-gray-50'
            }`}
          >
            Instant Checkout
          </button>
        </div>
      </div>

      {/* Descriptive Accents: Features and Specs */}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-gray-100">
        {/* Features List */}
        {props.features && props.features.length > 0 && (
          <div class="space-y-4">
            <h3 class="font-black text-sm uppercase tracking-widest text-gray-900">Highlights</h3>
            <ul class="space-y-3">
              {props.features.map((feature, index) => (
                <li key={index} class="flex items-start gap-3">
                  <div class="w-1.5 h-1.5 rounded-full bg-black mt-2 flex-shrink-0" />
                  <span class="text-gray-600 text-sm font-medium">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Specifications Grid */}
        {props.specifications && Object.keys(props.specifications).length > 0 && (
          <div class="space-y-4">
            <h3 class="font-black text-sm uppercase tracking-widest text-gray-900">The Specs</h3>
            <div class="grid grid-cols-1 gap-4">
              {Object.entries(props.specifications).map(([key, value]) => (
                <div
                  key={key}
                  class="flex flex-col py-2 border-b border-gray-50"
                >
                  <dt class="text-xs font-bold text-gray-400 uppercase tracking-tighter mb-1">{key}</dt>
                  <dd class="text-gray-900 text-sm font-bold">{value}</dd>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

