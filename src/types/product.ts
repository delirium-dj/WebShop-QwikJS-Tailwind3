export interface Product {
  id: string | number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number; // For showing discounts
  image: string;
  images?: string[]; // Additional images
  category: string;
  subcategory?: string;
  brand?: string;
  rating?: number;
  reviewCount?: number;
  tags?: string[];
  inStock: boolean;
  stockQuantity?: number;
  sku?: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  features?: string[];
  specifications?: Record<string, string>;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

// Optional: Create a type for the API response
export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}