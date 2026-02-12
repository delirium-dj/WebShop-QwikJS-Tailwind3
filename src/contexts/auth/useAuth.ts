/**
 * useAuth Hook
 * 
 * A custom hook that provides easy access to the authentication context.
 */

import { useContext } from '@builder.io/qwik';
import { AuthContext } from './AuthContext';
import type { AuthContextValue, AuthUser } from './types';

/**
 * useAuth - Access authentication state and actions
 * 
 * This hook must be called inside a component that's wrapped by <AuthProvider>.
 * If you try to use it outside the provider, it will throw a helpful error.
 */
export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error(
      'useAuth must be used within an AuthProvider. ' +
      'Make sure your component is wrapped with <AuthProvider> in layout.tsx'
    );
  }
  
  return context;
};

/**
 * useRequireAuth - Hook that returns the auth context
 */
export const useRequireAuth = (): AuthContextValue => {
  return useAuth();
};

/**
 * useAuthUser - Get just the user (null if not logged in)
 */
export const useAuthUser = (): AuthUser | null => {
  const auth = useAuth();
  return auth.state.user;
};

/**
 * useIsAuthenticated - Check if user is logged in
 */
export const useIsAuthenticated = (): boolean => {
  const auth = useAuth();
  return auth.state.user !== null && !auth.state.isLoading;
};
