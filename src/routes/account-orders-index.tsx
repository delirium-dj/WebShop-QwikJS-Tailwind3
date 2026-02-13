/**
 * Order History Page
 * 
 * Displays all orders for the logged-in user.
 * 
 * For Junior Developers:
 * - This page is at /account/orders
 * - Protected by AuthGuard (via account/layout.tsx)
 * - Shows list of all user's orders
 * - Has filtering and search
 * - Shows statistics (total spent, active orders)
 * 
 * File Location: src/routes/account/orders/index.tsx
 */

import { component$, useSignal, useTask$, $ } from '@builder.io/qwik';
import { routeLoader$ } from '@builder.io/qwik-city';
import { useAuth } from '~/contexts/auth';
import {
  getOrderHistory,
} from '../services/orders.service';
import type { OrderFilters, OrderStatus, OrderHistoryResponse } from '../types/order.types';
import { OrderCard } from '../components/OrderCard';

/**
 * Server-side data loader
 * 
 * This runs on the SERVER before the page loads.
 * It fetches the initial order history.
 */
// eslint-disable-next-line qwik/loader-location
export const useOrderHistory = routeLoader$(async () => {
  // In a real app, you'd get userId from session/cookie
  // For now, we'll return null and load client-side
  // TODO: Implement server-side auth check
  return null;
});

/**
 * Order History Page Component
 */
export default component$(() => {
  // Get auth context to get user ID
  const auth = useAuth();
  
  // State for orders data
  const orderHistory = useSignal<OrderHistoryResponse | null>(null);
  const isLoading = useSignal(true);
  const error = useSignal<string | null>(null);
  
  // Filter state
  const selectedStatus = useSignal<OrderStatus | 'all'>('all');
  const searchTerm = useSignal('');
  const currentPage = useSignal(1);
  
  /**
   * Load orders
   * 
   * This runs on the CLIENT to fetch orders.
   * Re-runs when filters change.
   */
  useTask$(async ({ track }) => {
    // Track filter changes
    track(() => selectedStatus.value);
    track(() => searchTerm.value);
    track(() => currentPage.value);
    track(() => auth.state.user);
    
    // Don't load if no user
    if (!auth.state.user) {
      isLoading.value = false;
      return;
    }
    
    isLoading.value = true;
    error.value = null;
    
    try {
      // Build filters
      const filters: OrderFilters = {
        status: selectedStatus.value,
        searchTerm: searchTerm.value || undefined,
      };
      
      // Fetch order history
      const history = await getOrderHistory(auth.state.user.id, {
        page: currentPage.value,
        pageSize: 10,
        filters,
      });
      
      if (history) {
        orderHistory.value = history;
      } else {
        error.value = 'Failed to load orders';
      }
    } catch (err) {
      console.error('Error loading orders:', err);
      error.value = 'An error occurred while loading your orders';
    } finally {
      isLoading.value = false;
    }
  });
  
  /**
   * Handle status filter change
   */
  const handleStatusChange$ = $((newStatus: OrderStatus | 'all') => {
    selectedStatus.value = newStatus;
    currentPage.value = 1; // Reset to first page
  });
  
  /**
   * Handle search
   */
  const handleSearch$ = $((term: string) => {
    searchTerm.value = term;
    currentPage.value = 1; // Reset to first page
  });
  
  /**
   * Handle page change
   */
  const handlePageChange$ = $((page: number) => {
    currentPage.value = page;
  });
  
  return (
    <div class="space-y-6">
      {/* Page Header */}
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Order History</h2>
        <p class="mt-1 text-sm text-gray-600">
          View and manage all your orders
        </p>
      </div>
      
      {/* Statistics Cards */}
      {orderHistory.value?.statistics && (
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Total Orders */}
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p class="text-sm font-medium text-gray-600">Total Orders</p>
            <p class="mt-2 text-3xl font-bold text-gray-900">
              {orderHistory.value.statistics.totalOrders}
            </p>
          </div>
          
          {/* Total Spent */}
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p class="text-sm font-medium text-gray-600">Total Spent</p>
            <p class="mt-2 text-3xl font-bold text-gray-900">
              ${orderHistory.value.statistics.totalSpent.toFixed(2)}
            </p>
          </div>
          
          {/* Active Orders */}
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p class="text-sm font-medium text-gray-600">Active Orders</p>
            <p class="mt-2 text-3xl font-bold text-gray-900">
              {orderHistory.value.statistics.activeOrders}
            </p>
          </div>
        </div>
      )}
      
      {/* Filters */}
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div class="flex flex-col sm:flex-row gap-4">
          {/* Status Filter */}
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Filter by Status
            </label>
            <select
              value={selectedStatus.value}
              onChange$={(e) => handleStatusChange$((e.target as HTMLSelectElement).value as OrderStatus | 'all')}
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          
          {/* Search */}
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Search Orders
            </label>
            <input
              type="text"
              value={searchTerm.value}
              onInput$={(e) => handleSearch$((e.target as HTMLInputElement).value)}
              placeholder="Search by product name..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
      
      {/* Orders List */}
      {isLoading.value ? (
        // Loading State
        <div class="flex items-center justify-center py-12">
          <div class="text-center">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p class="text-gray-600">Loading your orders...</p>
          </div>
        </div>
      ) : error.value ? (
        // Error State
        <div class="bg-red-50 border-l-4 border-red-400 p-6">
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
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-red-700">{error.value}</p>
            </div>
          </div>
        </div>
      ) : orderHistory.value && orderHistory.value.orders.length > 0 ? (
        // Orders List
        <div class="space-y-4">
          {orderHistory.value.orders.map((order: any) => (
            <OrderCard key={order.id} order={order} />
          ))}
          
          {/* Pagination */}
          {orderHistory.value.pagination.totalPages > 1 && (
            <div class="flex items-center justify-center gap-2 mt-6">
              {/* Previous Button */}
              <button
                onClick$={() => handlePageChange$(currentPage.value - 1)}
                disabled={currentPage.value === 1}
                class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {/* Page Numbers */}
              <div class="flex gap-1">
                {Array.from({ length: orderHistory.value.pagination.totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick$={() => handlePageChange$(page)}
                    class={`
                      px-4 py-2 border rounded-md text-sm font-medium
                      ${
                        page === currentPage.value
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }
                    `}
                  >
                    {page}
                  </button>
                ))}
              </div>
              
              {/* Next Button */}
              <button
                onClick$={() => handlePageChange$(currentPage.value + 1)}
                disabled={currentPage.value === orderHistory.value.pagination.totalPages}
                class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>
      ) : (
        // Empty State
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <svg
            class="mx-auto h-16 w-16 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          <h3 class="text-lg font-medium text-gray-900 mb-2">
            No orders found
          </h3>
          <p class="text-gray-600 mb-6">
            {selectedStatus.value !== 'all' || searchTerm.value
              ? 'Try adjusting your filters'
              : "You haven't placed any orders yet"}
          </p>
          <a
            href="/shop"
            class="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Start Shopping
          </a>
        </div>
      )}
    </div>
  );
});
