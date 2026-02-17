import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";

// Import banner images with optimization queries
// Using the same query string pattern as Hero.tsx for consistency
import ImgBanner1 from '~/media/images/hero/slide2.jpg?as=picture&w=480;720;1080;1920&format=avif;webp;jpg&quality=80&placeholder=blur';
import ImgBanner2 from '~/media/images/hero/slide3.jpg?as=picture&w=480;720;1080;1920&format=avif;webp;jpg&quality=80&placeholder=blur';
import ImgBanner3 from '~/media/images/hero/slide4.jpg?as=picture&w=480;720;1080;1920&format=avif;webp;jpg&quality=80&placeholder=blur';

const SLIDES = [
  { id: 1, image: ImgBanner1, alt: "New Season Arrivals" },
  { id: 2, image: ImgBanner2, alt: "Latest Fashion Trends" },
  { id: 3, image: ImgBanner3, alt: "Exclusive Collections" },
];

export const Banner = component$(() => {
  // Use a signal to track the current slide index
  // Start at 0 (first slide)
  const currentSlide = useSignal(0);

  // Use a signal to track if the component is mounted on the client
  // This is needed for the initial fade-in animation
  const isMounted = useSignal(false);

  // Auto-advance slides every 5 seconds
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ cleanup }) => {
    isMounted.value = true;
    const timer = setInterval(() => {
      // Increment slide index, loop back to 0 when reaching the end
      currentSlide.value = (currentSlide.value + 1) % SLIDES.length;
    }, 5000);
    cleanup(() => clearInterval(timer));
  });

  return (
    <section id="banner-section" class="relative my-20 h-[60vh] w-full overflow-hidden bg-black text-white">
      {/* Background Carousel */}
      <div class="absolute inset-0 z-0">
        {SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            class={`absolute inset-0 h-full w-full transition-opacity duration-1000 ease-in-out ${
              // Show slide if it's the current one AND component is mounted
              // Otherwise hide it (opacity-0)
              isMounted.value && index === currentSlide.value
                ? "opacity-100"
                : "opacity-0"
            }`}
          >
            <picture>
              {Object.entries(slide.image.sources).map(([key, value]) => (
                <source key={key} srcset={value} type={"image/" + key} />
              ))}
              <img
                src={slide.image.img.src}
                alt={slide.alt}
                width={slide.image.img.w}
                height={slide.image.img.h}
                class="h-full w-full object-cover opacity-60" // moderate opacity for text readability
                loading="lazy"
              />
            </picture>
            
            {/* Gradient Overlay for better text contrast */}
            {/* Using a subtle dark gradient from bottom to top */}
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          </div>
        ))}
      </div>

      {/* Content Layer (Static Text) */}
      <div class="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
        <h2 class="mb-4 text-4xl font-bold drop-shadow-lg">New Season Arrivals</h2>

        <p class="mb-8 max-w-xl text-lg drop-shadow-md">
          Check out all the trends you don’t want to miss this season.
        </p>

        <button
          id="banner-cta-btn"
          class="rounded-md bg-white px-8 py-3 text-black transition hover:bg-gray-200"
        >
          Shop Collection
        </button>
      </div>
    </section>
  );
});
