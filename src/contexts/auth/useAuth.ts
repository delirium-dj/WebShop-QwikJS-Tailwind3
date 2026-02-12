/**
 * useAuth Hook
 * 
 * A custom hook that provides easy access to the authentication context.
 * 
 * For Junior Developers:
 * - A "hook" is a special function that lets you access React/Qwik features
 * - This hook wraps useContext so you don't have to import it everywhere
 * - It also adds error handling and better TypeScript support
 * 
 * Why create a custom hook instead of using useContext directly?
 * 
 * WITHOUT custom hook (verbose):
 * ```typescript
 * import { useContext } from '@builder.io/qwik';
 * import { AuthContext } from '~/contexts/auth/AuthContext';
 * 
 * const auth = useContext(AuthContext);
 * if (!auth) throw new Error('Must be inside AuthProvider');
 * // Now use auth...
 * ```
 * 
 * WITH custom hook (clean):
 * ```typescript
 * import { useAuth } from '~/contexts/auth';
 * 
 * const auth = useAuth();
 * // That's it! Now use auth...
 * ```
 */

import { useContext } from '@builder.io/qwik';
import { AuthContext } from './AuthContext';
import type { AuthContextValue } from './types';

/**
 * useAuth - Access authentication state and actions
 * 
 * This hook must be called inside a component that's wrapped by <AuthProvider>.
 * If you try to use it outside the provider, it will throw a helpful error.
 * 
 * @returns {AuthContextValue} The auth context value
 * @throws {Error} If used outside AuthProvider
 * 
 * Usage example:
 * ```typescript
 * import { component$ } from '@builder.io/qwik';
 * import { useAuth } from '~/contexts/auth';
 * 
 * export default component$(() => {
 *   // Get auth state and actions
 *   const auth = useAuth();
 *   
 *   // Check if user is logged in
 *   if (auth.isLoading) {
 *     return <div>Loading...</div>;
 *   }
 *   
 *   if (!auth.user) {
 *     return <div>Please log in</div>;
 *   }
 *   
 *   // User is logged in!
 *   return (
 *     <div>
 *       <h1>Welcome, {auth.user.displayName}!</h1>
 *       <p>Email: {auth.user.email}</p>
 *       <button onClick$={auth.actions.logout}>
 *         Logout
 *       </button>
 *     </div>
 *   );
 * });
 * ```
 */
export const useAuth = (): AuthContextValue => {
  // Get the context value
  const context = useContext(AuthContext);
  
  /**
   * Error handling
   * 
   * If context is undefined, it means one of two things:
   * 1. The component isn't wrapped in <AuthProvider>
   * 2. There's a typo in the import
   * 
   * We throw a clear error to help developers debug this.
   */
  if (!context) {
    throw new Error(
      'useAuth must be used within an AuthProvider. ' +
      'Make sure your component is wrapped with <AuthProvider> in layout.tsx'
    );
  }
  
  return context;
};

/**
 * useRequireAuth - Hook that redirects if user is not logged in
 * 
 * This is a convenience hook for protected pages.
 * Instead of checking auth.user manually, just call this hook.
 * 
 * Note: In Qwik, we can't redirect inside a hook like this.
 * Use the AuthGuard component for actual redirection instead.
 * This hook is kept for compatibility but mainly returns the auth context.
 * 
 * @returns {AuthContextValue} The auth context value
 * 
 * Usage in a protected page:
 * ```typescript
 * import { component$ } from '@builder.io/qwik';
 * import { useRequireAuth } from '~/contexts/auth';
 * 
 * export default component$(() => {
 *   // This returns auth context - use AuthGuard component for actual protection
 *   const auth = useRequireAuth();
 *   
 *   // Check if user is logged in
 *   if (!auth.user) {
 *     return <div>Please log in</div>;
 *   }
 *   
 *   return (
 *     <div>
 *       <h1>My Account</h1>
 *       <p>Welcome, {auth.user.displayName}</p>
 *     </div>
 *   );
 * });
 * ```
 */
export const useRequireAuth = (): AuthContextValue => {
  const auth = useAuth();
  
  // Note: For actual redirection, use the AuthGuard component instead
  // This hook just returns the auth context for convenience
  
  return auth;
};

/**
 * useAuthUser - Get just the user (null if not logged in)
 * 
 * This is a convenience hook when you only need the user object.
 * 
 * @returns {AuthUser | null} The current user or null
 * 
 * Usage:
 * ```typescript
 * const user = useAuthUser();
 * 
 * if (user) {
 *   console.log('Logged in as:', user.email);
 * }
 * ```
 */
export const useAuthUser = () => {
  const auth = useAuth();
  return auth.user;
};

/**
 * useIsAuthenticated - Check if user is logged in
 * 
 * Returns a boolean for simple authenticated checks.
 * 
 * @returns {boolean} True if user is logged in, false otherwise
 * 
 * Usage:
 * ```typescript
 * const isLoggedIn = useIsAuthenticated();
 * 
 * if (isLoggedIn) {
 *   return <UserDashboard />;
 * }
 * 
 * return <LoginPrompt />;
 * ```
 */
export const useIsAuthenticated = (): boolean => {
  const auth = useAuth();
  return auth.user !== null && !auth.isLoading;
};
