import type { ApiProduct } from '~/services/api/types';
import type { Product } from '~/types/product';
import type { ProductImage } from '~/types/image.types';

/**
 * mapApiProductToProduct - Maps a single product from FakeStore API to our internal format
 * 
 * For Junior Developers:
 * The data we get from an API (FakeStore) doesn't always match the format our
 * components expect. This "mapper" function acts as a translator.
 */
export function mapApiProductToProduct(apiProduct: ApiProduct): Product {
  // Convert basic image string to our ProductImage structure
  const primaryImage: ProductImage = {
    id: `img-${apiProduct.id}`,
    url: apiProduct.image,
    alt: apiProduct.title,
    isPrimary: true,
    width: 600,
    height: 600
  };

  return {
    id: apiProduct.id,
    title: apiProduct.title,
    description: apiProduct.description,
    price: apiProduct.price,
    // Add imaginary discount variety for even IDs
    // Discounts: 20%, 25%, 33%, 40%, 50%
    originalPrice: apiProduct.id % 2 === 0 
      ? (() => {
          const multipliers = [1.25, 1.333, 1.5, 1.666, 2.0];
          const multiplier = multipliers[(apiProduct.id / 2) % multipliers.length];
          return Math.round(apiProduct.price * multiplier * 100) / 100;
        })()
      : undefined,
    image: apiProduct.image,
    images: [primaryImage], // Now matches Product interface
    category: apiProduct.category,
    rating: apiProduct.rating.rate,
    reviewCount: apiProduct.rating.count,
    inStock: true, // API doesn't provide stock info, so we assume true
    stockQuantity: 20
  };
}

/**
 * mapApiProductsToProducts - Maps an array of API products
 */
export function mapApiProductsToProducts(apiProducts: ApiProduct[]): Product[] {
  return apiProducts.map(mapApiProductToProduct);
}
