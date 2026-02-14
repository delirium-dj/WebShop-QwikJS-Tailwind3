/**
 * Addresses Page
 * 
 * Displays user's saved shipping/billing addresses and allows adding new ones.
 * 
 * Features:
 * - List all saved addresses
 * - Add new address form
 * - Delete address action
 * - Set default address (future)
 */

import { component$, useSignal } from '@builder.io/qwik';
import { routeLoader$, routeAction$, Form, z, zod$ } from '@builder.io/qwik-city';
import { supabase } from '~/lib/supabase';

/**
 * Address Interface
 */
interface Address {
  id: string;
  full_name: string;
  street_line1: string;
  street_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
}

/**
 * Server Loader: Fetch Addresses
 */
export const useAddressesLoader = routeLoader$(async ({ fail }) => {
  // Get user from sharedMap (populated by AuthGuard/layout)
  // We can also double-check with supabase.auth.getUser() on server
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return fail(401, { message: 'Unauthorized' });
  }

  const { data, error } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching addresses:', error);
    return [];
  }

  return data as Address[];
});

/**
 * Server Action: Add Address
 */
export const useAddAddressAction = routeAction$(
  async (data, { fail }) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return fail(401, { message: 'Unauthorized' });
    }

    const { error } = await supabase
      .from('addresses')
      .insert({
        user_id: user.id,
        full_name: data.fullName,
        street_line1: data.streetLine1,
        street_line2: data.streetLine2,
        city: data.city,
        state: data.state,
        postal_code: data.postalCode,
        country: data.country,
        is_default: data.isDefault === 'on', // Checkbox returns 'on'
      });

    if (error) {
      console.error('Error adding address:', error);
      return fail(500, { message: 'Failed to add address' });
    }

    return { success: true };
  },
  zod$({
    fullName: z.string().min(1, 'Full name is required'),
    streetLine1: z.string().min(1, 'Street address is required'),
    streetLine2: z.string().optional(),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    postalCode: z.string().min(1, 'Postal code is required'),
    country: z.string().min(1, 'Country is required'),
    isDefault: z.string().optional(),
  })
);

/**
 * Server Action: Delete Address
 */
export const useDeleteAddressAction = routeAction$(async ({ id }, { fail }) => {
  const { data: { user } } = await supabase.auth.getUser();
    
  if (!user) {
    return fail(401, { message: 'Unauthorized' });
  }

  const { error } = await supabase
    .from('addresses')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id); // Security: Ensure deleting own address

  if (error) {
    return fail(500, { message: 'Failed to delete address' });
  }

  return { success: true };
});

export default component$(() => {
  const addresses = useAddressesLoader();
  const addAddress = useAddAddressAction();
  const deleteAddress = useDeleteAddressAction();
  
  const isFormOpen = useSignal(false);
  
  // Reset form when successful
  // useTask$(({ track }) => {
  //   track(() => addAddress.value?.success);
  //   if (addAddress.value?.success) {
  //     isFormOpen.value = false;
  //   }
  // });

  return (
    <div class="space-y-6">
      <div class="flex justify-between items-center bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">My Addresses</h2>
          <p class="mt-1 text-sm text-gray-600">
            Manage your shipping and billing addresses
          </p>
        </div>
        <button
          onClick$={() => isFormOpen.value = !isFormOpen.value}
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          {isFormOpen.value ? 'Cancel' : 'Add New Address'}
        </button>
      </div>

      {/* Add Address Form */}
      {isFormOpen.value && (
        <div class="bg-white rounded-lg shadow border border-gray-200 p-6 animate-fadeIn">
          <h3 class="text-lg font-medium text-gray-900 mb-4">New Address</h3>
          
          <Form action={addAddress} onSubmitCompleted$={() => isFormOpen.value = false}>
            <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              
              <div class="sm:col-span-6">
                <label for="fullName" class="block text-sm font-medium text-gray-700">Full name</label>
                <div class="mt-1">
                  <input type="text" name="fullName" id="fullName" autocomplete="name" required class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border" />
                </div>
              </div>

              <div class="sm:col-span-6">
                <label for="streetLine1" class="block text-sm font-medium text-gray-700">Street address</label>
                <div class="mt-1">
                  <input type="text" name="streetLine1" id="streetLine1" autocomplete="street-address" required class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border" />
                </div>
              </div>

              <div class="sm:col-span-6">
                <label for="streetLine2" class="block text-sm font-medium text-gray-700">Apartment, suite, etc.</label>
                <div class="mt-1">
                  <input type="text" name="streetLine2" id="streetLine2" class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border" />
                </div>
              </div>

              <div class="sm:col-span-2">
                <label for="city" class="block text-sm font-medium text-gray-700">City</label>
                <div class="mt-1">
                  <input type="text" name="city" id="city" autocomplete="address-level2" required class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border" />
                </div>
              </div>

              <div class="sm:col-span-2">
                <label for="state" class="block text-sm font-medium text-gray-700">State / Province</label>
                <div class="mt-1">
                  <input type="text" name="state" id="state" autocomplete="address-level1" required class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border" />
                </div>
              </div>

              <div class="sm:col-span-2">
                <label for="postalCode" class="block text-sm font-medium text-gray-700">ZIP / Postal code</label>
                <div class="mt-1">
                  <input type="text" name="postalCode" id="postalCode" autocomplete="postal-code" required class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border" />
                </div>
              </div>
              
              <div class="sm:col-span-3">
                <label for="country" class="block text-sm font-medium text-gray-700">Country</label>
                <div class="mt-1">
                  <select id="country" name="country" autocomplete="country-name" class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border">
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="UK">United Kingdom</option>
                  </select>
                </div>
              </div>

              <div class="sm:col-span-6">
                <div class="flex items-start">
                  <div class="flex items-center h-5">
                    <input id="isDefault" name="isDefault" type="checkbox" class="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded" />
                  </div>
                  <div class="ml-3 text-sm">
                    <label for="isDefault" class="font-medium text-gray-700">Set as default address</label>
                  </div>
                </div>
              </div>

            </div>
            
            <div class="mt-6 flex justify-end">
               <button
                type="submit"
                disabled={addAddress.isRunning}
                class="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {addAddress.isRunning ? 'Saving...' : 'Save Address'}
              </button>
            </div>
            
            {addAddress.value?.failed && (
              <div class="mt-4 text-red-600 text-sm">
                {addAddress.value.message}
              </div>
            )}
          </Form>
        </div>
      )}

      {/* Error State */}
      {'message' in addresses.value && (
        <div class="bg-red-50 border-l-4 border-red-400 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-red-700">
                {(addresses.value as any).message || 'Failed to load addresses'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Addresses List or Empty State */}
      {Array.isArray(addresses.value) && addresses.value.length === 0 ? (
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">No addresses saved</h3>
          <p class="text-gray-600 mb-6">
            You haven't added any addresses yet.
          </p>
          <button
            onClick$={() => isFormOpen.value = true}
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Add New Address
          </button>
        </div>
      ) : Array.isArray(addresses.value) ? (
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {addresses.value.map((address) => (
            <div key={address.id} class="bg-white border border-gray-200 rounded-lg shadow-sm p-6 relative hover:shadow-md transition-shadow">
              {address.is_default && (
                <span class="absolute top-4 right-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Default
                </span>
              )}
              
              <div class="flex flex-col h-full">
                <div class="flex-grow">
                  <h3 class="text-lg font-medium text-gray-900">{address.full_name}</h3>
                  <div class="mt-2 text-sm text-gray-600 space-y-1">
                    <p>{address.street_line1}</p>
                    {address.street_line2 && <p>{address.street_line2}</p>}
                    <p>{address.city}, {address.state} {address.postal_code}</p>
                    <p>{address.country}</p>
                  </div>
                </div>
                
                <div class="mt-6 border-t border-gray-100 pt-4 flex space-x-4">
                  <button class="text-sm font-medium text-blue-600 hover:text-blue-500">
                    Edit
                  </button>
                  <button 
                    class="text-sm font-medium text-red-600 hover:text-red-500"
                    onClick$={() => {
                        if(confirm('Are you sure you want to delete this address?')) {
                            deleteAddress.submit?.({ id: address.id });
                        }
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
});
