# ReconShop - Modern eCommerce with QwikJS

ReconShop is a high-performance, SEO-optimized eCommerce platform built using **QwikJS** and **Tailwind CSS**. It leverages the unique "Resumability" feature of Qwik to deliver near-instant loading times and excellent Core Web Vitals.

## 🚀 Key Features

- **Server-Side Rendering (SSR)**: Full SEO-first approach using Qwik City's `routeLoader$`.
- **Dynamic Data Source**: Powered by the **FakeStore API** for a realistic catalog experience.
- **User Authentication**: Full-featured system using **Supabase Auth** featuring:
  - Email & Password registration/login.
  - **Google OAuth** integration.
  - **Account Management**: Profile editing (name, phone) and password resets.
  - **Protected Routes**: Secure `/account` area via `AuthGuard`.
- **Shopping Cart System**: Complex global state managed with Qwik Context and `useStore$`, featuring:
  - LocalStorage persistence.
  - Variant support (size/color).
  - Optimistic UI updates.
- **Reactive Filtering & Sorting**: Instant, client-side dynamic grid updates with URL parameter synchronization.
- **Image Optimization**: Professional-grade optimization (AVIF/WebP) using `vite-plugin-image-optimizer`.
- **Mobile UX**: High-performance animated hamburger menu, user profile menu, and slide-in cart drawer.

## 🛠️ Tech Stack

- **Framework**: [QwikJS](https://qwik.dev/) & [Qwik City](https://qwik.dev/docs/qwikcity/)
- **Backend / Auth**: [Supabase](https://supabase.com/)
- **Language**: TypeScript
- **Styling**: Tailwind CSS3
- **State Management**: Context API + `useStore$`
- **Deployment**: Netlify Edge Functions

## 📂 Project Structure

- `src/routes/`: File-based routing (Home, Shop, Auth, Account, Cart).
- `src/components/`: Modular UI components (Auth, Product, UI, Cart, Home).
- `src/services/api/`: Centralized API layer for interacting with external APIs.
- `src/contexts/`: Global state providers (Auth, Cart, Toast).
- `src/lib/`: Library initializations (Supabase client).
- `src/utils/`: Shared helper functions (Image optimization, Product mapping).

## 🚦 Getting Started

### Prerequisites

- `node.js` >= 18.x
- `pnpm` >= 10.x

### Installation & Environment

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Create a `.env.local` file in the root directory and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
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
