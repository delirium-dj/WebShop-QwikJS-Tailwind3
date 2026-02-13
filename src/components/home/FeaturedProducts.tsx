import { component$ } from "@builder.io/qwik";
import { ProductCard } from "~/components/product/ProductCard";

type FeaturedProductsProps = {
  products: {
    id: number;
    title: string;
    price: number;
    image: string;
  }[];
};

export const FeaturedProducts = component$<FeaturedProductsProps>(
  ({ products }) => {
    return (
      <section id="featured-products-section" class="py-20">
        <div class="container mx-auto px-4">
          <h2 class="mb-10 text-center text-3xl font-bold">
            Featured Products
          </h2>

          <div class="grid grid-cols-1 gap-6 md:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
                isFeatured={product.id % 2 !== 0}
              />
            ))}
          </div>
        </div>
      </section>
    );
  },
);
