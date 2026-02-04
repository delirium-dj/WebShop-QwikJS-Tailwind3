/**
 * Product Interface
 * Purpose: This is the data "blueprint" for a single product in our store.
 * Using an interface helps TypeScript catch errors if we forget a required field.
 */
export interface Product {
  id: string | number;         // Unique identifier (from database)
  title: string;               // Name of the product
  description: string;         // Long form marketing text
  price: number;               // Current selling price
  originalPrice?: number;      // Original price (for showing MSRP or cross-outs)
  image: string;               // Main display image URL
  images?: string[];           // Array of additional gallery images
  category: string;            // Parent category (e.g., "Electronics")
  subcategory?: string;        // Specific sub-category (e.g., "Headphones")
  brand?: string;              // Manufacturer name
  rating?: number;             // Average user rating (0 to 5)
  reviewCount?: number;        // Total number of user reviews
  tags?: string[];             // Search keywords (e.g., ["wireless", "noise-canceling"])
  inStock: boolean;            // Quick check for availability
  stockQuantity?: number;      // Actual number of items in the warehouse
  sku?: string;                // Stock Keeping Unit (for inventory tracking)
  weight?: number;             // Weight in grams or kg
  dimensions?: {               // Size for shipping calculations
    length: number;
    width: number;
    height: number;
  };
  features?: string[];         // Key bullet points for the UI
  specifications?: Record<string, string>; // Technical details (e.g., {"Battery": "30h"})
  createdAt?: Date | string;   // When the product was added
  updatedAt?: Date | string;   // When it was last modified
}

/**
 * ProductsResponse Interface
 * Purpose: Describes the structure of data returned from a search or list API.
 */
export interface ProductsResponse {
  products: Product[];         // List of products for the current page
  total: number;               // Total products in existence
  page: number;                // Current page number
  limit: number;               // Products per page
  totalPages: number;           // Calculated total pages
}
