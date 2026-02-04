import { component$ } from '@builder.io/qwik';

export const Hero = component$(() => {
  return (
    <section class="relative w-full h-[90vh] bg-black text-white">
      <div class="container mx-auto flex flex-col justify-center h-full px-4">
        <h1 class="text-5xl font-bold mb-6">
          Find Your Perfect Style
        </h1>

        <p class="text-lg max-w-xl mb-8">
          Discover the best outfits curated just for you.
        </p>

        <button class="bg-white text-black px-6 py-3 rounded-md hover:bg-gray-200 transition">
          Shop Now
        </button>
      </div>
    </section>
  );
});
