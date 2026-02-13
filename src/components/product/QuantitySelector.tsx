// src/components/product/QuantitySelector.tsx
import { component$, useSignal, $, type PropFunction } from "@builder.io/qwik";

// Configuration for the QuantitySelector
// Note: Callback functions in Qwik props must use PropFunction and end with $
// for proper serialization and "Lazy Loading".
type QuantitySelectorProps = {
  initialQuantity?: number; // Starting value (default: 1)
  max?: number; // Upper limit (e.g., stock count)
  min?: number; // Lower limit (usually 1)
  onChange$: PropFunction<(quantity: number) => void>;
};

/**
 * QuantitySelector Component
 * Provides a UI for users to increment, decrement, or manually input a quantity.
 * Why useSignal? So the count update is reactive and reflected instantly in the UI.
 */
export const QuantitySelector = component$<QuantitySelectorProps>(
  ({ initialQuantity = 1, max = 99, min = 1, onChange$ }) => {
    // Local state for the current count
    const quantity = useSignal(initialQuantity);

    // Decrement handler: ensures value doesn't go below 'min'
    // We use $ because this is an event handler that Qwik needs to track
    const handleDecrease = $(async () => {
      if (quantity.value > min) {
        quantity.value--;
        // We MUST await PropFunctions because they are lazy-loaded QRLs.
        await onChange$(quantity.value);
      }
    });

    // Increment handler: ensures value doesn't exceed 'max'
    const handleIncrease = $(async () => {
      if (quantity.value < max) {
        quantity.value++;
        await onChange$(quantity.value);
      }
    });

    // Manual input handler: validates and clamps the user's typed value
    const handleInputChange = $(async (event: Event) => {
      const input = event.target as HTMLInputElement;
      const value = parseInt(input.value) || min;
      // Clamp ensures the value stays within [min, max]
      const clampedValue = Math.max(min, Math.min(max, value));
      quantity.value = clampedValue;
      await onChange$(clampedValue);
    });

    return (
      <div class="flex w-fit items-center overflow-hidden rounded-xl border border-gray-200 shadow-sm">
        {/* Decrease Button */}
        <button
          id="qty-decrease-btn"
          onClick$={handleDecrease}
          disabled={quantity.value <= min}
          class="border-r border-gray-100 bg-white px-5 py-2 text-xl font-bold transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30"
          aria-label="Decrease quantity"
        >
          −
        </button>

        {/* Value Display / Input */}
        <input
          id="qty-input"
          type="number"
          value={quantity.value}
          onInput$={handleInputChange}
          min={min}
          max={max}
          class="w-16 py-2 text-center font-black text-gray-900 [appearance:textfield] focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          aria-label="Quantity"
        />

        {/* Increase Button */}
        <button
          id="qty-increase-btn"
          onClick$={handleIncrease}
          disabled={quantity.value >= max}
          class="border-l border-gray-100 bg-white px-5 py-2 text-xl font-bold transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
    );
  },
);
