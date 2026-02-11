# TASK: Step 6 — User Authentication System 🔐

## 📖 The Big Picture (For Junior Developers)

Before writing a single line of code, let's answer the most important question:

### "Do we need a database?"

**Short answer: Yes — but we don't have to build or manage one ourselves.**

Here's the thing: our shop currently uses the **FakeStore API** for product data, which is "read-only."
Nobody can register, log in, or save orders to it. So for user accounts, we need our **own backend service**.

But "backend" doesn't mean we need to set up a Linux server and install MySQL.
Instead, we'll use a **Backend-as-a-Service (BaaS)** called **Supabase**.

---

## 🤔 Why Supabase? (The Options We Considered)

| Option            | Pros                                                           | Cons                                              | Verdict        |
| :---------------- | :------------------------------------------------------------- | :------------------------------------------------ | :------------- |
| **Supabase**      | Free tier, built-in Auth, PostgreSQL DB, Social logins, JS SDK | Requires account setup                            | ✅ **CHOSEN**  |
| Firebase Auth     | Google's solution, great for auth only                         | No SQL database (Firestore is NoSQL), vendor lock | ❌ Not ideal   |
| Auth0             | Enterprise-grade, many social providers                        | Complex setup, paid tiers kick in fast            | ❌ Overkill    |
| Netlify Identity  | Built into our hosting                                         | Very limited free tier (5 users!), basic features | ❌ Too limited |
| Custom JWT + JSON | Full control, no third party                                   | We'd have to build everything; security risks     | ❌ Not for us  |

### Why Supabase wins for ReconShop:

1. **Auth + Database in one place** — We get user login AND a PostgreSQL database for future features (orders, wishlists, addresses).
2. **Built-in Social Login** — Google (our must-have) is a checkbox away. Adding GitHub, Microsoft, etc. is trivial.
3. **Free tier is generous** — 50,000 monthly active users, 500MB database, unlimited API requests.
4. **Works with any framework** — Supabase provides a plain JavaScript SDK (`@supabase/supabase-js`), so it works perfectly with Qwik.
5. **Row Level Security (RLS)** — The database can enforce "users can only read their own data" at the SQL level. Very secure.

---

## 🏗️ Architecture Overview

Here's how authentication will flow through our app:

```
┌─────────────────────────────────────────────────────┐
│                    BROWSER (Client)                  │
│                                                     │
│  ┌──────────┐   ┌──────────┐   ┌────────────────┐  │
│  │ Login    │   │ Register │   │ User Profile   │  │
│  │ Page     │   │ Page     │   │ Page           │  │
│  └────┬─────┘   └────┬─────┘   └───────┬────────┘  │
│       │              │                  │           │
│       ▼              ▼                  ▼           │
│  ┌──────────────────────────────────────────────┐   │
│  │           Auth Context (Qwik Context)        │   │
│  │  - user signal (current logged-in user)      │   │
│  │  - session signal (JWT token info)           │   │
│  │  - isLoading signal                          │   │
│  │  - login(), register(), logout(), etc.       │   │
│  └────────────────────┬─────────────────────────┘   │
│                       │                             │
│                       ▼                             │
│  ┌──────────────────────────────────────────────┐   │
│  │        Supabase JS Client (SDK)              │   │
│  │  @supabase/supabase-js                       │   │
│  └────────────────────┬─────────────────────────┘   │
│                       │                             │
└───────────────────────┼─────────────────────────────┘
                        │  HTTPS (encrypted)
                        ▼
┌───────────────────────────────────────────────────┐
│               SUPABASE CLOUD                      │
│                                                   │
│  ┌─────────────┐    ┌──────────────────────────┐  │
│  │  Auth       │    │  PostgreSQL Database     │  │
│  │  Service    │    │  ┌────────────────────┐  │  │
│  │             │    │  │ profiles table     │  │  │
│  │  - Email    │    │  │ (id, name, avatar) │  │  │
│  │  - Google   │    │  └────────────────────┘  │  │
│  │  - GitHub   │    │  ┌────────────────────┐  │  │
│  │  - etc.     │    │  │ orders table       │  │  │
│  │             │    │  │ (future Step 7-8)  │  │  │
│  └─────────────┘    │  └────────────────────┘  │  │
│                     └──────────────────────────┘  │
└───────────────────────────────────────────────────┘
```

### How it works, step by step:

1. **User clicks "Login"** → They see our Login page (`/auth/login`).
2. **User enters email + password** (or clicks "Sign in with Google").
3. **Our Qwik component calls Supabase SDK** → `supabase.auth.signInWithPassword(...)`.
4. **Supabase validates credentials** → If correct, returns a **JWT session token**.
5. **We store the session** in our Auth Context → All components can now see `user.value`.
6. **Protected routes check** → If `user.value` is `null`, redirect to `/auth/login`.
7. **On page refresh** → Supabase SDK automatically recovers the session from cookies/localStorage.

---

## 🗺️ File Structure (What We'll Create)

```
src/
├── lib/
│   └── supabase.ts                    # Supabase client instance (NEW)
│
├── contexts/
│   └── auth/                          # Auth context (NEW)
│       ├── AuthContext.tsx             # Provider component
│       ├── useAuth.ts                 # Custom hook
│       ├── types.ts                   # TypeScript interfaces
│       └── index.ts                   # Barrel exports
│
├── routes/
│   ├── auth/                          # Auth routes (NEW)
│   │   ├── login/
│   │   │   └── index.tsx              # Login page
│   │   ├── register/
│   │   │   └── index.tsx              # Register page
│   │   ├── forgot-password/
│   │   │   └── index.tsx              # Password reset request
│   │   ├── reset-password/
│   │   │   └── index.tsx              # Password reset form
│   │   └── callback/
│   │       └── index.tsx              # OAuth callback handler
│   │
│   ├── account/                       # Protected routes (NEW)
│   │   ├── index.tsx                  # User profile/dashboard
│   │   └── layout.tsx                 # Auth guard layout
│   │
│   └── layout.tsx                     # Updated with AuthProvider
│
├── components/
│   └── auth/                          # Auth UI components (NEW)
│       ├── LoginForm.tsx              # Email/password login form
│       ├── RegisterForm.tsx           # Registration form
│       ├── SocialLoginButtons.tsx     # Google, GitHub, etc. buttons
│       ├── AuthGuard.tsx              # Redirect if not logged in
│       └── UserMenu.tsx               # Header dropdown (avatar, logout)
│
└── .env.local                         # Supabase keys (NEVER commit this!)
```

---

## 📋 Implementation Phases

### Phase 1: Supabase Setup (No Code — Dashboard Only)

**Goal:** Create a Supabase project and configure authentication providers.

#### Steps:

1. **Create a Supabase account** at [supabase.com](https://supabase.com).
2. **Create a new project** → Name it `reconshop` → Choose a region close to you (e.g., EU West).
3. **Copy your keys** from `Settings > API Keys`:
   - `Project URL` (e.g., `https://xxxx.supabase.co`)
   - `Publishable key` (format: `sb_publishable_...` — safe to use in browsers)
   - `Secret key` (format: `sb_secret_...` — server-side ONLY, never in browser code)
4. **Enable Email Auth** → `Authentication > Providers > Email` → Toggle ON.
5. **Enable Google OAuth** → `Authentication > Providers > Google`:
   - Go to [Google Cloud Console](https://console.cloud.google.com).
   - Create OAuth 2.0 credentials.
   - Add `https://xxxx.supabase.co/auth/v1/callback` as an authorized redirect URI.
   - Copy the Client ID and Client Secret into Supabase.
6. **(Optional)** Enable GitHub, Microsoft, etc. the same way.
7. **Create a `profiles` table** in the Supabase SQL editor:

```sql
-- This table stores extra info about each user (name, avatar, etc.)
-- The 'id' column links to Supabase's built-in auth.users table.
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security so users can only see/edit their own profile
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own profile
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Policy: Auto-create a profile when a new user signs up
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Trigger: Auto-create profile row on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, phone, address)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'address'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

#### Acceptance Criteria:

- [ ] Supabase project created and running.
- [ ] Email/Password auth enabled.
- [ ] Google OAuth configured and tested in Supabase dashboard.
- [ ] `profiles` table created with RLS policies.
- [ ] Environment variables saved locally in `.env.local`.

---

### Phase 2: Supabase Client & Auth Context

**Goal:** Install the SDK, create a client, and build the Qwik Auth Context.

#### Steps:

1. **Install Supabase SDK:**

   ```powershell
   pnpm add @supabase/supabase-js
   ```

2. **Use the `.env.local`** file already created in the project root:

   ```env
   # Supabase credentials (NEVER commit this file!)
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your-key-here
   SUPABASE_SECRET_KEY=sb_secret_your-secret-here
   ```

   > **Junior Note:** The `VITE_` prefix is required for browser-accessible keys! Vite only exposes env vars to the browser if they start with `VITE_`. The `SUPABASE_SECRET_KEY` deliberately does NOT have the `VITE_` prefix — this keeps it invisible to browser code and only accessible in server-side functions like `routeLoader$`.

3. **Create `src/lib/supabase.ts`** — A single, reusable Supabase client:

   ```typescript
   import { createClient } from "@supabase/supabase-js";

   // These come from .env.local — the VITE_ prefix makes them available in the browser
   const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
   const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

   // This is safe: the Publishable key respects Row Level Security policies
   export const supabase = createClient(supabaseUrl, supabaseKey);
   ```

4. **Create `src/contexts/auth/`** following the same pattern as our CartContext:
   - `types.ts` — Define `AuthUser`, `AuthState`, `AuthActions`.
   - `AuthContext.tsx` — Provider component with `useStore$` for state.
   - `useAuth.ts` — Custom hook to access auth anywhere.
   - `index.ts` — Barrel exports.

5. **Wrap the app** — Add `<AuthProvider>` to `src/routes/layout.tsx`:
   ```tsx
   <AuthProvider>
     <CartProvider>...</CartProvider>
   </AuthProvider>
   ```
   > **Why AuthProvider is the outermost?** Because the Cart might eventually need to know WHO the user is (e.g., to sync their cart to the database). Auth wraps everything.

#### Acceptance Criteria:

- [ ] `@supabase/supabase-js` installed.
- [ ] `.env.local` created with Supabase keys (and added to `.gitignore`).
- [ ] Supabase client singleton created in `src/lib/supabase.ts`.
- [ ] Auth context created with login, register, logout, and session recovery.
- [ ] Auth context integrated into the root layout.

---

### Phase 3: Login & Register Pages

**Goal:** Build the UI for email/password authentication and social login buttons.

#### Steps:

1. **Create `/auth/login/index.tsx`:**
   - Email input field
   - Password input field
   - "Login" submit button with loading state
   - "Forgot Password?" link
   - "Don't have an account? Register" link
   - Social login buttons section (Google, etc.)
   - Error message display (wrong password, etc.)

2. **Create `/auth/register/index.tsx`:**
   - Full Name input
   - Email input
   - Password input (with strength indicator)
   - Confirm Password input
   - "Register" submit button
   - "Already have an account? Login" link
   - Social login buttons

3. **Create `SocialLoginButtons.tsx` component:**
   - Google button (branded with Google colors)
   - Optional: GitHub, Microsoft buttons
   - Each button calls `supabase.auth.signInWithOAuth({ provider: 'google' })`

4. **Create `/auth/callback/index.tsx`:**
   - This page handles the redirect back from Google/GitHub OAuth
   - It reads the auth token from the URL hash
   - Redirects to the homepage or the page the user was trying to visit

5. **Update Header** to show:
   - "Login" / "Register" buttons when logged OUT
   - User avatar + dropdown menu when logged IN

#### Acceptance Criteria:

- [ ] Login page renders with email/password form.
- [ ] Register page renders with registration form.
- [ ] Social login buttons (Google at minimum) are functional.
- [ ] OAuth callback page handles redirect correctly.
- [ ] Header updates based on auth state.
- [ ] Error messages display for invalid credentials.
- [ ] Success redirects to homepage or previous page.

---

### Phase 4: Protected Routes & Auth Guard

**Goal:** Prevent unauthenticated users from accessing account pages.

#### Steps:

1. **Create `src/components/auth/AuthGuard.tsx`:**
   - Checks if `user.value` exists in the Auth Context.
   - If not logged in → redirect to `/auth/login?redirect=/account`.
   - If logged in → render the children (the protected page).
   - Show a loading spinner while checking session.

2. **Create `/account/layout.tsx`:**
   - Uses the AuthGuard to protect ALL routes under `/account/*`.
   - This is a Qwik City "layout" — any page inside `/account/` inherits it.

3. **Create `/account/index.tsx`:**
   - User profile page showing:
     - Avatar (from Google or uploaded)
     - Full Name (editable)
     - Email (read-only)
     - Phone number (editable)
     - "Save Changes" button
     - "Change Password" section
     - "Logout" button

#### Acceptance Criteria:

- [ ] Visiting `/account` while logged out redirects to `/auth/login`.
- [ ] After login, the user is redirected back to `/account`.
- [ ] Profile page displays current user information.
- [ ] Profile updates save to Supabase `profiles` table.
- [ ] A loading state is shown while checking authentication.

---

### Phase 5: Password Reset Flow

**Goal:** Allow users to reset their password via email.

#### Steps:

1. **Create `/auth/forgot-password/index.tsx`:**
   - Email input field.
   - "Send Reset Link" button.
   - Calls `supabase.auth.resetPasswordForEmail(email)`.
   - Shows success message: "Check your email for a reset link."

2. **Create `/auth/reset-password/index.tsx`:**
   - New Password input.
   - Confirm New Password input.
   - "Update Password" button.
   - Calls `supabase.auth.updateUser({ password: newPassword })`.
   - Redirects to login on success.

3. **Configure Supabase email templates** (optional):
   - In Supabase Dashboard → Authentication → Email Templates.
   - Customize the reset email to include your brand name and styling.

#### Acceptance Criteria:

- [ ] Forgot password page sends reset email.
- [ ] Reset password page updates the password.
- [ ] User can log in with the new password.
- [ ] Error handling for expired or invalid reset tokens.

---

### Phase 6: Header Integration & User Menu

**Goal:** Make authentication visible and accessible from every page.

#### Steps:

1. **Create `UserMenu.tsx`** component:
   - User's avatar (or initials fallback).
   - Dropdown menu:
     - "My Account" → links to `/account`.
     - "My Orders" → links to `/account/orders` (future Step 8).
     - "Wishlist" → links to `/account/wishlist` (future Step 9).
     - Divider line.
     - "Logout" → calls `auth.actions.logout()`.

2. **Update `Header.tsx`:**
   - Import `useAuth` hook.
   - Show `<UserMenu />` when logged in.
   - Show "Login" / "Register" buttons when logged out.

3. **Update `MobileMenu.tsx`:**
   - Same conditional rendering for mobile.
   - "Hello, [Name]!" greeting when logged in.

#### Acceptance Criteria:

- [ ] Header shows login/register for anonymous users.
- [ ] Header shows user avatar + dropdown for authenticated users.
- [ ] Mobile menu reflects auth state.
- [ ] Logout works from any page.

---

## 🔒 Security Considerations

### What is SAFE ✅

- **Supabase Publishable Key** (`sb_publishable_...`) in browser code — This key is designed to be public. It can only do what your Row Level Security (RLS) policies allow.
- **JWT tokens** stored in cookies/localStorage — Supabase handles this securely.
- **Password hashing** — Supabase does this automatically. We never see or store raw passwords.

### What is NOT safe ❌

- **Supabase Secret Key** (`sb_secret_...`) — NEVER put this in browser code. It bypasses all security. Only use it in server-side code (like `routeLoader$` or Netlify Edge Functions). In our `.env.local`, this key does NOT have the `VITE_` prefix specifically to prevent it from leaking to the browser.
- **Disabling RLS** — Always keep Row Level Security ON for user data tables.
- **`.env.local`** — Must be in `.gitignore`. Never commit API keys to Git.

---

## 📦 New Dependencies

| Package                 | Purpose                         | Size  |
| :---------------------- | :------------------------------ | :---- |
| `@supabase/supabase-js` | Supabase client SDK (Auth + DB) | ~50KB |

That's it! Supabase's SDK is the only new dependency we need.

---

## 🎯 Final Acceptance Criteria (Full Step 6)

- [ ] User can register with email + password.
- [ ] User can log in with email + password.
- [ ] User can log in with Google OAuth.
- [ ] User can log out from any page.
- [ ] User can reset their password via email.
- [ ] Protected routes redirect unauthenticated users to login.
- [ ] User profile page shows and edits personal information.
- [ ] Header/mobile menu updates based on auth state.
- [ ] Auth state persists across page refreshes.
- [ ] All user data is protected by Row Level Security.
- [ ] No API keys are committed to version control.

---

## 🗓️ Estimated Effort

| Phase     | Description                    | Estimate        |
| :-------- | :----------------------------- | :-------------- |
| Phase 1   | Supabase Setup (Dashboard)     | 30 min          |
| Phase 2   | SDK + Auth Context             | 1–2 hours       |
| Phase 3   | Login & Register Pages         | 2–3 hours       |
| Phase 4   | Protected Routes & Profile     | 1–2 hours       |
| Phase 5   | Password Reset Flow            | 1 hour          |
| Phase 6   | Header Integration & User Menu | 1 hour          |
| **Total** | **Full Step 6**                | **~7–10 hours** |

---

## 📚 Learning Resources

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Supabase + Qwik (Community Guide)](https://supabase.com/docs/guides/getting-started)
- [Google OAuth Setup](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Qwik Context API](https://qwik.builder.io/docs/components/context/)

---

**Task Created:** February 11, 2026
**Status:** 🔜 Planning — Awaiting your approval to begin Phase 1.
**Priority:** High — Blocks Step 7 (Checkout) and Step 8 (Order History).
