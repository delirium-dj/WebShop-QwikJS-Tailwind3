import { component$ } from '@builder.io/qwik';
import { ProductCard } from '~/components/product/ProductCard';

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
      <section class="py-20">
        <div class="container mx-auto px-4">
          <h2 class="text-3xl font-bold mb-10 text-center">
            Featured Products
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>
    );
  }
);
