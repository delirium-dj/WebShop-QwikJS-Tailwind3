# How to Use Image Optimization - Practical Guide

## 🎯 For Junior Developers: Understanding Image Optimization

Once you've installed and configured Vite Image Tools, here's how to use it in your project.

---

## 📸 How It Works

### The Simple Explanation

**Before optimization:**
```
You have: product.jpg (3MB)
Users download: product.jpg (3MB) ⏱️ 6 seconds
```

**After optimization:**
```
You have: product.jpg (3MB) in your source folder
Vite creates during build:
  ├── product.jpg (500KB) - compressed original
  ├── product.webp (400KB) - modern format
  └── product.avif (300KB) - newest format

Users download: product.avif (300KB) ⏱️ 0.6 seconds
10x faster! 🚀
```

---

## 🗂️ Folder Structure for Images

### Recommended Structure

```
public/
├── images/
│   ├── products/          # Product photos
│   │   ├── product-1.jpg
│   │   ├── product-2.jpg
│   │   └── product-3.jpg
│   ├── banners/           # Hero images, banners
│   │   └── hero.jpg
│   ├── icons/             # SVG icons
│   │   └── logo.svg
│   └── thumbnails/        # Small images
│       └── thumb-1.jpg
```

### Why Use `public/` Folder?

The `public` folder is special:
- ✅ Files are copied directly to the build output
- ✅ Can be referenced by absolute paths (`/images/product.jpg`)
- ✅ Images here are automatically optimized by Vite Image Tools
- ✅ No import needed

---

## 🖼️ Using Images in Your Components

### Method 1: Direct Path (Recommended for Most Cases)

```tsx
// In your ProductCard component
export const ProductCard = component$(() => {
  return (
    <div>
      {/* 
        This image will be automatically optimized!
        Vite creates product-1.webp and product-1.avif during build
      */}
      <img 
        src="/images/products/product-1.jpg"
        alt="Product Name"
        width={400}
        height={400}
      />
    </div>
  );
});
```

**What happens:**
1. During development: Image loads as-is
2. During build: Vite optimizes it
3. In production: Browser gets the smallest format it supports

### Method 2: Using Picture Element (Best Performance)

```tsx
export const ProductCard = component$(() => {
  return (
    <picture>
      {/* 
        AVIF version - smallest file, newest browsers
        If browser supports AVIF, it uses this
      */}
      <source 
        srcset="/images/products/product-1.avif" 
        type="image/avif" 
      />
      
      {/* 
        WebP version - medium file size, most modern browsers
        If browser doesn't support AVIF but supports WebP, uses this
      */}
      <source 
        srcset="/images/products/product-1.webp" 
        type="image/webp" 
      />
      
      {/* 
        JPEG version - fallback for old browsers
        If browser supports neither AVIF nor WebP, uses this
      */}
      <img 
        src="/images/products/product-1.jpg"
        alt="Product Name"
        width={400}
        height={400}
        loading="lazy"
      />
    </picture>
  );
});
```

**Browser Support:**
- Chrome/Edge: Uses AVIF (smallest)
- Firefox: Uses AVIF (smallest)
- Safari: Uses WebP (medium)
- Old browsers: Uses JPEG (largest)

### Method 3: Responsive Images (Different Sizes)

```tsx
export const ProductCard = component$(() => {
  return (
    <img
      {/* 
        Browser picks the right size based on screen width
        - Small phones: 400px version
        - Tablets: 800px version
        - Desktop: 1200px version
      */}
      srcset="
        /images/products/product-1-400w.jpg 400w,
        /images/products/product-1-800w.jpg 800w,
        /images/products/product-1-1200w.jpg 1200w
      "
      sizes="
        (max-width: 640px) 400px,
        (max-width: 1024px) 800px,
        1200px
      "
      src="/images/products/product-1.jpg"
      alt="Product Name"
      loading="lazy"
    />
  );
});
```

---

## 🎨 Best Practices

### 1. Use Descriptive Filenames

**Good:**
```
product-nike-air-max-90-red.jpg
hero-summer-sale-2024.jpg
icon-shopping-cart.svg
```

**Bad:**
```
IMG_1234.jpg
photo.jpg
image1.jpg
```

### 2. Add Loading Attribute

```tsx
{/* Lazy load images below the fold (not visible on page load) */}
<img src="/images/product.jpg" loading="lazy" alt="Product" />

{/* Eagerly load images above the fold (visible immediately) */}
<img src="/images/hero.jpg" loading="eager" alt="Hero" />
```

**When to use:**
- `loading="eager"` - Hero images, logos (top of page)
- `loading="lazy"` - Product grids, footer images (below fold)

### 3. Always Include Alt Text

```tsx
{/* Good - descriptive alt text */}
<img src="/product.jpg" alt="Nike Air Max 90 in Red, Size 10" />

{/* Bad - missing or generic alt text */}
<img src="/product.jpg" alt="product" />
<img src="/product.jpg" alt="" />
```

**Why?**
- Accessibility (screen readers)
- SEO (search engines)
- Shows text if image fails to load

### 4. Specify Width and Height

```tsx
{/* Good - prevents layout shift */}
<img 
  src="/product.jpg" 
  width={400} 
  height={400} 
  alt="Product"
/>

{/* Bad - page jumps when image loads */}
<img src="/product.jpg" alt="Product" />
```

**Why?**
Browser reserves space, preventing content from jumping around

---

## 🧪 Testing Your Optimization

### Step 1: Build Your Project

```bash
# Run the production build
pnpm build
```

### Step 2: Check the Output

Look in the `dist` folder:

```
dist/
├── images/
│   ├── products/
│   │   ├── product-1.jpg      (500KB - compressed original)
│   │   ├── product-1.webp     (400KB - created by Vite)
│   │   └── product-1.avif     (300KB - created by Vite)
```

### Step 3: Compare Sizes

**Before optimization:**
```bash
ls -lh public/images/products/
# product-1.jpg → 3.0MB
```

**After optimization:**
```bash
ls -lh dist/images/products/
# product-1.jpg → 500KB   (83% smaller!)
# product-1.webp → 400KB  (87% smaller!)
# product-1.avif → 300KB  (90% smaller!)
```

### Step 4: Test in Browser

```bash
# Preview the built site
pnpm preview
```

Open DevTools (F12) → Network tab:
- See which format browser downloads
- Check file sizes
- Measure load times

---

## 📊 Expected Results

### File Size Reductions

| Format | Original Size | Optimized Size | Reduction |
|--------|--------------|----------------|-----------|
| JPEG   | 3.0 MB       | 500 KB         | 83%       |
| PNG    | 2.5 MB       | 400 KB         | 84%       |
| WebP   | -            | 400 KB         | 87%       |
| AVIF   | -            | 300 KB         | 90%       |
| SVG    | 50 KB        | 20 KB          | 60%       |

### Load Time Improvements

| Connection | Before | After | Improvement |
|------------|--------|-------|-------------|
| 4G         | 6s     | 0.6s  | 10x faster  |
| 3G         | 15s    | 1.5s  | 10x faster  |
| Slow 3G    | 30s    | 3s    | 10x faster  |

---

## 🐛 Common Issues

### Issue: Images Not Optimizing

**Check:**
1. Did you run `pnpm build`? (Not just dev server)
2. Are images in the `public/` folder?
3. Is the vite.config.ts correctly configured?

### Issue: Build Fails with Sharp Error

**Solution:**
```bash
# Remove and reinstall sharp
pnpm remove sharp
pnpm add -D sharp

# Clear cache
rm -rf node_modules/.vite-image-optimizer
pnpm build
```

### Issue: AVIF Not Working

Some browsers don't support AVIF yet:
- ✅ Chrome 85+
- ✅ Firefox 93+
- ✅ Edge 85+
- ❌ Safari (partial support)

**Solution:** Always provide fallbacks (WebP, JPEG)

---

## 💡 Pro Tips

### 1. Optimize Original Images First

Before adding to project:
- Crop to final aspect ratio
- Remove unnecessary elements
- Use appropriate format (JPEG for photos, PNG for transparency)

### 2. Use Correct Formats

| Use Case | Recommended Format |
|----------|-------------------|
| Product photos | JPEG → WebP → AVIF |
| Logos with transparency | PNG → WebP |
| Icons | SVG (when possible) |
| Screenshots | PNG → WebP |

### 3. Monitor Bundle Size

```bash
# Check bundle size after build
pnpm build

# Look for: "dist size"
# Images should be <50KB each ideally
```

---

## ✅ Checklist

Before deploying:

- [ ] All images in `public/images/` folder
- [ ] Descriptive filenames
- [ ] Alt text on all images
- [ ] Width/height specified
- [ ] Lazy loading for below-fold images
- [ ] Built project successfully
- [ ] Verified optimization in `dist/` folder
- [ ] Tested in browser
- [ ] Checked file sizes
- [ ] Measured page load time

---

**🎉 You're Done!**

Your images are now optimized and your site will load much faster!
