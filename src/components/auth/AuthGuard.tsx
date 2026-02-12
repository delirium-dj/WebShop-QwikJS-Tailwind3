/**
 * AuthGuard Component
 * 
 * A component that protects routes by checking if the user is authenticated.
 * If the user is not logged in, they're redirected to the login page.
 * 
 * For Junior Developers:
 * - This is a "guard" component - it decides who can access a page
 * - Think of it like a bouncer at a club checking IDs
 * - If you're logged in → you can see the page
 * - If you're not logged in → you get redirected to login
 * 
 * How it works:
 * 1. Component loads → Checks if user is authenticated
 * 2. While checking → Shows a loading spinner
 * 3. If not authenticated → Redirects to login with return URL
 * 4. If authenticated → Shows the protected content (children)
 * 
 * Usage:
 * Wrap any protected content with this component:
 * 
 * ```typescript
 * <AuthGuard>
 *   <ProtectedContent />
 * </AuthGuard>
 * ```
 * 
 * Or use it in a layout to protect an entire section:
 * 
 * ```typescript
 * // In /account/layout.tsx
 * export default component$(() => {
 *   return (
 *     <AuthGuard>
 *       <Slot /> // All pages under /account/* are protected
 *     </AuthGuard>
 *   );
 * });
 * ```
 */

import { component$, Slot, useVisibleTask$ } from '@builder.io/qwik';
import { useLocation, useNavigate } from '@builder.io/qwik-city';
import { useAuth } from '~/contexts/auth';

/**
 * Props for AuthGuard component
 */
interface AuthGuardProps {
  /**
   * Where to redirect if user is not authenticated
   * Default: '/auth/login'
   */
  redirectTo?: string;
  
  /**
   * Custom loading component to show while checking auth
   * If not provided, uses default spinner
   */
  loadingComponent?: any;
  
  /**
   * Custom component to show while redirecting
   * If not provided, returns null (blank screen)
   */
  redirectingComponent?: any;
}

/**
 * AuthGuard Component
 * 
 * Protects child components by requiring authentication.
 * Redirects to login if user is not authenticated.
 */
export const AuthGuard = component$<AuthGuardProps>((props) => {
  const {
    redirectTo = '/auth/login',
    loadingComponent,
    redirectingComponent,
  } = props;

  // Get auth state from context
  const auth = useAuth();
  
  // Get current location to save as return URL
  const location = useLocation();
  
  // Get navigation function
  const nav = useNavigate();

  /**
   * Check authentication and redirect if needed
   * 
   * This runs on the CLIENT side after the component becomes visible.
   * We use useVisibleTask$ instead of useTask$ because:
   * 1. We need access to window.location (browser-only)
   * 2. Navigation should only happen on the client
   */
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ track }) => {
    // Track auth.state.isLoading and auth.state.user
    // This makes the task re-run when these values change
    track(() => auth.state.isLoading);
    track(() => auth.state.user);

    /**
     * Redirect logic
     * 
     * Only redirect if:
     * 1. We're done checking (isLoading = false)
     * 2. There's no user (user = null)
     */
    if (!auth.state.isLoading && !auth.state.user) {
      // Build redirect URL with return path
      // This lets the login page redirect back here after login
      const returnUrl = location.url.pathname + location.url.search;
      const loginUrl = `${redirectTo}?redirect=${encodeURIComponent(returnUrl)}`;
      
      console.log('AuthGuard: User not authenticated, redirecting to:', loginUrl);
      
      // Redirect to login
      nav(loginUrl);
    }
  });

  /**
   * Render logic - what to show based on auth state
   */

  // CASE 1: Still checking if user is logged in
  // Show a loading spinner
  if (auth.state.isLoading) {
    // Use custom loading component if provided
    if (loadingComponent) {
      return loadingComponent;
    }
    
    // Default loading spinner
    return (
      <div class="min-h-screen flex items-center justify-center bg-gray-50">
        <div class="text-center">
          {/* Spinning circle animation */}
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p class="text-gray-600 text-lg">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // CASE 2: User is not logged in
  // Show redirecting message (or nothing)
  if (!auth.state.user) {
    // Use custom redirecting component if provided
    if (redirectingComponent) {
      return redirectingComponent;
    }
    
    // Default: blank screen while redirecting
    // (The redirect happens in useVisibleTask$ above)
    return (
      <div class="min-h-screen flex items-center justify-center bg-gray-50">
        <div class="text-center">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p class="text-gray-600 text-lg">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // CASE 3: User is logged in! ✅
  // Show the protected content
  return <Slot />;
});

/**
 * Alternative: RequireAuth Component
 * 
 * A simpler version that just shows a login prompt instead of redirecting.
 * Useful for inline protection within a page.
 * 
 * Usage:
 * ```typescript
 * <RequireAuth>
 *   <SecretContent />
 * </RequireAuth>
 * ```
 */
export const RequireAuth = component$(() => {
  const auth = useAuth();

  // Show loading state
  if (auth.state.isLoading) {
    return (
      <div class="flex items-center justify-center p-8">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!auth.state.user) {
    return (
      <div class="bg-yellow-50 border-l-4 border-yellow-400 p-6 my-4">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <svg
              class="h-6 w-6 text-yellow-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-yellow-700">
              You must be{' '}
              <a href="/auth/login" class="font-medium underline hover:text-yellow-600">
                logged in
              </a>{' '}
              to view this content.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // User is authenticated - show content
  return <Slot />;
});

/**
 * Role-Based AuthGuard (Advanced)
 * 
 * For future use when you add user roles (admin, customer, etc.)
 * 
 * Usage:
 * ```typescript
 * <RoleGuard requiredRole="admin">
 *   <AdminPanel />
 * </RoleGuard>
 * ```
 */
interface RoleGuardProps {
  requiredRole: string;
  fallback?: any;
}

export const RoleGuard = component$<RoleGuardProps>((props) => {
  const auth = useAuth();
  
  // Check if user has required role
  // Note: This assumes your AuthUser has a 'role' field
  // You'll need to add this to your Supabase profiles table
  const hasRole = auth.state.user && (auth.state.user as any).role === props.requiredRole;
  
  if (!hasRole) {
    return props.fallback || (
      <div class="bg-red-50 border-l-4 border-red-400 p-6 my-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg
              class="h-6 w-6 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
              />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-red-700">
              You do not have permission to access this content.
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  return <Slot />;
});
