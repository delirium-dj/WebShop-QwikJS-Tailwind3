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
        
        {/* Navigation */}
        <nav class="hidden md:flex items-center gap-8">
          <Link href="/" class="text-sm font-bold text-gray-600 hover:text-black uppercase tracking-wide">
            Home
          </Link>
          <Link href="/shop" class="text-sm font-bold text-gray-600 hover:text-black uppercase tracking-wide">
            Shop
          </Link>
          <Link href="/about" class="text-sm font-bold text-gray-600 hover:text-black uppercase tracking-wide">
            About
          </Link>
        </nav>

        {/* Actions */}
        <div class="flex items-center gap-4">
          <CartBadge />
        </div>
      </div>
    </header>
  );
});
