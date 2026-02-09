// src/services/api/config.ts

/**
 * API CONFIGURATION FILE
 * 
 * This file contains all the settings for connecting to external APIs.
 * Think of it as the "phone book" for your app - it knows all the addresses
 * of where to get data from.
 * 
 * For Junior Developers:
 * An API (Application Programming Interface) is like a waiter in a restaurant:
 * - You tell the waiter what you want (make a request)
 * - Waiter goes to the kitchen (API server)
 * - Waiter brings back your food (data response)
 */

/**
 * API_CONFIG
 * 
 * This object stores all configuration settings for our API
 * 
 * Why use a config object instead of hardcoding URLs everywhere?
 * - Easy to change API in one place
 * - Different URLs for development vs production
 * - Can switch between multiple APIs easily
 */
export const API_CONFIG = {
  /**
   * BASE_URL - The main address of our API
   * 
   * We're using FakeStore API as an example (free API for learning)
   * You can replace this with your own API later
   * 
   * Examples of other free APIs for learning:
   * - DummyJSON: 'https://dummyjson.com'
   * - JSONPlaceholder: 'https://jsonplaceholder.typicode.com'
   */
  BASE_URL: 'https://fakestoreapi.com',

  /**
   * ENDPOINTS - Specific paths within our API
   * 
   * Think of BASE_URL as the building address,
   * and ENDPOINTS as the room numbers inside
   * 
   * Example:
   * BASE_URL = '123 Main Street'
   * ENDPOINTS.PRODUCTS = 'Room 201'
   * Full address = '123 Main Street, Room 201'
   */
  ENDPOINTS: {
    /**
     * PRODUCTS - Path to get all products
     * Full URL: https://fakestoreapi.com/products
     */
    PRODUCTS: '/products',

    /**
     * PRODUCT_BY_ID - Path to get a single product
     * Use :id as a placeholder that we'll replace with actual ID
     * Example: /products/5 means "get product with ID 5"
     */
    PRODUCT_BY_ID: '/products/:id',

    /**
     * CATEGORIES - Path to get all product categories
     * Full URL: https://fakestoreapi.com/products/categories
     */
    CATEGORIES: '/products/categories',

    /**
     * PRODUCTS_BY_CATEGORY - Path to filter products by category
     * Example: /products/category/electronics
     */
    PRODUCTS_BY_CATEGORY: '/products/category/:category',

    /**
     * LIMITED_PRODUCTS - Get a limited number of products
     * Useful for "Featured Products" sections
     * Example: /products?limit=5 gets only 5 products
     */
    LIMITED_PRODUCTS: '/products?limit=:limit',

    /**
     * SORTED_PRODUCTS - Get products in specific order
     * Example: /products?sort=desc gets newest first
     */
    SORTED_PRODUCTS: '/products?sort=:sort',
  },

  /**
   * TIMEOUT - Maximum time to wait for API response (in milliseconds)
   * 
   * Why we need this:
   * - Prevents waiting forever if API is down
   * - Gives user feedback faster
   * 
   * 10000ms = 10 seconds
   * After 10 seconds, we give up and show error
   */
  TIMEOUT: 10000,

  /**
   * RETRY_ATTEMPTS - How many times to retry if request fails
   * 
   * Why retry?
   * - Network might be temporarily down
   * - Server might be busy
   * 
   * We'll try 3 times before giving up
   */
  RETRY_ATTEMPTS: 3,

  /**
   * CACHE_TIME - How long to remember API responses (in milliseconds)
   * 
   * Why cache?
   * - Faster loading (don't fetch same data twice)
   * - Less strain on API server
   * - Works offline if data is cached
   * 
   * 300000ms = 5 minutes
   */
  CACHE_TIME: 5 * 60 * 1000, // 5 minutes
};

/**
 * buildUrl - Helper function to construct complete API URLs
 * 
 * This function takes an endpoint and optional parameters,
 * and builds the full URL.
 * 
 * @param endpoint - The API endpoint (like '/products')
 * @param params - Optional parameters to replace in URL
 * @returns Complete URL ready to use
 * 
 * @example
 * // Simple endpoint
 * buildUrl('/products')
 * // Returns: 'https://fakestoreapi.com/products'
 * 
 * @example
 * // Endpoint with ID
 * buildUrl('/products/:id', { id: '5' })
 * // Returns: 'https://fakestoreapi.com/products/5'
 * 
 * @example
 * // Endpoint with multiple params
 * buildUrl('/products?limit=:limit', { limit: '10' })
 * // Returns: 'https://fakestoreapi.com/products?limit=10'
 */
export function buildUrl(
  endpoint: string,
  params?: Record<string, string | number>
): string {
  /**
   * Start with the base URL
   * Example: 'https://fakestoreapi.com'
   */
  let url = API_CONFIG.BASE_URL + endpoint;

  /**
   * If we have parameters, replace placeholders
   * 
   * How this works:
   * 1. Loop through each parameter
   * 2. Find ':paramName' in the URL
   * 3. Replace it with the actual value
   * 
   * Example:
   * url = '/products/:id'
   * params = { id: 5 }
   * Result: '/products/5'
   */
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      // Replace :key with the actual value
      // 'g' flag means "replace ALL occurrences"
      url = url.replace(`:${key}`, String(value));
    });
  }

  return url;
}

/**
 * getHeaders - Get HTTP headers for API requests
 * 
 * Headers are like "metadata" sent with your request
 * They tell the server what format we want and what we're sending
 * 
 * @returns Object containing HTTP headers
 * 
 * Common headers explained:
 * - Content-Type: What format we're sending (JSON)
 * - Accept: What format we want back (JSON)
 * - Authorization: Token for authentication (if needed)
 */
export function getHeaders(): HeadersInit {
  return {
    /**
     * Content-Type tells server we're sending JSON data
     * JSON = JavaScript Object Notation (standard data format)
     */
    'Content-Type': 'application/json',

    /**
     * Accept tells server we want JSON back
     * Server will format response as JSON
     */
    Accept: 'application/json',

    /**
     * OPTIONAL: Add authorization token
     * Uncomment this if your API requires authentication
     * 
     * Example:
     * 'Authorization': `Bearer ${getAuthToken()}`,
     */
  };
}

/**
 * isServerSide - Check if code is running on server or client
 * 
 * Why do we need this?
 * - Some code only works on server (like database access)
 * - Some code only works on client (like localStorage)
 * 
 * @returns true if running on server, false if in browser
 */
export function isServerSide(): boolean {
  /**
   * 'window' only exists in the browser, not on server
   * 
   * On server: typeof window === 'undefined' → true
   * In browser: typeof window === 'object' → false
   */
  return typeof window === 'undefined';
}

/**
 * API_ERRORS - Common error messages
 * 
 * Having standard error messages makes debugging easier
 * and provides consistent user feedback
 */
export const API_ERRORS = {
  /**
   * NETWORK_ERROR - Internet connection problem
   */
  NETWORK_ERROR: 'Network connection failed. Please check your internet.',

  /**
   * TIMEOUT_ERROR - Request took too long
   */
  TIMEOUT_ERROR: 'Request timed out. Please try again.',

  /**
   * NOT_FOUND - Resource doesn't exist
   */
  NOT_FOUND: 'The requested resource was not found.',

  /**
   * SERVER_ERROR - Something wrong on the server
   */
  SERVER_ERROR: 'Server error. Please try again later.',

  /**
   * UNKNOWN_ERROR - Unexpected error
   */
  UNKNOWN_ERROR: 'An unexpected error occurred.',
};

/**
 * Example Usage of This Config File:
 * 
 * ```typescript
 * import { buildUrl, getHeaders, API_CONFIG } from './config';
 * 
 * // Build URL for getting product with ID 5
 * const url = buildUrl(API_CONFIG.ENDPOINTS.PRODUCT_BY_ID, { id: 5 });
 * // Result: 'https://fakestoreapi.com/products/5'
 * 
 * // Make API request
 * const response = await fetch(url, {
 *   headers: getHeaders(),
 * });
 * 
 * // Get data
 * const product = await response.json();
 * ```
 */
