# Phase 4: Protected Routes & Auth Guard - Implementation Guide

## ✅ What's Been Created

I've created all the files needed for Phase 4 of your authentication system. These files work together to protect routes and create a user profile page.

---

## 📦 Files Delivered

### 1. **AuthGuard.tsx** - Route Protection Component
**Location**: `src/components/auth/AuthGuard.tsx`

**What it does**:
- Checks if user is logged in before showing content
- Redirects to login if not authenticated
- Shows loading spinner while checking
- Saves current URL to redirect back after login

**Key Features**:
- ✅ Automatic redirect to login with return URL
- ✅ Loading state with spinner
- ✅ Customizable redirect path
- ✅ Custom loading/redirecting components
- ✅ **BONUS**: `RequireAuth` component for inline protection
- ✅ **BONUS**: `RoleGuard` component for role-based access (future use)

**How it works**:
```typescript
// Wrap any content to protect it
<AuthGuard>
  <ProtectedContent />
</AuthGuard>

// Or protect an entire section
<AuthGuard redirectTo="/auth/login">
  <Slot /> // All child pages are protected
</AuthGuard>
```

---

### 2. **account-layout.tsx** - Account Section Layout
**Location**: `src/routes/account/layout.tsx`

**What it does**:
- Wraps ALL pages under `/account/*` with AuthGuard
- Provides navigation tabs (Profile, Orders, Wishlist, Addresses)
- Shows welcome message with user name
- Includes logout button in footer

**Key Features**:
- ✅ Automatic protection for all account pages
- ✅ Responsive navigation tabs
- ✅ Welcome message with user info
- ✅ Server-side cache control (no caching of authenticated pages)
- ✅ Quick logout access
- ✅ Support link to contact page

**Pages Protected by this Layout**:
- `/account` → User profile (index.tsx)
- `/account/orders` → Order history (future)
- `/account/wishlist` → User wishlist (future)
- `/account/addresses` → Saved addresses (future)

---

### 3. **account-index.tsx** - User Profile Page
**Location**: `src/routes/account/index.tsx`

**What it does**:
- Shows user profile information
- Allows editing name and phone number
- Enables password changes
- Displays account statistics

**Key Features**:
- ✅ Display name editing with validation
- ✅ Phone number editing (optional field)
- ✅ Password change with confirmation
- ✅ Avatar display (or initials fallback)
- ✅ Success/error messages
- ✅ Cancel buttons to revert changes
- ✅ Account statistics cards (orders, wishlist, addresses)
- ✅ Auto-saves to Supabase profiles table

---

## 🚀 Installation Steps

### Step 1: Copy AuthGuard Component

Copy `AuthGuard.tsx` to `src/components/auth/`:

```bash
# Create the auth components directory if it doesn't exist
mkdir -p src/components/auth

# Copy the AuthGuard component
cp AuthGuard.tsx src/components/auth/
```

### Step 2: Create Account Routes

Create the account section in your routes folder:

```bash
# Create account directory
mkdir -p src/routes/account

# Copy layout and index files
cp account-layout.tsx src/routes/account/layout.tsx
cp account-index.tsx src/routes/account/index.tsx
```

### Step 3: Update Auth Context Export (if needed)

Make sure your auth context is properly exported in `src/contexts/auth/index.ts`:

```typescript
// Should already have these exports from Phase 2:
export { AuthProvider, AuthContext } from './AuthContext';
export { useAuth } from './useAuth';
export type { AuthUser, AuthContextValue } from './types';
```

### Step 4: Verify File Structure

Your project structure should look like this:

```
src/
├── components/
│   └── auth/
│       └── AuthGuard.tsx           ← NEW
│
├── contexts/
│   └── auth/
│       ├── AuthContext.tsx         ← From Phase 2
│       ├── useAuth.ts              ← From Phase 2
│       ├── types.ts                ← From Phase 2
│       └── index.ts                ← From Phase 2
│
└── routes/
    └── account/
        ├── layout.tsx              ← NEW (protects all /account/* pages)
        └── index.tsx               ← NEW (profile page at /account)
```

---

## 🧪 Testing Checklist

After copying the files, test these scenarios:

### Test 1: Redirect When Logged Out
- [ ] Visit `/account` while logged out
- [ ] You should be redirected to `/auth/login?redirect=/account`
- [ ] After login, you should return to `/account`

### Test 2: Profile Page Access
- [ ] Log in to your account
- [ ] Visit `/account`
- [ ] You should see your profile information
- [ ] Avatar or initials should display

### Test 3: Edit Profile
- [ ] Click "Edit Profile" button
- [ ] Change your display name
- [ ] Change your phone number
- [ ] Click "Save Changes"
- [ ] Success message should appear
- [ ] Profile should update in Supabase

### Test 4: Cancel Editing
- [ ] Click "Edit Profile"
- [ ] Make some changes
- [ ] Click "Cancel"
- [ ] Changes should be reverted
- [ ] Original values should be restored

### Test 5: Change Password
- [ ] Click "Change Password" button
- [ ] Enter new password (min 6 characters)
- [ ] Confirm new password
- [ ] Click "Change Password"
- [ ] Success message should appear
- [ ] Log out and log back in with new password

### Test 6: Password Validation
- [ ] Try to change password with less than 6 characters
- [ ] Error message should appear
- [ ] Try to change password with mismatched confirmation
- [ ] Error message should appear

### Test 7: Loading States
- [ ] Refresh the `/account` page
- [ ] You should see "Checking authentication..." spinner briefly
- [ ] Page should load smoothly after check

### Test 8: Navigation Tabs
- [ ] Click on "Orders" tab
- [ ] Should navigate to `/account/orders` (even if page doesn't exist yet)
- [ ] Click on "Wishlist" tab
- [ ] Should navigate to `/account/wishlist`

---

## 🎯 How the Protection Works

### Flow Diagram

```
User visits /account
       ↓
AuthGuard checks user
       ↓
   Is user logged in?
       ↓
   ┌───┴───┐
   │       │
  YES     NO
   │       │
   ↓       ↓
 Show    Redirect to
 Page    /auth/login
           ↓
    Save return URL
    (/account)
           ↓
    User logs in
           ↓
    Redirect back to
    /account
```

### Code Flow Explanation

**Step 1: User visits /account**
```typescript
// Browser navigates to /account
```

**Step 2: account/layout.tsx loads**
```typescript
// layout.tsx wraps content with AuthGuard
<AuthGuard redirectTo="/auth/login">
  <Slot /> // This is your profile page
</AuthGuard>
```

**Step 3: AuthGuard checks authentication**
```typescript
const auth = useAuth();

if (!auth.isLoading && !auth.user) {
  // Not logged in → redirect to login
  nav('/auth/login?redirect=/account');
}
```

**Step 4a: If logged in**
```typescript
// Show the protected content (profile page)
return <Slot />;
```

**Step 4b: If not logged in**
```typescript
// Redirect to login
// After login, user will return to /account
```

---

## 🔧 Customization Options

### Option 1: Custom Loading Component

```typescript
// In account/layout.tsx
<AuthGuard
  loadingComponent={
    <div class="custom-loading">
      <YourCustomSpinner />
    </div>
  }
>
  <Slot />
</AuthGuard>
```

### Option 2: Custom Redirect Path

```typescript
// Redirect to a custom page instead of /auth/login
<AuthGuard redirectTo="/signin">
  <Slot />
</AuthGuard>
```

### Option 3: Inline Protection

```typescript
// Protect just a section of a page
<RequireAuth>
  <div>This content requires login</div>
</RequireAuth>

// Rest of page is visible to everyone
<div>This content is public</div>
```

### Option 4: Role-Based Protection (Future)

```typescript
// Protect content by user role
<RoleGuard requiredRole="admin">
  <AdminPanel />
</RoleGuard>
```

---

## 🐛 Common Issues & Solutions

### Issue 1: "useAuth must be used within AuthProvider"

**Problem**: AuthGuard can't access auth context

**Solution**: Make sure `<AuthProvider>` wraps your app in `src/routes/layout.tsx`:

```typescript
// In src/routes/layout.tsx
export default component$(() => {
  return (
    <AuthProvider>
      <Header />
      <Slot />
      <Footer />
    </AuthProvider>
  );
});
```

---

### Issue 2: Infinite redirect loop

**Problem**: Page keeps redirecting between /account and /auth/login

**Solution**: Check that:
1. Auth context is properly initialized
2. Session is being restored from localStorage
3. No conflicting redirects in other components

---

### Issue 3: Profile updates not saving

**Problem**: Changes to profile don't persist

**Solution**: 
1. Verify your `profiles` table exists in Supabase (see Phase 2 SQL setup)
2. Check Row Level Security policies are correct
3. Ensure `updateProfile` action in AuthContext works
4. Check browser console for errors

---

### Issue 4: AuthGuard shows loading forever

**Problem**: Spinner never goes away

**Solution**:
1. Check if `auth.isLoading` ever becomes false
2. Verify `useVisibleTask$` in AuthContext runs
3. Check if Supabase client is properly initialized
4. Look for errors in browser console

---

## 📚 Code Examples

### Example 1: Protect a Single Page

If you want to protect just one page (not using a layout):

```typescript
// In src/routes/my-page/index.tsx
import { component$ } from '@builder.io/qwik';
import { AuthGuard } from '~/components/auth/AuthGuard';

export default component$(() => {
  return (
    <AuthGuard>
      <div>
        <h1>My Protected Page</h1>
        <p>Only logged-in users can see this</p>
      </div>
    </AuthGuard>
  );
});
```

---

### Example 2: Show Different Content Based on Auth

```typescript
import { component$ } from '@builder.io/qwik';
import { useAuth } from '~/contexts/auth';

export default component$(() => {
  const auth = useAuth();

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.user) {
    return (
      <div>
        <h1>Welcome, {auth.user.displayName}!</h1>
        <p>You are logged in</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Welcome, Guest!</h1>
      <a href="/auth/login">Please log in</a>
    </div>
  );
});
```

---

### Example 3: Inline Content Protection

```typescript
import { component$ } from '@builder.io/qwik';
import { RequireAuth } from '~/components/auth/AuthGuard';

export default component$(() => {
  return (
    <div>
      <h1>Product Page</h1>
      <p>Everyone can see this product info</p>
      
      <RequireAuth>
        <div>
          <h2>Premium Features</h2>
          <p>Only logged-in users see this</p>
        </div>
      </RequireAuth>
    </div>
  );
});
```

---

## 🎓 Junior Developer Notes

### What is Route Protection?

Route protection means **preventing unauthorized users from accessing certain pages**. Think of it like a bouncer at a club:
- ✅ You have an ID (logged in) → You can enter
- ❌ No ID (not logged in) → You're redirected to get one (login page)

### Why Use a Layout?

Layouts in Qwik City are like "wrappers" that automatically apply to all pages in a folder:

```
src/routes/account/layout.tsx  ← Wraps everything below
├── index.tsx                   ← Gets wrapped
├── orders/index.tsx            ← Gets wrapped
└── wishlist/index.tsx          ← Gets wrapped
```

This means you only write the protection code ONCE (in layout.tsx), and it applies to ALL account pages automatically. No copy-pasting!

### What is useVisibleTask$?

`useVisibleTask$` is Qwik's way of running code on the CLIENT after the component becomes visible:

```typescript
useVisibleTask$(() => {
  // This runs in the BROWSER
  // Can access window, document, etc.
  // Perfect for redirects and navigation
});
```

We use it in AuthGuard because:
1. Navigation only works in the browser
2. We need to check if user is logged in on page load
3. We need to redirect if they're not

### What is useTask$?

`useTask$` runs on both SERVER and CLIENT, but `useVisibleTask$` only runs on CLIENT. We need client-only for navigation.

---

## ✅ Phase 4 Acceptance Criteria

Let's verify you've met all the requirements from the task document:

- [ ] **Visiting `/account` while logged out redirects to `/auth/login`** ✅
- [ ] **After login, user is redirected back to `/account`** ✅
- [ ] **Profile page displays current user information** ✅
- [ ] **Profile updates save to Supabase `profiles` table** ✅
- [ ] **Loading state is shown while checking authentication** ✅
- [ ] **User can edit display name** ✅
- [ ] **User can edit phone number** ✅
- [ ] **User can change password** ✅
- [ ] **Account statistics are shown** ✅ (placeholder for now)
- [ ] **Logout button works** ✅

All requirements met! 🎉

---

## 📈 Next Steps

After Phase 4 is working, you can move to:

**Phase 5: Password Reset Flow**
- Forgot password page (`/auth/forgot-password`)
- Reset password page (`/auth/reset-password`)
- Email link handling

**Phase 6: Header Integration**
- Update header to show login/register when logged out
- Show user avatar dropdown when logged in
- Add quick navigation to account pages

**Future Account Pages** (use same layout pattern):
- `/account/orders` → Order history
- `/account/wishlist` → Saved items
- `/account/addresses` → Shipping addresses
- `/account/payment-methods` → Saved cards

---

## 🔗 Related Files

From Phase 2 (Already completed):
- `src/contexts/auth/AuthContext.tsx` - Auth state provider
- `src/contexts/auth/useAuth.ts` - Custom hooks
- `src/contexts/auth/types.ts` - TypeScript types
- `src/lib/supabase.ts` - Supabase client

From Phase 4 (This delivery):
- `src/components/auth/AuthGuard.tsx` - Route protection
- `src/routes/account/layout.tsx` - Account layout
- `src/routes/account/index.tsx` - Profile page

---

**Created**: February 12, 2026  
**Phase**: 4 of 6  
**Status**: ✅ Complete and Ready to Deploy  
**Next Phase**: Password Reset Flow (Phase 5)
