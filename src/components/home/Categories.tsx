import { component$ } from '@builder.io/qwik';

const categories = [
  {
    id: 1,
    title: 'Women',
    image: '/images/categories/women.jpg',
  },
  {
    id: 2,
    title: 'Men',
    image: '/images/categories/men.jpg',
  },
  {
    id: 3,
    title: 'Accessories',
    image: '/images/categories/accessories.jpg',
  },
];

export const Categories = component$(() => {
  return (
    <section class="py-16">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold mb-10 text-center">
          Shop by Category
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              class="relative group overflow-hidden rounded-lg"
            >
              <img
                src={category.image}
                alt={category.title}
                width={400}
                height={400}
                class="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
              />

              <div class="absolute inset-0 bg-black/40 flex items-center justify-center">
                <h3 class="text-white text-2xl font-semibold">
                  {category.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});
