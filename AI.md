# ReconShop Project - Complete AI Context Guide

**Last Updated:** February 9, 2026 (Updated with mock data expansion and dynamic featured products)
**Framework:** QwikJS v1.19.0 with Qwik City  
**Language:** TypeScript 5.4.5  
**Styling:** Tailwind CSS 3.4.17  
**Deployment:** Netlify Edge Functions

---

## 📋 Project Overview

**ReconShop** is a full responsive eCommerce website built with QwikJS, featuring a component-based, flexible architecture. It provides a modern shopping experience with product browsing, detailed product views, shopping cart management, and image optimization.

### Key Features

- ✅ Full responsive eCommerce experience
- ✅ Client-side rendering (CSR)
- ✅ Component-based, flexible architecture
- ✅ Product image gallery with zoom
- ✅ Shopping cart with context state management
- ✅ Toast notifications system
- ✅ Mobile hamburger menu (slide-in drawer)
- ✅ Image optimization (AVIF, WebP, JPEG)
- ✅ Lazy loading and responsive images
- ✅ LocalStorage cart persistence
- ✅ Real-time cart updates

### Technology Stack

- **Framework:** QwikJS with Qwik City
- **Build Tool:** Vite 7.3.1
- **Styling:** Tailwind CSS 3.4.17
- **Image Optimization:** Vite Image Optimizer
- **Image Handling:** Vite Image Tools
- **Type Checking:** TypeScript with strict mode
- **Deployment:** Netlify Edge Functions
- **Package Manager:** pnpm

### Development Commands

```bash
# Development server with hot reload
pnpm run dev

# Build for production
pnpm build

# Preview production build locally
pnpm preview

# Type checking
pnpm run build.types

# Linting
pnpm lint

# Code formatting
pnpm fmt

# Deploy to Netlify
pnpm run deploy

# Netlify preview
pnpm serve
```

---

## 📁 Project Structure

### Core Application Structure

```
reconshop/
├── src/
│   ├── entry.dev.tsx                    # Dev entry point
│   ├── entry.ssr.tsx                    # Server-side rendering entry
│   ├── entry.netlify-edge.tsx           # Netlify Edge Functions entry
│   ├── entry.preview.tsx                # Preview entry point
│   ├── root.tsx                         # Root component with QwikCityProvider
│   ├── global.css                       # Global styles (Tailwind imports)
│   │
│   ├── components/                      # Reusable UI components
│   │   ├── Hero.tsx                     # Hero section component
│   │   ├── router-head/
│   │   │   └── router-head.tsx          # Head metadata management
│   │   ├── ui/                          # Core UI components
│   │   │   ├── Header.tsx               # Main navigation header
│   │   │   ├── Breadcrumb.tsx           # Breadcrumb navigation
│   │   │   └── MobileMenu.tsx           # Mobile drawer menu
│   │   ├── home/                        # Homepage components
│   │   │   ├── Home.tsx                 # Main home component
│   │   │   ├── Hero.tsx                 # Hero banner
│   │   │   ├── Categories.tsx           # Category section
│   │   │   ├── Banner.tsx               # Promotional banner
│   │   │   └── FeaturedProducts.tsx     # Featured products showcase
│   │   ├── product/                     # Product-related components
│   │   │   ├── ProductImage.tsx         # Individual product image
│   │   │   ├── ImageGallery.tsx         # Gallery with thumbnails
│   │   │   ├── ProductCard.tsx          # Product card for listings
│   │   │   ├── ProductGallery.tsx       # Product detail gallery
│   │   │   ├── ProductInfo.tsx          # Product details & specs
│   │   │   ├── ProductImage.tsx         # Single product image
│   │   │   ├── QuantitySelector.tsx     # Quantity input component
│   │   │   ├── RelatedProducts.tsx      # Related items section
│   │   │   └── index.ts                 # Barrel exports
│   │   └── cart/                        # Shopping cart components
│   │       ├── AddToCartButton.tsx      # Add to cart button
│   │       ├── CartBadge.tsx            # Cart icon with count badge
│   │       ├── CartCountBadge.tsx       # Count display
│   │       ├── CartDrawer.tsx           # Cart sidebar
│   │       └── CartItemCard.tsx         # Individual cart item
│   │
│   ├── contexts/                        # Global context providers
│   │   ├── cart/                        # Shopping cart context
│   │   │   ├── CartContext.tsx          # Context provider (provider component)
│   │   │   ├── useCart.ts               # Custom hook to access cart
│   │   │   ├── types.ts                 # TypeScript interfaces
│   │   │   ├── utils.ts                 # Helper functions
│   │   │   └── index.ts                 # Barrel exports
│   │   └── toast/                       # Toast notification context
│   │       ├── ToastContext.tsx         # Toast provider component
│   │       ├── useToast.ts              # Custom hook to access toast
│   │       └── index.ts                 # Barrel exports
│   │
│   ├── routes/                          # Qwik City routes
│   │   ├── index.tsx                    # Home page (/)
│   │   ├── layout.tsx                   # Root layout with providers
│   │   ├── cart/
│   │   │   └── index.tsx                # Shopping cart page
│   │   ├── product/
│   │   │   └── [id]/
│   │   │       └── index.tsx            # Dynamic product detail page
│   │   ├── products/
│   │   │   └── [slug]/
│   │   │       └── index.tsx            # Product by slug page
│   │   └── shop/
│   │       └── index.tsx                # Shop listing page
│   │
│   ├── types/                           # Shared TypeScript interfaces
│   │   ├── product.ts                   # Product interfaces
│   │   └── image.types.ts               # Image-related types
│   │
│   ├── utils/                           # Utility functions
│   │   └── image.utils.ts               # Image helper functions
│   │
│   └── data/                            # Mock data for development
│       └── mockProducts.ts              # Sample product data
│
├── public/                              # Static files (copied to build)
│   ├── images/                          # Product and asset images
│   │   ├── products/                    # Product photos
│   │   ├── categories/                  # Category images
│   │   ├── banners/                     # Hero banners
│   │   └── icons/                       # SVG icons
│   ├── manifest.json                    # PWA manifest
│   ├── robots.txt                       # SEO robots file
│   └── _headers                         # Netlify headers config
│
├── server/                              # Server configuration
│   ├── entry.preview.js                 # Preview server entry
│   ├── @qwik-city-not-found-paths.js   # 404 paths
│   └── @qwik-city-static-paths.js      # Static paths
│
├── adapters/                            # Framework adapters
│   └── netlify-edge/
│       └── vite.config.ts               # Netlify Edge adapter config
│
├── tasks/                               # Project documentation
│   ├── PROGRESS_SUMMARY.md              # Development progress
│   └── Done/                            # Completed task documentation
│
├── .github/                             # GitHub configuration
│   ├── skills/                          # AI skill files
│   │   ├── workflows/                   # Skill workflows
│   │   ├── rules/                       # Framework rules
│   │   └── history/                     # Project history
│   └── ...
│
├── .vscode/                             # VS Code configuration
│   ├── qwik.code-snippets               # Qwik component snippets
│   └── qwik-city.code-snippets          # Qwik City snippets
│
├── Configuration Files
│   ├── vite.config.ts                   # Vite build configuration
│   ├── tsconfig.json                    # TypeScript configuration
│   ├── tailwind.config.js               # Tailwind CSS configuration
│   ├── postcss.config.cjs               # PostCSS configuration
│   ├── prettier.config.js               # Code formatter config
│   ├── eslint.config.js                 # Linting rules
│   ├── qwik.env.d.ts                    # Qwik environment types
│   ├── netlify.toml                     # Netlify deployment config
│   ├── package.json                     # Project dependencies
│   ├── pnpm-lock.yaml                   # Locked dependency versions
│   ├── README.md                        # Project readme
│   └── TODO.md                          # Development roadmap
```

---

## 🏗️ Architecture & State Management

### Application Root (src/root.tsx)

The root component initializes the entire QwikCity application with the QwikCityProvider wrapper:

```tsx
export default component$(() => {
  return (
    <QwikCityProvider>
      <head>
        <meta charset="utf-8" />
        <RouterHead />
      </head>
      <body lang="en">
        <RouterOutlet />
      </body>
    </QwikCityProvider>
  );
});
```

### Layout & Providers (src/routes/layout.tsx)

All routes inherit this layout which wraps the app with essential context providers:

```tsx
export default component$(() => {
  return (
    <CartProvider>
      <div class="flex min-h-screen flex-col font-sans">
        <Header />
        <main class="flex-1 bg-white">
          <ToastProvider>
            <Slot />
          </ToastProvider>
        </main>
        <footer>...</footer>
      </div>
    </CartProvider>
  );
});
```

**Provider Hierarchy:**

1. **CartProvider** - Global shopping cart state
2. **Header** - Navigation component
3. **ToastProvider** - Notification system
4. **Slot** - Route content rendered here
5. **Footer** - Global footer

---

## 🛒 Shopping Cart System

### Cart Context Structure (src/contexts/cart/)

#### Types (types.ts)

```typescript
interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  discount?: number;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  discount: number;
  total: number;
}

interface CartActions {
  addItem: QRL<(item: Omit<CartItem, "quantity">, quantity?: number) => void>;
  removeItem: QRL<(id: number, size?: string, color?: string) => void>;
  updateQuantity: QRL<
    (id: number, quantity: number, size?: string, color?: string) => void
  >;
  clearCart: QRL<() => void>;
  getItemQuantity: QRL<(id: number, size?: string, color?: string) => number>;
  isInCart: QRL<(id: number, size?: string, color?: string) => boolean>;
}

type CartContextType = {
  state: CartState;
  actions: CartActions;
};
```

#### Cart Provider (CartContext.tsx)

- Manages global cart state using `useStore$`
- Persists cart to `localStorage` on every change
- Provides actions: `addItem`, `removeItem`, `updateQuantity`, `clearCart`
- Automatically calculates totals when items change
- Uses `useVisibleTask$` for browser-only localStorage operations

#### Custom Hook (useCart.ts)

```typescript
export const useCart = (): CartContextType => {
  const cart = useContext(CartContext);
  if (!cart) {
    throw new Error("useCart must be used within CartProvider");
  }
  return cart;
};
```

**Usage in components:**

```tsx
export default component$(() => {
  const cart = useCart();

  return (
    <div>
      <p>Items: {cart.state.totalItems}</p>
      <button onClick$={() => cart.actions.addItem(product)}>
        Add to Cart
      </button>
    </div>
  );
});
```

#### Utility Functions (utils.ts)

- `calculateCartTotals(items)` - Recalculates subtotal and total
- `loadCartFromStorage()` - Retrieves saved cart
- `saveCartToStorage(items)` - Persists cart
- `findCartItemIndex(items, item)` - Locates item by ID+size+color
- `clearCartFromStorage()` - Clears persisted data

---

## 📢 Toast Notification System

### Toast Context (src/contexts/toast/)

#### Types & Interface

```typescript
type ToastType = "success" | "error" | "info" | "warning";

interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  messages: ToastMessage[];
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
}
```

#### Custom Hook (useToast.ts)

```typescript
export const useToast = () => {
  const toast = useContext(ToastContext);
  if (!toast) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return toast;
};
```

**Usage in components:**

```tsx
export default component$(() => {
  const toast = useToast();

  return (
    <button onClick$={() => toast.showToast("Added to cart!", "success")}>
      Add to Cart
    </button>
  );
});
```

---

## 📦 Product Data Models

### Product Type (src/types/product.ts)

```typescript
interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discount?: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;
  subcategory?: string;
  brand?: string;
  rating?: number;
  reviewCount?: number;
  tags?: string[];
  inStock: boolean;
  stockQuantity?: number;
  sku?: string;
  sizes?: string[];
  colors?: string[];
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  features?: string[];
  specifications?: Record<string, string>;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
```

### Image Type (src/types/image.types.ts)

```typescript
interface ProductImage {
  id: string;
  url: string;
  alt: string;
  thumbnail?: string;
  width: number;
  height: number;
  isPrimary?: boolean;
}
```

---

## 🖼️ Image Handling & Optimization

### Image Optimization Configuration (vite.config.ts)

Uses `vite-plugin-image-optimizer` with:

- **Formats:** AVIF, WebP, JPEG (in order of preference)
- **Lazy Loading:** Images load when visible in viewport
- **Responsive Images:** Multiple size variants generated
- **Placeholder:** Blur-up placeholders while loading
- **Error Handling:** Fallback images on load failure

### Image Components

#### ProductImage Component

- Individual product image with lazy loading
- Supports multiple size variants
- Click handlers for gallery navigation
- Loading placeholder animation
- Error fallback handling

#### ImageGallery Component

- Thumbnail navigation
- Previous/Next arrow controls
- Zoom on hover
- Image preloading for smooth transitions
- Vertical/horizontal layout options
- Keyboard navigation support
- Mobile-friendly touch support

#### ProductCard Component

- Shows product with thumbnail
- Price and discount display
- Rating/review info
- Quick add to cart button

### Public Image Folder Structure

```
public/images/
├── products/          # Product photos (optimized)
├── categories/        # Category images
├── banners/          # Hero/promotional banners
└── icons/            # SVG icons
```

All images in `public/` are automatically optimized during build.

---

## 🧩 Core Components

### Navigation & Layout

#### Header Component (src/components/ui/Header.tsx)

- Sticky navigation bar
- Logo/brand link to home
- Desktop navigation links
- Cart badge with count
- Mobile menu toggle
- Search button placeholder
- Links: Home, Shop, About, Blog, Contact

#### MobileMenu Component (src/components/ui/MobileMenu.tsx)

- Slide-in drawer from right
- Mobile-only (hidden on desktop)
- Semi-transparent blurred backdrop
- Close button (X icon)
- Full-height navigation
- Categories and search access
- Smooth animations

#### Breadcrumb Component (src/components/ui/Breadcrumb.tsx)

- Secondary navigation breadtrail
- Shows current location in hierarchy
- Clickable ancestor links
- Non-clickable current page
- Responsive overflow handling
- Accessibility with aria-label

### Shopping Cart

#### AddToCartButton Component

- OnClick$ handler for cart addition
- Loading states during operation
- Success state with icon
- Variant support (size/color)
- Integrates with Toast notifications

#### CartBadge Component

- Displays cart icon
- Shows real-time item count
- Link to cart page
- Badge animation on updates

#### CartDrawer Component

- Sidebar cart preview
- List of cart items with thumbnails
- Quantity adjustment buttons
- Remove item buttons
- Subtotal/total display
- Checkout button
- Empty cart message

#### CartItemCard Component

- Individual cart item display
- Thumbnail image
- Product info (title, price)
- Quantity selector with +/- buttons
- Remove button
- Variant display (size/color)

### Product Display

#### ProductCard Component (for listings)

- Product image with lazy loading
- Product title
- Price with optional discount display
- Original price (crossed out)
- Rating/review count
- "Add to Cart" button
- Quick view link

#### ProductGallery Component (for detail pages)

- Main image display
- Thumbnail strip (vertical or horizontal)
- Image navigation (previous/next)
- Zoom on hover feature
- Image counter badge
- Touch/keyboard navigation

#### ProductImage Component

- Individual image wrapper
- Lazy loading support
- Responsive srcset
- Size variants
- Error handling
- Loading placeholder

#### ProductInfo Component

- Product title and brand
- Price display with discount
- Stock status indicator
- Description text
- Features/specifications list
- Variant selectors (size, color dropdowns)
- Quantity selector
- Add to cart button

#### QuantitySelector Component

- Number input for quantity
- Increment (+) button
- Decrement (-) button
- Min/max validation
- Accessible ARIA labels

#### RelatedProducts Component

- Shows related products
- "You might also like" section
- Uses same ProductCard component
- Pagination or horizontal scroll

### Home Page Components

#### Hero Component

- Large banner image
- Headline and subheading
- Call-to-action button
- Full-width layout
- Responsive image sizing

#### Categories Component

- Grid of category cards (responsive: 1 mobile, 3 desktop)
- Category images with overlays
- Category titles
- Hover effects
- Navigation links to category pages

#### FeaturedProducts Component

- Showcase of featured items
- Product cards grid
- Uses ProductCard component
- Pagination or "View All" link

#### Banner Component

- Promotional banner section
- Half-height image
- Semi-transparent dark overlay
- Centered text and button
- "Shop Collection" CTA

---

## 🛣️ Routing Structure

### Qwik City Routes

```
/                          Home page
  ├── /shop               Shop/product listing
  ├── /product/[id]       Product detail (by ID)
  ├── /products/[slug]    Product detail (by slug)
  ├── /cart               Shopping cart page
  ├── /about              About page
  ├── /blog               Blog page
  └── /contact            Contact page
```

### Route Loaders

Routes use `routeLoader$` for data fetching:

```typescript
export const useProductData = routeLoader$(async ({ params, status }) => {
  const productId = parseInt(params.id);
  // Fetch product from API or mock data
  // Currently uses mockProducts for development
  return product;
});
```

**Currently using mock data** - Replace with real API calls for production:

```typescript
// Development: src/data/mockProducts.ts
// Production: Should fetch from API/database
```

### Mock Product Data (src/data/mockProducts.ts)

**Expanded to 16 Products** with dynamic data source:

The project now includes 16 sample products for comprehensive testing and development. Each product has:

```typescript
interface MockProduct {
  id: string; // Unique ID (prod-1, prod-2, etc.)
  name: string; // Product title
  slug: string; // URL-friendly name
  price: number; // Current price
  originalPrice?: number; // Original price (for discounts)
  images: ProductImage[]; // Array of product images
  category: string; // Product category
  rating: number; // Star rating (0-5)
  inStock: boolean; // Availability status
  description: string; // Product description
  createdAt: Date; // Timestamp for sorting
}
```

**Current Products (16 total):**

| ID      | Name                            | Category             | Price   | Stock |
| ------- | ------------------------------- | -------------------- | ------- | ----- |
| prod-1  | Premium Wireless Headphones     | Electronics          | $299.99 | ✅    |
| prod-2  | Smartphone Stand                | Accessories          | $29.99  | ✅    |
| prod-3  | USB-C Cable Pack                | Cables               | $19.99  | ❌    |
| prod-4  | Wireless Mouse                  | Computer Accessories | $49.99  | ✅    |
| prod-5  | Mechanical Keyboard RGB         | Computer Accessories | $159.99 | ✅    |
| prod-6  | Portable SSD 1TB                | Storage              | $129.99 | ✅    |
| prod-7  | USB Hub 7-in-1                  | Cables & Hubs        | $39.99  | ✅    |
| prod-8  | Webcam 4K Pro                   | Video                | $89.99  | ✅    |
| prod-9  | Laptop Stand Aluminum           | Accessories          | $44.99  | ✅    |
| prod-10 | Monitor Light Bar               | Lighting             | $69.99  | ✅    |
| prod-11 | Desk Organizer Set              | Office Supplies      | $34.99  | ✅    |
| prod-12 | Wireless Charging Pad           | Charging             | $24.99  | ✅    |
| prod-13 | Portable Phone Charger 20000mAh | Charging             | $54.99  | ✅    |
| prod-14 | Blue Light Glasses              | Eye Protection       | $59.99  | ✅    |
| prod-15 | Ergonomic Wrist Rest            | Accessories          | $19.99  | ✅    |
| prod-16 | HDMI Cable 2.1 8K               | Cables               | $29.99  | ✅    |

**Helper Functions:**

```typescript
// Get single product by ID
export const getProductById = (id: string) => {
  return mockProducts.find((product) => product.id === id);
};

// Get single product by slug
export const getProductBySlug = (slug: string) => {
  return mockProducts.find((product) => product.slug === slug);
};

// Get latest featured products (sorted by createdAt, newest first)
export const getLatestProducts = (count: number = 4) => {
  return mockProducts
    .sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA; // Newest first
    })
    .slice(0, count)
    .map((product) => ({
      id: parseInt(product.id.replace("prod-", "")),
      title: product.name,
      price: product.price,
      image: product.images[0]?.url || "/images/placeholder.jpg",
    }));
};
```

**Homepage Integration:**

The homepage now uses `getLatestProducts(4)` to display the 4 most recently added products:

```typescript
// src/routes/index.tsx
export const useFeaturedProducts = routeLoader$(async () => {
  return getLatestProducts(4); // Returns 4 newest products
});
```

This ensures **automatic synchronization** - adding new products to mockProducts.ts automatically updates the homepage without code changes.

---

## 🎨 Styling & Theme

### Tailwind CSS Configuration

**Path aliases:**

```typescript
// tsconfig.json
"paths": {
  "~/*": ["./src/*"]
}
```

**Custom animations:**

- `slide-in-right` - 0.3s slide animation
- `slide-out-right` - 0.3s slide-out animation
- `bounce-in` - 0.5s bounce effect
- `pulse-scale` - 0.3s scale pulse effect

**Key utility classes used:**

- `container` - Max-width centered wrapper
- `px-4` - Horizontal padding
- `space-x-6` - Horizontal gap between elements
- `sticky top-0 z-40` - Fixed header positioning
- `grid grid-cols-1 md:grid-cols-3` - Responsive grids
- `hidden md:block` - Responsive visibility
- `flex items-center justify-between` - Flexbox layouts

### Global Styles (src/global.css)

- Tailwind imports (@tailwind directives)
- Custom scrollbar styles
- Default font stack
- Base element resets

---

## 🔧 Build & Development Configuration

### Vite Configuration (vite.config.ts)

**Plugins (in order):**

1. `qwikCity()` - Qwik City routing
2. `qwikVite()` - Qwik optimization
3. `tsconfigPaths()` - TypeScript path resolution
4. `ViteImageOptimizer()` - Image optimization

**Image Optimizer Settings:**

- Test pattern: `/\.(jpe?g|png|gif|tiff|webp|svg|avif)$/i`
- Input: public and src folders
- Output: Multiple format variants
- Cache: Enabled for incremental builds

### TypeScript Configuration (tsconfig.json)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ES2022",
    "jsx": "react-jsx",
    "jsxImportSource": "@builder.io/qwik",
    "strict": true,
    "paths": {
      "~/*": ["./src/*"]
    }
  }
}
```

### Netlify Deployment (netlify.toml)

```toml
[build]
  command = "pnpm build"
  publish = "dist"

[functions]
  node_bundler = "pnpm"
```

---

## 📋 Key Qwik Patterns & Conventions

### Component Declaration

All components use `component$` wrapper for proper Qwik optimization:

```typescript
export const MyComponent = component$<MyProps>(({ prop1, prop2 }) => {
  return <div>{prop1}</div>;
});
```

### Event Handlers

Event handlers use `$` suffix for serialization:

```typescript
<button onClick$={() => doSomething()}>Click me</button>

// Or with explicit $ wrapper:
const handleClick = $(() => {
  // Handler logic
});
```

### State Management

**Reactive state:**

```typescript
const count = useSignal(0);
return <div>{count.value}</div>;
```

**Mutable stores:**

```typescript
const store = useStore({ count: 0 });
return <div>{store.count}</div>;
```

**Context usage:**

```typescript
useContextProvider(MyContext, {
  /* value */
});
const value = useContext(MyContext);
```

### Data Loading

**Route loaders (server-side):**

```typescript
export const useData = routeLoader$(async ({ params }) => {
  return await fetchData(params.id);
});

// In component:
export default component$(() => {
  const data = useData();
  return <div>{data.value}</div>;
});
```

**Browser-only effects:**

```typescript
useVisibleTask$(() => {
  // Only runs in browser when component becomes visible
  localStorage.setItem("key", value);
});
```

---

## 🐛 Common Development Patterns

### Add to Cart Flow

1. User clicks "Add to Cart" button
2. Component calls `cart.actions.addItem(product, quantity)`
3. CartContext checks if item exists (by ID + variants)
4. If exists: increment quantity
5. If new: add to items array
6. Recalculate totals
7. Save to localStorage
8. Show success toast: `toast.showToast('Added to cart!', 'success')`

### Product Detail Page Flow

1. Route loader fetches product by ID from mockProducts
2. Product displays in ImageGallery, ProductInfo, RelatedProducts
3. User can select variants (size, color)
4. User selects quantity with QuantitySelector
5. User clicks "Add to Cart"
6. AddToCartButton triggers cart action
7. Toast shows success/error message

### Navigation Flow

1. User clicks link in Header or MobileMenu
2. Qwik City router handles navigation
3. New route renders (no full page reload)
4. Meta tags updated via RouterHead
5. Breadcrumb updates to show location

---

## 📝 Code Quality Standards

### TypeScript Practices

- **Strict mode** enabled for type safety
- **Explicit return types** on functions
- **Interface definitions** for all data structures
- **Type guards** for optional properties
- **QRL<> wrappers** for serializable functions

### Accessibility Standards

- **ARIA labels** on interactive elements
- **Semantic HTML** (nav, button, section, article)
- **Keyboard navigation** support
- **Focus management** in menus/dialogs
- **Alt text** on all images

### Performance Best Practices

- **Code splitting** via Qwik's optimizer
- **Lazy loading** for images and components
- **Image optimization** (multiple formats, sizes)
- **LocalStorage caching** for cart data
- **Event delegation** where appropriate
- **Conditional rendering** to avoid unnecessary DOM

### Component Organization

- **Single responsibility** principle
- **Props interfaces** always defined
- **Barrel exports** in index.ts files
- **Comments** for complex logic
- **Descriptive names** for components/functions
- **Consistent file structure** across folders

---

## 🚀 Current Development Status

### Completed Features ✅

- [x] Product details page with gallery and zoom
- [x] Hamburger menu (animated slide-in drawer)
- [x] Enhanced Add to Cart with loading states
- [x] Cart context store with persistence
- [x] Cart page/drawer with full management
- [x] Image optimization with AVIF/WebP/JPEG
- [x] Product filtering system
- [x] Toast notifications system
- [x] Homepage with featured products
- [x] Multiple product variants support
- [x] **NEW**: AI context documentation system (AI.md + update workflow)
- [x] **NEW**: Expanded mock products (4 → 16 products with timestamps)
- [x] **NEW**: Dynamic featured products from mockProducts data source

### In Progress 🔄

- [ ] Qwik Link integration for optimized navigation
- [ ] Advanced hydration optimization
- [ ] Step 5.3: Full server-side data fetching with real API

### Planned Features 📋

- [ ] User authentication system
- [ ] Order history and tracking
- [ ] Wishlist functionality
- [ ] Advanced search with filters
- [ ] Payment gateway integration
- [ ] Review and rating system
- [ ] Email notifications
- [ ] Admin dashboard

---

## 🔗 File Dependencies & Relationships

### Component Import Tree

```
src/routes/layout.tsx (Root layout with providers)
  ├── src/components/ui/Header.tsx
  │   ├── src/components/ui/MobileMenu.tsx
  │   └── src/components/cart/CartBadge.tsx
  │       └── src/contexts/cart/useCart.ts
  ├── src/components/router-head/router-head.tsx
  └── src/contexts/cart/CartProvider (wrapper)
      └── src/contexts/cart/CartContext.tsx
  └── src/contexts/toast/ToastProvider (wrapper)
      └── src/contexts/toast/ToastContext.tsx

src/routes/index.tsx (Home page)
  ├── src/components/home/Hero.tsx
  ├── src/components/home/Categories.tsx
  ├── src/components/home/FeaturedProducts.tsx
  │   └── src/components/product/ProductCard.tsx
  └── src/components/home/Banner.tsx

src/routes/product/[id]/index.tsx (Product detail)
  ├── src/components/product/ProductGallery.tsx
  │   └── src/components/product/ImageGallery.tsx
  │       └── src/components/product/ProductImage.tsx
  ├── src/components/product/ProductInfo.tsx
  │   ├── src/components/product/QuantitySelector.tsx
  │   └── src/components/cart/AddToCartButton.tsx
  │       └── src/contexts/cart/useCart.ts
  └── src/components/product/RelatedProducts.tsx
      └── src/components/product/ProductCard.tsx

src/routes/cart/index.tsx (Cart page)
  ├── src/components/cart/CartDrawer.tsx
  │   └── src/components/cart/CartItemCard.tsx
  └── src/contexts/cart/useCart.ts
```

### Data Flow

```
User Action (Click "Add to Cart")
  ↓
AddToCartButton.tsx onClick$ handler
  ↓
cart.actions.addItem() (from CartContext)
  ↓
CartContext updates cartState store
  ↓
calculateCartTotals() recalculates
  ↓
saveCartToStorage() persists to localStorage
  ↓
useToast() shows success notification
  ↓
CartBadge reactively updates with new count
```

---

## 🎯 Quick Reference: How to...

### Add a New Route

1. Create folder: `src/routes/new-route/index.tsx`
2. Export default component in `component$()` wrapper
3. Export optional `head: DocumentHead` for SEO
4. Component automatically available at `/new-route`

```typescript
export default component$(() => {
  return <div>Route content</div>;
});

export const head: DocumentHead = {
  title: "Page Title",
  meta: [{ name: "description", content: "..." }],
};
```

### Add Cart Functionality to a Component

```typescript
import { component$ } from '@builder.io/qwik';
import { useCart } from '~/contexts/cart';
import { useToast } from '~/contexts/toast';

export default component$(() => {
  const cart = useCart();
  const toast = useToast();

  const handleAddToCart = $(() => {
    cart.actions.addItem({
      id: 1,
      title: "Product",
      price: 99.99,
      image: "/img.jpg"
    }, 1);
    toast.showToast('Added to cart!', 'success');
  });

  return <button onClick$={handleAddToCart}>Add to Cart</button>;
});
```

### Add a Toast Notification

```typescript
import { useToast } from "~/contexts/toast";

const toast = useToast();

// Success
toast.showToast("Item added!", "success", 3000);

// Error
toast.showToast("Something went wrong", "error", 5000);

// Info
toast.showToast("Please note...", "info", 3000);

// Warning
toast.showToast("Are you sure?", "warning", 3000);
```

### Use Product Images with Optimization

```typescript
// From public folder (optimized automatically)
<img src="/images/products/product-1.jpg" alt="Product" />

// Or with picture element for format variants
<picture>
  <source srcset="/images/products/product.avif" type="image/avif" />
  <source srcset="/images/products/product.webp" type="image/webp" />
  <img src="/images/products/product.jpg" alt="Product" />
</picture>
```

### Fetch Product Data

```typescript
import { routeLoader$ } from '@builder.io/qwik-city';
import { getProductById } from '~/data/mockProducts';

export const useProduct = routeLoader$(async ({ params }) => {
  const product = getProductById(parseInt(params.id));
  if (!product) throw new Error('Product not found');
  return product;
});

export default component$(() => {
  const product = useProduct();
  return <div>{product.value.title}</div>;
});
```

---

## 📚 Important Files Reference

| File                                  | Purpose                                 |
| ------------------------------------- | --------------------------------------- |
| `src/root.tsx`                        | App initialization & QwikCityProvider   |
| `src/routes/layout.tsx`               | Global layout with cart/toast providers |
| `src/contexts/cart/CartContext.tsx`   | Shopping cart state & logic             |
| `src/contexts/toast/ToastContext.tsx` | Notification system                     |
| `src/types/product.ts`                | Product data structure                  |
| `src/data/mockProducts.ts`            | Sample data for development             |
| `src/components/product/index.ts`     | Barrel exports for product components   |
| `src/components/cart/`                | All cart UI components                  |
| `vite.config.ts`                      | Build & optimization settings           |
| `tailwind.config.js`                  | Styling theme & animations              |
| `netlify.toml`                        | Deployment configuration                |

---

## 🎓 For New AI Agents

When working on this project:

1. **Always use `component$`** for all components - this is how Qwik enables resumability
2. **Use `$` suffix on event handlers** - allows Qwik to serialize and optimize
3. **Check contexts before using** - ensure CartProvider/ToastProvider wrap the component
4. **Save to localStorage** after cart changes - handled by CartContext
5. **Mock data first** - mockProducts.ts has examples; replace with real API later
6. **Responsive design** - use Tailwind's `md:` breakpoints (mobile first)
7. **Images go in `/public`** - automatically optimized during build
8. **Type everything** - strict TypeScript mode is enforced
9. **Test on mobile** - many components have mobile-specific implementations
10. **Check dark mode** - Tailwind config supports extending for dark mode

---

**Document Version:** 1.1  
**Last Updated:** February 9, 2026 (18:00 UTC)
**Session:** Expanded mock products (4→16) + dynamic homepage sync + AI context docs  
**Next Update:** After Step 5.3 (Server-side data fetching) or major feature additions
