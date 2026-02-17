/**
 * IMAGETOOLS TYPE DECLARATIONS
 *
 * This file tells TypeScript the shape of objects returned by vite-imagetools
 * when we use the `?as=picture` query string on image imports.
 *
 * WHY THIS IS NEEDED:
 * When we write: import Img from 'photo.jpg?as=picture&w=480...'
 * TypeScript has no idea what that import returns — it's not a normal
 * module. Without these declarations, you get TS2307 "Cannot find module."
 *
 * HOW IT WORKS:
 * TypeScript ambient `declare module` supports exactly ONE wildcard (*).
 * The `*` matches any prefix, and the rest of the pattern is a literal suffix.
 *
 *   "*.jpg?as=picture&w=480;720&quality=80"
 *    ^                                     ^
 *    wildcard matches the path before .jpg  literal suffix must match exactly
 *
 * IMPORTANT GOTCHA:
 * TypeScript does NOT support two wildcards (e.g., "*.jpg?*" is INVALID).
 * And "*.jpg" alone only matches strings ending in ".jpg" — NOT our imports
 * which end with query parameters like "&placeholder=blur".
 *
 * So we declare one pattern PER unique query-string suffix used in the project.
 * Each pattern's `*` absorbs everything up to and including the filename,
 * and the literal suffix matches the exact query parameters.
 */

// ── Shared interface for the picture object vite-imagetools returns ──
// sources: { avif: "srcset-string", webp: "srcset-string", ... }
// img:     { src: "/optimized/image.jpg", w: 1920, h: 1080 }
interface ImageToolsPicture {
  sources: Record<string, string>;
  img: {
    src: string;
    w: number;
    h: number;
  };
}

// ─── Pattern 1: Hero slides ────────────────────────────────────────
// Used in: src/components/Hero.tsx (slide1–4)
// Query:   ?as=picture&w=480;720;1080;1920&format=avif;webp;jpg&quality=80&placeholder=blur
declare module "*.jpg?as=picture&w=480;720;1080;1920&format=avif;webp;jpg&quality=80&placeholder=blur" {
  const value: ImageToolsPicture;
  export default value;
}

// ─── Pattern 2: Category images ────────────────────────────────────
// Used in: src/components/home/Categories.tsx
// Query:   ?as=picture&w=512;640;720&format=avif;webp;jpg&quality=85&placeholder=blur
declare module "*.jpg?as=picture&w=512;640;720&format=avif;webp;jpg&quality=85&placeholder=blur" {
  const value: ImageToolsPicture;
  export default value;
}

// ─── Pattern 3: Blog post images ───────────────────────────────────
// Used in: src/routes/blog/index.tsx
// Query:   ?as=picture&w=400;800&format=avif;webp;jpg&quality=80
declare module "*.jpg?as=picture&w=400;800&format=avif;webp;jpg&quality=80" {
  const value: ImageToolsPicture;
  export default value;
}

// ─── Plain image imports (no query string) ─────────────────────────
// Covers standard imports like: import logo from './logo.png'
declare module "*.jpg" {
  const src: string;
  export default src;
}

declare module "*.jpeg" {
  const src: string;
  export default src;
}

declare module "*.png" {
  const src: string;
  export default src;
}

declare module "*.webp" {
  const src: string;
  export default src;
}

declare module "*.avif" {
  const src: string;
  export default src;
}

declare module "*.gif" {
  const src: string;
  export default src;
}

declare module "*.svg" {
  const src: string;
  export default src;
}