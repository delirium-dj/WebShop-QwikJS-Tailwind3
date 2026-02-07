/**
 * Image Utilities
 * 
 * This file contains utility functions for handling product images,
 * including URL generation, size calculations, and image optimization.
 * 
 * For Junior Developers:
 * - These functions help manage images efficiently across the app
 * - They handle different image sizes and optimize loading performance
 * - Use these utilities instead of directly manipulating image URLs
 */

import type { ImageSize, ProductImage } from '../types/image.types';

/**
 * Default image dimensions for each size variant
 * These dimensions are used when generating optimized image URLs
 */
const IMAGE_DIMENSIONS: Record<ImageSize, { width: number; height: number }> = {
  thumbnail: { width: 150, height: 150 },
  small: { width: 300, height: 300 },
  medium: { width: 600, height: 600 },
  large: { width: 1200, height: 1200 },
  original: { width: 0, height: 0 }, // 0 means use original dimensions
};

/**
 * Generates an optimized image URL based on size and quality requirements
 * 
 * @param baseUrl - The original image URL
 * @param size - The desired image size variant
 * @param quality - Optional quality setting (1-100)
 * @returns Optimized image URL (in production, this would call an image CDN)
 * 
 * Example usage:
 * const thumbnailUrl = getOptimizedImageUrl('/images/product.jpg', 'thumbnail', 80);
 */
export const getOptimizedImageUrl = (
  baseUrl: string,
  size: ImageSize = 'medium',
  quality: number = 85
): string => {
  // In a real application, you would integrate with an image optimization service
  // like Cloudinary, Imgix, or your own image processing API
  // For now, we return the base URL with size parameters
  
  const dimensions = IMAGE_DIMENSIONS[size];
  
  // If original size is requested, return the base URL
  if (size === 'original') {
    return baseUrl;
  }
  
  // Example: In production, you might generate URLs like:
  // `https://cdn.example.com/images/${baseUrl}?w=${dimensions.width}&h=${dimensions.height}&q=${quality}`
  
  return baseUrl;
};

/**
 * Generates srcset attribute for responsive images
 * This allows the browser to choose the best image size for the current viewport
 * 
 * @param baseUrl - The original image URL
 * @param sizes - Array of size variants to include in srcset
 * @returns String formatted for img srcset attribute
 * 
 * Example output:
 * "/images/product.jpg?w=300 300w, /images/product.jpg?w=600 600w"
 */
export const generateSrcSet = (
  baseUrl: string,
  sizes: ImageSize[] = ['small', 'medium', 'large']
): string => {
  return sizes
    .map((size) => {
      const dimensions = IMAGE_DIMENSIONS[size];
      const url = getOptimizedImageUrl(baseUrl, size);
      return `${url} ${dimensions.width}w`;
    })
    .join(', ');
};

/**
 * Gets the primary image from an array of product images
 * 
 * @param images - Array of product images
 * @returns The primary image, or the first image if no primary is marked
 * 
 * Example usage:
 * const mainImage = getPrimaryImage(product.images);
 */
export const getPrimaryImage = (images: ProductImage[]): ProductImage | null => {
  if (!images || images.length === 0) {
    return null;
  }
  
  // Find the image marked as primary
  const primaryImage = images.find((img) => img.isPrimary);
  
  // If no primary image is found, return the first image
  return primaryImage || images[0];
};

/**
 * Validates if an image URL is accessible
 * This is useful for error handling and fallback images
 * 
 * @param url - The image URL to validate
 * @returns Promise that resolves to true if image is accessible
 */
export const validateImageUrl = async (url: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
};

/**
 * Gets a fallback/placeholder image URL
 * Used when the actual product image fails to load or isn't available
 * 
 * @param width - Desired width of placeholder
 * @param height - Desired height of placeholder
 * @returns URL to placeholder image
 */
export const getPlaceholderImage = (
  width: number = 300,
  height: number = 300
): string => {
  // Using a placeholder service (in production, use your own placeholder images)
  return `https://via.placeholder.com/${width}x${height}/CCCCCC/666666?text=No+Image`;
};

/**
 * Converts image size to pixel dimensions
 * 
 * @param size - The image size variant
 * @returns Object with width and height in pixels
 */
export const getSizeDimensions = (size: ImageSize) => {
  return IMAGE_DIMENSIONS[size];
};

/**
 * Preloads an image for better performance
 * Useful for images that will be needed soon (e.g., next in a gallery)
 * 
 * @param url - The image URL to preload
 * 
 * Example usage:
 * preloadImage(nextGalleryImage.url);
 */
export const preloadImage = (url: string): void => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = url;
  document.head.appendChild(link);
};
