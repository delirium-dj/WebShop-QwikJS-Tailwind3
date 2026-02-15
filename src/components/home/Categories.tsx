import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";

const categories = [
  {
    id: 1,
    title: "Women",
    image: "/images/categories/women.jpg",
    url: "/shop?category=women's clothing",
  },
  {
    id: 2,
    title: "Men",
    image: "/images/categories/men.jpg",
    url: "/shop?category=men's clothing",
  },
  {
    id: 3,
    title: "Electronics",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=1000&auto=format&fit=crop",
    url: "/shop?category=electronics",
  },
];

export const Categories = component$(() => {
  return (
    <section id="categories-section" class="py-16">
      <div class="container mx-auto px-4">
        <h2 class="mb-10 text-center text-3xl font-bold">Shop by Category</h2>

        <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
          {categories.map((category) => {
            const Content = (
              <div
                id={`category-card-${category.id}`}
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
            );

            return category.url ? (
              <Link key={category.id} href={category.url}>
                {Content}
              </Link>
            ) : (
              <div key={category.id}>{Content}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
});
