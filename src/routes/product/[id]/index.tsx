import { component$ } from '@builder.io/qwik';
import { routeLoader$ } from '@builder.io/qwik-city';

export const useProduct = routeLoader$(async ({ params }) => {
  const id = Number(params.id);

  // TEMP mock (replace with real API later)
  const products = [
    {
      id: 1,
      title: 'Classic Jacket',
      price: 120,
      image: '/images/products/jacket.jpg',
      description: 'Premium quality jacket for all seasons.',
    },
    {
      id: 2,
      title: 'Summer Dress',
      price: 90,
      image: '/images/products/dress.jpg',
      description: 'Light and stylish dress for summer.',
    },
  ];

  const product = products.find((p) => p.id === id);

  if (!product) {
    throw new Error('Product not found');
  }

  return product;
});

export default component$(() => {
  const product = useProduct();

  return (
    <section class="py-20">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Image */}
          <div class="overflow-hidden rounded-lg">
            <img
              src={product.value.image}
              alt={product.value.title}
              class="w-full h-[500px] object-cover"
            />
          </div>

          {/* Info */}
          <div class="flex flex-col justify-center">
            <h1 class="text-4xl font-bold mb-4">
              {product.value.title}
            </h1>

            <p class="text-xl text-gray-600 mb-6">
              ${product.value.price}
            </p>

            <p class="mb-8 text-gray-700">
              {product.value.description}
            </p>

            <button class="bg-black text-white px-8 py-3 rounded-md hover:bg-gray-800 transition w-fit">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </section>
  );
});
