import { component$, useSignal, $ } from "@builder.io/qwik";
import type { ProductImage } from "~/utils/image";
import { WishlistButton } from "../wishlist/WishlistButton";

// Prop definitions for the ProductGallery component
type ProductGalleryProps = {
  images: (string | ProductImage)[]; // Array of image URLs or objects
  title: string; // Product title for alt text accessibility
  // Added for wishlist integration
  product?: {
    id: number;
    title: string;
    price: number;
    image: string;
    category: string;
    discount?: number;
  };
};

/**
 * ProductGallery Component
 * Purpose: Manages the display of product images, including a main view,
 * zoom functionality, and a thumbnail navigation bar.
 */
export const ProductGallery = component$<ProductGalleryProps>(
  ({ images, title, product }) => {
    // Helper to get image URL regardless of format
    const getUrl = (img: string | ProductImage) =>
      typeof img === "string" ? img : img.url;

    // State management using Qwik signals:
    // selectedImageIndex: Tracks which image is currently being shown in the main view
    const selectedImageIndex = useSignal(0);
    // isZoomed: Tracks if the main image is currently in a zoomed-in state
    const isZoomed = useSignal(false);

    // Event Handlers (using the $ suffix for Qwik serialization):

    // Changes the active image when a thumbnail is clicked
    const handleThumbnailClick = $((index: number) => {
      selectedImageIndex.value = index;
    });

    // Toggles the zoom effect when clicking the main image
    const toggleZoom = $(() => {
      isZoomed.value = !isZoomed.value;
    });

    // Navigates to the previous image, looping to the end if at the start
    const handlePrevious = $(() => {
      selectedImageIndex.value =
        selectedImageIndex.value === 0
          ? images.length - 1
          : selectedImageIndex.value - 1;
    });

    // Navigates to the next image, looping to the start if at the end
    const handleNext = $(() => {
      selectedImageIndex.value =
        selectedImageIndex.value === images.length - 1
          ? 0
          : selectedImageIndex.value + 1;
    });

    return (
      <div class="space-y-4">
        {/* Main Image Viewport */}
        <div class="group relative overflow-hidden rounded-lg border border-gray-100 bg-gray-100 shadow-sm">
          <div
            class={`relative flex items-center justify-center transition-all duration-300 ${isZoomed.value ? "z-10 cursor-zoom-out bg-white" : "cursor-zoom-in"}`}
            onClick$={toggleZoom}
          >
            <img
              src={getUrl(images[selectedImageIndex.value])}
              alt={`${title} - Image ${selectedImageIndex.value + 1}`}
              width={800}
              height={500}
              class={`h-[500px] w-full object-contain transition-transform duration-500 will-change-transform ${
                isZoomed.value ? "scale-150" : "scale-100"
              }`}
            />
          </div>

          {/* Wishlist Button — Integrated into bottom-right corner of main image gallery */}
          {product && (
            <div class="absolute bottom-4 right-4 z-40">
              <WishlistButton 
                product={{
                  id: product.id,
                  title: product.title,
                  price: product.price,
                  image: product.image,
                  category: product.category || "Uncategorized",
                  discount: product.discount || 0
                }} 
                variant="icon"
              />
            </div>
          )}

          {/* Navigation Arrows (Only visible on hover) */}
          {images.length > 1 && (
            <>
              <button
                id="gallery-prev-btn"
                onClick$={handlePrevious}
                class="absolute left-4 top-1/2 -translate-y-1/2 transform rounded-full bg-white/90 p-2.5 opacity-0 shadow-md transition-all duration-200 hover:scale-110 hover:bg-white group-hover:opacity-100"
                aria-label="Previous image"
              >
                <svg
                  class="h-6 w-6 text-gray-800"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2.5"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                id="gallery-next-btn"
                onClick$={handleNext}
                class="absolute right-4 top-1/2 -translate-y-1/2 transform rounded-full bg-white/90 p-2.5 opacity-0 shadow-md transition-all duration-200 hover:scale-110 hover:bg-white group-hover:opacity-100"
                aria-label="Next image"
              >
                <svg
                  class="h-6 w-6 text-gray-800"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2.5"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </>
          )}

          {/* Image Counter Badge — Shifted slightly to left to avoid collision with Wishlist heart */}
          {images.length > 1 && (
            <div class="absolute bottom-4 left-4 rounded-full bg-black/60 px-3 py-1 text-xs font-medium tracking-wider text-white backdrop-blur-md">
              {selectedImageIndex.value + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Thumbnail Navigation Rack */}
        {images.length > 1 && (
          <div class="grid grid-cols-4 gap-4">
            {images.map((image, index) => (
              <button
                id={`gallery-thumbnail-${index}`}
                key={index}
                onClick$={() => handleThumbnailClick(index)}
                class={`relative aspect-square overflow-hidden rounded-md border-2 transition-all duration-200 ${
                  selectedImageIndex.value === index
                    ? "border-black ring-2 ring-black/10"
                    : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <img
                  src={getUrl(image)}
                  alt={`${title} thumbnail ${index + 1}`}
                  width={200}
                  height={200}
                  class="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    );
  },
);
