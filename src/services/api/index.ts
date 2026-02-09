// src/services/api/index.ts

/**
 * API SERVICE INDEX (BARREL EXPORT FILE)
 * 
 * This file exports everything from our API service.
 * Think of it as a "shop window" that displays all available items.
 * 
 * For Junior Developers:
 * Instead of importing from multiple files:
 * ```typescript
 * import { getAllProducts } from '~/services/api/products';
 * import { API_CONFIG } from '~/services/api/config';
 * import { ApiProduct } from '~/services/api/types';
 * ```
 * 
 * You can import from one place:
 * ```typescript
 * import { getAllProducts, API_CONFIG, ApiProduct } from '~/services/api';
 * ```
 * 
 * This is cleaner and easier to maintain!
 */

/**
 * Export all API functions
 * These are the tools for fetching data
 */
export {
  getAllProducts,
  getProductById,
  getCategories,
  getProductsByCategory,
  searchProducts,
} from './products';

/**
 * Export configuration
 * These are the settings for API
 */
export { API_CONFIG, buildUrl, getHeaders, isServerSide, API_ERRORS } from './config';

/**
 * Export types
 * These define the shape of data
 */
export type {
  ApiProduct,
  ProductsResponse,
  ProductResponse,
  CategoriesResponse,
  ApiError,
  ApiResponse,
  FetchOptions,
  PaginationParams,
} from './types';

/**
 * Now you can use it like this:
 * 
 * ```typescript
 * import { getAllProducts, ApiProduct } from '~/services/api';
 * 
 * const products: ApiProduct[] = await getAllProducts();
 * ```
 */
