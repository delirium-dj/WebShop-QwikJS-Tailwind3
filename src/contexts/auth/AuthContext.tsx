/**
 * Auth Context - Authentication State Management
 * 
 * This file creates a Qwik Context that holds all authentication state
 * and provides auth functions to the entire application.
 * 
 * For Junior Developers:
 * - Context is like a "global storage" that any component can access
 * - Instead of passing props down 10 levels, components just call useAuth()
 * - Qwik's Context works differently than React's (it's more efficient)
 */

import {
  component$,
  createContextId,
  useContextProvider,
  useStore,
  useVisibleTask$,
  Slot,
  $,
} from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city';
import { supabase } from '~/lib/supabase';
import type {
  AuthContextValue,
  AuthUser,
  AuthState,
  AuthActions,
  LoginCredentials,
  RegisterCredentials,
  UpdateProfileData,
  OAuthProvider,
} from './types';

/**
 * Create the Auth Context ID
 */
export const AuthContext = createContextId<AuthContextValue>('auth.context');

/**
 * AuthProvider Component
 * 
 * This component wraps your entire app (usually in layout.tsx).
 * It provides the auth state and functions to all child components.
 */
export const AuthProvider = component$(() => {
  /**
   * Navigation helper for redirects
   */
  const nav = useNavigate();

  // ============================================
  // REACTIVE STATE (Store)
  // ============================================
  /**
   * Internal reactive state store
   * This holds all auth state in a single reactive proxy.
   */
  const authState = useStore<AuthState>({
    user: null,
    session: null,
    isLoading: true, // Start true so we can check session on mount
    error: null,
  });

  // ============================================
  // HELPER FUNCTIONS
  // ============================================
  
  /**
   * Load user profile from the 'profiles' table
   */
  const loadUserProfile = $(async (userId: string) => {
    try {
      // Get basic user info from Supabase Auth
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        authState.user = null;
        return;
      }
      
      // Get extended profile info from our 'profiles' table
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (profileError) {
        console.warn('Profile not found/error:', profileError.message);
        // Even if profile fails, we still have the basic auth user
        authState.user = authUser as AuthUser;
        return;
      }
      
      // Combine auth user with profile data
      authState.user = {
        ...authUser,
        displayName: profile?.display_name || authUser.user_metadata?.full_name,
        avatar: profile?.avatar_url || authUser.user_metadata?.avatar_url,
        phone: profile?.phone,
      } as AuthUser;
      
    } catch (err) {
      console.error('Failed to load user profile:', err);
      authState.error = 'Failed to load user profile';
    }
  });

  // ============================================
  // INITIALIZATION (useVisibleTask$)
  // ============================================
  
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async () => {
    // Safety timeout: If Supabase takes too long, stop loading so UI shows
    const timeoutId = setTimeout(() => {
        if (authState.isLoading) {
            authState.isLoading = false;
        }
    }, 3000);

    try {
      /**
       * Get the current session on page load
       */
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      if (currentSession) {
        authState.session = currentSession;
        // Load user data (including profile info)
        await loadUserProfile(currentSession.user.id);
      }
    } catch (err) {
      console.error('Initial session check failed:', err);
    } finally {
      // Clear timeout and remove loading spinner
      clearTimeout(timeoutId);
      authState.isLoading = false;
    }

    /**
     * Listen for auth state changes
     */
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        authState.session = currentSession;
        
        if (currentSession?.user) {
          await loadUserProfile(currentSession.user.id);
        } else {
          authState.user = null;
        }
      }
    );

    /**
     * Cleanup function
     */
    return () => {
      subscription.unsubscribe();
      clearTimeout(timeoutId);
    };
  }, { strategy: 'document-ready' });

  // ============================================
  // AUTH ACTIONS
  // ============================================
  
  /**
   * Login with email and password
   */
  const login = $(async (credentials: LoginCredentials) => {
    try {
      authState.error = null;
      authState.isLoading = true;
      
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });
      
      if (loginError) {
        authState.error = loginError.message;
        throw loginError;
      }
      
      if (data.session) {
        authState.session = data.session;
        await loadUserProfile(data.user.id);
        nav('/');
      }
    } catch (err) {
      console.error('Login error:', err);
      throw err;
    } finally {
      authState.isLoading = false;
    }
  });

  /**
   * Register a new user
   * 
   * For Junior Devs:
   * 1. Validates passwords match (client-side check)
   * 2. Calls Supabase signUp to create the user in auth.users
   * 3. Attempts to upsert a row into our custom 'profiles' table
   *    (this is a "nice-to-have" — registration should still succeed if it fails)
   * 4. If Supabase returns a session, the user is auto-confirmed → go home
   * 5. If NO session, email confirmation is required → go to verify-email page
   */
  const register = $(async (credentials: RegisterCredentials) => {
    try {
      authState.error = null;
      authState.isLoading = true;
      
      // Step 1: Client-side password validation
      if (credentials.password !== credentials.confirmPassword) {
        const err = new Error('Passwords do not match');
        authState.error = err.message;
        throw err;
      }
      
      // Step 2: Call Supabase Auth — this is the CRITICAL step
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            // Stored in auth.users.raw_user_meta_data (always works)
            full_name: credentials.displayName,
          },
        },
      });
      
      // If Supabase returned an error, STOP here — don't navigate anywhere
      if (signUpError) {
        authState.error = signUpError.message;
        throw signUpError;
      }
      
      // Step 3: If we have a user, try to create/update their profile
      // Profile creation is NON-CRITICAL — it should not block registration
      if (data.user) {
        try {
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: data.user.id,
              display_name: credentials.displayName,
              phone: credentials.phone,
              updated_at: new Date().toISOString(),
            });
          
          if (profileError) {
            // Log but DON'T throw — the user was still created in auth.users
            // The display_name is also saved in user_metadata as a backup
            console.warn(
              'Profile upsert failed (non-critical):',
              profileError.message,
              '— The user was still registered successfully via Supabase Auth.'
            );
          }
        } catch (profileErr) {
          // Catch any unexpected errors from the profile upsert
          console.warn('Profile creation threw unexpectedly:', profileErr);
        }
        
        // Step 4: Navigate based on whether Supabase gave us a session
        if (data.session) {
          // Auto-confirmed (email confirmation OFF in Supabase dashboard)
          authState.session = data.session;
          await loadUserProfile(data.user.id);
          nav('/');
        } else {
          // Email confirmation is required (normal production behavior)
          nav('/auth/verify-email');
        }
      }
    } catch (err) {
      console.error('Registration error:', err);
      throw err;
    } finally {
      authState.isLoading = false;
    }
  });

  /**
   * Login with OAuth provider
   */
  const loginWithProvider = $(async (provider: OAuthProvider) => {
    try {
      authState.error = null;
      const { error: providerError } = await supabase.auth.signInWithOAuth({
        provider: provider as any,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (providerError) {
        authState.error = providerError.message;
        throw providerError;
      }
    } catch (err) {
      console.error('OAuth error:', err);
      throw err;
    }
  });

  /**
   * Logout the current user
   */
  const logout = $(async () => {
    try {
      authState.error = null;
      await supabase.auth.signOut();
      authState.user = null;
      authState.session = null;
      nav('/');
    } catch (err) {
      console.error('Logout error:', err);
      throw err;
    }
  });

  /**
   * Update user profile
   */
  const updateProfile = $(async (data: UpdateProfileData) => {
    try {
      authState.error = null;
      if (!authState.user) throw new Error('Not logged in');
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          display_name: data.displayName,
          avatar_url: data.avatar,
          phone: data.phone,
          updated_at: new Date().toISOString(),
        })
        .eq('id', authState.user.id);
      
      if (updateError) {
        authState.error = updateError.message;
        throw updateError;
      }
      
      await loadUserProfile(authState.user.id);
    } catch (err) {
      console.error('Update profile error:', err);
      throw err;
    }
  });

  /**
   * Send password reset email
   */
  const resetPassword = $(async (email: string) => {
    try {
      authState.error = null;
      authState.isLoading = true;
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      if (resetError) {
        authState.error = resetError.message;
        throw resetError;
      }
    } catch (err) {
      console.error('Password reset error:', err);
      throw err;
    } finally {
      authState.isLoading = false;
    }
  });

  /**
   * Update password
   */
  const updatePassword = $(async (newPassword: string) => {
    try {
      authState.error = null;
      authState.isLoading = true;
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (updateError) {
        authState.error = updateError.message;
        throw updateError;
      }
      await logout();
    } catch (err) {
      console.error('Update password error:', err);
      throw err;
    } finally {
      authState.isLoading = false;
    }
  });

  /**
   * Refresh session
   */
  const refreshSession = $(async () => {
    const { data: { session }, error } = await supabase.auth.refreshSession();
    if (error) console.error('Session refresh error:', error);
    if (session) authState.session = session;
  });

  /**
   * Clear error
   */
  const clearError = $(() => {
    authState.error = null;
  });

  // ============================================
  // PROVIDE CONTEXT
  // ============================================
  
  const actions: AuthActions = {
    login,
    register,
    loginWithProvider,
    logout,
    updateProfile,
    resetPassword,
    updatePassword,
    refreshSession,
    clearError,
  };

  useContextProvider(AuthContext, {
    state: authState,
    actions,
  });

  return <Slot />;
});
