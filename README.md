# ReconShop - Modern eCommerce with QwikJS

ReconShop is a high-performance, SEO-optimized eCommerce platform built using **QwikJS** and **Tailwind CSS**. It leverages the unique "Resumability" feature of Qwik to deliver near-instant loading times and excellent Core Web Vitals.

## 🚀 Key Features

- **Server-Side Rendering (SSR)**: Full SEO-first approach using Qwik City's `routeLoader$`.
- **Dynamic Data Source**: Powered by the **FakeStore API** for a realistic catalog experience.
- **Resumable Components**: Zero hydration overhead for a faster user experience.
- **Responsive Design**: Fully mobile-first UI using Tailwind CSS 3.4.
- **Shopping Cart System**: Complex global state managed with Qwik Context and `useStore$`, featuring:
  - LocalStorage persistence.
  - Variant support (size/color).
  - Optimistic UI updates.
- **Image Optimization**: Professional-grade optimization (AVIF/WebP) using `vite-plugin-image-optimizer`.
- **Toast Notifications**: Custom notification system for user actions.
- **Mobile UX**: High-performance animated hamburger menu and slide-in cart drawer.

## 🛠️ Tech Stack

- **Framework**: [QwikJS](https://qwik.dev/) & [Qwik City](https://qwik.dev/docs/qwikcity/)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Context API + `useStore$`
- **Animations**: CSS Transitions & Lucide-like SVG icons
- **Deployment**: Netlify Edge Functions

## 📂 Project Structure

- `src/routes/`: File-based routing (Home, Shop, Product Detail, Cart).
- `src/components/`: Modular UI components (UI, Product, Cart, Home).
- `src/services/api/`: Centralized API layer for interacting with FakeStore API.
- `src/contexts/`: Global state providers (Cart, Toast).
- `src/utils/`: Shared helper functions (Image optimization, Product mapping).
- `src/data/`: Legacy mock data and local testing utilities.

## 🚦 Getting Started

### Prerequisites

- `node.js` >= 18.x
- `pnpm` >= 10.x

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm run dev
```

### Production Build & Preview

```bash
# Build for production
pnpm build

# Preview locally using Netlify CLI
pnpm serve
```

## 🤖 AI Development

This project is optimized for AI-assisted development. Detailed context, rule sets, and architecture guides for AI agents can be found in the `AI Dev` directory.

---

_ReconShop - Reconstructing the web, one component at a time._
