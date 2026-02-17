import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";

// Import images as components using the ?jsx suffix for automatic optimization (WebP, AVIF, lazy loading)
import ImgWomen from '~/media/images/categories/renaldo-matamoro-0LVSC_L2lEc-unsplash.jpg?as=picture&w=512;640;720&format=avif;webp;jpg&quality=85&placeholder=blur';
import ImgMen from '~/media/images/categories/hunters-race-hNoSCxPWYII-unsplash.jpg?as=picture&w=512;640;720&format=avif;webp;jpg&quality=85&placeholder=blur';
import ImgElectronics from '~/media/images/categories/electronics.jpg?as=picture&w=512;640;720&format=avif;webp;jpg&quality=85&placeholder=blur';

const categories = [
  {
    id: 1,
    title: "Women",
    image: ImgWomen,
    url: "/shop?category=women's clothing",
  },
  {
    id: 2,
    title: "Men",
    image: ImgMen,
    url: "/shop?category=men's clothing",
  },
  {
    id: 3,
    title: "Electronics",
    image: ImgElectronics,
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
            // Determine if the image is a component (ESM import), a string (external URL), or a metadata object
            const ImageComponent = category.image as any;
            
            const Content = (
              <div
                id={`category-card-${category.id}`}
                class="group relative overflow-hidden rounded-lg"
              >
                {/* 
                  Image Handling Logic:
                  1. If it's a string, it's an external URL.
                  2. If it's an object with 'sources', it's a vite-imagetools "picture" metadata object.
                  3. Defaults to a JSX component (from ?jsx suffix).
                */}
                {typeof ImageComponent === 'string' ? (
                  <img
                    src={ImageComponent}
                    alt={category.title}
                    width={400}
                    height={400}
                    class="h-80 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                ) : (ImageComponent as any).sources ? (
                  <picture class="h-80 w-full overflow-hidden">
                    {Object.entries((ImageComponent as any).sources).map(([key, value]) => (
                      <source key={key} srcset={value as string} type={"image/" + key} />
                    ))}
                    <img
                      src={(ImageComponent as any).img.src}
                      alt={category.title}
                      width={(ImageComponent as any).img.w}
                      height={(ImageComponent as any).img.h}
                      class="h-80 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                  </picture>
                ) : (
                  <ImageComponent 
                    alt={category.title}
                    class="h-80 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                )}

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
