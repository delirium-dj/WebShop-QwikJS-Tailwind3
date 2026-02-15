import { component$, Slot } from "@builder.io/qwik";

/**
 * BLOG POST LAYOUT
 * 
 * WHY: This layout specifically handles the styling for MDX blog posts.
 * It uses the Tailwind Typography (prose) plugin to ensure that 
 * standard HTML elements like <h1>, <p>, and <ul> look great 
 * without manual styling for every post.
 */
export default component$(() => {
  return (
    <div class="bg-gray-50 min-h-screen py-12">
      <div class="container mx-auto px-4 max-w-4xl">
        <div class="bg-white rounded-3xl shadow-xl overflow-hidden p-8 md:p-16">
          {/* 
            'prose prose-indigo lg:prose-xl': 
             This is the magic class from the Typography plugin. 
             It automatically styles the <Slot /> (the MDX content).
          */}
          <article class="prose prose-indigo prose-lg max-w-none">
            <Slot />
          </article>
          
          <div class="mt-16 pt-8 border-t border-gray-100 italic text-gray-500 text-sm">
            ReconShop Blog — Building the future of e-commerce.
          </div>
        </div>
      </div>
    </div>
  );
});
