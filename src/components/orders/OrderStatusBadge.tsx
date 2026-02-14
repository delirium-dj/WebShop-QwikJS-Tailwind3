/**
 * OrderStatusBadge Component
 * 
 * Displays the current status of an order with appropriate color and icon.
 * 
 * For Junior Developers:
 * - This is a "dumb" component - it just displays data
 * - Takes a status and shows a colored badge
 * - Different colors for different statuses
 * - Uses the ORDER_STATUS_CONFIG from types
 * 
 * Usage:
 * ```typescript
 * <OrderStatusBadge status="shipped" />
 * <OrderStatusBadge status="delivered" size="lg" />
 * ```
 */

import { component$ } from '@builder.io/qwik';
import { ORDER_STATUS_CONFIG, type OrderStatus } from '~/types/order.types';

/**
 * Props for OrderStatusBadge
 */
interface OrderStatusBadgeProps {
  /**
   * The order status to display
   */
  status: OrderStatus;
  
  /**
   * Size variant
   * - sm: Small badge (default)
   * - md: Medium badge
   * - lg: Large badge
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Show icon?
   * Default: true
   */
  showIcon?: boolean;
}

/**
 * OrderStatusBadge Component
 * 
 * Displays a colored badge with the order status.
 */
export const OrderStatusBadge = component$<OrderStatusBadgeProps>((props) => {
  const { 
    status, 
    size = 'sm',
    showIcon = true,
  } = props;
  
  // Get configuration for this status
  const config = ORDER_STATUS_CONFIG[status];
  
  // Size classes
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };
  
  return (
    <span
      class={`
        inline-flex items-center gap-1.5 font-medium rounded-full
        ${config.bgColor} ${config.color}
        ${sizeClasses[size]}
      `}
    >
      {showIcon && <span>{config.icon}</span>}
      <span>{config.label}</span>
    </span>
  );
});
