/**
 * Auth Module - Barrel Export File
 * 
 * This file re-exports everything from the auth module in one place.
 * 
 * For Junior Developers:
 * - A "barrel export" is a pattern where you create an index.ts file
 * - It exports everything from other files in the same directory
 * - This makes imports cleaner and easier to manage
 * 
 * Without barrel exports (messy):
 * ```typescript
 * import { AuthProvider } from '~/contexts/auth/AuthContext';
 * import { useAuth } from '~/contexts/auth/useAuth';
 * import type { AuthUser, LoginCredentials } from '~/contexts/auth/types';
 * ```
 * 
 * With barrel exports (clean):
 * ```typescript
 * import { AuthProvider, useAuth, type AuthUser, type LoginCredentials } from '~/contexts/auth';
 * ```
 * 
 * Much cleaner! And if we move files around, we only update the index.ts,
 * not every component that imports from auth.
 */

// ============================================
// COMPONENTS
// ============================================
// Export the main provider component
export { AuthProvider, AuthContext } from './AuthContext';

// ============================================
// HOOKS
// ============================================
// Export all custom hooks
export { 
  useAuth,           // Main hook - access full auth context
  useRequireAuth,    // Hook with redirect logic
  useAuthUser,       // Get just the user object
  useIsAuthenticated // Boolean check for auth status
} from './useAuth';

// ============================================
// TYPES
// ============================================
// Export all TypeScript types and interfaces
// The 'type' keyword is important - it tells TypeScript these are types,
// not values, so they get stripped out during compilation
export type {
  // Main interfaces
  AuthUser,
  AuthState,
  AuthContextValue,
  AuthActions,
  
  // Form data types
  LoginCredentials,
  RegisterCredentials,
  UpdateProfileData,
  
  // Other types
  OAuthProvider,
  FormErrors,
} from './types';

// Export the enum (not a type, so no 'type' keyword)
export { AuthErrorCode } from './types';

/**
 * Usage Examples
 * 
 * Here are some common ways to use the auth module in your components:
 * 
 * EXAMPLE 1: Simple auth check
 * ```typescript
 * import { component$ } from '@builder.io/qwik';
 * import { useAuth } from '~/contexts/auth';
 * 
 * export default component$(() => {
 *   const auth = useAuth();
 *   
 *   return (
 *     <div>
 *       {auth.user ? (
 *         <p>Hello, {auth.user.displayName}!</p>
 *       ) : (
 *         <p>Please log in</p>
 *       )}
 *     </div>
 *   );
 * });
 * ```
 * 
 * EXAMPLE 2: Login form
 * ```typescript
 * import { component$, useSignal, $ } from '@builder.io/qwik';
 * import { useAuth, type LoginCredentials } from '~/contexts/auth';
 * 
 * export default component$(() => {
 *   const auth = useAuth();
 *   const email = useSignal('');
 *   const password = useSignal('');
 *   
 *   const handleLogin$ = $(async () => {
 *     await auth.actions.login({
 *       email: email.value,
 *       password: password.value,
 *     });
 *   });
 *   
 *   return (
 *     <form>
 *       <input
 *         type="email"
 *         value={email.value}
 *         onInput$={(e) => email.value = e.target.value}
 *       />
 *       <input
 *         type="password"
 *         value={password.value}
 *         onInput$={(e) => password.value = e.target.value}
 *       />
 *       <button onClick$={handleLogin$}>Login</button>
 *       {auth.error && <p class="error">{auth.error}</p>}
 *     </form>
 *   );
 * });
 * ```
 * 
 * EXAMPLE 3: Protected route with AuthGuard
 * ```typescript
 * import { component$ } from '@builder.io/qwik';
 * import { useAuth } from '~/contexts/auth';
 * import { useNavigate } from '@builder.io/qwik-city';
 * 
 * export default component$(() => {
 *   const auth = useAuth();
 *   const nav = useNavigate();
 *   
 *   if (auth.isLoading) {
 *     return <div>Loading...</div>;
 *   }
 *   
 *   if (!auth.user) {
 *     nav('/auth/login');
 *     return null;
 *   }
 *   
 *   return <div>Protected content for {auth.user.email}</div>;
 * });
 * ```
 * 
 * EXAMPLE 4: OAuth login buttons
 * ```typescript
 * import { component$, $ } from '@builder.io/qwik';
 * import { useAuth } from '~/contexts/auth';
 * 
 * export default component$(() => {
 *   const auth = useAuth();
 *   
 *   const handleGoogleLogin$ = $(async () => {
 *     await auth.actions.loginWithProvider('google');
 *   });
 *   
 *   return (
 *     <button onClick$={handleGoogleLogin$}>
 *       Sign in with Google
 *     </button>
 *   );
 * });
 * ```
 * 
 * EXAMPLE 5: Logout button
 * ```typescript
 * import { component$ } from '@builder.io/qwik';
 * import { useAuth } from '~/contexts/auth';
 * 
 * export default component$(() => {
 *   const auth = useAuth();
 *   
 *   if (!auth.user) return null;
 *   
 *   return (
 *     <button onClick$={auth.actions.logout}>
 *       Logout
 *     </button>
 *   );
 * });
 * ```
 */
