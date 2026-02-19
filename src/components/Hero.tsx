
import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";

// Import local hero images with optimization queries
import ImgHero1 from '~/media/images/hero/renaldo-matamoro-0LVSC_L2lEc-unsplash.jpg?as=picture&w=480;720;1080;1920&format=avif;webp;jpg&quality=50&placeholder=blur';
import ImgHero2 from '~/media/images/hero/slide1.jpg?as=picture&w=480;720;1080;1920&format=avif;webp;jpg&quality=50&placeholder=blur';
import ImgHero3 from '~/media/images/hero/renaldo-matamoro-nmqeZMomaMI-unsplash.jpg?as=picture&w=480;720;1080;1920&format=avif;webp;jpg&quality=50&placeholder=blur';
import ImgHero4 from '~/media/images/hero/tamara-bellis-IwVRO3TLjLc-unsplash.jpg?as=picture&w=480;720;1080;1920&format=avif;webp;jpg&quality=50&placeholder=blur';

const SLIDES = [
  { id: 1, image: ImgHero1, alt: "Summer Fashion Collection" },
  { id: 2, image: ImgHero2, alt: "Urban Style Essentials" },
  { id: 3, image: ImgHero3, alt: "Premium Accessories" },
  { id: 4, image: ImgHero4, alt: "Modern Lifestyle" },
];

export const Hero = component$(() => {
  const currentSlide = useSignal(0);
  const isMounted = useSignal(false);

  // Auto-advance slides every 5 seconds
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ cleanup }) => {
    isMounted.value = true;
    const timer = setInterval(() => {
      currentSlide.value = (currentSlide.value + 1) % SLIDES.length;
    }, 5000);
    cleanup(() => clearInterval(timer));
  });

  return (
    <section
      id="hero-section"
      class="relative h-[90vh] w-full overflow-hidden bg-black text-white"
    >
      {/* Background Carousel */}
      <div class="absolute inset-0 z-0">
        {SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            class={`absolute inset-0 h-full w-full transition-opacity duration-1000 ease-in-out ${
              // Ensure the first slide is visible during SSR and before client-side hydration
              (isMounted.value && index === currentSlide.value) || (!isMounted.value && index === 0)
                ? "opacity-100"
                : "opacity-0"
            }`}
          >
            <picture>
              {Object.entries(slide.image.sources).map(([key, value]) => (
                <source key={key} srcset={value as string} type={"image/" + key} />
              ))}
              <img
                src={slide.image.img.src}
                alt={slide.alt}
                width={slide.image.img.w}
                height={slide.image.img.h}
                class="h-full w-full object-cover opacity-60" // moderate opacity for text readability
                // Optimization: Eager load the first slide's image for better LCP
                loading={index === 0 ? "eager" : "lazy"}
                // @ts-expect-error - fetchpriority is a valid but newer attribute
                fetchpriority={index === 0 ? "high" : undefined}
              />
            </picture>
            {/* Gradient Overlay for better text contrast */}
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          </div>
        ))}
      </div>

      {/* Content Layer */}
      <div class="relative z-10 container mx-auto flex h-full flex-col justify-center px-4">
        <h1 class="mb-6 text-5xl font-bold drop-shadow-lg text-center">Find Your Perfect Style</h1>

        <p class="mb-8 max-w-xl text-lg drop-shadow-md text-center mx-auto">
          Discover the best outfits curated just for you.
        </p>

        <Link
          href="/shop"
          id="hero-shop-btn"
          class="w-fit rounded-md bg-white px-6 py-3 text-center text-black transition hover:bg-gray-200 mx-auto"
        >
          Shop Now
        </Link>
      </div>
    </section>
  );
});
