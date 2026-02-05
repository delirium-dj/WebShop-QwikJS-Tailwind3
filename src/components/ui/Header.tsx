import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { CartBadge } from '../cart/CartBadge';

export const Header = component$(() => {
  return (
    <header class="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div class="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" class="text-2xl font-black tracking-tighter">
          ReconShop
        </Link>
        
        {/* Actions & Navigation grouped on the right */}
        <div class="flex items-center gap-8">
          {/* Cart slightly left of links */}
          <CartBadge />

          {/* Navigation links on the far right */}
          <nav class="hidden md:flex items-center gap-6">
            <Link href="/" class="text-xs font-bold text-gray-600 hover:text-black uppercase tracking-widest transition-colors">
              Home
            </Link>
            <Link href="/shop" class="text-xs font-bold text-gray-600 hover:text-black uppercase tracking-widest transition-colors">
              Shop
            </Link>
            <Link href="/about" class="text-xs font-bold text-gray-600 hover:text-black uppercase tracking-widest transition-colors">
              About
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
});
