import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  return (
    <div class="bg-white">
      {/* Hero Section */}
      <section class="relative bg-gray-900 py-24 sm:py-32">
        <div class="absolute inset-0 overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-br from-indigo-900 to-black opacity-90" />
        </div>
        <div class="relative container mx-auto px-4">
          <div class="max-w-2xl">
            <h1 class="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              About ReconShop
            </h1>
            <p class="mt-6 text-xl text-gray-300">
              We are redefining the e-commerce experience with speed, style, and security. Built on the cutting-edge QwikJS framework.
            </p>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section class="py-20">
        <div class="container mx-auto px-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 class="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p class="text-lg text-gray-600 mb-4">
                At ReconShop, our goal is to provide a seamless and lightning-fast shopping experience. We believe that technology should empower users, not slow them down.
              </p>
              <p class="text-lg text-gray-600">
                By leveraging Qwik's resumability, we ensure that our site is interactive almost instantly, delivering a premium experience regardless of connection speed.
              </p>
            </div>
            <div class="rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80" 
                alt="Our Team" 
                class="w-full h-80 object-cover"
                width={800}
                height={400}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section class="py-20 bg-gray-50">
        <div class="container mx-auto px-4 text-center">
          <h2 class="text-3xl font-bold text-gray-900 mb-12">Our Core Values</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6 mx-auto">
                <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 class="text-xl font-bold mb-4">Resumability</h3>
              <p class="text-gray-600">Built for performance, ensuring zero hydration overhead.</p>
            </div>
            <div class="p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6 mx-auto">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 class="text-xl font-bold mb-4">Security</h3>
              <p class="text-gray-600">Powered by Supabase for enterprise-grade auth and data safety.</p>
            </div>
            <div class="p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6 mx-auto">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              </div>
              <h3 class="text-xl font-bold mb-4">Consistency</h3>
              <p class="text-gray-600">A unified design language across all components.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
});

export const head: DocumentHead = {
  title: "About Us - ReconShop",
  meta: [
    {
      name: "description",
      content: "Learn more about ReconShop and our mission to redefine e-commerce.",
    },
  ],
};
