import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';

export default component$(() => {
  return (
    <div class="min-h-[70vh] flex items-center justify-center bg-white px-4">
      <div class="max-w-md w-full text-center">
        <div class="mb-6 inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full">
          <svg class="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
        <p class="text-gray-600 mb-8">
          Thank you for your purchase. We've sent a confirmation email with your order details.
        </p>

        <Link
          href="/"
          class="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition shadow-lg"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
});