// src/components/product/RelatedProducts.tsx
import { component$ } from '@builder.io/qwik';
import { ProductCard } from './ProductCard';

// Defines the structure for a single related product.
type RelatedProduct = {
  id: number;
  title: string;
  price: number;
  image: string;
  discount?: number; // Optional discount percentage
  rating?: number;   // Optional product rating
  stock?: number;    // Optional stock quantity
};

// Define the shape of data for the related products section.
type RelatedProductsProps = {
  products: RelatedProduct[]; // Array of product objects
  title?: string;             // Optional section header title, defaults to 'Related Products'
};

/**
 * RelatedProducts Component
 * Purpose: Displays a grid of products that are similar or related to the current one.
 * It reuses the ProductCard component to maintain UI consistency and display each product.
 */
export const RelatedProducts = component$<RelatedProductsProps>(
  ({ products, title = 'Related Products' }) => {
    // If there are no products provided or the array is empty, we return null
    // so the section doesn't render at all, keeping the UI clean.
    if (!products || products.length === 0) {
      return null;
    }

    return (
      <section class="py-12">
        {/* Section Header */}
        <div class="mb-8">
          <h2 class="text-2xl font-bold text-gray-900">{title}</h2>
          <p class="text-gray-600 mt-2">
            You might also be interested in these products
          </p>
        </div>

        {/* Responsive Grid Layout */}
        {/* This div creates a grid that adapts to different screen sizes: */}
        {/* - 1 column on small screens (default) */}
        {/* - 2 columns on medium screens (sm:grid-cols-2) */}
        {/* - 4 columns on large screens (lg:grid-cols-4) */}
        {/* 'gap-6' adds space between the grid items. */}
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* We map over the first 4 products to display them as cards. */}
          {/* The 'slice(0, 4)' ensures we only show a maximum of 4 related products. */}
          {products.slice(0, 4).map((product) => (
            // For each product, we render a ProductCard component.
            // 'key' is important for performance in lists, it helps Qwik identify each item uniquely.
            <ProductCard
              key={product.id}
              id={product.id}
              title={product.title}
              price={product.price}
              image={product.image}
              discount={product.discount}
              rating={product.rating}
              stock={product.stock}
            />
          ))}
        </div>
      </section>
    );
  }
);
