/**
 * MAIN LAYOUT
 * 
 * WHAT: This is the "Skeleton" of your entire website. 
 * IT CONTAINS: The Header, the Footer, and the special `<Slot />` where 
 * all your pages (like Home, Shop, Login) are injected.
 * 
 * WHY: We use a layout so we don't have to copy-paste the Header and Footer 
 * onto every single page. Change it here, and it changes everywhere!
 * 
 * JUNIOR TIP: 
 * We wrap everything in 'Providers' (Auth, Cart, Toast). 
 * This makes sure that the User Data, Shopping Cart, and Pop-up Notifications 
 * are available to every single page in the app.
 */

import { component$, Slot } from '@builder.io/qwik';
import { routeLoader$ } from '@builder.io/qwik-city';
import { CartProvider } from '~/contexts/cart';
import { Header } from '~/components/ui/Header';
import { ToastProvider } from '~/contexts/toast';
import { AuthProvider } from '~/contexts/auth';

import { WishlistProvider } from '~/contexts/wishlist';

/**
 * routeLoader$ - Getting data before the page loads
 * This one just returns the current server time.
 */
export const useServerTimeLoader = routeLoader$(() => {
  return {
    date: new Date().toISOString(),
  };
});

export default component$(() => {
  return (
    <AuthProvider>
    <CartProvider>
    <WishlistProvider>
      <div class="min-h-screen flex flex-col font-sans">
        <Header />
        <main class="flex-1 bg-white">
          <ToastProvider>
            <Slot />
          </ToastProvider>
        </main>
        <footer class="bg-gray-900 text-white py-6">
          <div class="container mx-auto px-4 text-center">
            <p class="text-gray-400">© 2024 ReconShop. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </WishlistProvider>
    </CartProvider>
    </AuthProvider>
  );
});
