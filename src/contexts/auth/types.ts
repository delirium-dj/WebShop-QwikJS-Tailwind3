/**
 * Auth Types
 * 
 * WHAT: This file defines the "Blueprint" for our authentication data.
 * WHY: We use TypeScript interfaces to ensure that every developer uses the same 
 * names for variables (like 'email' vs 'userEmail'). If someone makes a typo, 
 * the editor will show a red underline immediately.
 * 
 * JUNIOR TIP: Think of an 'interface' like a required checklist for an object.
 */

import type { User, Session } from '@supabase/supabase-js';
import type { PropFunction } from '@builder.io/qwik';

/**
 * AuthUser - Extended user profile information
 */
export interface AuthUser extends User {
  displayName?: string;
  avatar?: string;
  phone?: string;
}

/**
 * AuthState - The complete authentication state
 */
export interface AuthState {
  user: AuthUser | null;
  session: Session | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * LoginCredentials - Email/password login form data
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * RegisterCredentials - Registration form data
 */
export interface RegisterCredentials {
  email: string;
  password: string;
  confirmPassword: string;
  displayName: string;
  phone?: string;
}

/**
 * UpdateProfileData - Data for updating user profile
 */
export interface UpdateProfileData {
  displayName?: string;
  avatar?: string;
  phone?: string;
}

/**
 * AuthActions - All authentication functions
 */
export interface AuthActions {
  login: PropFunction<(credentials: LoginCredentials) => Promise<void>>;
  register: PropFunction<(credentials: RegisterCredentials) => Promise<void>>;
  loginWithProvider: PropFunction<(provider: OAuthProvider) => Promise<void>>;
  logout: PropFunction<() => Promise<void>>;
  updateProfile: PropFunction<(data: UpdateProfileData) => Promise<void>>;
  resetPassword: PropFunction<(email: string) => Promise<void>>;
  updatePassword: PropFunction<(newPassword: string) => Promise<void>>;
  refreshSession: PropFunction<() => Promise<void>>;
  clearError: PropFunction<() => void>;
}

/**
 * AuthContextValue - The complete value of AuthContext
 */
export interface AuthContextValue {
  state: AuthState;
  actions: AuthActions;
}

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

export enum AuthErrorCode {
  INVALID_CREDENTIALS = 'invalid_credentials',
  EMAIL_NOT_CONFIRMED = 'email_not_confirmed',
  USER_ALREADY_EXISTS = 'user_already_registered',
  WEAK_PASSWORD = 'weak_password',
  SESSION_EXPIRED = 'session_expired',
  NETWORK_ERROR = 'network_request_failed',
  UNKNOWN = 'unknown_error',
}

export interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  displayName?: string;
  phone?: string;
  general?: string;
}
