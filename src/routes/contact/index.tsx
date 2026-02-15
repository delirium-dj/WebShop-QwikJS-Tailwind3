import { component$, useSignal, $ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  const isSubmitting = useSignal(false);
  const submitted = useSignal(false);

  const handleSubmit = $(async (e: Event) => {
    e.preventDefault();
    isSubmitting.value = true;
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    isSubmitting.value = false;
    submitted.value = true;
  });

  return (
    <div class="bg-white">
      {/* Hero Section */}
      <section class="bg-gray-100 py-20">
        <div class="container mx-auto px-4 text-center">
          <h1 class="text-4xl font-bold text-gray-900 mb-4 sm:text-5xl">Contact Us</h1>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      <section class="py-20">
        <div class="container mx-auto px-4">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-20">
            {/* Contact Form */}
            <div>
              {submitted.value ? (
                <div class="bg-green-50 p-8 rounded-2xl border border-green-100 text-center">
                  <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 class="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h2>
                  <p class="text-gray-600">Thank you for reaching out. A team member will be in touch shortly.</p>
                  <button 
                    onClick$={() => submitted.value = false}
                    class="mt-8 text-sm font-bold text-green-600 hover:text-green-700"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit$={handleSubmit} class="space-y-6">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label class="block text-sm font-bold text-gray-700 mb-2">First Name</label>
                      <input required type="text" class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" placeholder="John" />
                    </div>
                    <div>
                      <label class="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
                      <input required type="text" class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" placeholder="Doe" />
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                    <input required type="email" class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" placeholder="john@example.com" />
                  </div>
                  <div>
                    <label class="block text-sm font-bold text-gray-700 mb-2">Subject</label>
                    <select class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all">
                      <option>General Inquiry</option>
                      <option>Support</option>
                      <option>Sales</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-bold text-gray-700 mb-2">Message</label>
                    <textarea required rows={5} class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" placeholder="How can we help?"></textarea>
                  </div>
                  <button 
                    disabled={isSubmitting.value}
                    class="w-full bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-black transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting.value ? (
                      <>
                        <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Sending...
                      </>
                    ) : 'Send Message'}
                  </button>
                </form>
              )}
            </div>

            {/* Contact Info */}
            <div class="space-y-12">
              <div>
                <h2 class="text-2xl font-bold text-gray-900 mb-6">Visit Our Office</h2>
                <div class="flex items-start gap-4">
                  <div class="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0 text-indigo-600">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p class="font-bold text-gray-900">San Francisco HQ</p>
                    <p class="text-gray-600 mt-1">123 Tech Plaza, Suite 400<br />San Francisco, CA 94103</p>
                  </div>
                </div>
              </div>

              <div>
                <h2 class="text-2xl font-bold text-gray-900 mb-6">Online Support</h2>
                <div class="space-y-6">
                  <div class="flex items-start gap-4">
                    <div class="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0 text-green-600">
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p class="font-bold text-gray-900">Email Us</p>
                      <p class="text-gray-600 mt-1 underline hover:text-indigo-600 cursor-pointer">support@reconshop.com</p>
                    </div>
                  </div>
                  <div class="flex items-start gap-4">
                    <div class="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0 text-blue-600">
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <div>
                      <p class="font-bold text-gray-900">Live Chat</p>
                      <p class="text-gray-600 mt-1">Available Mon-Fri, 9am - 6pm PST</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Contact Us - ReconShop",
  meta: [
    {
      name: "description",
      content: "Get in touch with the ReconShop team for any questions or support.",
    },
  ],
};
