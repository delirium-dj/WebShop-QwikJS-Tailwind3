/**
 * Auth Context - Authentication State Management
 * 
 * WHAT: This file creates a "Global Store" for user authentication.
 * IT CONTAINS: The user's status (loggedIn/loggedOut), their profile data, and 
 * functions like login() and logout().
 * 
 * WHY: We use Context so we don't have to "prop drill" (pass data manually) 
 * through every single component. Any component in the app can just call `useAuth()` 
 * to know if a user is logged in.
 * 
 * JUNIOR TIP: 
 * We separate 'state' (data that changes) from 'actions' (functions that do work).
 * This is a Qwik best practice to prevent "Serialization Errors" because 
 * functions cannot be easily saved to a database/proxy like raw data can.
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
   * WHAT: A 'useStore' is a reactive object. 
   * WHY: When any value inside this object changes (like 'user'), Qwik 
   * automatically re-renders ONLY the parts of the UI that use that specific value.
   */
  const authState = useStore<AuthState>({
    user: null, // Starts empty
    session: null, // Supabase session data
    isLoading: true, // Start true so we can check if a user is already logged in on refresh
    error: null, // Stores any error messages (like "Wrong Password")
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

  /**
   * INITIALIZATION (Running on the Browser)
   * WHY: Supabase needs access to the browser's 'localStorage' and cookies 
   * to see if a user is already logged in. This code only runs once when the user 
   * first visits the site or refreshes.
   */
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async () => {
    // Safety timeout: If Supabase takes too long (e.g. bad internet), 
    // we stop the loading spinner so the user isn't stuck forever.
    const timeoutId = setTimeout(() => {
        if (authState.isLoading) {
            authState.isLoading = false;
        }
    }, 3000);

    try {
      /**
       * Get current session from Supabase
       */
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      if (currentSession) {
        authState.session = currentSession;
        // If we found a session, load the user's detailed profile
        await loadUserProfile(currentSession.user.id);
      }
    } catch (err) {
      console.error('Initial session check failed:', err);
    } finally {
      clearTimeout(timeoutId);
      authState.isLoading = false;
    }

    /**
     * Auth Listener: Updates the app instantly if the user logs in or out in another tab
     */
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        authState.session = currentSession;
        
        if (currentSession?.user) {
          // Sync session to cookie for server-side access (Loaders/Actions)
          if (currentSession.access_token) {
            document.cookie = `sb-access-token=${currentSession.access_token}; path=/; max-age=${currentSession.expires_in}; SameSite=Lax; Secure`;
            // Also store refresh token if needed, but access token is enough for short-lived requests
            if (currentSession.refresh_token) {
               document.cookie = `sb-refresh-token=${currentSession.refresh_token}; path=/; max-age=${currentSession.expires_in}; SameSite=Lax; Secure`;
            }
          }
          await loadUserProfile(currentSession.user.id);
        } else {
          // Clear cookies on logout
          document.cookie = 'sb-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          document.cookie = 'sb-refresh-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          authState.user = null;
        }
      }
    );

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
