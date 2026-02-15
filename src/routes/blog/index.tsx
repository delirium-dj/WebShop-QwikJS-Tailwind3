import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  const posts = [
    {
      id: 1,
      title: "The Future of QwikJS in E-commerce",
      excerpt: "Explore how resumability is changing the way we build online shops.",
      date: "Feb 15, 2026",
      category: "Technology",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 2,
      title: "State Management with Zustand",
      excerpt: "Why we chose Zustand for our cart and local states.",
      date: "Feb 10, 2026",
      category: "Development",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 3,
      title: "Designing for Conversion",
      excerpt: "Tips and tricks for creating high-performing product pages.",
      date: "Feb 05, 2026",
      category: "Design",
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80"
    }
  ];

  return (
    <div class="bg-gray-50 min-h-screen pb-20">
      {/* Hero Section */}
      <section class="bg-indigo-600 py-20">
        <div class="container mx-auto px-4 text-center">
          <h1 class="text-4xl font-bold text-white mb-4 sm:text-5xl">Our Blog</h1>
          <p class="text-xl text-indigo-100 max-w-2xl mx-auto">
            Insights, updates, and tutorials from the ReconShop team.
          </p>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section class="container mx-auto px-4 -mt-10">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article key={post.id} class="bg-white rounded-2xl overflow-hidden shadow-lg transition-transform hover:-translate-y-1">
              <img src={post.image} alt={post.title} class="w-full h-56 object-cover" width={400} height={224} />
              <div class="p-6">
                <div class="flex items-center gap-4 mb-3">
                  <span class="text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                    {post.category}
                  </span>
                  <span class="text-xs text-gray-500">{post.date}</span>
                </div>
                <h2 class="text-2xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600">
                  {post.title}
                </h2>
                <p class="text-gray-600 mb-6 line-clamp-2">
                  {post.excerpt}
                </p>
                <div class="flex items-center justify-between">
                  <span class="text-sm font-bold text-gray-900 hover:text-indigo-600 cursor-pointer">
                    Read More &rarr;
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Blog - ReconShop",
  meta: [
    {
      name: "description",
      content: "Stay updated with the latest news and articles from ReconShop.",
    },
  ],
};
