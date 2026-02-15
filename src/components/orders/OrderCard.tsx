/**
 * OrderCard Component
 * 
 * Displays a summary of an order in the order history list.
 * 
 * For Junior Developers:
 * - This is a "card" component - shows order info in a box
 * - Clickable - links to full order details
 * - Shows: order number, status, total, date, preview image
 * - Used in the order history page
 * 
 * Usage:
 * ```typescript
 * <OrderCard order={orderSummary} />
 * ```
 */

import { component$ } from '@builder.io/qwik';
import type { OrderSummary } from '~/types/order';
import { OrderStatusBadge } from './OrderStatusBadge';

/**
 * Props for OrderCard
 */
interface OrderCardProps {
  /**
   * Order summary data
   */
  order: OrderSummary;
  
  /**
   * Show actions (Reorder, View Details)?
   * Default: true
   */
  showActions?: boolean;
}

/**
 * OrderCard Component
 * 
 * Displays an order summary with image, status, and actions.
 */
export const OrderCard = component$<OrderCardProps>((props) => {
  const { order, showActions = true } = props;
  
  // Format date for display
  const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  // Format price
  const formattedTotal = `$${order.total.toFixed(2)}`;
  
  return (
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      {/* Card Header */}
      <div class="p-4 border-b border-gray-200 bg-gray-50">
        <div class="flex items-center justify-between flex-wrap gap-2">
          {/* Order Number */}
          <div>
            <p class="text-sm text-gray-600">Order Number</p>
            <p class="font-semibold text-gray-900">{order.orderNumber}</p>
          </div>
          
          {/* Status Badge */}
          <OrderStatusBadge status={order.status} />
        </div>
      </div>
      
      {/* Card Body */}
      <div class="p-4">
        <div class="flex gap-4">
          {/* Product Image Preview */}
          {order.firstItemImage && (
            <div class="flex-shrink-0">
              <img
                src={order.firstItemImage}
                alt={order.firstItemTitle || 'Product'}
                width={80}
                height={80}
                class="w-20 h-20 object-contain rounded border border-gray-200"
              />
            </div>
          )}
          
          {/* Order Info */}
          <div class="flex-1 min-w-0">
            {/* Product Name (if available) */}
            {order.firstItemTitle && (
              <p class="text-sm font-medium text-gray-900 truncate mb-1">
                {order.firstItemTitle}
                {order.itemCount > 1 && (
                  <span class="text-gray-500 font-normal">
                    {' '}
                    + {order.itemCount - 1} more item
                    {order.itemCount - 1 > 1 ? 's' : ''}
                  </span>
                )}
              </p>
            )}
            
            {/* Order Date */}
            <p class="text-sm text-gray-600">
              Ordered on {orderDate}
            </p>
            
            {/* Item Count */}
            <p class="text-sm text-gray-600 mt-1">
              {order.itemCount} item{order.itemCount > 1 ? 's' : ''}
            </p>
          </div>
          
          {/* Order Total */}
          <div class="flex-shrink-0 text-right">
            <p class="text-sm text-gray-600">Total</p>
            <p class="text-lg font-bold text-gray-900">{formattedTotal}</p>
          </div>
        </div>
      </div>
      
      {/* Card Footer - Actions */}
      {showActions && (
        <div class="p-4 border-t border-gray-200 bg-gray-50">
          <div class="flex gap-3 flex-wrap">
            {/* View Details Button */}
            <a
              href={`/account/orders/${order.id}`}
              class="flex-1 sm:flex-none px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-600 rounded-md hover:bg-blue-50 text-center"
            >
              View Details
            </a>
            
            {/* Reorder Button (only for delivered orders) */}
            {order.status === 'delivered' && (
              <button
                class="flex-1 sm:flex-none px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Reorder
              </button>
            )}
            
            {/* Track Shipment (only for shipped orders) */}
            {order.status === 'shipped' && (
              <a
                href={`/account/orders/${order.id}#tracking`}
                class="flex-1 sm:flex-none px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-center"
              >
                Track Shipment
              </a>
            )}
            
            {/* Cancel Order (only for pending/processing) */}
            {(order.status === 'pending' || order.status === 'processing') && (
              <button
                class="flex-1 sm:flex-none px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-600 rounded-md hover:bg-red-50"
              >
                Cancel Order
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
});
