/**
 * ProductImage Component
 * 
 * A reusable component for displaying product images with optimization,
 * lazy loading, and responsive behavior.
 * 
 * For Junior Developers:
 * - This component wraps the native <img> tag with additional features
 * - It handles lazy loading (images load only when visible on screen)
 * - It provides fallback images if the main image fails to load
 * - It optimizes images for different screen sizes
 * 
 * Usage example:
 * <ProductImage 
 *   image={productImage} 
 *   size="medium" 
 *   class="rounded-lg shadow-md"
 * />
 */

import { component$, useSignal, $, type QRL } from '@builder.io/qwik';
import type { ProductImage as ProductImageType, ImageSize } from '../../types/image.types';
import {
  getOptimizedImageUrl,
  generateSrcSet,
  getPlaceholderImage,
  getSizeDimensions,
} from '../../utils/image.utils';

/**
 * Component props interface
 */
interface ProductImageProps {
  // The image object containing URL and metadata
  image: ProductImageType;
  
  // Size variant to display (determines image dimensions)
  size?: ImageSize;
  
  // Additional CSS classes to apply to the image
  class?: string;
  
  // Whether to enable lazy loading (loads when scrolled into view)
  lazy?: boolean;
  
  // Whether to show a placeholder while loading
  showPlaceholder?: boolean;
  
  // Image quality (1-100, higher = better quality but larger file size)
  quality?: number;
  
  // Optional click handler
  onClick$?: QRL<() => void>;
}

/**
 * ProductImage Component
 * 
 * Renders an optimized, responsive product image with lazy loading support
 */
export const ProductImage = component$<ProductImageProps>((props) => {
  // Destructure props with default values
  const {
    image,
    size = 'medium',
    class: className = '',
    lazy = true,
    showPlaceholder = true,
    quality = 85,
    onClick$,
  } = props;

  // Signal to track if the image has loaded successfully
  const isLoaded = useSignal(false);
  
  // Signal to track if there was an error loading the image
  const hasError = useSignal(false);

  // Get the dimensions for the requested size
  const dimensions = getSizeDimensions(size);
  
  // Generate the optimized image URL
  const imageUrl = getOptimizedImageUrl(image.url, size, quality);
  
  // Generate srcset for responsive images (different sizes for different screen widths)
  const srcSet = generateSrcSet(image.url);
  
  // Get placeholder image URL in case of errors
  const placeholderUrl = getPlaceholderImage(dimensions.width, dimensions.height);

  /**
   * Handler for when the image loads successfully
   */
  const handleLoad$ = $(() => {
    isLoaded.value = true;
  });

  /**
   * Handler for when the image fails to load
   */
  const handleError$ = $(() => {
    hasError.value = true;
    console.error(`Failed to load image: ${image.url}`);
  });

  return (
    <div
      class={`relative overflow-hidden ${className}`}
      style={{
        width: dimensions.width > 0 ? `${dimensions.width}px` : '100%',
        height: dimensions.height > 0 ? `${dimensions.height}px` : 'auto',
      }}
    >
      {/* Show placeholder while image is loading (if enabled) */}
      {showPlaceholder && !isLoaded.value && !hasError.value && (
        <div class="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <svg
            class="w-12 h-12 text-gray-400"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
      )}

      {/* Main product image */}
      <img
        src={hasError.value ? placeholderUrl : imageUrl}
        srcSet={hasError.value ? undefined : srcSet}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        alt={image.alt}
        width={dimensions.width || image.width}
        height={dimensions.height || image.height}
        loading={lazy ? 'lazy' : 'eager'}
        class={`
          w-full h-full object-cover transition-opacity duration-300
          ${isLoaded.value ? 'opacity-100' : 'opacity-0'}
          ${onClick$ ? 'cursor-pointer hover:opacity-90' : ''}
        `}
        onLoad$={handleLoad$}
        onError$={handleError$}
        onClick$={onClick$}
      />

      {/* Optional badge for primary images */}
      {image.isPrimary && (
        <div class="absolute top-2 left-2 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded">
          Primary
        </div>
      )}
    </div>
  );
});
