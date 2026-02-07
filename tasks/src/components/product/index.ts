/**
 * Product Components Index
 * 
 * This file exports all product-related components for easy importing.
 * 
 * For Junior Developers:
 * - This is a barrel export file
 * - It allows you to import multiple components from one place
 * - Instead of: import { ProductImage } from './product/ProductImage'
 *              import { ImageGallery } from './product/ImageGallery'
 * - You can do: import { ProductImage, ImageGallery } from './product'
 * 
 * Usage example:
 * import { ProductImage, ImageGallery, ProductCard } from '~/components/product';
 */

// Export all product components
export { ProductImage } from './ProductImage';
export { ImageGallery } from './ImageGallery';
export { ProductCard } from './ProductCard';

// Export types if needed
export type { ProductImage as ProductImageType } from '../../types/image.types';
