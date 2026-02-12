/**
 * User Profile Page
 * 
 * The main account dashboard where users can view and edit their profile.
 * 
 * For Junior Developers:
 * - This is the page shown at /account (the index.tsx file)
 * - It's automatically wrapped by account/layout.tsx (which includes AuthGuard)
 * - Users must be logged in to see this page
 * 
 * Features:
 * - Display user information (name, email, phone)
 * - Edit profile (update name, phone)
 * - Upload/change avatar
 * - Change password
 * - Account statistics (future: order count, wishlist items)
 * 
 * File Location: src/routes/account/index.tsx
 */

import { component$, useSignal, $, useTask$ } from '@builder.io/qwik';
import { useAuth } from '~/contexts/auth';

/**
 * Profile Page Component
 */
export default component$(() => {
  // Get auth context
  const auth = useAuth();
  
  // ============================================
  // FORM STATE (Signals)
  // ============================================
  // These track the form inputs for profile editing
  
  const displayName = useSignal(auth.state.user?.displayName || '');
  const phone = useSignal(auth.state.user?.phone || '');
  const newPassword = useSignal('');
  const confirmPassword = useSignal('');
  
  // UI state signals
  const isEditingProfile = useSignal(false);
  const isChangingPassword = useSignal(false);
  const isSaving = useSignal(false);
  const saveMessage = useSignal<string | null>(null);
  const passwordMessage = useSignal<string | null>(null);
  
  /**
   * Initialize form with user data
   * 
   * This runs when the component mounts or when auth.state.user changes.
   * We use useTask$ instead of useVisibleTask$ because this doesn't
   * need browser APIs - it just updates signals.
   */
  useTask$(({ track }) => {
    // Track auth.state.user changes
    track(() => auth.state.user);
    
    // Update form fields with latest user data
    if (auth.state.user) {
      displayName.value = auth.state.user.displayName || '';
      phone.value = auth.state.user.phone || '';
    }
  });
  
  // ============================================
  // EVENT HANDLERS
  // ============================================
  
  /**
   * Handle profile update
   */
  const handleSaveProfile$ = $(async () => {
    try {
      isSaving.value = true;
      saveMessage.value = null;
      
      // Validate inputs
      if (!displayName.value.trim()) {
        saveMessage.value = 'Display name is required';
        return;
      }
      
      // Update profile via auth context
      await auth.actions.updateProfile({
        displayName: displayName.value.trim(),
        phone: phone.value.trim() || undefined,
      });
      
      // Success!
      saveMessage.value = 'Profile updated successfully!';
      isEditingProfile.value = false;
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        saveMessage.value = null;
      }, 3000);
      
    } catch (error) {
      console.error('Profile update error:', error);
      saveMessage.value = 'Failed to update profile. Please try again.';
    } finally {
      isSaving.value = false;
    }
  });
  
  /**
   * Handle password change
   */
  const handleChangePassword$ = $(async () => {
    try {
      isSaving.value = true;
      passwordMessage.value = null;
      
      // Validate passwords
      if (!newPassword.value || newPassword.value.length < 6) {
        passwordMessage.value = 'Password must be at least 6 characters';
        return;
      }
      
      if (newPassword.value !== confirmPassword.value) {
        passwordMessage.value = 'Passwords do not match';
        return;
      }
      
      // Update password via auth context
      await auth.actions.updatePassword(newPassword.value);
      
      // Success!
      passwordMessage.value = 'Password changed successfully!';
      isChangingPassword.value = false;
      
      // Clear form
      newPassword.value = '';
      confirmPassword.value = '';
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        passwordMessage.value = null;
      }, 3000);
      
    } catch (error) {
      console.error('Password change error:', error);
      passwordMessage.value = 'Failed to change password. Please try again.';
    } finally {
      isSaving.value = false;
    }
  });
  
  /**
   * Cancel editing
   */
  const handleCancelEdit$ = $(() => {
    // Reset form to original values
    if (auth.state.user) {
      displayName.value = auth.state.user.displayName || '';
      phone.value = auth.state.user.phone || '';
    }
    isEditingProfile.value = false;
    saveMessage.value = null;
  });
  
  /**
   * Cancel password change
   */
  const handleCancelPasswordChange$ = $(() => {
    newPassword.value = '';
    confirmPassword.value = '';
    isChangingPassword.value = false;
    passwordMessage.value = null;
  });

  // ============================================
  // RENDER
  // ============================================

  return (
    <div class="space-y-6">
      {/* Page Header */}
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Profile Information</h2>
        <p class="mt-1 text-sm text-gray-600">
          Update your account information and manage your profile.
        </p>
      </div>

      {/* Profile Card */}
      <div class="bg-white shadow rounded-lg">
        {/* Card Header with Avatar */}
        <div class="px-6 py-5 border-b border-gray-200">
          <div class="flex items-center">
            {/* Avatar */}
            <div class="flex-shrink-0">
              {auth.state.user?.avatar ? (
                <img
                  class="h-20 w-20 rounded-full object-cover"
                  src={auth.state.user.avatar}
                  width={80}
                  height={80}
                  alt={auth.state.user.displayName || 'User avatar'}
                />
              ) : (
                // Default avatar with initials
                <div class="h-20 w-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-semibold">
                  {auth.state.user?.displayName?.charAt(0).toUpperCase() ||
                   auth.state.user?.email?.charAt(0).toUpperCase() ||
                   'U'}
                </div>
              )}
            </div>
            
            {/* User Info */}
            <div class="ml-5 flex-1">
              <h3 class="text-lg font-medium text-gray-900">
                {auth.state.user?.displayName || 'User'}
              </h3>
              <p class="text-sm text-gray-500">{auth.state.user?.email}</p>
              <p class="mt-1 text-xs text-gray-400">
                Member since {new Date(auth.state.user?.created_at || Date.now()).toLocaleDateString()}
              </p>
            </div>
            
            {/* Edit Button */}
            {!isEditingProfile.value && (
              <button
                onClick$={() => (isEditingProfile.value = true)}
                class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Card Body */}
        <div class="px-6 py-5">
          {/* Success/Error Message */}
          {saveMessage.value && (
            <div
              class={`mb-4 p-4 rounded-md ${
                saveMessage.value.includes('success')
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {saveMessage.value}
            </div>
          )}
          
          {/* Profile Form */}
          <div class="space-y-6">
            {/* Display Name Field */}
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Display Name
              </label>
              {isEditingProfile.value ? (
                <input
                  type="text"
                  value={displayName.value}
                  onInput$={(e) => (displayName.value = (e.target as HTMLInputElement).value)}
                  class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your name"
                />
              ) : (
                <p class="text-gray-900">{displayName.value || 'Not set'}</p>
              )}
            </div>

            {/* Email Field (Read-only) */}
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <p class="text-gray-900">{auth.state.user?.email}</p>
              <p class="mt-1 text-xs text-gray-500">
                Email cannot be changed. Contact support if you need to update it.
              </p>
            </div>

            {/* Phone Field */}
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              {isEditingProfile.value ? (
                <input
                  type="tel"
                  value={phone.value}
                  onInput$={(e) => (phone.value = (e.target as HTMLInputElement).value)}
                  class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+1 (555) 123-4567"
                />
              ) : (
                <p class="text-gray-900">{phone.value || 'Not set'}</p>
              )}
            </div>

            {/* Action Buttons (when editing) */}
            {isEditingProfile.value && (
              <div class="flex gap-3">
                <button
                  onClick$={handleSaveProfile$}
                  disabled={isSaving.value}
                  class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving.value ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick$={handleCancelEdit$}
                  disabled={isSaving.value}
                  class="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Password Change Section */}
      <div class="bg-white shadow rounded-lg">
        <div class="px-6 py-5 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-medium text-gray-900">Password</h3>
              <p class="mt-1 text-sm text-gray-600">
                Update your password to keep your account secure
              </p>
            </div>
            {!isChangingPassword.value && (
              <button
                onClick$={() => (isChangingPassword.value = true)}
                class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Change Password
              </button>
            )}
          </div>
        </div>

        {isChangingPassword.value && (
          <div class="px-6 py-5">
            {/* Password Message */}
            {passwordMessage.value && (
              <div
                class={`mb-4 p-4 rounded-md ${
                  passwordMessage.value.includes('success')
                    ? 'bg-green-50 text-green-800 border border-green-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                {passwordMessage.value}
              </div>
            )}

            <div class="space-y-4">
              {/* New Password */}
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword.value}
                  onInput$={(e) => (newPassword.value = (e.target as HTMLInputElement).value)}
                  class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter new password"
                />
                <p class="mt-1 text-xs text-gray-500">
                  Minimum 6 characters
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword.value}
                  onInput$={(e) => (confirmPassword.value = (e.target as HTMLInputElement).value)}
                  class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Confirm new password"
                />
              </div>

              {/* Action Buttons */}
              <div class="flex gap-3">
                <button
                  onClick$={handleChangePassword$}
                  disabled={isSaving.value}
                  class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving.value ? 'Changing...' : 'Change Password'}
                </button>
                <button
                  onClick$={handleCancelPasswordChange$}
                  disabled={isSaving.value}
                  class="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Account Stats (Future Enhancement) */}
      <div class="bg-white shadow rounded-lg">
        <div class="px-6 py-5">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Account Overview</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Orders */}
            <div class="text-center p-4 bg-blue-50 rounded-lg">
              <p class="text-3xl font-bold text-blue-600">0</p>
              <p class="text-sm text-gray-600 mt-1">Total Orders</p>
            </div>
            
            {/* Wishlist Items */}
            <div class="text-center p-4 bg-purple-50 rounded-lg">
              <p class="text-3xl font-bold text-purple-600">0</p>
              <p class="text-sm text-gray-600 mt-1">Wishlist Items</p>
            </div>
            
            {/* Saved Addresses */}
            <div class="text-center p-4 bg-green-50 rounded-lg">
              <p class="text-3xl font-bold text-green-600">0</p>
              <p class="text-sm text-gray-600 mt-1">Saved Addresses</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
