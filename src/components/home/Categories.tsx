import { component$ } from "@builder.io/qwik";

const categories = [
  {
    id: 1,
    title: "Women",
    image: "/images/categories/women.jpg",
  },
  {
    id: 2,
    title: "Men",
    image: "/images/categories/men.jpg",
  },
  {
    id: 3,
    title: "Accessories",
    image: "/images/categories/accessories.jpg",
  },
];

export const Categories = component$(() => {
  return (
    <section id="categories-section" class="py-16">
      <div class="container mx-auto px-4">
        <h2 class="mb-10 text-center text-3xl font-bold">Shop by Category</h2>

        <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
          {categories.map((category) => (
            <div
              id={`category-card-${category.id}`}
              key={category.id}
              class="group relative overflow-hidden rounded-lg"
            >
              <img
                src={category.image}
                alt={category.title}
                width={400}
                height={400}
                class="h-80 w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              <div class="absolute inset-0 flex items-center justify-center bg-black/40">
                <h3 class="text-2xl font-semibold text-white">
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
