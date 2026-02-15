import { component$ } from "@builder.io/qwik";
import { Link, type DocumentHead } from "@builder.io/qwik-city";

// Import all blog images with Vite optimization query strings
// These imports return an object that contains multiple source formats (AVIF, WebP, JPG)
// and multiple widths for responsive loading.
import qwikFutureImg from "./posts/qwik-future/qwik-future.jpg?as=picture&w=400;800&format=avif;webp;jpg&quality=80";
import zustandStateImg from "./posts/zustand-state/zustand-state.jpg?as=picture&w=400;800&format=avif;webp;jpg&quality=80";
import powerResumabilityImg from "./posts/power-resumability/power-resumability.jpg?as=picture&w=400;800&format=avif;webp;jpg&quality=80";
import edgeComputingImg from "./posts/edge-computing/edge-computing.jpg?as=picture&w=400;800&format=avif;webp;jpg&quality=80";
import tailwindStylingImg from "./posts/tailwind-styling/tailwind-styling.jpg?as=picture&w=400;800&format=avif;webp;jpg&quality=80";
import secureAuthImg from "./posts/secure-auth/secure-auth.jpg?as=picture&w=400;800&format=avif;webp;jpg&quality=80";

/**
 * Blog Page Component
 * Displays a list of blog posts with optimized local images and internal links.
 * 
 * NOTE: Tags/Categories are marked as UNUSED in the UI as per user request.
 */
export default component$(() => {
  // We define our blog posts in an array for easy management.
  // We've updated the image property to use the optimized objects from our imports.
  const posts = [
    {
      id: 1,
      title: "The Future of QwikJS in E-commerce",
      excerpt: "Explore how resumability is changing the way we build online shops by delivering zero hydration overhead.",
      date: "Feb 15, 2026",
      category: "Technology", // UNUSED
      image: qwikFutureImg,
      href: "/blog/posts/qwik-future/"
    },
    {
      id: 2,
      title: "State Management with Zustand",
      excerpt: "Why we chose Zustand for our cart and local states - a minimalist, fast, and scalable state management solution.",
      date: "Feb 10, 2026",
      category: "Development", // UNUSED
      image: zustandStateImg,
      href: "/blog/posts/zustand-state/"
    },
    {
      id: 3,
      title: "The Power of Resumability",
      excerpt: "Understanding how Qwik eliminates hydration to achieve near-instant interactivity.",
      date: "Feb 08, 2026",
      category: "Core Concepts", // UNUSED
      image: powerResumabilityImg,
      href: "/blog/posts/power-resumability/"
    },
    {
      id: 4,
      title: "Edge Computing with Qwik City",
      excerpt: "Deploying your ReconShop to the edge for global performance and reliability.",
      date: "Feb 05, 2026",
      category: "Cloud", // UNUSED
      image: edgeComputingImg,
      href: "/blog/posts/edge-computing/"
    },
    {
      id: 5,
      title: "Styling with Tailwind CSS 3",
      excerpt: "How to maintain a premium design system using utility-first CSS in Qwik components.",
      date: "Feb 02, 2026",
      category: "Design", // UNUSED
      image: tailwindStylingImg,
      href: "/blog/posts/tailwind-styling/"
    },
    {
      id: 6,
      title: "Secure Auth with Supabase",
      excerpt: "Implementing Google OAuth and protected routes in the ReconShop account section.",
      date: "Jan 30, 2026",
      category: "Security", // UNUSED
      image: secureAuthImg,
      href: "/blog/posts/secure-auth/"
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
          {posts.map((post) => {
            const imgData = post.image as any;
            
            return (
              <Link 
                key={post.id} 
                href={post.href} 
                class="group bg-white rounded-2xl overflow-hidden shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl block border border-transparent hover:border-indigo-100"
              >
                <div class="relative overflow-hidden h-56">
                  {/* Optimized Picture Tag from vite-imagetools */}
                  <picture>
                    {Object.entries(imgData.sources).map(([key, value]) => (
                      <source key={key} srcset={value as string} type={"image/" + key} />
                    ))}
                    <img
                      src={imgData.img.src}
                      alt={post.title}
                      class="w-full h-full object-cover transition-transform duration-500"
                      width={imgData.img.w}
                      height={imgData.img.h}
                    />
                  </picture>
                  
                  {/* TAGS UI REMOVED AS PER USER REQUEST */}
                </div>
                
                <div class="p-6">
                  <div class="flex items-center gap-2 mb-4">
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span class="text-xs font-medium text-gray-500 uppercase tracking-tighter">{post.date}</span>
                  </div>
                  
                  <h2 class="text-2xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">
                    {post.title}
                  </h2>
                  
                  <p class="text-gray-600 mb-6 line-clamp-3 text-sm leading-relaxed">
                    {post.excerpt}
                  </p>
                  
                  <div class="pt-4 border-t border-gray-50 flex items-center justify-between">
                    <span class="text-sm font-bold text-gray-900 group-hover:text-indigo-600 flex items-center gap-1 transition-colors">
                      {"Read Article"}
                      <svg class="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Blog - Insights & Updates | ReconShop",
  meta: [
    {
      name: "description",
      content: "Stay updated with the latest news, articles, and technical insights from the ReconShop team including QwikJS and state management trends.",
    },
  ],
};
