// src/components/ui/Breadcrumb.tsx
import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";

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
    <nav
      id="breadcrumb-nav"
      aria-label="Breadcrumb"
      class="scrollbar-hide overflow-x-auto whitespace-nowrap"
    >
      <ol class="flex items-center text-xs font-medium md:text-sm">
        {items.map((item, index) => (
          <li key={index} class="flex items-center">
            {/* Show a separator icon (chevron) for every item except the first one. */}
            {index > 0 && (
              <svg
                class="mx-1 h-4 w-4 flex-shrink-0 text-gray-300 md:mx-2"
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
                class="text-gray-400 transition-colors duration-200 hover:text-black"
              >
                {item.label}
              </Link>
            ) : (
              <span class="max-w-[150px] truncate font-extrabold text-gray-900 md:max-w-none">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
});
