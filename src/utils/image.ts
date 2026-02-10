/**
 * IMAGE UTILITIES AND TYPES
 *
 * This consolidated file handles all image-related functionality:
 * - Type definitions for product images
 * - Image optimization functions
 * - Image validation and caching
 * - Placeholder and fallback handling
 *
 * For Junior Developers:
 * When you need to work with images, you'll find everything you need in this file.
 * Instead of jumping between multiple files, it's all organized in one place!
 *
 * Key patterns:
 * - Types are at the top for easy reference
 * - Constants (like dimensions) are organized by purpose
 * - Functions are grouped by responsibility (optimization, validation, etc.)
 */

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

/**
 * Represents a single product image
 *
 * @property id - Unique identifier for the image
 * @property url - Full URL path to the image file
 * @property alt - Alternative text for accessibility (describes the image)
 * @property thumbnail - Optional URL to a smaller thumbnail version
 * @property width - Optional width of the image in pixels
 * @property height - Optional height of the image in pixels
 * @property isPrimary - Flag to indicate if this is the main product image
 */
export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  thumbnail?: string;
  width?: number;
  height?: number;
  isPrimary?: boolean;
}

/**
 * Image size variants used throughout the application
 *
 * - thumbnail: Small images for product cards (e.g., 150x150)
 * - small: Medium-sized images (e.g., 300x300)
 * - medium: Standard product images (e.g., 600x600)
 * - large: Full-size images for detail view (e.g., 1200x1200)
 * - original: Unmodified original image
 */
export type ImageSize = "thumbnail" | "small" | "medium" | "large" | "original";

/**
 * Configuration for image optimization
 *
 * @property quality - JPEG/WebP quality (1-100, higher is better quality)
 * @property format - Preferred image format
 * @property lazy - Whether to enable lazy loading
 * @property placeholder - Whether to show a placeholder while loading
 */
export interface ImageConfig {
  quality?: number;
  format?: "webp" | "jpeg" | "png";
  lazy?: boolean;
  placeholder?: boolean;
}

/**
 * Props for image components
 *
 * @property image - The product image object
 * @property size - The size variant to display
 * @property config - Optional image configuration overrides
 * @property className - Additional CSS classes to apply
 * @property onClick$ - Optional click handler for the image
 */
export interface ImageProps {
  image: ProductImage;
  size?: ImageSize;
  config?: ImageConfig;
  className?: string;
  onClick$?: () => void;
}

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Default image dimensions for each size variant
 * These dimensions are used when generating optimized image URLs
 *
 * For Junior Developers:
 * If you want to change how large images are, edit these values.
 * For example, if you want thumbnails to be 200x200 instead of 150x150,
 * just change the first entry here!
 */
const IMAGE_DIMENSIONS: Record<ImageSize, { width: number; height: number }> = {
  thumbnail: { width: 150, height: 150 },
  small: { width: 300, height: 300 },
  medium: { width: 600, height: 600 },
  large: { width: 1200, height: 1200 },
  original: { width: 0, height: 0 }, // 0 means use original dimensions
};

// ============================================================================
// IMAGE OPTIMIZATION FUNCTIONS
// ============================================================================

/**
 * Generates an optimized image URL based on size and quality requirements
 *
 * In a real production app, this would integrate with an image CDN like Cloudinary.
 * For now, it returns the base URL (ready for future CDN integration).
 *
 * @param baseUrl - The original image URL
 * @param size - The desired image size variant
 * @returns Optimized image URL
 *
 * @example
 * ```tsx
 * const thumbnailUrl = getOptimizedImageUrl('/images/product.jpg', 'thumbnail');
 * const largeUrl = getOptimizedImageUrl('/images/product.jpg', 'large');
 * ```
 */
export const getOptimizedImageUrl = (
  baseUrl: string,
  _size: ImageSize = "medium",
): string => {
  // In a real application, you would integrate with an image optimization service
  // like Cloudinary, Imgix, or your own image processing API
  // For now, we return the base URL with size parameters

  // const dimensions = IMAGE_DIMENSIONS[_size];

  // If original size is requested, return the base URL
  if (_size === "original") {
    return baseUrl;
  }

  // Example: In production, you might generate URLs like:
  // `https://cdn.example.com/images/${baseUrl}?w=${dimensions.width}&h=${dimensions.height}&q=${_quality}`
  if (process.env.NODE_ENV === "development") {
    // console.log('Optimizing with quality:', _quality);
  }

  return baseUrl;
};

/**
 * Generates srcset attribute for responsive images
 *
 * This allows the browser to choose the best image size for the current viewport.
 * The browser will automatically select the best size based on device width and DPI.
 *
 * @param baseUrl - The original image URL
 * @param sizes - Array of size variants to include in srcset
 * @returns String formatted for img srcset attribute
 *
 * @example
 * ```tsx
 * // Output: "/images/product.jpg 300w, /images/product.jpg 600w, /images/product.jpg 1200w"
 * const srcSet = generateSrcSet('/images/product.jpg');
 * <img srcset={srcSet} />
 * ```
 */
export const generateSrcSet = (
  baseUrl: string,
  sizes: ImageSize[] = ["small", "medium", "large"],
): string => {
  return sizes
    .map((size) => {
      const dimensions = IMAGE_DIMENSIONS[size];
      const url = getOptimizedImageUrl(baseUrl, size);
      return `${url} ${dimensions.width}w`;
    })
    .join(", ");
};

// ============================================================================
// IMAGE SELECTION & RETRIEVAL FUNCTIONS
// ============================================================================

/**
 * Gets the primary image from an array of product images
 *
 * If no image is marked as primary, returns the first image in the array.
 * This is useful for displaying the "main" product image in galleries.
 *
 * @param images - Array of product images
 * @returns The primary image, or the first image if no primary is marked
 *
 * @example
 * ```tsx
 * const mainImage = getPrimaryImage(product.images);
 * return <img src={mainImage?.url} alt={mainImage?.alt} />;
 * ```
 */
export const getPrimaryImage = (
  images: ProductImage[],
): ProductImage | null => {
  if (!images || images.length === 0) {
    return null;
  }

  // Find the image marked as primary
  const primaryImage = images.find((img) => img.isPrimary);

  // If no primary image is found, return the first image
  return primaryImage || images[0];
};

/**
 * Converts image size variant to pixel dimensions
 *
 * Useful when you need to set explicit dimensions or understand size constraints.
 * For example: When creating a container, knowing the dimensions helps with layout.
 *
 * @param size - The image size variant (e.g., 'small', 'medium')
 * @returns Object with width and height in pixels
 *
 * @example
 * ```tsx
 * const { width, height } = getSizeDimensions('small');
 * console.log(width); // 300
 * console.log(height); // 300
 * ```
 */
export const getSizeDimensions = (size: ImageSize) => {
  return IMAGE_DIMENSIONS[size];
};

// ============================================================================
// IMAGE VALIDATION & FALLBACK FUNCTIONS
// ============================================================================

/**
 * Gets a fallback/placeholder image URL
 *
 * Used when the actual product image fails to load or isn't available.
 * This provides a consistent visual appearance instead of broken image icons.
 *
 * @param width - Desired width of placeholder
 * @param height - Desired height of placeholder
 * @returns URL to placeholder image
 *
 * @example
 * ```tsx
 * // If product image fails to load, use this:
 * const fallbackUrl = getPlaceholderImage(300, 300);
 * <img src={imageLoaded ? productUrl : fallbackUrl} />
 * ```
 */
export const getPlaceholderImage = (
  width: number = 300,
  height: number = 300,
): string => {
  // Using a placeholder service (in production, use your own placeholder images)
  return `https://via.placeholder.com/${width}x${height}/CCCCCC/666666?text=No+Image`;
};

/**
 * Validates if an image URL is accessible
 *
 * This is useful for error handling and determining fallback images.
 * The function tries to load the image and resolves based on success/failure.
 *
 * @param url - The image URL to validate
 * @returns Promise that resolves to true if image is accessible, false otherwise
 *
 * @example
 * ```tsx
 * const isValid = await validateImageUrl(imageUrl);
 * if (isValid) {
 *   // Use this image
 * } else {
 *   // Use fallback/placeholder
 * }
 * ```
 */
export const validateImageUrl = async (url: string): Promise<boolean> => {
  return new Promise((resolve) => {
    // Create an invisible img element to test the URL
    const img = new Image();

    // If image loads successfully, URL is valid
    img.onload = () => resolve(true);

    // If image fails to load, URL is invalid
    img.onerror = () => resolve(false);

    // Trigger the load by setting the src
    img.src = url;
  });
};

// ============================================================================
// IMAGE PRELOADING & PERFORMANCE FUNCTIONS
// ============================================================================

/**
 * Preloads an image for better performance
 *
 * Useful for images that will be needed soon (e.g., next slide in a gallery).
 * The browser starts downloading the image in the background,
 * so it's ready to display instantly when needed.
 *
 * @param url - The image URL to preload
 *
 * @example
 * ```tsx
 * // Preload the next gallery image before user clicks "Next"
 * const handleShowNextImage = () => {
 *   preloadImage(nextImage.url);
 *   setCurrentImage(nextImage);
 * };
 * ```
 */
export const preloadImage = (url: string): void => {
  // Only works in browser (not SSR)
  if (typeof document === "undefined") {
    return;
  }

  // Create a link element with rel="preload"
  const link = document.createElement("link");
  link.rel = "preload";
  link.as = "image";
  link.href = url;

  // Add to document head to trigger preload
  document.head.appendChild(link);
};
