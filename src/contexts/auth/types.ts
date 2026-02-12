/**
 * Auth Types
 * 
 * This file contains all TypeScript interfaces and types used throughout
 * the authentication system.
 * 
 * For Junior Developers:
 * - Types help catch errors before code runs
 * - They act as documentation for what data looks like
 * - IDEs use them to provide autocomplete and error checking
 * - Think of them as "contracts" that define data shapes
 */

import type { User, Session } from '@supabase/supabase-js';

/**
 * AuthUser - Extended user profile information
 * 
 * This combines Supabase's built-in User type with our custom profile data.
 * 
 * Why extend the User type?
 * - Supabase's User has: id, email, created_at, etc.
 * - We want to add: displayName, avatar, phone
 * - This type gives us both in one place
 */
export interface AuthUser extends User {
  // Custom fields from our 'profiles' table
  displayName?: string;      // User's full name (e.g., "John Doe")
  avatar?: string;           // URL to profile picture
  phone?: string;            // Phone number (optional)
  
  // These are already in Supabase User but we make them explicit:
  // id: string               - Unique user ID (UUID)
  // email: string            - User's email address
  // created_at: string       - When account was created
  // email_confirmed_at: string | null - When email was verified
}

/**
 * AuthState - The complete authentication state
 * 
 * This represents ALL the auth-related information our app needs.
 * It's stored in Qwik signals in the AuthContext.
 * 
 * Think of it as a "snapshot" of the current auth status:
 * - Who is logged in? (user)
 * - What's their session token? (session)
 * - Are we still checking? (isLoading)
 * - Did something go wrong? (error)
 */
export interface AuthState {
  /**
   * The currently logged-in user
   * 
   * - null = No one is logged in
   * - AuthUser = Someone is logged in with their info
   */
  user: AuthUser | null;
  
  /**
   * The current session (JWT token info)
   * 
   * - null = No active session
   * - Session = Contains access_token, refresh_token, expires_at
   * 
   * What's a session?
   * Think of it as a "login ticket" that proves you're authenticated.
   * It expires after a certain time (usually 1 hour), then gets refreshed.
   */
  session: Session | null;
  
  /**
   * Loading state flag
   * 
   * true = We're checking if user is logged in (on page load)
   * false = We've finished checking, user is either logged in or not
   * 
   * Use this to show spinners: "Checking your login status..."
   */
  isLoading: boolean;
  
  /**
   * Error message (if something went wrong)
   * 
   * null = No errors
   * string = Error message to show to user
   * 
   * Examples:
   * - "Invalid email or password"
   * - "Email already registered"
   * - "Session expired, please log in again"
   */
  error: string | null;
}

/**
 * LoginCredentials - Email/password login form data
 * 
 * This is what we send to Supabase when user submits the login form.
 */
export interface LoginCredentials {
  email: string;        // User's email address
  password: string;     // User's password (sent securely over HTTPS)
}

/**
 * RegisterCredentials - Registration form data
 * 
 * This is what we collect when a new user signs up.
 * 
 * Why more fields than login?
 * - We want to collect their name upfront
 * - Phone is optional but nice to have
 * - We need to confirm their password to prevent typos
 */
export interface RegisterCredentials {
  email: string;               // User's email address
  password: string;            // User's chosen password
  confirmPassword: string;     // Must match password (checked on frontend)
  displayName: string;         // User's full name
  phone?: string;              // Optional phone number
}

/**
 * UpdateProfileData - Data for updating user profile
 * 
 * All fields are optional because user might only want to update one thing.
 * For example, they might just change their name and leave everything else.
 */
export interface UpdateProfileData {
  displayName?: string;   // Update full name
  avatar?: string;        // Update profile picture URL
  phone?: string;         // Update phone number
  // Note: Email changes are handled separately via Supabase's changeEmail()
  // Note: Password changes use Supabase's updatePassword()
}

/**
 * AuthActions - All authentication functions
 * 
 * This interface defines what actions our Auth Context provides.
 * Think of it as a "menu" of things you can do with authentication.
 * 
 * Why group them in an interface?
 * - Makes it easy to see all available actions in one place
 * - TypeScript can check if we implemented everything
 * - Autocomplete works better in your IDE
 */
export interface AuthActions {
  /**
   * Login with email and password
   * 
   * @param credentials - Email and password from login form
   * @returns Promise that resolves when login succeeds or fails
   * 
   * Usage:
   * await auth.actions.login({ email: 'user@example.com', password: 'pass123' });
   */
  login: (credentials: LoginCredentials) => Promise<void>;
  
  /**
   * Register a new user account
   * 
   * @param credentials - Email, password, name, etc. from signup form
   * @returns Promise that resolves when registration succeeds or fails
   * 
   * What happens internally:
   * 1. Create auth account in Supabase Auth
   * 2. Create profile record in 'profiles' table
   * 3. Send verification email (if enabled)
   */
  register: (credentials: RegisterCredentials) => Promise<void>;
  
  /**
   * Login with a social provider (Google, GitHub, etc.)
   * 
   * @param provider - Social login provider (e.g., 'google', 'github', 'gitlab')
   * 
   * How OAuth works:
   * 1. User clicks "Sign in with Google"
   * 2. We redirect to Google's login page
   * 3. User logs in to Google and approves our app
   * 4. Google redirects back to us with a token
   * 5. We use that token to log the user in
   */
  loginWithProvider: (provider: OAuthProvider) => Promise<void>;
  
  /**
   * Log out the current user
   * 
   * What happens:
   * 1. Clears the session from Supabase
   * 2. Removes tokens from localStorage/cookies
   * 3. Updates AuthState to { user: null, session: null }
   * 4. Redirects to home page
   */
  logout: () => Promise<void>;
  
  /**
   * Update user profile information
   * 
   * @param data - Fields to update (all optional)
   * 
   * Example:
   * await auth.actions.updateProfile({ displayName: 'New Name' });
   */
  updateProfile: (data: UpdateProfileData) => Promise<void>;
  
  /**
   * Send password reset email
   * 
   * @param email - User's email address
   * 
   * Flow:
   * 1. User enters email on "Forgot Password" page
   * 2. Supabase sends email with reset link
   * 3. User clicks link → goes to /auth/reset-password
   * 4. User enters new password
   */
  resetPassword: (email: string) => Promise<void>;
  
  /**
   * Update user's password
   * 
   * @param newPassword - The new password
   * 
   * Used in two scenarios:
   * 1. User is logged in and wants to change password
   * 2. User clicked reset link from email
   */
  updatePassword: (newPassword: string) => Promise<void>;
  
  /**
   * Refresh the current session
   * 
   * Sessions expire (usually after 1 hour). This gets a new token.
   * Supabase usually does this automatically, but sometimes we need
   * to force it (e.g., after updating profile).
   */
  refreshSession: () => Promise<void>;
  
  /**
   * Clear any error messages
   * 
   * Use this when user dismisses an error notification
   * or starts a new form submission.
   */
  clearError: () => void;
}

/**
 * AuthContextValue - The complete value of AuthContext
 * 
 * This is what components get when they call useAuth().
 * It combines the current state with available actions.
 * 
 * Example usage in a component:
 * 
 * const auth = useAuth();
 * 
 * // Access state:
 * if (auth.user) {
 *   console.log('User is logged in:', auth.user.email);
 * }
 * 
 * // Call actions:
 * await auth.actions.login({ email, password });
 */
export interface AuthContextValue {
  /**
   * Current authentication state
   * In Qwik, these are signals (reactive values)
   */
  user: AuthUser | null;
  session: Session | null;
  isLoading: boolean;
  error: string | null;
  
  /**
   * Available actions (functions)
   */
  actions: AuthActions;
}

/**
 * OAuth Provider Type
 * 
 * Defines which social login providers we support.
 * These match Supabase's built-in OAuth providers.
 * 
 * Note: Supabase supports many providers, but we list the most common ones here.
 * Add more as needed from Supabase's Provider type.
 */
export type OAuthProvider = 
  | 'google' 
  | 'github' 
  | 'gitlab'
  | 'bitbucket'
  | 'azure'
  | 'facebook'
  | 'twitter'
  | 'discord'
  | 'twitch'
  | 'linkedin'
  | 'spotify'
  | 'slack'
  | 'apple';

/**
 * Auth Error Codes
 * 
 * Common error codes from Supabase Auth.
 * Use these to show friendly error messages to users.
 */
export enum AuthErrorCode {
  INVALID_CREDENTIALS = 'invalid_credentials',
  EMAIL_NOT_CONFIRMED = 'email_not_confirmed',
  USER_ALREADY_EXISTS = 'user_already_registered',
  WEAK_PASSWORD = 'weak_password',
  SESSION_EXPIRED = 'session_expired',
  NETWORK_ERROR = 'network_request_failed',
  UNKNOWN = 'unknown_error',
}

/**
 * Helper type for form validation errors
 * 
 * Used in login/register forms to show field-specific errors.
 */
export interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  displayName?: string;
  phone?: string;
  general?: string;  // For errors that don't fit a specific field
}
