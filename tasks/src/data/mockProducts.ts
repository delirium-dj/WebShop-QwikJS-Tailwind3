/**
 * Mock Product Data
 * 
 * Sample product data with images for testing and development.
 * 
 * For Junior Developers:
 * - This file contains example data that you can use during development
 * - In a real application, this data would come from a database or API
 * - The image URLs use placeholder services (replace with real URLs in production)
 * - This helps you test components without needing a backend initially
 */

import type { ProductImage } from '../types/image.types';

/**
 * Sample product images for testing
 */
export const mockProductImages: ProductImage[] = [
  {
    id: 'img-1',
    url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
    alt: 'Black wireless headphones - front view',
    thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150',
    width: 800,
    height: 800,
    isPrimary: true,
  },
  {
    id: 'img-2',
    url: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800',
    alt: 'Black wireless headphones - side view',
    thumbnail: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=150',
    width: 800,
    height: 800,
    isPrimary: false,
  },
  {
    id: 'img-3',
    url: 'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=800',
    alt: 'Black wireless headphones - detail view',
    thumbnail: 'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=150',
    width: 800,
    height: 800,
    isPrimary: false,
  },
];

/**
 * Sample product data for testing ProductCard component
 */
export const mockProducts = [
  {
    id: 'prod-1',
    name: 'Premium Wireless Headphones',
    slug: 'premium-wireless-headphones',
    price: 299.99,
    originalPrice: 399.99,
    images: mockProductImages,
    category: 'Electronics',
    rating: 4.5,
    inStock: true,
    description: 'High-quality wireless headphones with active noise cancellation',
  },
  {
    id: 'prod-2',
    name: 'Smartphone Stand',
    slug: 'smartphone-stand',
    price: 29.99,
    images: [
      {
        id: 'img-4',
        url: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800',
        alt: 'Smartphone stand - wooden finish',
        thumbnail: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=150',
        width: 800,
        height: 800,
        isPrimary: true,
      },
    ],
    category: 'Accessories',
    rating: 4.0,
    inStock: true,
    description: 'Elegant wooden smartphone stand for your desk',
  },
  {
    id: 'prod-3',
    name: 'USB-C Cable Pack',
    slug: 'usb-c-cable-pack',
    price: 19.99,
    originalPrice: 29.99,
    images: [
      {
        id: 'img-5',
        url: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=800',
        alt: 'USB-C cables - various colors',
        thumbnail: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=150',
        width: 800,
        height: 800,
        isPrimary: true,
      },
    ],
    category: 'Cables',
    rating: 4.8,
    inStock: false,
    description: 'Durable USB-C cables in multiple lengths',
  },
  {
    id: 'prod-4',
    name: 'Wireless Mouse',
    slug: 'wireless-mouse',
    price: 49.99,
    images: [
      {
        id: 'img-6',
        url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800',
        alt: 'Ergonomic wireless mouse',
        thumbnail: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=150',
        width: 800,
        height: 800,
        isPrimary: true,
      },
      {
        id: 'img-7',
        url: 'https://images.unsplash.com/photo-1586252593091-ffa1a15d3f3e?w=800',
        alt: 'Wireless mouse - top view',
        thumbnail: 'https://images.unsplash.com/photo-1586252593091-ffa1a15d3f3e?w=150',
        width: 800,
        height: 800,
        isPrimary: false,
      },
    ],
    category: 'Computer Accessories',
    rating: 4.3,
    inStock: true,
    description: 'Comfortable ergonomic wireless mouse with precision tracking',
  },
];

/**
 * Get a single product by ID
 */
export const getProductById = (id: string) => {
  return mockProducts.find((product) => product.id === id);
};

/**
 * Get a single product by slug
 */
export const getProductBySlug = (slug: string) => {
  return mockProducts.find((product) => product.slug === slug);
};
