import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";

export const Hero = component$(() => {
  return (
    <section
      id="hero-section"
      class="relative h-[90vh] w-full bg-black text-white"
    >
      <div class="container mx-auto flex h-full flex-col justify-center px-4">
        <h1 class="mb-6 text-5xl font-bold">Find Your Perfect Style</h1>

        <p class="mb-8 max-w-xl text-lg">
          Discover the best outfits curated just for you.
        </p>

        <Link
          href="/shop"
          id="hero-shop-btn"
          class="rounded-md bg-white px-6 py-3 text-center text-black transition hover:bg-gray-200"
        >
          Shop Now
        </Link>
      </div>
    </section>
  );
});
