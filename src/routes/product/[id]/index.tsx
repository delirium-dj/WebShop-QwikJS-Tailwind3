// src/routes/product/[id]/index.tsx
import { component$ } from '@builder.io/qwik';
import { routeLoader$, type DocumentHead } from '@builder.io/qwik-city';
import { ProductGallery } from '~/components/product/ProductGallery';
import { ProductInfo } from '~/components/product/ProductInfo';
import { RelatedProducts } from '~/components/product/RelatedProducts';
import { Breadcrumb } from '~/components/ui/Breadcrumb';

// This is a mock data loader - in Step 5 you'll replace this with real API/database calls
// We use routeLoader$ to fetch data on the server before the component renders.
// This is essential for SEO and performance (Resumability).
export const useProductData = routeLoader$(async ({ params, status }) => {
  const productId = parseInt(params.id);

  // Mock product database - replace with actual data fetching from an API or Database later.
  // Why? Because we want to show a realistic e-commerce experience while developing.
  const mockProducts = [
    {
      id: 1,
      title: 'Premium Wireless Headphones',
      price: 299.99,
      discount: 15,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
      images: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800',
        'https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=800',
        'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800',
      ],
      category: 'Electronics',
      description:
        'Experience premium sound quality with our flagship wireless headphones. Featuring active noise cancellation, 30-hour battery life, and premium materials for ultimate comfort. Perfect for music lovers and professionals alike.',
      rating: 4.8,
      reviews: 342,
      stock: 45,
      sizes: ['One Size'],
      colors: ['Black', 'Silver', 'Blue', 'Red'],
      features: [
        'Active Noise Cancellation (ANC) technology',
        '30-hour battery life with quick charge',
        'Premium memory foam ear cushions',
        'Bluetooth 5.0 with multipoint connectivity',
        'Built-in microphone for hands-free calls',
        'Foldable design with carrying case included',
      ],
      specifications: {
        'Driver Size': '40mm',
        'Frequency Response': '20Hz - 20kHz',
        'Impedance': '32 Ohm',
        'Weight': '250g',
        'Bluetooth Version': '5.0',
        'Battery Life': '30 hours',
        'Charging Time': '2 hours',
        'Warranty': '2 years',
      },
    },
    {
      id: 2,
      title: 'Smart Watch Series X',
      price: 399.99,
      discount: 20,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
      images: [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
        'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800',
      ],
      category: 'Wearables',
      description:
        'The most advanced smartwatch yet. Track your health, stay connected, and customize your style with our latest wearable technology.',
      rating: 4.6,
      reviews: 218,
      stock: 8,
      sizes: ['40mm', '44mm'],
      colors: ['Space Gray', 'Silver', 'Gold', 'Rose Gold'],
      features: [
        'Always-on Retina display',
        'Blood oxygen monitoring',
        'ECG app for heart health',
        'Water resistant up to 50m',
        '18-hour battery life',
        'GPS and cellular connectivity',
      ],
      specifications: {
        'Display Size': '1.78 inches',
        'Resolution': '448 x 368 pixels',
        'Processor': 'Dual-core S8',
        'Storage': '32GB',
        'Battery': '18 hours',
        'Water Resistance': '50m',
        'Operating System': 'watchOS 10',
      },
    },
    {
      id: 3,
      title: 'Professional Camera Lens 50mm f/1.8',
      price: 599.99,
      image: 'https://images.unsplash.com/photo-1606980402022-f7d7f24c1f4f?w=800',
      images: [
        'https://images.unsplash.com/photo-1606980402022-f7d7f24c1f4f?w=800',
        'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800',
      ],
      category: 'Photography',
      description:
        'Capture stunning portraits with this professional-grade 50mm prime lens. Features fast f/1.8 aperture for beautiful bokeh and low-light performance.',
      rating: 4.9,
      reviews: 156,
      stock: 0, // Out of stock example
      features: [
        'Fast f/1.8 maximum aperture',
        '8-blade circular aperture for smooth bokeh',
        'Ultra-low dispersion glass elements',
        'Weather-sealed construction',
        'Silent autofocus motor',
        'Minimum focus distance: 0.45m',
      ],
      specifications: {
        'Focal Length': '50mm',
        'Maximum Aperture': 'f/1.8',
        'Minimum Aperture': 'f/22',
        'Lens Elements': '9 elements in 8 groups',
        'Filter Size': '58mm',
        'Weight': '420g',
        'Length': '77mm',
      },
    },
  ];

  const product = mockProducts.find((p) => p.id === productId);

  // If the product doesn't exist, we return null and set the status to 404.
  // This tells search engines that the page doesn't exist.
  if (!product) {
    status(404);
    return null;
  }

  // Get related products (products in the same category, excluding the current one)
  const relatedProducts = mockProducts
    .filter((p) => p.id !== productId && p.category === product.category)
    .slice(0, 4);

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
            />
          </div>

          {/* Right Column - Product Info (Price, Options, Add to Cart) */}
          <div>
            <ProductInfo
              id={product.id}
              title={product.title}
              price={product.price}
              discount={product.discount}
              rating={product.rating}
              reviews={product.reviews}
              description={product.description}
              stock={product.stock}
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
