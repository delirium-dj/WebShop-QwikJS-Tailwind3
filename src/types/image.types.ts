/**
 * Image Types
 * 
 * This file contains TypeScript interfaces and types for handling product images
 * throughout the application. These types ensure type safety when working with
 * product images in components and utilities.
 */

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
export type ImageSize = 'thumbnail' | 'small' | 'medium' | 'large' | 'original';

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
  format?: 'webp' | 'jpeg' | 'png';
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
