/**
 * Order Details Page
 * 
 * Shows complete information about a single order.
 * 
 * For Junior Developers:
 * - This page is at /account/orders/[id]
 * - The [id] part is dynamic - it's the order ID
 * - Protected by AuthGuard (via account/layout.tsx)
 * - Shows: all items, shipping address, payment, tracking
 * - Users can cancel pending orders
 * 
 * File Location: src/routes/account/orders/[id]/index.tsx
 */

import { component$, useSignal, useTask$, $ } from '@builder.io/qwik';
import { routeLoader$, useNavigate } from '@builder.io/qwik-city';
import { useAuth } from '~/contexts/auth';
import {
  getOrderById,
  cancelOrder,
} from '../services/orders.service';
import type { Order } from '../types/order.types';
import { OrderStatusBadge } from '../components/OrderStatusBadge';

/**
 * Server-side data loader
 * 
 * Extracts the order ID from the URL.
 */
// eslint-disable-next-line qwik/loader-location
export const useOrderId = routeLoader$(({ params }) => {
  return params.id;
});

/**
 * Order Details Page Component
 */
export default component$(() => {
  // Get order ID from URL
  const orderIdLoader = useOrderId();
  const orderId = orderIdLoader.value;
  
  // Get auth context
  const auth = useAuth();
  
  // Navigation
  const nav = useNavigate();
  
  // State
  const order = useSignal<Order | null>(null);
  const isLoading = useSignal(true);
  const error = useSignal<string | null>(null);
  const isCancelling = useSignal(false);
  
  /**
   * Load order details
   */
  useTask$(async ({ track }) => {
    track(() => auth.state.user);
    
    if (!auth.state.user || !orderId) {
      isLoading.value = false;
      return;
    }
    
    isLoading.value = true;
    error.value = null;
    
    try {
      const orderData = await getOrderById(orderId, auth.state.user.id);
      
      if (orderData) {
        order.value = orderData;
      } else {
        error.value = 'Order not found';
      }
    } catch (err) {
      console.error('Error loading order:', err);
      error.value = 'Failed to load order details';
    } finally {
      isLoading.value = false;
    }
  });
  
  /**
   * Handle cancel order
   */
  const handleCancelOrder$ = $(async () => {
    if (!order.value || !auth.state.user) return;
    
    // Confirm cancellation
    if (!confirm('Are you sure you want to cancel this order?')) {
      return;
    }
    
    isCancelling.value = true;
    
    try {
      const cancelled = await cancelOrder(order.value.id, auth.state.user.id);
      
      if (cancelled) {
        order.value = cancelled;
        alert('Order cancelled successfully');
      } else {
        alert('Failed to cancel order. Please contact support.');
      }
    } catch (err) {
      console.error('Error cancelling order:', err);
      alert('An error occurred while cancelling the order');
    } finally {
      isCancelling.value = false;
    }
  });
  
  /**
   * Handle reorder
   */
  const handleReorder$ = $(() => {
    // TODO: Implement reorder functionality
    // For now, just show alert
    alert('Reorder functionality coming soon!');
  });
  
  // Loading state
  if (isLoading.value) {
    return (
      <div class="flex items-center justify-center py-12">
        <div class="text-center">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p class="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error.value || !order.value) {
    return (
      <div class="text-center py-12">
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
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">
          {error.value || 'Order not found'}
        </h3>
        <button
          onClick$={() => nav('/account/orders')}
          class="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Back to Orders
        </button>
      </div>
    );
  }
  
  // Format date
  const orderDate = new Date(order.value.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  return (
    <div class="space-y-6">
      {/* Back Button */}
      <button
        onClick$={() => nav('/account/orders')}
        class="flex items-center gap-2 text-blue-600 hover:text-blue-700"
      >
        <svg
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Orders
      </button>
      
      {/* Page Header */}
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 mb-1">
              Order {order.value.orderNumber}
            </h1>
            <p class="text-sm text-gray-600">
              Placed on {orderDate}
            </p>
          </div>
          
          <OrderStatusBadge status={order.value.status} size="lg" />
        </div>
        
        {/* Quick Stats */}
        <div class="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <p class="text-sm text-gray-600">Items</p>
            <p class="font-medium text-gray-900">
              {order.value.items.reduce((sum, item) => sum + item.quantity, 0)}
            </p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Total</p>
            <p class="font-medium text-gray-900">
              ${order.value.total.toFixed(2)}
            </p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Payment</p>
            <p class="font-medium text-gray-900 capitalize">
              {order.value.paymentMethod.replace('_', ' ')}
            </p>
          </div>
        </div>
      </div>
      
      {/* Order Items */}
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">Order Items</h2>
        </div>
        <div class="divide-y divide-gray-200">
          {order.value.items.map((item) => (
            <div key={item.id} class="p-6 flex gap-4">
              {/* Product Image */}
              <div class="flex-shrink-0">
                <img
                  src={item.image}
                  alt={item.title}
                  width={96}
                  height={96}
                  class="w-24 h-24 object-contain rounded border border-gray-200"
                />
              </div>
              
              {/* Product Info */}
              <div class="flex-1 min-w-0">
                <h3 class="font-medium text-gray-900 mb-1">{item.title}</h3>
                
                {/* Variant Info */}
                {item.variant && (
                  <p class="text-sm text-gray-600 mb-2">
                    {item.variant.size && `Size: ${item.variant.size}`}
                    {item.variant.size && item.variant.color && ' • '}
                    {item.variant.color && `Color: ${item.variant.color}`}
                  </p>
                )}
                
                {/* Quantity and Price */}
                <div class="flex items-center gap-4 text-sm text-gray-600">
                  <span>Quantity: {item.quantity}</span>
                  <span>•</span>
                  <span>Price: ${item.price.toFixed(2)}</span>
                </div>
              </div>
              
              {/* Subtotal */}
              <div class="flex-shrink-0 text-right">
                <p class="font-medium text-gray-900">
                  ${item.subtotal.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Order Summary */}
        <div class="p-6 border-t border-gray-200 bg-gray-50">
          <div class="max-w-xs ml-auto space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Subtotal</span>
              <span class="text-gray-900">${order.value.subtotal.toFixed(2)}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Shipping</span>
              <span class="text-gray-900">${order.value.shippingCost.toFixed(2)}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Tax</span>
              <span class="text-gray-900">${order.value.tax.toFixed(2)}</span>
            </div>
            <div class="flex justify-between text-lg font-semibold pt-2 border-t border-gray-300">
              <span class="text-gray-900">Total</span>
              <span class="text-gray-900">${order.value.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Shipping Information */}
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Shipping Information</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Shipping Address */}
          <div>
            <h3 class="text-sm font-medium text-gray-700 mb-2">Delivery Address</h3>
            <div class="text-sm text-gray-900">
              <p>{order.value.shippingAddress.fullName}</p>
              <p>{order.value.shippingAddress.addressLine1}</p>
              {order.value.shippingAddress.addressLine2 && (
                <p>{order.value.shippingAddress.addressLine2}</p>
              )}
              <p>
                {order.value.shippingAddress.city}, {order.value.shippingAddress.state}{' '}
                {order.value.shippingAddress.postalCode}
              </p>
              <p>{order.value.shippingAddress.country}</p>
              <p class="mt-2">Phone: {order.value.shippingAddress.phone}</p>
            </div>
          </div>
          
          {/* Tracking Info */}
          <div>
            <h3 class="text-sm font-medium text-gray-700 mb-2">Tracking Information</h3>
            {order.value.trackingNumber ? (
              <div class="text-sm">
                <p class="text-gray-600 mb-1">Tracking Number:</p>
                <p class="font-mono text-gray-900 mb-3">{order.value.trackingNumber}</p>
                {order.value.estimatedDelivery && (
                  <div>
                    <p class="text-gray-600 mb-1">Estimated Delivery:</p>
                    <p class="text-gray-900">
                      {new Date(order.value.estimatedDelivery).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p class="text-sm text-gray-600">
                Tracking information will be available once your order ships.
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div class="flex gap-3 flex-wrap">
        {/* Reorder Button */}
        {order.value.status === 'delivered' && (
          <button
            onClick$={handleReorder$}
            class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Reorder
          </button>
        )}
        
        {/* Cancel Order Button */}
        {(order.value.status === 'pending' || order.value.status === 'processing') && (
          <button
            onClick$={handleCancelOrder$}
            disabled={isCancelling.value}
            class="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCancelling.value ? 'Cancelling...' : 'Cancel Order'}
          </button>
        )}
        
        {/* Contact Support */}
        <a
          href="/contact"
          class="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
        >
          Contact Support
        </a>
      </div>
    </div>
  );
});
