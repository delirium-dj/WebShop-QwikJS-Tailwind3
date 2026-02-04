import { component$ } from '@builder.io/qwik';

type ProductCardProps = {
  id: number;
  title: string;
  price: number;
  image: string;
};

export const ProductCard = component$<ProductCardProps>(
  ({ id, title, price, image }) => {
    return (
      <div class="group border rounded-lg overflow-hidden">
        <div class="relative overflow-hidden">
          <img
            src={image}
            alt={title}
            width={400}
            height={400}
            class="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        <div class="p-4 text-center">
          <h3 class="text-lg font-semibold mb-2">{title}</h3>
          <p class="text-gray-600 mb-4">${price}</p>

          <button class="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition">
            Add to Cart
          </button>
        </div>
      </div>
    );
  }
);
