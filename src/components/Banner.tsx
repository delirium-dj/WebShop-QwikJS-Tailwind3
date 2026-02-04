import { component$ } from '@builder.io/qwik';

export const Banner = component$(() => {
  return (
    <section class="relative w-full h-[60vh] my-20">
      <img
        src="/images/banner/banner.jpg"
        alt="Banner"
        width={1920}
        height={1080}
        class="absolute inset-0 w-full h-full object-cover"
      />

      <div class="absolute inset-0 bg-black/50" />

      <div class="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
        <h2 class="text-4xl font-bold mb-4">
          New Season Arrivals
        </h2>

        <p class="text-lg mb-8 max-w-xl">
          Check out all the trends you don’t want to miss this season.
        </p>

        <button class="bg-white text-black px-8 py-3 rounded-md hover:bg-gray-200 transition">
          Shop Collection
        </button>
      </div>
    </section>
  );
});
