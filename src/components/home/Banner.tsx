import { component$ } from "@builder.io/qwik";
import ImgBanner from '~/media/images/banner/banner.jpg?jsx';

export const Banner = component$(() => {
  return (
    <section id="banner-section" class="relative my-20 h-[60vh] w-full">
      <picture>
        <ImgBanner 
          alt="Banner"
          class="absolute inset-0 h-full w-full object-cover"
        />
      </picture>

      <div class="absolute inset-0 bg-black/50" />

      <div class="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center text-white">
        <h2 class="mb-4 text-4xl font-bold">New Season Arrivals</h2>

        <p class="mb-8 max-w-xl text-lg">
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
