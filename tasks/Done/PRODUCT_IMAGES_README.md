# Product Images - Step 5.2

This directory contains all components, utilities, and types related to product images in the ReconShop application.

## 📁 File Structure

```
src/
├── components/
│   └── product/
│       ├── ProductImage.tsx      # Individual product image component
│       ├── ImageGallery.tsx      # Image gallery with thumbnails
│       ├── ProductCard.tsx       # Product card with image
│       └── index.ts              # Barrel export file
├── types/
│   └── image.types.ts            # TypeScript interfaces for images
├── utils/
│   └── image.utils.ts            # Image utility functions
└── data/
    └── mockProducts.ts           # Sample data for testing
```

## 🧩 Components

### 1. ProductImage

A reusable component for displaying individual product images with optimization and lazy loading.

**Features:**
- ✅ Lazy loading (loads when visible)
- ✅ Responsive images with srcset
- ✅ Loading placeholder animation
- ✅ Error handling with fallback images
- ✅ Multiple size variants
- ✅ Click handler support

**Usage:**
```tsx
import { ProductImage } from '~/components/product';

<ProductImage 
  image={productImage} 
  size="medium" 
  class="rounded-lg shadow-md"
  onClick$={() => console.log('Image clicked')}
/>
```

**Props:**
- `image` (ProductImage): The image object to display
- `size?` (ImageSize): Size variant - 'thumbnail' | 'small' | 'medium' | 'large' | 'original'
- `class?` (string): Additional CSS classes
- `lazy?` (boolean): Enable lazy loading (default: true)
- `showPlaceholder?` (boolean): Show loading placeholder (default: true)
- `quality?` (number): Image quality 1-100 (default: 85)
- `onClick$?` (QRL): Click handler function

---

### 2. ImageGallery

A full-featured image gallery for product detail pages with thumbnails and zoom.

**Features:**
- ✅ Thumbnail navigation
- ✅ Previous/Next arrows
- ✅ Zoom on hover
- ✅ Image preloading for smooth transitions
- ✅ Vertical or horizontal layout
- ✅ Touch/swipe support (mobile-ready)
- ✅ Image counter badge

**Usage:**
```tsx
import { ImageGallery } from '~/components/product';

<ImageGallery 
  images={product.images}
  enableZoom={true}
  layout="vertical"
/>
```

**Props:**
- `images` (ProductImage[]): Array of product images
- `class?` (string): Additional CSS classes
- `enableZoom?` (boolean): Enable zoom on hover (default: true)
- `layout?` ('vertical' | 'horizontal'): Gallery layout (default: 'vertical')

---

### 3. ProductCard

A complete product card component for grid/list views.

**Features:**
- ✅ Product image with hover effects
- ✅ Price display with discounts
- ✅ Rating stars
- ✅ Add to cart button
- ✅ Wishlist button
- ✅ Quick view button
- ✅ Out of stock overlay
- ✅ Discount badge

**Usage:**
```tsx
import { ProductCard } from '~/components/product';

<ProductCard 
  product={product}
  showAddToCart={true}
  onAddToCart$={(productId) => addToCart(productId)}
/>
```

**Props:**
- `product` (Product): Product object with images
- `class?` (string): Additional CSS classes
- `showAddToCart?` (boolean): Show add to cart button (default: true)
- `onAddToCart$?` ((productId: string) => void): Add to cart callback

---

## 🛠️ Utilities

### image.utils.ts

Helper functions for working with images:

- `getOptimizedImageUrl(baseUrl, size, quality)` - Generate optimized image URLs
- `generateSrcSet(baseUrl, sizes)` - Create srcset for responsive images
- `getPrimaryImage(images)` - Get the primary image from an array
- `validateImageUrl(url)` - Check if an image URL is accessible
- `getPlaceholderImage(width, height)` - Get placeholder image URL
- `getSizeDimensions(size)` - Get pixel dimensions for a size variant
- `preloadImage(url)` - Preload an image for better performance

**Example:**
```typescript
import { getOptimizedImageUrl, getPrimaryImage } from '~/utils/image.utils';

const primaryImage = getPrimaryImage(product.images);
const optimizedUrl = getOptimizedImageUrl(primaryImage.url, 'medium', 80);
```

---

## 📊 Types

### image.types.ts

TypeScript interfaces for type safety:

- `ProductImage` - Single product image object
- `ImageSize` - Size variant type
- `ImageConfig` - Image optimization configuration
- `ImageProps` - Component props interface

**Example:**
```typescript
import type { ProductImage, ImageSize } from '~/types/image.types';

const myImage: ProductImage = {
  id: 'img-1',
  url: '/images/product.jpg',
  alt: 'Product description',
  isPrimary: true,
  width: 800,
  height: 800,
};
```

---

## 📦 Mock Data

### mockProducts.ts

Sample data for development and testing:

- `mockProductImages` - Array of sample images
- `mockProducts` - Array of sample products
- `getProductById(id)` - Get product by ID
- `getProductBySlug(slug)` - Get product by URL slug

**Example:**
```typescript
import { mockProducts, getProductBySlug } from '~/data/mockProducts';

const product = getProductBySlug('premium-wireless-headphones');
```

---

## 🎨 Image Sizes

The application uses five size variants:

| Size | Dimensions | Use Case |
|------|-----------|----------|
| `thumbnail` | 150x150 | Gallery thumbnails, cart items |
| `small` | 300x300 | Product cards, small previews |
| `medium` | 600x600 | Product detail default view |
| `large` | 1200x1200 | Gallery main image, zoom view |
| `original` | Original | Download, print quality |

---

## 🚀 Quick Start

### Display a single product image:
```tsx
import { ProductImage } from '~/components/product';
import { mockProductImages } from '~/data/mockProducts';

export default component$(() => {
  return (
    <ProductImage 
      image={mockProductImages[0]} 
      size="medium" 
    />
  );
});
```

### Display a product gallery:
```tsx
import { ImageGallery } from '~/components/product';
import { mockProducts } from '~/data/mockProducts';

export default component$(() => {
  const product = mockProducts[0];
  
  return (
    <ImageGallery 
      images={product.images}
      enableZoom={true}
    />
  );
});
```

### Display products in a grid:
```tsx
import { ProductCard } from '~/components/product';
import { mockProducts } from '~/data/mockProducts';

export default component$(() => {
  return (
    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {mockProducts.map((product) => (
        <ProductCard 
          key={product.id}
          product={product}
          onAddToCart$={(id) => console.log('Add to cart:', id)}
        />
      ))}
    </div>
  );
});
```

---

## 🔧 Future Enhancements

Potential improvements for production:

1. **Image CDN Integration** - Integrate with Cloudinary, Imgix, or similar services
2. **WebP/AVIF Support** - Automatic format conversion for modern browsers
3. **Image Compression** - On-the-fly compression based on device
4. **Progressive Loading** - Blur-up effect while images load
5. **360° Product View** - Interactive product rotation
6. **Video Support** - Add product videos alongside images
7. **User-Generated Images** - Customer photos in gallery
8. **Image Annotations** - Hotspots for product features

---

## 📝 Notes for Junior Developers

### What is lazy loading?
Lazy loading means images only load when they're about to be visible on screen. This improves page performance by not loading all images at once.

### What is srcset?
srcset allows browsers to choose the best image size for the current screen. Mobile gets smaller images, desktop gets larger ones.

### What is a signal?
In Qwik, `useSignal()` creates a reactive value. When it changes, only the components using it re-render. It's similar to `useState` in React but more efficient.

### What is the $ suffix?
In Qwik, functions ending with `$` (like `onClick$`) are optimized to only load when needed. This keeps your initial page load super fast.

---

## 🐛 Troubleshooting

**Images not loading?**
- Check that image URLs are correct
- Verify CORS settings if using external URLs
- Look for console errors
- Try the placeholder image

**Gallery not working?**
- Ensure you're passing an array of images
- Check that image objects have required fields (id, url, alt)
- Verify there are no console errors

**Slow performance?**
- Reduce image quality (try 70-80 instead of 85)
- Use appropriate size variants
- Enable lazy loading
- Consider using a CDN

---

## 📚 Resources

- [Qwik Documentation](https://qwik.builder.io/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Web.dev Image Optimization Guide](https://web.dev/fast/#optimize-your-images)
- [MDN: Responsive Images](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)

---

Created as part of **Step 5.2: Product Images** for the ReconShop eCommerce project.
