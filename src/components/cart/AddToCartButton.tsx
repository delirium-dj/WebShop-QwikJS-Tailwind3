// src/components/cart/AddToCartButton.tsx
import { component$, useSignal, $ } from "@builder.io/qwik";
import { useCart } from "~/contexts/cart";
import { useToast } from "~/contexts/toast";

/**
 * Product Type for Add to Cart Button
 * This defines what product information we need to add an item to the cart.
 */
type AddToCartButtonProps = {
  product: {
    id: number;
    title: string;
    price: number;
    image: string;
    discount?: number;
    selectedSize?: string;
    selectedColor?: string;
  };
  quantity?: number; // How many to add (default: 1)
  variant?: "primary" | "secondary" | "outline"; // Visual style
  size?: "sm" | "md" | "lg"; // Button size
  fullWidth?: boolean; // Should button take full width?
  disabled?: boolean; // Is button disabled (e.g., out of stock)?
  showIcon?: boolean; // Show cart icon?
  onSuccess?: () => void; // Optional callback after successful add
};

/**
 * Enhanced Add to Cart Button Component
 *
 * This is a "smart" button that handles the entire add-to-cart flow:
 * 1. Shows a loading spinner while adding
 * 2. Displays a success checkmark when done
 * 3. Shows a toast notification with product details
 * 4. Prevents duplicate clicks during loading
 *
 * Junior Dev Note:
 * This component demonstrates "optimistic UI" - we show visual feedback immediately
 * even before the cart state finishes updating, making the app feel faster.
 */
export const AddToCartButton = component$<AddToCartButtonProps>(
  ({
    product,
    quantity = 1,
    variant = "primary",
    size = "md",
    fullWidth = false,
    disabled = false,
    showIcon = true,
    onSuccess,
  }) => {
    // Access our global cart and toast systems
    const cart = useCart();
    const toast = useToast();

    // Reactive state for button animations
    const isLoading = useSignal(false); // True while adding to cart
    const isSuccess = useSignal(false); // True briefly after successful add

    /**
     * Handle Add to Cart Click
     * This is the main function that runs when the button is clicked.
     */
    const handleAddToCart = $(async (event: Event) => {
      event.preventDefault();
      event.stopPropagation();

      if (disabled || isLoading.value) return;

      isLoading.value = true;

      try {
        // Simulate network delay for better UX feedback (remove in production)
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Add item to cart
        await cart.actions.addItem(
          {
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            discount: product.discount,
            selectedSize: product.selectedSize,
            selectedColor: product.selectedColor,
          },
          quantity,
        );

        // Show success state
        isSuccess.value = true;

        // Show toast notification
        const variantText =
          product.selectedSize || product.selectedColor
            ? ` (${[product.selectedSize, product.selectedColor]
                .filter(Boolean)
                .join(", ")})`
            : "";

        // Show toast notification with product details
         
        toast.showToast(
          `${quantity > 1 ? `${quantity}x ` : ""}${product.title}${variantText} added to cart`,
          "success",
          3000,
        );

        // Call success callback if provided
        // eslint-disable-next-line qwik/valid-lexical-scope
        onSuccess?.();

        // Reset success state after animation
        setTimeout(() => {
          isSuccess.value = false;
        }, 2000);
      } catch (error) {
        // Show error toast
         
        toast.showToast("Failed to add item to cart", "error");
        console.error("Add to cart error:", error);
      } finally {
        isLoading.value = false;
      }
    });

    // Button size classes
    const sizeClasses = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg",
    };

    // Button variant classes
    const variantClasses = {
      primary: "bg-black text-white hover:bg-gray-800 disabled:bg-gray-300",
      secondary:
        "bg-gray-200 text-gray-900 hover:bg-gray-300 disabled:bg-gray-100",
      outline:
        "bg-transparent border-2 border-black text-black hover:bg-black hover:text-white disabled:border-gray-300 disabled:text-gray-300",
    };

    const baseClasses = `
      inline-flex items-center justify-center gap-2 font-semibold rounded-md
      transition-all duration-200 disabled:cursor-not-allowed
      ${fullWidth ? "w-full" : ""}
      ${sizeClasses[size]}
      ${variantClasses[variant]}
      ${isSuccess.value ? "scale-95" : "scale-100"}
    `;

    return (
      <button
        id="add-to-cart-main-btn"
        onClick$={handleAddToCart}
        disabled={disabled || isLoading.value}
        class={baseClasses}
        aria-label={`Add ${product.title} to cart`}
      >
        {/* Loading Spinner */}
        {isLoading.value && (
          <svg
            class="h-5 w-5 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            />
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}

        {/* Success Checkmark */}
        {isSuccess.value && !isLoading.value && (
          <svg
            class="h-5 w-5 animate-bounce"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clip-rule="evenodd"
            />
          </svg>
        )}

        {/* Shopping Cart Icon */}
        {!isLoading.value && !isSuccess.value && showIcon && (
          <svg
            class="h-5 w-5"
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
        )}

        {/* Button Text */}
        <span>
          {isLoading.value
            ? "Adding..."
            : isSuccess.value
              ? "Added!"
              : disabled
                ? "Out of Stock"
                : "Add to Cart"}
        </span>
      </button>
    );
  },
);
