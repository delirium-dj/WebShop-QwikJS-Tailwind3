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

import type { ProductImage } from "../types/image.types";

/**
 * Sample product images for testing
 */
export const mockProductImages: ProductImage[] = [
  {
    id: "img-1",
    url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
    alt: "Black wireless headphones - front view",
    thumbnail:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150",
    width: 800,
    height: 800,
    isPrimary: true,
  },
  {
    id: "img-2",
    url: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800",
    alt: "Black wireless headphones - side view",
    thumbnail:
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=150",
    width: 800,
    height: 800,
    isPrimary: false,
  },
  {
    id: "img-3",
    url: "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=800",
    alt: "Black wireless headphones - detail view",
    thumbnail:
      "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=150",
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
    id: "prod-1",
    name: "Premium Wireless Headphones",
    slug: "premium-wireless-headphones",
    price: 299.99,
    originalPrice: 399.99,
    images: mockProductImages,
    category: "Electronics",
    rating: 4.5,
    inStock: true,
    description:
      "High-quality wireless headphones with active noise cancellation",
    createdAt: new Date("2025-12-01"),
  },
  {
    id: "prod-2",
    name: "Smartphone Stand",
    slug: "smartphone-stand",
    price: 29.99,
    images: [
      {
        id: "img-4",
        url: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800",
        alt: "Smartphone stand - wooden finish",
        thumbnail:
          "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=150",
        width: 800,
        height: 800,
        isPrimary: true,
      },
    ],
    category: "Accessories",
    rating: 4.0,
    inStock: true,
    description: "Elegant wooden smartphone stand for your desk",
    createdAt: new Date("2025-12-02"),
  },
  {
    id: "prod-3",
    name: "USB-C Cable Pack",
    slug: "usb-c-cable-pack",
    price: 19.99,
    originalPrice: 29.99,
    images: [
      {
        id: "img-5",
        url: "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=800",
        alt: "USB-C cables - various colors",
        thumbnail:
          "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=150",
        width: 800,
        height: 800,
        isPrimary: true,
      },
    ],
    category: "Cables",
    rating: 4.8,
    inStock: false,
    description: "Durable USB-C cables in multiple lengths",
    createdAt: new Date("2025-12-03"),
  },
  {
    id: "prod-4",
    name: "Wireless Mouse",
    slug: "wireless-mouse",
    price: 49.99,
    images: [
      {
        id: "img-6",
        url: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800",
        alt: "Ergonomic wireless mouse",
        thumbnail:
          "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=150",
        width: 800,
        height: 800,
        isPrimary: true,
      },
      {
        id: "img-7",
        url: "https://images.unsplash.com/photo-1586252593091-ffa1a15d3f3e?w=800",
        alt: "Wireless mouse - top view",
        thumbnail:
          "https://images.unsplash.com/photo-1586252593091-ffa1a15d3f3e?w=150",
        width: 800,
        height: 800,
        isPrimary: false,
      },
    ],
    category: "Computer Accessories",
    rating: 4.3,
    inStock: true,
    description: "Comfortable ergonomic wireless mouse with precision tracking",
    createdAt: new Date("2025-12-04"),
  },
  {
    id: "prod-5",
    name: "Mechanical Keyboard RGB",
    slug: "mechanical-keyboard-rgb",
    price: 159.99,
    originalPrice: 199.99,
    images: [
      {
        id: "img-8",
        url: "https://images.unsplash.com/photo-1587829191301-4f34b2911fd0?w=800",
        alt: "RGB Mechanical Keyboard",
        thumbnail:
          "https://images.unsplash.com/photo-1587829191301-4f34b2911fd0?w=150",
        width: 800,
        height: 800,
        isPrimary: true,
      },
    ],
    category: "Computer Accessories",
    rating: 4.7,
    inStock: true,
    description: "Premium mechanical keyboard with customizable RGB lighting",
    createdAt: new Date("2025-12-05"),
  },
  {
    id: "prod-6",
    name: "Portable SSD 1TB",
    slug: "portable-ssd-1tb",
    price: 129.99,
    images: [
      {
        id: "img-9",
        url: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800",
        alt: "Portable SSD External Storage",
        thumbnail:
          "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=150",
        width: 800,
        height: 800,
        isPrimary: true,
      },
    ],
    category: "Storage",
    rating: 4.6,
    inStock: true,
    description: "Fast and reliable portable SSD for backup and file transfer",
    createdAt: new Date("2025-12-06"),
  },
  {
    id: "prod-7",
    name: "USB Hub 7-in-1",
    slug: "usb-hub-7-in-1",
    price: 39.99,
    images: [
      {
        id: "img-10",
        url: "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=800",
        alt: "7-in-1 USB Hub",
        thumbnail:
          "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=150",
        width: 800,
        height: 800,
        isPrimary: true,
      },
    ],
    category: "Cables & Hubs",
    rating: 4.4,
    inStock: true,
    description:
      "Compact USB hub with 7 ports for multiple device connectivity",
    createdAt: new Date("2025-12-07"),
  },
  {
    id: "prod-8",
    name: "Webcam 4K Pro",
    slug: "webcam-4k-pro",
    price: 89.99,
    originalPrice: 119.99,
    images: [
      {
        id: "img-11",
        url: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800",
        alt: "4K Professional Webcam",
        thumbnail:
          "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=150",
        width: 800,
        height: 800,
        isPrimary: true,
      },
    ],
    category: "Video",
    rating: 4.5,
    inStock: true,
    description:
      "4K resolution webcam perfect for streaming and video conferences",
    createdAt: new Date("2025-12-08"),
  },
  {
    id: "prod-9",
    name: "Laptop Stand Aluminum",
    slug: "laptop-stand-aluminum",
    price: 44.99,
    images: [
      {
        id: "img-12",
        url: "https://images.unsplash.com/photo-1559056199-641a0ac8b3f4?w=800",
        alt: "Aluminum Laptop Stand",
        thumbnail:
          "https://images.unsplash.com/photo-1559056199-641a0ac8b3f4?w=150",
        width: 800,
        height: 800,
        isPrimary: true,
      },
    ],
    category: "Accessories",
    rating: 4.6,
    inStock: true,
    description: "Premium aluminum laptop stand for ergonomic workspace setup",
    createdAt: new Date("2025-12-09"),
  },
  {
    id: "prod-10",
    name: "Monitor Light Bar",
    slug: "monitor-light-bar",
    price: 69.99,
    images: [
      {
        id: "img-13",
        url: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800",
        alt: "Monitor Light Bar",
        thumbnail:
          "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=150",
        width: 800,
        height: 800,
        isPrimary: true,
      },
    ],
    category: "Lighting",
    rating: 4.3,
    inStock: true,
    description:
      "Smart monitor light bar that reduces eye strain and improves focus",
    createdAt: new Date("2025-12-10"),
  },
  {
    id: "prod-11",
    name: "Desk Organizer Set",
    slug: "desk-organizer-set",
    price: 34.99,
    images: [
      {
        id: "img-14",
        url: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800",
        alt: "Desk Organizer Set",
        thumbnail:
          "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=150",
        width: 800,
        height: 800,
        isPrimary: true,
      },
    ],
    category: "Office Supplies",
    rating: 4.2,
    inStock: true,
    description: "Complete desk organizer set to keep your workspace tidy",
    createdAt: new Date("2025-12-11"),
  },
  {
    id: "prod-12",
    name: "Wireless Charging Pad",
    slug: "wireless-charging-pad",
    price: 24.99,
    images: [
      {
        id: "img-15",
        url: "https://images.unsplash.com/photo-1609042231454-d07d9ccafba1?w=800",
        alt: "Wireless Charging Pad",
        thumbnail:
          "https://images.unsplash.com/photo-1609042231454-d07d9ccafba1?w=150",
        width: 800,
        height: 800,
        isPrimary: true,
      },
    ],
    category: "Charging",
    rating: 4.4,
    inStock: true,
    description:
      "Fast wireless charging pad compatible with all Qi-enabled devices",
    createdAt: new Date("2025-12-12"),
  },
  {
    id: "prod-13",
    name: "Portable Phone Charger 20000mAh",
    slug: "portable-phone-charger-20000mah",
    price: 54.99,
    images: [
      {
        id: "img-16",
        url: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800",
        alt: "Portable Phone Charger",
        thumbnail:
          "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=150",
        width: 800,
        height: 800,
        isPrimary: true,
      },
    ],
    category: "Charging",
    rating: 4.5,
    inStock: true,
    description: "High-capacity portable charger with fast charging technology",
    createdAt: new Date("2025-12-13"),
  },
  {
    id: "prod-14",
    name: "Blue Light Glasses",
    slug: "blue-light-glasses",
    price: 59.99,
    images: [
      {
        id: "img-17",
        url: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800",
        alt: "Blue Light Blocking Glasses",
        thumbnail:
          "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=150",
        width: 800,
        height: 800,
        isPrimary: true,
      },
    ],
    category: "Eye Protection",
    rating: 4.3,
    inStock: true,
    description: "Stylish blue light blocking glasses for extended screen time",
    createdAt: new Date("2025-12-14"),
  },
  {
    id: "prod-15",
    name: "Ergonomic Wrist Rest",
    slug: "ergonomic-wrist-rest",
    price: 19.99,
    images: [
      {
        id: "img-18",
        url: "https://images.unsplash.com/photo-1587829191301-4f34b2911fd0?w=800",
        alt: "Ergonomic Wrist Rest",
        thumbnail:
          "https://images.unsplash.com/photo-1587829191301-4f34b2911fd0?w=150",
        width: 800,
        height: 800,
        isPrimary: true,
      },
    ],
    category: "Accessories",
    rating: 4.1,
    inStock: true,
    description:
      "Memory foam wrist rest for comfortable typing and mouse usage",
    createdAt: new Date("2025-12-15"),
  },
  {
    id: "prod-16",
    name: "HDMI Cable 2.1 8K",
    slug: "hdmi-cable-2-1-8k",
    price: 29.99,
    images: [
      {
        id: "img-19",
        url: "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=800",
        alt: "HDMI 2.1 8K Cable",
        thumbnail:
          "https://images.unsplash.com/photo-1625948515291-69613efd103f",
        width: 800,
        height: 800,
        isPrimary: true,
      },
    ],
    category: "Cables",
    rating: 4.6,
    inStock: true,
    description: "8K HDMI 2.1 cable for high-resolution display connectivity",
    createdAt: new Date("2025-12-16"),
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

/**
 * Get the latest featured products (most recently added)
 * @param count Number of products to return (default: 4)
 */
export const getLatestProducts = (count: number = 4) => {
  return mockProducts
    .sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA; // Newest first
    })
    .slice(0, count)
    .map((product) => ({
      id: parseInt(product.id.replace("prod-", "")),
      title: product.name,
      price: product.price,
      image: product.images[0]?.url || "/images/placeholder.jpg",
    }));
};
