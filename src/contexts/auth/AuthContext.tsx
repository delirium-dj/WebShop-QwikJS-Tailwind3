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
 * 
 * How to use in a component:
 * ```typescript
 * import { useAuth } from '~/contexts/auth';
 * 
 * export default component$(() => {
 *   const auth = useAuth();
 *   
 *   if (auth.user) {
 *     return <div>Welcome, {auth.user.email}!</div>;
 *   }
 *   
 *   return <button onClick$={auth.actions.login}>Login</button>;
 * });
 * ```
 */

import {
  component$,
  createContextId,
  useContextProvider,
  useSignal,
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
import type { Session } from '@supabase/supabase-js';

/**
 * Create the Auth Context ID
 * 
 * This is Qwik's way of creating a "global variable slot".
 * Think of it as giving a unique name to our auth state.
 * 
 * The string 'auth.context' is just an identifier - it could be anything,
 * but we make it descriptive for debugging.
 */
export const AuthContext = createContextId<AuthContextValue>('auth.context');

/**
 * AuthProvider Component
 * 
 * This component wraps your entire app (usually in layout.tsx).
 * It provides the auth state and functions to all child components.
 * 
 * Props:
 * - children (via <Slot />) - All the components inside this provider
 * 
 * Usage in layout.tsx:
 * ```typescript
 * export default component$(() => {
 *   return (
 *     <AuthProvider>
 *       <Header />
 *       <main>
 *         <Slot /> // Your page content
 *       </main>
 *       <Footer />
 *     </AuthProvider>
 *   );
 * });
 * ```
 */
export const AuthProvider = component$(() => {
  // ============================================
  // REACTIVE STATE (Signals)
  // ============================================
  // Signals are Qwik's reactive values - when they change,
  // only the parts of the UI that use them will update
  
  /**
   * Current logged-in user
   * null = no one is logged in
   */
  const user = useSignal<AuthUser | null>(null);
  
  /**
   * Current session (JWT token info)
   * null = no active session
   */
  const session = useSignal<Session | null>(null);
  
  /**
   * Loading state
   * true = we're checking if user is logged in (on initial page load)
   */
  const isLoading = useSignal<boolean>(true);
  
  /**
   * Error message
   * null = no errors
   * string = error to show to user
   */
  const error = useSignal<string | null>(null);
  
  /**
   * Navigation helper for redirects
   */
  const nav = useNavigate();

  // ============================================
  // INITIALIZATION (useVisibleTask$)
  // ============================================
  // This runs ONCE when the component first renders on the CLIENT
  // We use it to:
  // 1. Check if there's an existing session (from cookies/localStorage)
  // 2. Listen for auth state changes (login, logout, token refresh)
  
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async () => {
    /**
     * Get the current session on page load
     * 
     * Supabase automatically restores sessions from localStorage.
     * If the user was logged in before, this will restore their session.
     */
    const { data: { session: currentSession } } = await supabase.auth.getSession();
    
    if (currentSession) {
      session.value = currentSession;
      // Load user data (including profile info)
      await loadUserProfile(currentSession.user.id);
    }
    
    // Done checking - remove loading spinner
    isLoading.value = false;

    /**
     * Listen for auth state changes
     * 
     * This is called whenever:
     * - User logs in
     * - User logs out
     * - Session expires and gets refreshed
     * - User changes their email/password
     * 
     * We update our local state to match Supabase's state.
     */
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state changed:', event);
        
        session.value = currentSession;
        
        if (currentSession?.user) {
          await loadUserProfile(currentSession.user.id);
        } else {
          user.value = null;
        }
      }
    );

    /**
     * Cleanup function
     * 
     * When the component unmounts (page closes), we unsubscribe
     * from the auth listener to prevent memory leaks.
     */
    return () => {
      subscription.unsubscribe();
    };
  });

  // ============================================
  // HELPER FUNCTIONS
  // ============================================
  
  /**
   * Load user profile from the 'profiles' table
   * 
   * Why a separate function?
   * - Supabase Auth gives us basic info (id, email)
   * - We store extended info (name, avatar, phone) in a 'profiles' table
   * - This function fetches both and combines them
   * 
   * @param userId - The user's unique ID (UUID)
   */
  const loadUserProfile = $(async (userId: string) => {
    try {
      // Get basic user info from Supabase Auth
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        user.value = null;
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
        user.value = authUser as AuthUser;
        return;
      }
      
      // Combine auth user with profile data
      user.value = {
        ...authUser,
        displayName: profile?.display_name || authUser.user_metadata?.full_name,
        avatar: profile?.avatar_url || authUser.user_metadata?.avatar_url,
        phone: profile?.phone,
      } as AuthUser;
      
    } catch (err) {
      console.error('Failed to load user profile:', err);
      error.value = 'Failed to load user profile';
    }
  });

  // ============================================
  // AUTH ACTIONS
  // ============================================
  // These are the functions components will call to login, logout, etc.
  // They're wrapped in $() so Qwik can lazy-load them
  
  /**
   * Login with email and password
   */
  const login = $(async (credentials: LoginCredentials) => {
    try {
      error.value = null;
      isLoading.value = true;
      
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });
      
      if (loginError) {
        // Show friendly error messages
        if (loginError.message.includes('Invalid')) {
          error.value = 'Invalid email or password';
        } else if (loginError.message.includes('Email not confirmed')) {
          error.value = 'Please verify your email before logging in';
        } else {
          error.value = loginError.message;
        }
        return;
      }
      
      if (data.session) {
        session.value = data.session;
        await loadUserProfile(data.user.id);
        
        // Redirect to home page after successful login
        nav('/');
      }
    } catch (err) {
      console.error('Login error:', err);
      error.value = 'An unexpected error occurred. Please try again.';
    } finally {
      isLoading.value = false;
    }
  });

  /**
   * Register a new user
   */
  const register = $(async (credentials: RegisterCredentials) => {
    try {
      error.value = null;
      isLoading.value = true;
      
      // Validate password confirmation on frontend
      if (credentials.password !== credentials.confirmPassword) {
        error.value = 'Passwords do not match';
        return;
      }
      
      // Create auth account
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            // Store display name in user metadata
            full_name: credentials.displayName,
          },
        },
      });
      
      if (signUpError) {
        error.value = signUpError.message;
        return;
      }
      
      if (data.user) {
        // Create profile record in our 'profiles' table
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
          // Don't fail registration if profile creation fails
          // User can update their profile later
        }
        
        // Show success message
        error.value = null;
        
        // Check if email confirmation is required
        if (data.session) {
          // Auto-login if email confirmation is disabled
          session.value = data.session;
          await loadUserProfile(data.user.id);
          nav('/');
        } else {
          // Email confirmation required
          nav('/auth/verify-email');
        }
      }
    } catch (err) {
      console.error('Registration error:', err);
      error.value = 'Failed to create account. Please try again.';
    } finally {
      isLoading.value = false;
    }
  });

  /**
   * Login with OAuth provider (Google, GitHub, etc.)
   */
  const loginWithProvider = $(async (provider: OAuthProvider) => {
    try {
      error.value = null;
      
      const { error: providerError } = await supabase.auth.signInWithOAuth({
        provider: provider as any, // Cast to avoid TypeScript error with custom providers
        options: {
          // Where to redirect after OAuth completes
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (providerError) {
        error.value = `Failed to login with ${provider}`;
        console.error('OAuth error:', providerError);
      }
      
      // Note: The browser will redirect to the provider's login page
      // After login, they redirect back to /auth/callback
      // The callback page will handle the rest
    } catch (err) {
      console.error('OAuth error:', err);
      error.value = 'OAuth login failed. Please try again.';
    }
  });

  /**
   * Logout the current user
   */
  const logout = $(async () => {
    try {
      error.value = null;
      
      await supabase.auth.signOut();
      
      // Clear local state
      user.value = null;
      session.value = null;
      
      // Redirect to home page
      nav('/');
    } catch (err) {
      console.error('Logout error:', err);
      error.value = 'Failed to logout. Please try again.';
    }
  });

  /**
   * Update user profile
   */
  const updateProfile = $(async (data: UpdateProfileData) => {
    try {
      error.value = null;
      
      if (!user.value) {
        error.value = 'You must be logged in to update your profile';
        return;
      }
      
      // Update profile in database
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          display_name: data.displayName,
          avatar_url: data.avatar,
          phone: data.phone,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.value.id);
      
      if (updateError) {
        error.value = 'Failed to update profile';
        console.error('Profile update error:', updateError);
        return;
      }
      
      // Reload user profile to get updated data
      await loadUserProfile(user.value.id);
    } catch (err) {
      console.error('Update profile error:', err);
      error.value = 'Failed to update profile. Please try again.';
    }
  });

  /**
   * Send password reset email
   */
  const resetPassword = $(async (email: string) => {
    try {
      error.value = null;
      
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      
      if (resetError) {
        error.value = resetError.message;
        return;
      }
      
      // Success - email sent
      error.value = null;
    } catch (err) {
      console.error('Password reset error:', err);
      error.value = 'Failed to send reset email. Please try again.';
    }
  });

  /**
   * Update password (used in reset flow or account settings)
   */
  const updatePassword = $(async (newPassword: string) => {
    try {
      error.value = null;
      
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });
      
      if (updateError) {
        error.value = updateError.message;
        return;
      }
      
      error.value = null;
    } catch (err) {
      console.error('Update password error:', err);
      error.value = 'Failed to update password. Please try again.';
    }
  });

  /**
   * Refresh the current session
   */
  const refreshSession = $(async () => {
    try {
      const { data, error: refreshError } = await supabase.auth.refreshSession();
      
      if (refreshError) {
        console.error('Session refresh error:', refreshError);
        return;
      }
      
      if (data.session) {
        session.value = data.session;
      }
    } catch (err) {
      console.error('Session refresh error:', err);
    }
  });

  /**
   * Clear error message
   */
  const clearError = $(() => {
    error.value = null;
  });

  // ============================================
  // PROVIDE CONTEXT VALUE
  // ============================================
  // This makes the auth state and actions available to all child components
  
  const contextValue: AuthContextValue = {
    // State (these are signals, so components can access .value)
    user: user.value,
    session: session.value,
    isLoading: isLoading.value,
    error: error.value,
    
    // Actions (functions)
    actions: {
      login,
      register,
      loginWithProvider,
      logout,
      updateProfile,
      resetPassword,
      updatePassword,
      refreshSession,
      clearError,
    },
  };
  
  // Provide the context to all children
  useContextProvider(AuthContext, contextValue);

  // ============================================
  // RENDER
  // ============================================
  // Slot renders all child components
  return <Slot />;
});
