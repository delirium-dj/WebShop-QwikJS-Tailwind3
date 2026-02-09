// src/services/api/types.ts

/**
 * API TYPES FILE
 * 
 * This file defines the "shape" of data we get from the API.
 * Think of types as a blueprint or contract - they tell TypeScript
 * exactly what properties an object should have.
 * 
 * For Junior Developers:
 * Types are like labels on boxes:
 * - Without types: "There's stuff in this box" (confusing!)
 * - With types: "This box contains exactly: 1 string, 2 numbers" (clear!)
 */

/**
 * ApiProduct - Structure of product data from FakeStore API
 * 
 * This interface describes what a product looks like when we get it from the API.
 * Every product MUST have these properties.
 * 
 * Why use an interface?
 * - TypeScript will warn us if we forget a property
 * - Autocomplete in VS Code
 * - Prevents typos (like 'titel' instead of 'title')
 * 
 * Example product from API:
 * {
 *   id: 1,
 *   title: "Wireless Headphones",
 *   price: 99.99,
 *   description: "High quality wireless headphones",
 *   category: "electronics",
 *   image: "https://example.com/image.jpg",
 *   rating: {
 *     rate: 4.5,
 *     count: 120
 *   }
 * }
 */
export interface ApiProduct {
  /**
   * id - Unique identifier for the product
   * Type: number
   * Example: 1, 2, 3, etc.
   */
  id: number;

  /**
   * title - Name of the product
   * Type: string (text)
   * Example: "Wireless Headphones"
   */
  title: string;

  /**
   * price - Cost of the product in dollars
   * Type: number (can have decimals)
   * Example: 99.99, 19.99, 149.00
   */
  price: number;

  /**
   * description - Detailed information about the product
   * Type: string (can be long text)
   * Example: "High quality wireless headphones with noise cancellation"
   */
  description: string;

  /**
   * category - Product category/type
   * Type: string
   * Example: "electronics", "clothing", "jewelery"
   */
  category: string;

  /**
   * image - URL to product image
   * Type: string (URL address)
   * Example: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg"
   */
  image: string;

  /**
   * rating - Product rating information
   * Type: object with two properties (rate and count)
   * 
   * Nested object structure:
   * {
   *   rate: 4.5,    // Average rating (1-5)
   *   count: 120    // How many people rated it
   * }
   */
  rating: {
    /**
     * rate - Average star rating
     * Type: number (decimal)
     * Range: 0 to 5
     * Example: 4.5 means 4.5 out of 5 stars
     */
    rate: number;

    /**
     * count - Number of ratings
     * Type: number (integer)
     * Example: 120 means 120 people rated this product
     */
    count: number;
  };
}

/**
 * ProductsResponse - What we get when requesting multiple products
 * 
 * This is simply an array (list) of products.
 * 
 * Example:
 * [
 *   { id: 1, title: "Product 1", ... },
 *   { id: 2, title: "Product 2", ... },
 *   { id: 3, title: "Product 3", ... }
 * ]
 */
export type ProductsResponse = ApiProduct[];

/**
 * ProductResponse - What we get when requesting a single product
 * 
 * This is just one product object.
 * 
 * Example:
 * {
 *   id: 1,
 *   title: "Wireless Headphones",
 *   price: 99.99,
 *   ...
 * }
 */
export type ProductResponse = ApiProduct;

/**
 * CategoriesResponse - List of available categories
 * 
 * This is an array of category names (strings).
 * 
 * Example from FakeStore API:
 * [
 *   "electronics",
 *   "jewelery",
 *   "men's clothing",
 *   "women's clothing"
 * ]
 */
export type CategoriesResponse = string[];

/**
 * ApiError - Structure of error responses
 * 
 * When an API request fails, we get an error object.
 * This interface describes what that error looks like.
 * 
 * Why define error types?
 * - Handle errors consistently
 * - Know what error information is available
 * - Show helpful messages to users
 */
export interface ApiError {
  /**
   * message - Human-readable error description
   * Type: string
   * Example: "Product not found", "Network error"
   */
  message: string;

  /**
   * status - HTTP status code (optional)
   * Type: number
   * 
   * Common status codes:
   * - 200: Success
   * - 400: Bad Request
   * - 404: Not Found
   * - 500: Server Error
   * 
   * The ? means this is optional (might not be present)
   */
  status?: number;

  /**
   * details - Additional error information (optional)
   * Type: any (can be anything)
   * Example: { field: 'email', error: 'Invalid format' }
   */
  details?: any;
}

/**
 * ApiResponse - Generic wrapper for API responses
 * 
 * This is a "generic type" - it can wrap any kind of data.
 * Think of it as a box that can hold different types of content.
 * 
 * The <T> means "this can be any type"
 * 
 * Example:
 * ApiResponse<ApiProduct> = response containing a product
 * ApiResponse<ApiProduct[]> = response containing array of products
 */
export interface ApiResponse<T> {
  /**
   * data - The actual data from API
   * Type: T (whatever type you specify)
   * Example: If T is ApiProduct, then data is an ApiProduct
   */
  data: T;

  /**
   * error - Error information if request failed
   * Type: ApiError | null
   * - If request succeeded: null
   * - If request failed: ApiError object
   */
  error: ApiError | null;

  /**
   * loading - Whether request is still in progress
   * Type: boolean (true/false)
   * - true: Request is loading
   * - false: Request is complete
   */
  loading: boolean;
}

/**
 * FetchOptions - Configuration for fetch requests
 * 
 * When making API calls, we can customize how the request behaves.
 * This interface describes the available options.
 */
export interface FetchOptions {
  /**
   * method - HTTP method to use
   * Type: string
   * 
   * Common methods:
   * - 'GET': Retrieve data (default)
   * - 'POST': Create new data
   * - 'PUT': Update existing data
   * - 'DELETE': Remove data
   * 
   * For e-commerce, we mostly use GET to fetch products
   */
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

  /**
   * headers - HTTP headers to send
   * Type: object with string key-value pairs
   * Example: { 'Content-Type': 'application/json' }
   */
  headers?: Record<string, string>;

  /**
   * body - Data to send with request (for POST/PUT)
   * Type: any (usually an object that will be converted to JSON)
   * Example: { name: "New Product", price: 99.99 }
   */
  body?: any;

  /**
   * cache - Whether to use cached response
   * Type: boolean (true/false)
   * - true: Use cached data if available
   * - false: Always fetch fresh data
   */
  cache?: boolean;

  /**
   * timeout - Maximum time to wait (in milliseconds)
   * Type: number
   * Example: 5000 = 5 seconds
   */
  timeout?: number;
}

/**
 * PaginationParams - Parameters for paginated results
 * 
 * When you have many products, you don't want to load them all at once.
 * Pagination splits them into pages (like Google search results).
 * 
 * Example:
 * Page 1: Products 1-20
 * Page 2: Products 21-40
 * Page 3: Products 41-60
 */
export interface PaginationParams {
  /**
   * limit - How many items per page
   * Type: number
   * Example: 20 means show 20 products per page
   */
  limit?: number;

  /**
   * sort - Sort order
   * Type: string
   * Options:
   * - 'asc': Ascending (A to Z, 1 to 10)
   * - 'desc': Descending (Z to A, 10 to 1)
   */
  sort?: 'asc' | 'desc';
}

/**
 * Example Usage:
 * 
 * ```typescript
 * // Define a function that returns a product
 * async function getProduct(id: number): Promise<ApiProduct> {
 *   const response = await fetch(`/api/products/${id}`);
 *   const product: ApiProduct = await response.json();
 *   return product;
 * }
 * 
 * // Use the product
 * const product = await getProduct(1);
 * console.log(product.title);  // TypeScript knows 'title' exists!
 * console.log(product.xyz);    // ERROR! 'xyz' doesn't exist on ApiProduct
 * ```
 * 
 * Benefits of Using Types:
 * 1. Autocomplete - VS Code suggests properties
 * 2. Error Prevention - Catches typos before running code
 * 3. Documentation - Types explain what data looks like
 * 4. Refactoring - Changing types updates all usage
 */
