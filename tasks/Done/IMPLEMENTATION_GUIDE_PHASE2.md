# Auth Context Implementation Guide

## ✅ Phase 2 Complete: Supabase Client & Auth Context

I've created the 4 essential files for your authentication system, all heavily commented for junior developers.

---

## 📦 Deliverables

### 1. **types.ts** - TypeScript Type Definitions
**Location**: `src/contexts/auth/types.ts`

**What it contains**:
- ✅ `AuthUser` - Extended user profile interface
- ✅ `AuthState` - Complete authentication state
- ✅ `LoginCredentials` - Login form data structure
- ✅ `RegisterCredentials` - Registration form data
- ✅ `UpdateProfileData` - Profile update structure
- ✅ `AuthActions` - All available auth functions
- ✅ `AuthContextValue` - Complete context value
- ✅ `OAuthProvider` - Supported social login providers
- ✅ `AuthErrorCode` - Common error codes enum
- ✅ `FormErrors` - Form validation errors

**Key features**:
- Comprehensive JSDoc comments explaining each type
- Examples of how to use each interface
- Explanations of WHY each field exists

---

### 2. **AuthContext.tsx** - Main Context Provider
**Location**: `src/contexts/auth/AuthContext.tsx`

**What it contains**:
- ✅ `AuthContext` - Qwik Context ID
- ✅ `AuthProvider` - Provider component that wraps your app
- ✅ Session initialization on page load
- ✅ Auth state change listener
- ✅ User profile loading from database
- ✅ All auth actions (login, register, logout, etc.)

**Key features**:
- Automatically restores sessions on page load
- Listens for auth changes (login, logout, token refresh)
- Combines Supabase Auth with custom profile data
- Handles errors with friendly messages
- Lazy-loads auth functions with `$()`

**Auth Actions Implemented**:
1. `login()` - Email/password login
2. `register()` - Create new account
3. `loginWithProvider()` - OAuth (Google, GitHub, etc.)
4. `logout()` - Sign out user
5. `updateProfile()` - Update user profile
6. `resetPassword()` - Send password reset email
7. `updatePassword()` - Change password
8. `refreshSession()` - Refresh JWT token
9. `clearError()` - Clear error messages

---

### 3. **useAuth.ts** - Custom Hooks
**Location**: `src/contexts/auth/useAuth.ts`

**What it contains**:
- ✅ `useAuth()` - Main hook to access auth context
- ✅ `useRequireAuth()` - Hook for protected routes
- ✅ `useAuthUser()` - Get just the user object
- ✅ `useIsAuthenticated()` - Boolean auth check

**Key features**:
- Error handling if used outside AuthProvider
- Helper hooks for common use cases
- Clear error messages for developers

---

### 4. **index.ts** - Barrel Exports
**Location**: `src/contexts/auth/index.ts`

**What it contains**:
- ✅ Re-exports all components, hooks, and types
- ✅ Usage examples for common scenarios
- ✅ Documentation for junior developers

**Key features**:
- Clean imports: `import { useAuth } from '~/contexts/auth'`
- 5 complete code examples included
- Explains the barrel export pattern

---

## 🚀 Quick Start Guide

### Step 1: Install Dependencies

```bash
pnpm add @supabase/supabase-js
```

### Step 2: Create Supabase Client

Create `src/lib/supabase.ts`:

```typescript
/**
 * Supabase Client
 * 
 * This is the configured Supabase client that connects to your project.
 */

import { createClient } from '@supabase/supabase-js';

// Get environment variables
// These come from your .env.local file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. ' +
    'Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in .env.local'
  );
}

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Store session in localStorage (persists across page reloads)
    storage: globalThis.localStorage,
    // Auto-refresh tokens before they expire
    autoRefreshToken: true,
    // Persist session across tabs
    persistSession: true,
    // Detect when session expires
    detectSessionInUrl: true,
  },
});
```

### Step 3: Create Environment Variables

Create `.env.local` in your project root:

```env
# Supabase Configuration
# Get these from: https://supabase.com/dashboard → Your Project → Settings → API

# Your Supabase project URL
VITE_SUPABASE_URL=https://your-project-id.supabase.co

# Your Supabase publishable/anonymous key (safe to use in browser)
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Your Supabase secret key (NEVER use in browser code, server-side only)
SUPABASE_SECRET_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**IMPORTANT**: Add `.env.local` to your `.gitignore`!

### Step 4: Copy Auth Files to Your Project

Copy these 4 files to `src/contexts/auth/`:
- `types.ts`
- `AuthContext.tsx`
- `useAuth.ts`
- `index.ts`

### Step 5: Wrap Your App with AuthProvider

Update `src/routes/layout.tsx`:

```typescript
import { component$, Slot } from '@builder.io/qwik';
import { AuthProvider } from '~/contexts/auth';

export default component$(() => {
  return (
    <AuthProvider>
      {/* Your existing layout */}
      <Header />
      <main>
        <Slot />
      </main>
      <Footer />
    </AuthProvider>
  );
});
```

### Step 6: Use Auth in Your Components

```typescript
import { component$ } from '@builder.io/qwik';
import { useAuth } from '~/contexts/auth';

export default component$(() => {
  const auth = useAuth();
  
  if (auth.isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!auth.user) {
    return <div>Please log in</div>;
  }
  
  return (
    <div>
      <h1>Welcome, {auth.user.displayName}!</h1>
      <button onClick$={auth.actions.logout}>Logout</button>
    </div>
  );
});
```

---

## 🗄️ Database Setup

You need to create a `profiles` table in Supabase.

### SQL to Run in Supabase:

Go to Supabase Dashboard → SQL Editor → New Query, and run:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  display_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Policy: Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create a function to automatically create a profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url, created_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to call the function when a user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

---

## 🎯 What Each File Does

### Flow Diagram:

```
Component
   ↓
   calls useAuth()
   ↓
AuthContext.tsx (provides auth state)
   ↓
   uses Supabase Client
   ↓
Supabase Cloud (handles auth)
   ↓
PostgreSQL Database (stores profiles)
```

### Detailed Responsibilities:

**types.ts**:
- Defines what data looks like
- Ensures type safety
- Acts as documentation

**AuthContext.tsx**:
- Manages auth state (user, session, loading, errors)
- Provides auth functions (login, logout, etc.)
- Listens for auth changes
- Combines Supabase Auth with custom profiles

**useAuth.ts**:
- Makes context easy to access
- Provides helpful error messages
- Offers convenience hooks

**index.ts**:
- Simplifies imports
- Centralizes exports
- Provides usage examples

---

## 🧪 Testing Checklist

After setting up, test these:

- [ ] App loads without errors
- [ ] `auth.isLoading` is initially `true`, then becomes `false`
- [ ] `auth.user` is `null` when not logged in
- [ ] Environment variables are loaded correctly
- [ ] Supabase client connects (check Network tab)
- [ ] No TypeScript errors
- [ ] Context is provided to all components

---

## 🐛 Common Issues & Solutions

### Issue 1: "Missing Supabase environment variables"
**Solution**: Create `.env.local` with your Supabase keys

### Issue 2: "useAuth must be used within AuthProvider"
**Solution**: Make sure `<AuthProvider>` wraps your app in `layout.tsx`

### Issue 3: "Cannot read property 'value' of undefined"
**Solution**: Check that you're accessing signals correctly: `auth.user` (not `auth.user.value`)

### Issue 4: TypeScript errors about Signal types
**Solution**: The context provides the `.value` already - don't access it again

### Issue 5: Profile not created on signup
**Solution**: Make sure you ran the database setup SQL

---

## 📚 Next Steps

Now that Phase 2 is complete, you can move on to:

**Phase 3: Login & Register Pages**
- Create `/auth/login` page
- Create `/auth/register` page
- Create social login buttons
- Handle OAuth callback

**Phase 4: Protected Routes**
- Create AuthGuard component
- Protect `/account/*` routes
- Create user profile page

**Phase 5: Password Reset**
- Forgot password page
- Reset password page

**Phase 6: Header Integration**
- Update header with user menu
- Show login/register when logged out
- Show avatar when logged in

---

## 💡 Pro Tips

1. **Always check `auth.isLoading`** before checking `auth.user`
2. **Clear errors** before new form submissions: `auth.actions.clearError()`
3. **Use type annotations** when destructuring: `const { user }: AuthContextValue = useAuth();`
4. **Test in incognito** to simulate new users
5. **Check browser console** for detailed error messages

---

## 🔒 Security Reminders

- ✅ Publishable key (`VITE_*`) is safe in browser code
- ❌ Secret key (`SUPABASE_SECRET_KEY`) never goes to browser
- ✅ `.env.local` is in `.gitignore`
- ✅ Row Level Security (RLS) is enabled on profiles table
- ✅ Passwords are hashed by Supabase (we never see them)

---

**Created**: February 11, 2026  
**Phase**: 2 of 6  
**Status**: ✅ Complete  
**Ready for**: Phase 3 (Login & Register Pages)
