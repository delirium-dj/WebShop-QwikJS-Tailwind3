// src/components/ui/Breadcrumb.tsx
import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';

// Define the structure of a single breadcrumb link.
type BreadcrumbItem = {
  label: string; // Text to display
  href?: string; // Optional URL. If missing, it's the current page (non-clickable).
};

// Define the props for the Breadcrumb component.
type BreadcrumbProps = {
  items: BreadcrumbItem[];
};

/**
 * Breadcrumb Component
 * Purpose: Provides a secondary navigation at the top of the page to help 
 * users understand their location within the site hierarchy.
 */
export const Breadcrumb = component$<BreadcrumbProps>(({ items }) => {
  return (
    <nav aria-label="Breadcrumb" class="overflow-x-auto whitespace-nowrap scrollbar-hide">
      <ol class="flex items-center text-xs md:text-sm font-medium">
        {items.map((item, index) => (
          <li key={index} class="flex items-center">
            {/* Show a separator icon (chevron) for every item except the first one. */}
            {index > 0 && (
              <svg
                class="w-4 h-4 text-gray-300 mx-1 md:mx-2 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            )}
            
            {/* If the item has a href, render a Link. Otherwise, render a span for the current page. */}
            {item.href ? (
              <Link
                href={item.href}
                class="text-gray-400 hover:text-black transition-colors duration-200"
              >
                {item.label}
              </Link>
            ) : (
              <span class="text-gray-900 font-extrabold truncate max-w-[150px] md:max-w-none">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
});

