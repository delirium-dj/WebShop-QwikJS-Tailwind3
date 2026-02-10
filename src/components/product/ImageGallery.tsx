/**
 * ImageGallery Component
 *
 * A full-featured image gallery for product detail pages.
 * Displays a main image with thumbnails for navigation.
 *
 * For Junior Developers:
 * - This component manages multiple product images in a gallery layout
 * - The main image shows the currently selected image
 * - Thumbnails show all available images and allow clicking to change the main image
 * - It includes zoom functionality on hover (optional)
 * - Signals (useSignal) are used to track which image is currently selected
 *
 * Usage example:
 * <ImageGallery images={product.images} />
 */

import { component$, useSignal, $, useTask$ } from "@builder.io/qwik";
import type { ProductImage as ProductImageType } from "../../utils/image";
import { ProductImage } from "./ProductImage";
import { getPrimaryImage, preloadImage } from "../../utils/image";

/**
 * Component props interface
 */
interface ImageGalleryProps {
  // Array of product images to display in the gallery
  images: ProductImageType[];

  // Additional CSS classes for the gallery container
  class?: string;

  // Whether to enable zoom on hover
  enableZoom?: boolean;

  // Layout direction: 'vertical' (thumbnails on left) or 'horizontal' (thumbnails on bottom)
  layout?: "vertical" | "horizontal";
}

/**
 * ImageGallery Component
 *
 * Displays a product image gallery with main image and thumbnail navigation
 */
export const ImageGallery = component$<ImageGalleryProps>((props) => {
  const {
    images,
    class: className = "",
    enableZoom = true,
    layout = "vertical",
  } = props;

  // If no images provided, return null (don't render anything)
  if (!images || images.length === 0) {
    return (
      <div class="flex h-96 w-full items-center justify-center rounded-lg bg-gray-200">
        <p class="text-lg text-gray-500">No images available</p>
      </div>
    );
  }

  // Get the primary image or first image as default
  const primaryImage = getPrimaryImage(images);

  // Signal to track the currently selected image index
  const selectedIndex = useSignal(
    images.findIndex((img) => img.id === primaryImage?.id) || 0,
  );

  // Signal to track zoom state
  const isZoomed = useSignal(false);

  // Signal for mouse position (used for zoom effect)
  const mousePosition = useSignal({ x: 0, y: 0 });

  /**
   * Preload adjacent images for smoother navigation
   * This runs on the client side after the component is visible
   */
  useTask$(({ track }) => {
    // Track changes to selectedIndex
    track(() => selectedIndex.value);

    // Preload next and previous images
    const nextIndex = (selectedIndex.value + 1) % images.length;
    const prevIndex = (selectedIndex.value - 1 + images.length) % images.length;

    if (images[nextIndex]) {
      preloadImage(images[nextIndex].url);
    }
    if (images[prevIndex]) {
      preloadImage(images[prevIndex].url);
    }
  });

  /**
   * Handler for clicking a thumbnail
   */
  const selectImage$ = $((index: number) => {
    selectedIndex.value = index;
  });

  /**
   * Handler for mouse move on main image (for zoom effect)
   */
  const handleMouseMove$ = $((event: MouseEvent) => {
    if (!enableZoom) return;

    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();

    // Calculate mouse position as percentage
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    mousePosition.value = { x, y };
  });

  /**
   * Handler for mouse enter (activate zoom)
   */
  const handleMouseEnter$ = $(() => {
    if (enableZoom) {
      isZoomed.value = true;
    }
  });

  /**
   * Handler for mouse leave (deactivate zoom)
   */
  const handleMouseLeave$ = $(() => {
    isZoomed.value = false;
  });

  // Get the currently selected image
  const currentImage = images[selectedIndex.value];

  // Determine layout classes based on layout prop
  const layoutClasses =
    layout === "vertical"
      ? "flex flex-col md:flex-row gap-4"
      : "flex flex-col gap-4";

  const thumbnailContainerClasses =
    layout === "vertical"
      ? "flex flex-row md:flex-col gap-2 order-2 md:order-1 overflow-x-auto md:overflow-y-auto md:max-h-[600px]"
      : "flex flex-row gap-2 overflow-x-auto";

  const mainImageClasses =
    layout === "vertical" ? "flex-1 order-1 md:order-2" : "w-full";

  return (
    <div class={`image-gallery ${layoutClasses} ${className}`}>
      {/* Thumbnail navigation */}
      <div class={thumbnailContainerClasses}>
        {images.map((image, index) => (
          <button
            key={image.id}
            class={`h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
              selectedIndex.value === index
                ? "border-blue-600 ring-2 ring-blue-200"
                : "border-gray-300 hover:border-gray-400"
            } `}
            onClick$={() => selectImage$(index)}
            aria-label={`View ${image.alt}`}
          >
            <ProductImage
              image={image}
              size="thumbnail"
              lazy={false}
              showPlaceholder={false}
              class="h-full w-full"
            />
          </button>
        ))}
      </div>

      {/* Main image display */}
      <div class={mainImageClasses}>
        <div
          class={`relative overflow-hidden rounded-lg bg-gray-100 ${enableZoom ? "cursor-zoom-in" : ""} `}
          onMouseMove$={handleMouseMove$}
          onMouseEnter$={handleMouseEnter$}
          onMouseLeave$={handleMouseLeave$}
        >
          <ProductImage
            image={currentImage}
            size="large"
            lazy={false}
            class={`h-auto w-full transition-transform duration-200 ${isZoomed.value ? "scale-150" : "scale-100"} `}
            style={
              isZoomed.value
                ? {
                    "transform-origin": `${mousePosition.value.x}% ${mousePosition.value.y}%`,
                  }
                : undefined
            }
          />

          {/* Image counter badge */}
          {images.length > 1 && (
            <div class="absolute bottom-4 right-4 rounded-full bg-black bg-opacity-60 px-3 py-1 text-sm text-white">
              {selectedIndex.value + 1} / {images.length}
            </div>
          )}

          {/* Navigation arrows (show only if multiple images) */}
          {images.length > 1 && (
            <>
              {/* Previous button */}
              <button
                class="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white bg-opacity-80 p-2 shadow-lg transition-all hover:bg-opacity-100"
                onClick$={() =>
                  selectImage$(
                    (selectedIndex.value - 1 + images.length) % images.length,
                  )
                }
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
                    stroke-width="2"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              {/* Next button */}
              <button
                class="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white bg-opacity-80 p-2 shadow-lg transition-all hover:bg-opacity-100"
                onClick$={() =>
                  selectImage$((selectedIndex.value + 1) % images.length)
                }
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
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </>
          )}

          {/* Zoom hint */}
          {enableZoom && !isZoomed.value && (
            <div class="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-black bg-opacity-60 px-3 py-1 text-xs text-white">
              <svg
                class="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
                />
              </svg>
              <span>Hover to zoom</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
