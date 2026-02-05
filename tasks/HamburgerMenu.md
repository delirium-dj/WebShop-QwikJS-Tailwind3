# Step 0: Hamburger Menu - Implementation Guide

## 🎯 Overview

Two complete hamburger menu implementations that maintain your current header style while adding mobile functionality:

1. **Slide-in Drawer** (Recommended) - Menu slides from right
2. **Dropdown Menu** - Menu drops from top

Both include:
- Smooth animations
- Accessible markup
- Proper Qwik integration
- Mobile-responsive design
- No body scroll when open (drawer version)

---

## 📦 Files Created

### Option 1: Slide-in Drawer Menu (Recommended)
```
src/components/header/
├── Header.tsx              # Main header with slide-in menu
└── MobileMenu.tsx          # Slide-in drawer component
```

### Option 2: Dropdown Menu
```
src/components/header/
├── HeaderWithDropdown.tsx  # Main header with dropdown
└── MobileMenuDropdown.tsx  # Dropdown menu component
```

---

## 🚀 Installation - Choose One

### Option 1: Slide-in Drawer (Recommended)

**Step 1:** Create directory
```bash
mkdir -p src/components/header
```

**Step 2:** Copy files
- Copy `MobileMenu.tsx` to `src/components/header/MobileMenu.tsx`
- Copy `Header.tsx` to `src/components/header/Header.tsx`

**Step 3:** Update your layout
Replace your existing header import in `src/routes/layout.tsx`:

```tsx
import { Header } from '~/components/header/Header';

export default component$(() => {
  return (
    <>
      <Header />
      <main>
        <Slot />
      </main>
    </>
  );
});
```

---

### Option 2: Dropdown Menu

**Step 1:** Create directory
```bash
mkdir -p src/components/header
```

**Step 2:** Copy files
- Copy `MobileMenuDropdown.tsx` to `src/components/header/MobileMenuDropdown.tsx`
- Copy `HeaderWithDropdown.tsx` to `src/components/header/HeaderWithDropdown.tsx`

**Step 3:** Update your layout
```tsx
import { HeaderWithDropdown } from '~/components/header/HeaderWithDropdown';

export default component$(() => {
  return (
    <>
      <HeaderWithDropdown />
      <main>
        <Slot />
      </main>
    </>
  );
});
```

---

## ✨ Features

### Hamburger Menu Features
✅ **Animated icon** - Transforms into X when open  
✅ **Smooth transitions** - 300ms ease-in-out  
✅ **Mobile responsive** - Only shows on screens < 1024px  
✅ **Keyboard accessible** - Proper ARIA labels  
✅ **Auto-close on navigation** - Closes when link clicked  

### Slide-in Drawer Specific
✅ **Body scroll lock** - Prevents background scrolling  
✅ **Backdrop overlay** - Darkens background  
✅ **Slides from right** - 320px width  
✅ **Menu footer** - Quick access to cart  

### Dropdown Menu Specific
✅ **Drops from header** - Smooth height transition  
✅ **Lighter overlay** - More subtle backdrop  
✅ **Full width** - Uses entire screen width  
✅ **Compact design** - Takes less vertical space  

---

## 🎨 Customization

### Change Navigation Links

Edit the `navLinks` array in your Header component:

```tsx
const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'Products', href: '/products' },  // Add new
  { label: 'About', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];
```

### Change Menu Width (Slide-in only)

In `MobileMenu.tsx`, change `w-80` (320px):

```tsx
// Narrow menu (256px)
class="... w-64 ..."

// Wider menu (384px)
class="... w-96 ..."

// Full screen
class="... w-full ..."
```

### Change Animation Speed

Update `duration-300` to:
- `duration-150` - Faster (150ms)
- `duration-500` - Slower (500ms)

### Change Menu Side (Slide-in only)

To slide from left instead of right:

```tsx
// In MobileMenu.tsx, change:
class="... right-0 ... translate-x-full"  // Right side
// To:
class="... left-0 ... -translate-x-full"  // Left side
```

### Add Logo to Mobile Menu

In `MobileMenu.tsx`, add to menu header:

```tsx
<div class="flex items-center justify-between p-6 border-b">
  <div class="flex items-center gap-2">
    <img src="/logo.png" alt="Logo" class="h-8 w-8" />
    <h2 class="text-xl font-bold">ReconShop</h2>
  </div>
  <button onClick$={closeMenu}>...</button>
</div>
```

### Add User Account Section

Add before menu footer:

```tsx
<div class="px-6 py-4 border-t border-gray-200">
  <Link
    href="/account"
    onClick$={closeMenu}
    class="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 rounded-md"
  >
    <svg class="w-5 h-5" ...>...</svg>
    <span>My Account</span>
  </Link>
</div>
```

### Style the Active Link

Add active state to navigation links:

```tsx
// In MobileMenu.tsx or MobileMenuDropdown.tsx
{links.map((link) => {
  const isActive = window.location.pathname === link.href;
  
  return (
    <Link
      href={link.href}
      class={`block px-4 py-3 rounded-md font-medium ${
        isActive
          ? 'bg-black text-white'  // Active style
          : 'text-gray-700 hover:bg-gray-100 hover:text-black'
      }`}
    >
      {link.label}
    </Link>
  );
})}
```

---

## 🔧 Integration with Cart Badge

When you implement the cart (Step 2), update the cart icon:

```tsx
// In Header.tsx
import { useCart } from '~/contexts/cart';

export const Header = component$(() => {
  const cart = useCart();  // Add this
  
  return (
    // ... in cart icon section
    <Link href="/cart" class="... relative">
      <svg>...</svg>
      {cart.state.totalItems > 0 && (
        <span class="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center">
          {cart.state.totalItems}
        </span>
      )}
    </Link>
  );
});
```

---

## 📱 Responsive Breakpoints

The menu visibility is controlled by Tailwind's `lg:` breakpoint:

- **Mobile** (< 1024px): Hamburger menu visible
- **Desktop** (≥ 1024px): Full navigation visible

To change the breakpoint, replace `lg:` with:
- `md:` for 768px breakpoint
- `xl:` for 1280px breakpoint
- `2xl:` for 1536px breakpoint

Example:
```tsx
// Show desktop nav at 768px instead of 1024px
<nav class="hidden md:flex ...">  // Change lg: to md:
<button class="md:hidden ...">    // Change lg: to md:
```

---

## 🎯 Testing Checklist

- [ ] Hamburger icon appears on mobile (< 1024px)
- [ ] Hamburger icon hidden on desktop (≥ 1024px)
- [ ] Icon animates to X when menu opens
- [ ] Menu slides in smoothly
- [ ] All navigation links work
- [ ] Clicking link closes menu
- [ ] Clicking overlay closes menu
- [ ] Close button (X) works
- [ ] No horizontal scroll when menu open
- [ ] Body scroll locked (slide-in version)
- [ ] Menu accessible via keyboard
- [ ] Touch gestures work on mobile

---

## 🐛 Troubleshooting

### Issue: Menu doesn't close when clicking link
**Solution:** Ensure `onClick$={closeMenu}` is on each `<Link>` component.

### Issue: Body still scrolls behind menu
**Solution:** Check that body overflow is being set correctly in the `toggleMenu` function.

### Issue: Menu appears on desktop
**Solution:** Verify `lg:hidden` class is on the mobile menu wrapper.

### Issue: Hamburger icon doesn't animate
**Solution:** Ensure Tailwind classes for rotation/translation are being applied conditionally based on `isOpen.value`.

### Issue: Menu is cut off on small screens
**Solution:** For slide-in menu, reduce width from `w-80` to `w-64` or `w-72`.

### Issue: TypeScript errors
**Solution:** Ensure NavLink type is defined and imported correctly.

---

## 🎨 Styling Tips

### Match Your Brand Colors

Replace black with your brand color:

```tsx
// Black buttons
class="bg-black text-white hover:bg-gray-800"

// To your brand color (e.g., blue)
class="bg-blue-600 text-white hover:bg-blue-700"
```

### Add Icons to Menu Items

```tsx
{links.map((link) => (
  <Link href={link.href}>
    <div class="flex items-center gap-3">
      {link.icon && <span class="w-5 h-5">{link.icon}</span>}
      <span>{link.label}</span>
    </div>
  </Link>
))}
```

### Rounded Corners

Change menu border radius:

```tsx
// More rounded
class="... rounded-2xl"

// No rounding (for slide-in from edge)
class="... rounded-l-2xl"  // Only left side rounded
```

---

## 📚 Comparison: Drawer vs Dropdown

| Feature | Slide-in Drawer | Dropdown |
|---------|----------------|----------|
| **Animation** | Slide from side | Expand from top |
| **Overlay** | Dark (50% opacity) | Light (30% opacity) |
| **Body Scroll** | Locked | Allowed |
| **Space Usage** | Fixed width | Full width |
| **Best For** | Detailed menus | Simple navigation |
| **Mobile UX** | Modern app-like | Traditional web |

---

## 🚀 What's Next

After implementing the hamburger menu:

1. **Test on real devices** - iOS and Android
2. **Test different screen sizes** - Tablets, small phones
3. **Add search functionality** - Mobile search bar
4. **Integrate cart badge** - When Step 2 is complete
5. **Add user account menu** - Profile, orders, settings

---

## 📝 Code Quality Notes

### Accessibility
✅ Proper ARIA labels (`aria-label`, `aria-expanded`)  
✅ Semantic HTML (`<nav>`, `<button>`)  
✅ Keyboard navigation support  
✅ Focus management  

### Performance
✅ No unnecessary re-renders  
✅ Optimized animations (GPU-accelerated)  
✅ Conditional rendering  
✅ Signal-based state management  

### Best Practices
✅ TypeScript types  
✅ Qwik's `$` functions for event handlers  
✅ Component composition  
✅ Responsive design first  

---

**✅ Step 0 Complete!**

Your header now has a fully functional hamburger menu that:
- Works seamlessly on mobile
- Maintains your current style
- Provides smooth user experience
- Is production-ready

Ready to continue with the cart implementation! 🎉
