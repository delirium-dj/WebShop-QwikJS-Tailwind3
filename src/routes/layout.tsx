// src/routes/layout.tsx
import { component$, Slot } from '@builder.io/qwik';
import { routeLoader$ } from '@builder.io/qwik-city';
import { CartProvider } from '~/contexts/cart';
import { Header } from '~/components/ui/Header';

export const useServerTimeLoader = routeLoader$(() => {
  return {
    date: new Date().toISOString(),
  };
});

export default component$(() => {
  return (
    <CartProvider>
      <div class="min-h-screen flex flex-col font-sans">
        <Header />
        <main class="flex-1 bg-white">
          <Slot />
        </main>
        <footer class="bg-gray-900 text-white py-6">
          <div class="container mx-auto px-4 text-center">
            <p class="text-gray-500">© 2024 ReconShop. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </CartProvider>
  );
});
