// src/routes/product/[id]/index.tsx
import { component$ } from '@builder.io/qwik';
import { routeLoader$, type DocumentHead } from '@builder.io/qwik-city';
import { ProductGallery } from '~/components/product/ProductGallery';
import { ProductInfo } from '~/components/product/ProductInfo';
import { RelatedProducts } from '~/components/product/RelatedProducts';
import { Breadcrumb } from '~/components/ui/Breadcrumb';
import { getProductById, getAllProducts } from '~/services/api/products';
import { mapApiProductToProduct, mapApiProductsToProducts } from '~/utils/product-mapper';
import { ProductReviews } from "~/components/reviews";

// We use routeLoader$ to fetch data on the server before the component renders.
export const useProductData = routeLoader$(async ({ params, status }) => {
  const productId = params.id;

  // 1. Fetch the main product
  const apiProduct = await getProductById(productId);

  if (!apiProduct) {
    status(404);
    return null;
  }

  // 2. Map to our internal format
  const product = mapApiProductToProduct(apiProduct);

  // 3. Fetch related products (all products in same category)
  let relatedProducts: any[] = [];
  const allInCategory = await getAllProducts(); // FakeStore doesn't have a great "related" filter besides category
  
  if (allInCategory) {
    relatedProducts = mapApiProductsToProducts(allInCategory)
      .filter((p) => p.id !== product.id && p.category === product.category)
      .slice(0, 4);
  }

  return {
    product,
    relatedProducts,
  };
});


export default component$(() => {
  // We consume the data from our routeLoader$ here.
  const data = useProductData();

  // Handle the case where the product was not found (404).
  if (!data.value) {
    return (
      <div class="container mx-auto px-4 py-16 text-center">
        <h1 class="text-4xl font-bold mb-4">Product Not Found</h1>
        <p class="text-gray-600 mb-8">
          The product you're looking for doesn't exist.
        </p>
        <a
          href="/"
          class="inline-block bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition"
        >
          Back to Home
        </a>
      </div>
    );
  }

  const { product, relatedProducts } = data.value;

  // Breadcrumb items to help users navigate back.
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: product.category || 'Products', href: '/shop' },
    { label: product.title },
  ];

  return (
    <div class="bg-white">
      {/* Breadcrumb Navigation */}
      <div class="container mx-auto px-4 py-6">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      {/* Product Details Section */}
      <div class="container mx-auto px-4 pb-12">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Product Gallery (Images) */}
          <div>
            <ProductGallery
              images={product.images || [product.image]}
              title={product.title}
              product={{
                id: product.id,
                title: product.title,
                price: product.price,
                image: product.image,
                category: product.category,
                discount: product.discount
              }}
            />
          </div>

          {/* Right Column - Product Info (Price, Options, Add to Cart) */}
          <div>
            <ProductInfo
              id={product.id}
              title={product.title}
              price={product.price}
              image={product.image}
              discount={product.discount}
              rating={product.rating}
              reviews={product.reviewCount}
              description={product.description}
              stock={product.stockQuantity}
              sizes={product.sizes}
              colors={product.colors}
              category={product.category}
              specifications={product.specifications}
              features={product.features}
            />
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div class="container mx-auto px-4 border-t py-12">
          <RelatedProducts
            products={relatedProducts}
            title="You May Also Like"
          />
        </div>
      )}

      {/* REVIEWS SECTION — Step 10 */}
      <div class="container mx-auto px-4 border-t py-12">
        <ProductReviews
          productId={product.id}
          productTitle={product.title}
        />
      </div>
    </div>
  );
});

// This sets the HTML <head> metadata for better SEO.
// Qwik allows us to dynamically generate tags based on the loaded data.
export const head: DocumentHead = ({ resolveValue }) => {
  const data = resolveValue(useProductData);

  if (!data) {
    return {
      title: 'Product Not Found - ReconShop',
      meta: [
        {
          name: 'description',
          content: 'Product not found',
        },
      ],
    };
  }

  const { product } = data;

  return {
    title: `${product.title} - ReconShop`,
    meta: [
      {
        name: 'description',
        content: product.description || `Buy ${product.title} at ReconShop`,
      },
      {
        name: 'keywords',
        content: `${product.title}, ${product.category}, shop, ecommerce`,
      },
      // Open Graph tags for better social sharing (Facebook, etc.)
      {
        property: 'og:title',
        content: product.title,
      },
      {
        property: 'og:description',
        content: product.description || '',
      },
      {
        property: 'og:image',
        content: product.image,
      },
      {
        property: 'og:type',
        content: 'product',
      },
      // Product specific meta for shopping platforms
      {
        property: 'product:price:amount',
        content: product.price.toString(),
      },
      {
        property: 'product:price:currency',
        content: 'USD',
      },
    ],
  };
};
