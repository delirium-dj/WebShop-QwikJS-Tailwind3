# Project Map

## Core Structure

- **src/root.tsx**: The root component that initializes the app and provides context.
- **src/entry.ssr.tsx**: Server-side rendering entry point.
- **src/entry.dev.tsx / src/entry.preview.tsx**: Development and preview entry points.
- **src/global.css**: Global styles including Tailwind imports.

## Routes (Qwik City)

- **src/routes/index.tsx**: The Home page route.
- **src/routes/product/[id]/index.tsx**: Dynamic route for single product details.

## Components

- **src/components/Hero.tsx**: A reusable Hero section.
- **src/components/home/**: Components used mainly on the homepage.
  - `FeaturedProducts.tsx`: Displays a list of featured products.
- **src/components/product/**: Product-related components.
  - `ProductCard.tsx`: Individual product display card.
- **src/components/router-head/**: Manages the `<head>` metadata for routes.
