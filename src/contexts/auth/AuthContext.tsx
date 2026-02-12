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
   * Qwik tracks property access (state.user, state.isLoading)
   * so components re-render only when the used properties change.
   */
  const authService = useStore<AuthContextValue>({
    user: null,
    session: null,
    isLoading: false, // Start false so Sign In/Sign Up show during SSR; useVisibleTask$ runs client-only
    error: null,
    actions: {
        // Actions will be populated by the Qwik optimizer
        login: $(() => Promise.resolve()),
        register: $(() => Promise.resolve()),
        loginWithProvider: $(() => Promise.resolve()),
        logout: $(() => Promise.resolve()),
        updateProfile: $(() => Promise.resolve()),
        resetPassword: $(() => Promise.resolve()),
        updatePassword: $(() => Promise.resolve()),
        refreshSession: $(() => Promise.resolve()),
        clearError: $(() => {}),
    }
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
        authService.user = null;
        return;
      }
      
      // Get extended profile info from our 'profiles' table
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (profileError) {
        console.error('Error loading profile:', profileError);
        // Even if profile fails, we still have the basic user
        authService.user = authUser as AuthUser;
        return;
      }
      
      // Combine auth user with profile data
      authService.user = {
        ...authUser,
        displayName: profile?.display_name || authUser.user_metadata?.full_name,
        avatar: profile?.avatar_url || authUser.user_metadata?.avatar_url,
        phone: profile?.phone,
      } as AuthUser;
      
    } catch (err) {
      console.error('Failed to load user profile:', err);
      authService.error = 'Failed to load user profile';
    }
  });

  // ============================================
  // INITIALIZATION (useVisibleTask$)
  // ============================================
  // This runs ONCE when the component first renders on the CLIENT
  
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async () => {
    // Safety timeout: If Supabase takes too long, stop loading so UI shows
    const timeoutId = setTimeout(() => {
        if (authService.isLoading) {
            authService.isLoading = false;
        }
    }, 2000);

    /**
     * Get the current session on page load
     */
    const { data: { session: currentSession } } = await supabase.auth.getSession();
    
    // Clear timeout since we got a response
    clearTimeout(timeoutId);

    if (currentSession) {
      authService.session = currentSession;
      // Load user data (including profile info)
      await loadUserProfile(currentSession.user.id);
    }
    
    // Done checking - remove loading spinner
    authService.isLoading = false;

    /**
     * Listen for auth state changes
     */
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        authService.session = currentSession;
        
        if (currentSession?.user) {
          await loadUserProfile(currentSession.user.id);
        } else {
          authService.user = null;
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
  authService.actions.login = $(async (credentials: LoginCredentials) => {
    try {
      authService.error = null;
      authService.isLoading = true;
      
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });
      
      if (loginError) {
        if (loginError.message.includes('Invalid')) {
          authService.error = 'Invalid email or password';
        } else if (loginError.message.includes('Email not confirmed')) {
          authService.error = 'Please verify your email before logging in';
        } else {
          authService.error = loginError.message;
        }
        return;
      }
      
      if (data.session) {
        authService.session = data.session;
        await loadUserProfile(data.user.id);
        nav('/');
      }
    } catch (err) {
      console.error('Login error:', err);
      authService.error = 'An unexpected error occurred. Please try again.';
    } finally {
      authService.isLoading = false;
    }
  });

  /**
   * Register a new user
   */
  authService.actions.register = $(async (credentials: RegisterCredentials) => {
    try {
      authService.error = null;
      authService.isLoading = true;
      
      if (credentials.password !== credentials.confirmPassword) {
        authService.error = 'Passwords do not match';
        return;
      }
      
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            full_name: credentials.displayName,
          },
        },
      });
      
      if (signUpError) {
        authService.error = signUpError.message;
        return;
      }
      
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            display_name: credentials.displayName,
            phone: credentials.phone,
            created_at: new Date().toISOString(),
          });
        
        if (profileError) {
          console.error('Profile creation error:', profileError);
        }
        
        authService.error = null;
        
        if (data.session) {
          authService.session = data.session;
          await loadUserProfile(data.user.id);
          nav('/');
        } else {
          nav('/auth/verify-email');
        }
      }
    } catch (err) {
      console.error('Registration error:', err);
      authService.error = 'Failed to create account. Please try again.';
    } finally {
      authService.isLoading = false;
    }
  });

  /**
   * Login with OAuth provider
   */
  authService.actions.loginWithProvider = $(async (provider: OAuthProvider) => {
    try {
      authService.error = null;
      
      const { error: providerError } = await supabase.auth.signInWithOAuth({
        provider: provider as any,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (providerError) {
        authService.error = `Failed to login with ${provider}`;
        console.error('OAuth error:', providerError);
      }
    } catch (err) {
      console.error('OAuth error:', err);
      authService.error = 'OAuth login failed. Please try again.';
    }
  });

  /**
   * Logout the current user
   */
  authService.actions.logout = $(async () => {
    try {
      authService.error = null;
      await supabase.auth.signOut();
      authService.user = null;
      authService.session = null;
      nav('/');
    } catch (err) {
      console.error('Logout error:', err);
      authService.error = 'Failed to logout. Please try again.';
    }
  });

  /**
   * Update user profile
   */
  authService.actions.updateProfile = $(async (data: UpdateProfileData) => {
    try {
      authService.error = null;
      
      if (!authService.user) {
        authService.error = 'You must be logged in to update your profile';
        return;
      }
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          display_name: data.displayName,
          avatar_url: data.avatar,
          phone: data.phone,
          updated_at: new Date().toISOString(),
        })
        .eq('id', authService.user.id);
      
      if (updateError) {
        authService.error = 'Failed to update profile';
        console.error('Profile update error:', updateError);
        return;
      }
      
      await loadUserProfile(authService.user.id);
    } catch (err) {
      console.error('Update profile error:', err);
      authService.error = 'Failed to update profile. Please try again.';
    }
  });

  /**
   * Send password reset email
   */
  authService.actions.resetPassword = $(async (email: string) => {
    try {
      authService.error = null;
      authService.isLoading = true;
      
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      
      if (resetError) {
        authService.error = resetError.message;
        return;
      }
    } catch (err) {
      console.error('Password reset error:', err);
      authService.error = 'Failed to send reset email. Please try again.';
    } finally {
      authService.isLoading = false;
    }
  });

  /**
   * Update password
   */
  authService.actions.updatePassword = $(async (newPassword: string) => {
    try {
      authService.error = null;
      authService.isLoading = true;
      
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });
      
      if (updateError) {
        authService.error = updateError.message;
        return;
      }
      
      await authService.actions.logout();
    } catch (err) {
      console.error('Update password error:', err);
      authService.error = 'Failed to update password. Please try again.';
    } finally {
      authService.isLoading = false;
    }
  });

  /**
   * Refresh the current session
   */
  authService.actions.refreshSession = $(async () => {
    try {
      const { data, error: refreshError } = await supabase.auth.refreshSession();
      if (refreshError) {
        console.error('Session refresh error:', refreshError);
        return;
      }
      if (data.session) {
        authService.session = data.session;
      }
    } catch (err) {
      console.error('Session refresh error:', err);
    }
  });

  /**
   * Clear error message
   */
  authService.actions.clearError = $(() => {
    authService.error = null;
  });

  // ============================================
  // PROVIDE CONTEXT VALUE
  // ============================================
  
  useContextProvider(AuthContext, authService);

  return <Slot />;
});
