import { component$, $, type PropFunction } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import type { ProductImage as ProductImageType } from "../../types/image.types";
import { ProductImage } from "./ProductImage";

/**
 * Component props interface
 * Reverted to flatter props for compatibility with existing components
 */
interface ProductCardProps {
  // Support nested product object
  product?: {
    id: string | number;
    name?: string;
    title?: string;
    price: number;
    originalPrice?: number;
    discount?: number;
    images?: ProductImageType[];
    image?: string;
    category?: string;
    rating?: number;
    inStock?: boolean;
    stock?: number;
    slug?: string;
  };

  // Support flat props (legacy/alternative)
  id?: string | number;
  name?: string;
  title?: string;
  price?: number;
  originalPrice?: number;
  discount?: number;
  images?: ProductImageType[];
  image?: string;
  category?: string;
  rating?: number;
  inStock?: boolean;
  stock?: number;

  // Additional CSS classes
  class?: string;

  // Whether to show the "Add to Cart" button
  showAddToCart?: boolean;

  // Callback when "Add to Cart" is clicked
  onAddToCart$?: PropFunction<(productId: string) => void>;
}

/**
 * ProductCard Component
 *
 * Displays a product in a card format with image, details, and actions.
 * Supports both new, legacy, and nested prop formats for maximum compatibility.
 */
export const ProductCard = component$<ProductCardProps>((props) => {
  const {
    product: nestedProduct,
    id: flatId,
    name: flatName,
    title: flatTitle,
    price: flatPrice,
    originalPrice: flatOriginalPrice,
    discount: flatDiscount,
    images: flatImages = [],
    image: flatImage,
    category: flatCategory,
    rating: flatRating,
    inStock: flatInStock,
    stock: flatStock,
    class: className = "",
    showAddToCart = true,
    onAddToCart$,
  } = props;

  // Resolve values from either nested product or flat props
  const id = flatId || nestedProduct?.id;
  const price = flatPrice !== undefined ? flatPrice : nestedProduct?.price || 0;
  const name = flatName || nestedProduct?.name;
  const title = flatTitle || nestedProduct?.title;
  const originalPrice = flatOriginalPrice || nestedProduct?.originalPrice;
  const discount = flatDiscount || nestedProduct?.discount;
  const images =
    flatImages.length > 0 ? flatImages : nestedProduct?.images || [];
  const image = flatImage || nestedProduct?.image;
  const category = flatCategory || nestedProduct?.category;
  const rating = flatRating !== undefined ? flatRating : nestedProduct?.rating;
  const inStock =
    flatInStock !== undefined ? flatInStock : nestedProduct?.inStock;
  const stock = flatStock !== undefined ? flatStock : nestedProduct?.stock;

  // Resolve display name and stock status
  const displayTitle = name || title || "Unnamed Product";
  const isAvailable =
    inStock !== undefined ? inStock : stock !== undefined ? stock > 0 : true;

  // Resolve primary image
  // If we have any images object, use the one marked primary.
  // Otherwise, if we have a legacy image string, wrap it.
  const displayImage: ProductImageType =
    images.length > 0
      ? images.find((img: ProductImageType) => img.isPrimary) || images[0]
      : {
          id: `img-${id}`,
          url: image || "/placeholder.jpg",
          alt: displayTitle,
          width: 400,
          height: 400,
        };

  // Calculate discount percentage
  const discountPct =
    discount ||
    (originalPrice
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0);
  const displayOriginalPrice =
    originalPrice || (discount ? price / (1 - discount / 100) : undefined);

  /**
   * Handle add to cart button click
   */
  const handleAddToCart$ = $(async (event: Event) => {
    // Prevent the link navigation when clicking the button
    event.preventDefault();
    event.stopPropagation();

    if (onAddToCart$) {
      await onAddToCart$(String(id));
    }
  });

  return (
    <div
      class={`product-card group relative overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 hover:shadow-xl ${className} `}
    >
      {/* Product link wrapper */}
      <Link href={`/product/${id}`} class="block">
        {/* Image section */}
        <div class="relative aspect-square bg-gray-100">
          <ProductImage
            image={displayImage}
            size="small"
            class="h-full w-full transition-transform duration-300 group-hover:scale-105"
          />

          {/* Discount badge */}
          {discountPct > 0 && (
            <div class="absolute right-2 top-2 rounded bg-red-600 px-2 py-1 text-xs font-bold text-white">
              -{discountPct}%
            </div>
          )}

          {/* Out of stock overlay */}
          {!isAvailable && (
            <div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <span class="rounded-lg bg-white px-4 py-2 font-semibold text-gray-800">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Product details section */}
        <div class="p-4">
          {/* Category */}
          {category && (
            <p class="mb-1 text-xs uppercase tracking-wide text-gray-500">
              {category}
            </p>
          )}

          {/* Product name */}
          <h3 class="mb-2 line-clamp-2 text-lg font-semibold text-gray-800 transition-colors group-hover:text-blue-600">
            {displayTitle}
          </h3>

          {/* Rating */}
          {rating !== undefined && (
            <div class="mb-2 flex items-center gap-1">
              {[...Array(5)].map((_, index) => (
                <svg
                  key={index}
                  class={`h-4 w-4 ${
                    index < Math.floor(rating)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span class="ml-1 text-sm text-gray-600">
                ({rating.toFixed(1)})
              </span>
            </div>
          )}

          {/* Price section */}
          <div class="mb-3 flex items-center gap-2">
            <span class="text-2xl font-bold text-gray-900">
              ${price.toFixed(2)}
            </span>
            {displayOriginalPrice && (
              <span class="text-sm text-gray-500 line-through">
                ${displayOriginalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Add to cart button */}
          {showAddToCart && isAvailable && (
            <button
              class="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition-colors duration-200 hover:bg-blue-700"
              onClick$={handleAddToCart$}
            >
              <svg
                class="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              Add to Cart
            </button>
          )}
        </div>
      </Link>

      {/* Wishlist button */}
      <button
        class="absolute left-4 top-4 z-10 rounded-full bg-white bg-opacity-80 p-2 shadow-md transition-all hover:bg-opacity-100"
        onClick$={(e) => {
          e.preventDefault();
          e.stopPropagation();
          // Wishlist functionality would go here
        }}
        aria-label="Add to wishlist"
      >
        <svg
          class="h-5 w-5 text-gray-600 transition-colors hover:text-red-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </button>
    </div>
  );
});
