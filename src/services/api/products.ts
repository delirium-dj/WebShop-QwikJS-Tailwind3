// src/services/api/products.ts

/**
 * PRODUCTS API SERVICE
 *
 * This file contains all functions for fetching product data from the API.
 * Think of it as a "toolbox" - each function is a tool for getting specific data.
 *
 * For Junior Developers:
 * Instead of writing fetch() code everywhere, we put it all here.
 * This makes code:
 * - Easier to maintain (change API in one place)
 * - Easier to test (test one file instead of many)
 * - Easier to understand (clear function names)
 */

import { API_CONFIG, buildUrl, getHeaders, API_ERRORS } from "./config";
import type {
  ProductsResponse,
  ProductResponse,
  CategoriesResponse,
  ApiError,
  PaginationParams,
} from "./types";

/**
 * handleApiError - Convert API errors into friendly messages
 *
 * When API calls fail, we get technical error objects.
 * This function converts them into messages users can understand.
 *
 * @param error - The error that occurred
 * @returns User-friendly error object
 *
 * Example:
 * Input: Error: fetch failed
 * Output: { message: "Network connection failed. Please check your internet." }
 */
function handleApiError(error: unknown): ApiError {
  /**
   * Check if this is a network error
   * Network errors happen when:
   * - No internet connection
   * - Server is down
   * - Firewall blocks request
   */
  if (error instanceof TypeError && error.message.includes("fetch")) {
    return {
      message: API_ERRORS.NETWORK_ERROR,
      status: 0, // Status 0 means network error
    };
  }

  /**
   * Check if this is a timeout error
   * Timeout = request took too long
   */
  if (error instanceof Error && error.message.includes("timeout")) {
    return {
      message: API_ERRORS.TIMEOUT_ERROR,
      status: 408, // Status 408 = Request Timeout
    };
  }

  /**
   * For any other error, return generic message
   */
  return {
    message: API_ERRORS.UNKNOWN_ERROR,
    details: error,
  };
}

/**
 * fetchWithTimeout - Fetch with automatic timeout
 *
 * Regular fetch() will wait forever if server doesn't respond.
 * This function gives up after a certain time.
 *
 * @param url - The URL to fetch from
 * @param options - Fetch options (headers, method, etc.)
 * @param timeout - Maximum wait time in milliseconds
 * @returns Promise with the response
 *
 * How it works:
 * 1. Start the fetch request
 * 2. Start a timer
 * 3. Whichever finishes first wins
 * 4. If timer wins, throw timeout error
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeout: number = API_CONFIG.TIMEOUT,
): Promise<Response> {
  /**
   * Create a promise that rejects after timeout
   *
   * This is like setting an alarm clock:
   * "If fetch doesn't finish in 10 seconds, stop waiting!"
   */
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new Error("Request timeout"));
    }, timeout);
  });

  /**
   * Race between fetch and timeout
   *
   * Promise.race() means: "First one to finish wins"
   * - If fetch finishes first: return response
   * - If timeout finishes first: throw error
   */
  return Promise.race([fetch(url, options), timeoutPromise]);
}

/**
 * getAllProducts - Fetch all products from API
 *
 * This function gets the complete list of products.
 * Use this for shop page, search results, etc.
 *
 * @param params - Optional pagination parameters
 * @returns Array of products or empty array if error
 *
 * @example
 * // Get all products
 * const products = await getAllProducts();
 *
 * @example
 * // Get first 10 products
 * const products = await getAllProducts({ limit: 10 });
 *
 * @example
 * // Get products sorted newest first
 * const products = await getAllProducts({ sort: 'desc' });
 */
export async function getAllProducts(
  params?: PaginationParams,
): Promise<ProductsResponse> {
  try {
    /**
     * Build the URL with optional parameters
     *
     * Example outputs:
     * - No params: 'https://fakestoreapi.com/products'
     * - With limit: 'https://fakestoreapi.com/products?limit=10'
     * - With sort: 'https://fakestoreapi.com/products?sort=desc'
     */
    let url = buildUrl(API_CONFIG.ENDPOINTS.PRODUCTS);

    /**
     * Add query parameters if provided
     *
     * Query parameters go after ? in URL
     * Example: /products?limit=10&sort=desc
     */
    if (params) {
      const queryParams = new URLSearchParams();

      if (params.limit) {
        queryParams.append("limit", params.limit.toString());
      }

      if (params.sort) {
        queryParams.append("sort", params.sort);
      }

      // Add parameters to URL if any exist
      const queryString = queryParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    /**
     * Make the API request
     *
     * This sends an HTTP GET request to the API
     * GET = "please give me data" (doesn't change anything on server)
     */
    const response = await fetchWithTimeout(url, {
      method: "GET",
      headers: getHeaders(),
    });

    /**
     * Check if request was successful
     *
     * HTTP status codes:
     * - 200-299: Success
     * - 400-499: Client error (we did something wrong)
     * - 500-599: Server error (server has a problem)
     */
    if (!response.ok) {
      // Request failed - throw error with status code
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    /**
     * Convert response to JSON
     *
     * API sends data as text in JSON format
     * .json() converts text to JavaScript object
     *
     * Example response text:
     * '[{"id":1,"title":"Product"},{"id":2,"title":"Product 2"}]'
     *
     * After .json():
     * [{ id: 1, title: "Product" }, { id: 2, title: "Product 2" }]
     */
    const products: ProductsResponse = await response.json();

    /**
     * Log success in development
     * This helps with debugging
     */
    console.log(`✅ Fetched ${products.length} products`);

    return products;
  } catch (error) {
    /**
     * Handle errors gracefully
     *
     * Instead of crashing, we:
     * 1. Log the error for debugging
     * 2. Return empty array so page still works
     */
    const apiError = handleApiError(error);
    console.error("❌ Error fetching products:", apiError.message);

    // Return empty array as fallback
    return [];
  }
}

/**
 * getProductById - Fetch a single product by ID
 *
 * Use this for product detail pages.
 *
 * @param id - Product ID number
 * @returns Product object or null if not found
 *
 * @example
 * const product = await getProductById(5);
 * if (product) {
 *   console.log(product.title);
 * } else {
 *   console.log('Product not found');
 * }
 */
export async function getProductById(
  id: number | string,
): Promise<ProductResponse | null> {
  try {
    /**
     * Build URL with product ID
     *
     * Example:
     * Input: id = 5
     * Output: 'https://fakestoreapi.com/products/5'
     */
    const url = buildUrl(API_CONFIG.ENDPOINTS.PRODUCT_BY_ID, {
      id: id.toString(),
    });

    /**
     * Fetch the product
     */
    const response = await fetchWithTimeout(url, {
      method: "GET",
      headers: getHeaders(),
    });

    /**
     * Check for 404 Not Found
     * This means product doesn't exist
     */
    if (response.status === 404) {
      console.warn(`⚠️ Product ${id} not found`);
      return null;
    }

    /**
     * Check for other errors
     */
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    /**
     * Convert to JSON and return
     */
    const product: ProductResponse = await response.json();
    console.log(`✅ Fetched product: ${product.title}`);

    return product;
  } catch (error) {
    /**
     * Handle errors
     */
    const apiError = handleApiError(error);
    console.error(`❌ Error fetching product ${id}:`, apiError.message);

    return null;
  }
}

/**
 * getCategories - Fetch all available categories
 *
 * Use this for category filters, navigation menus, etc.
 *
 * @returns Array of category names
 *
 * @example
 * const categories = await getCategories();
 * // Returns: ["electronics", "jewelery", "men's clothing", "women's clothing"]
 */
export async function getCategories(): Promise<CategoriesResponse> {
  try {
    const url = buildUrl(API_CONFIG.ENDPOINTS.CATEGORIES);

    const response = await fetchWithTimeout(url, {
      method: "GET",
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const categories: CategoriesResponse = await response.json();
    console.log(`✅ Fetched ${categories.length} categories`);

    return categories;
  } catch (error) {
    const apiError = handleApiError(error);
    console.error("❌ Error fetching categories:", apiError.message);

    return [];
  }
}

/**
 * getProductsByCategory - Fetch products filtered by category
 *
 * Use this for category pages (e.g., "All Electronics")
 *
 * @param category - Category name
 * @param params - Optional pagination parameters
 * @returns Array of products in that category
 *
 * @example
 * const electronics = await getProductsByCategory('electronics');
 *
 * @example
 * // Get first 5 electronics products
 * const electronics = await getProductsByCategory('electronics', { limit: 5 });
 */
export async function getProductsByCategory(
  category: string,
  params?: PaginationParams,
): Promise<ProductsResponse> {
  try {
    /**
     * Build URL with category
     *
     * Example:
     * Input: category = 'electronics'
     * Output: 'https://fakestoreapi.com/products/category/electronics'
     */
    let url = buildUrl(API_CONFIG.ENDPOINTS.PRODUCTS_BY_CATEGORY, {
      category: encodeURIComponent(category), // Encode special characters
    });

    /**
     * Add pagination parameters
     */
    if (params) {
      const queryParams = new URLSearchParams();

      if (params.limit) {
        queryParams.append("limit", params.limit.toString());
      }

      if (params.sort) {
        queryParams.append("sort", params.sort);
      }

      const queryString = queryParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    const response = await fetchWithTimeout(url, {
      method: "GET",
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const products: ProductsResponse = await response.json();
    console.log(
      `✅ Fetched ${products.length} products in category: ${category}`,
    );

    return products;
  } catch (error) {
    const apiError = handleApiError(error);
    console.error(
      `❌ Error fetching products for category ${category}:`,
      apiError.message,
    );

    return [];
  }
}

/**
 * searchProducts - Search products by title
 *
 * FakeStore API doesn't have built-in search, so we:
 * 1. Fetch all products
 * 2. Filter them by search term
 *
 * Note: In a real app, the API would handle searching
 *
 * @param searchTerm - What to search for
 * @returns Products matching search term
 *
 * @example
 * const results = await searchProducts('shirt');
 * // Returns all products with 'shirt' in the title
 */
export async function searchProducts(
  searchTerm: string,
): Promise<ProductsResponse> {
  try {
    /**
     * Fetch all products first
     */
    const allProducts = await getAllProducts();

    /**
     * Filter products by search term
     *
     * How filtering works:
     * 1. Go through each product
     * 2. Check if title contains search term (case-insensitive)
     * 3. Keep only matching products
     */
    const filteredProducts = allProducts.filter((product) => {
      // Convert both to lowercase for case-insensitive search
      const titleLower = product.title.toLowerCase();
      const searchLower = searchTerm.toLowerCase();

      // Check if title contains search term
      return titleLower.includes(searchLower);
    });

    console.log(
      `✅ Found ${filteredProducts.length} products matching "${searchTerm}"`,
    );

    return filteredProducts;
  } catch (error) {
    const apiError = handleApiError(error);
    console.error(`❌ Error searching products:`, apiError.message);

    return [];
  }
}

/**
 * SUMMARY OF FUNCTIONS
 *
 * This file provides 5 main functions:
 *
 * 1. getAllProducts() - Get all products (for shop page)
 * 2. getProductById() - Get one product (for detail page)
 * 3. getCategories() - Get category list (for filters)
 * 4. getProductsByCategory() - Filter by category
 * 5. searchProducts() - Search by title
 *
 * All functions:
 * - Handle errors gracefully
 * - Return safe defaults (empty array or null)
 * - Log helpful messages
 * - Use TypeScript for type safety
 */
