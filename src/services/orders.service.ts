/**
 * Order Service
 * 
 * This file contains all functions for interacting with the orders database.
 * 
 * For Junior Developers:
 * - Services are the "bridge" between your app and the database
 * - Instead of writing SQL in components, call these functions
 * - These functions handle: fetching, creating, updating orders
 * - Error handling is built-in
 * 
 * Usage Example:
 * ```typescript
 * import { getOrderHistory, getOrderById } from '~/services/orders.service';
 * 
 * // In a component
 * const orders = await getOrderHistory(userId);
 * const order = await getOrderById(orderId);
 * ```
 */

import { supabase } from '~/lib/supabase';
import type {
  Order,
  OrderSummary,
  OrderRow,
  CreateOrderInput,
  UpdateOrderStatusInput,
  OrderFilters,
  OrderHistoryResponse,
  OrderStatistics,
} from '~/types/order.types';

/**
 * Generate a unique order number
 * 
 * Format: ORD-YYYY-NNNNNN
 * Example: ORD-2024-000123
 * 
 * Why?
 * - Database IDs (UUIDs) are hard to remember
 * - Order numbers are user-friendly
 * - Easy to reference in customer support
 */
function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, '0');
  return `ORD-${year}-${random}`;
}

/**
 * Convert database row to Order object
 * 
 * Why convert?
 * - Database uses snake_case (user_id)
 * - TypeScript uses camelCase (userId)
 * - This function does the mapping
 */
function rowToOrder(row: OrderRow): Order {
  return {
    id: row.id,
    orderNumber: row.order_number,
    userId: row.user_id,
    items: row.items,
    shippingAddress: row.shipping_address,
    paymentMethod: row.payment_method,
    subtotal: row.subtotal,
    shippingCost: row.shipping_cost,
    tax: row.tax,
    total: row.total,
    status: row.status,
    trackingNumber: row.tracking_number,
    estimatedDelivery: row.estimated_delivery,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    orderNotes: row.order_notes,
  };
}

/**
 * Convert Order to database row
 * 
 * The reverse of rowToOrder - converts camelCase to snake_case.
 */
function orderToRow(order: Partial<Order>): Partial<OrderRow> {
  return {
    id: order.id,
    order_number: order.orderNumber,
    user_id: order.userId,
    items: order.items,
    shipping_address: order.shippingAddress,
    payment_method: order.paymentMethod,
    subtotal: order.subtotal,
    shipping_cost: order.shippingCost,
    tax: order.tax,
    total: order.total,
    status: order.status,
    tracking_number: order.trackingNumber,
    estimated_delivery: order.estimatedDelivery,
    order_notes: order.orderNotes,
  };
}

/**
 * Create a new order
 * 
 * This is called when user completes checkout.
 * 
 * @param orderData - Order information from checkout
 * @returns The created order with generated ID and order number
 * 
 * Usage:
 * ```typescript
 * const newOrder = await createOrder({
 *   userId: user.id,
 *   items: cartItems,
 *   shippingAddress: address,
 *   paymentMethod: 'credit_card',
 *   subtotal: 100,
 *   shippingCost: 10,
 *   tax: 8,
 *   total: 118,
 *   status: 'pending',
 * });
 * ```
 */
export async function createOrder(
  orderData: CreateOrderInput
): Promise<Order | null> {
  try {
    // Generate order number
    const orderNumber = generateOrderNumber();
    
    // Prepare data for database
    const now = new Date().toISOString();
    const orderRow: Partial<OrderRow> = {
      ...orderToRow(orderData as Order),
      order_number: orderNumber,
      created_at: now,
      updated_at: now,
    };
    
    // Insert into database
    const { data, error } = await supabase
      .from('orders')
      .insert(orderRow)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating order:', error);
      return null;
    }
    
    // Convert back to Order type
    return rowToOrder(data as OrderRow);
  } catch (error) {
    console.error('Failed to create order:', error);
    return null;
  }
}

/**
 * Get a single order by ID
 * 
 * @param orderId - The order's unique ID
 * @param userId - The user's ID (for security - users can only see their own orders)
 * @returns The order or null if not found
 * 
 * Usage:
 * ```typescript
 * const order = await getOrderById('order-uuid', 'user-uuid');
 * if (order) {
 *   console.log('Order total:', order.total);
 * }
 * ```
 */
export async function getOrderById(
  orderId: string,
  userId: string
): Promise<Order | null> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .eq('user_id', userId) // Security: only get user's own orders
      .single();
    
    if (error) {
      console.error('Error fetching order:', error);
      return null;
    }
    
    if (!data) {
      return null;
    }
    
    return rowToOrder(data as OrderRow);
  } catch (error) {
    console.error('Failed to fetch order:', error);
    return null;
  }
}

/**
 * Get order history for a user
 * 
 * Returns a paginated list of orders with statistics.
 * 
 * @param userId - The user's ID
 * @param options - Pagination and filtering options
 * @returns Order history with pagination and stats
 * 
 * Usage:
 * ```typescript
 * const history = await getOrderHistory('user-uuid', {
 *   page: 1,
 *   pageSize: 10,
 *   filters: { status: 'shipped' }
 * });
 * 
 * console.log('Orders:', history.orders);
 * console.log('Total spent:', history.statistics.totalSpent);
 * ```
 */
export async function getOrderHistory(
  userId: string,
  options: {
    page?: number;
    pageSize?: number;
    filters?: OrderFilters;
  } = {}
): Promise<OrderHistoryResponse | null> {
  try {
    const { page = 1, pageSize = 10, filters = {} } = options;
    
    // Build query
    let query = supabase
      .from('orders')
      .select('*', { count: 'exact' })
      .eq('user_id', userId);
    
    // Apply filters
    if (filters.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }
    
    if (filters.dateFrom) {
      query = query.gte('created_at', filters.dateFrom);
    }
    
    if (filters.dateTo) {
      query = query.lte('created_at', filters.dateTo);
    }
    
    // Apply search (search in items JSON)
    // Note: This is a simplified search - in production you'd use full-text search
    if (filters.searchTerm) {
      // This is a basic example - Supabase has better text search capabilities
      // For now, we'll fetch all and filter in memory
      // In production, consider using Postgres full-text search
    }
    
    // Apply pagination
    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;
    query = query.range(start, end);
    
    // Order by most recent first
    query = query.order('created_at', { ascending: false });
    
    // Execute query
    const { data, error, count } = await query;
    
    if (error) {
      console.error('Error fetching order history:', error);
      return null;
    }
    
    // Convert rows to OrderSummary
    const orders: OrderSummary[] = (data as OrderRow[]).map((row) => ({
      id: row.id,
      orderNumber: row.order_number,
      status: row.status,
      total: row.total,
      itemCount: row.items.reduce((sum, item) => sum + item.quantity, 0),
      createdAt: row.created_at,
      firstItemImage: row.items[0]?.image,
      firstItemTitle: row.items[0]?.title,
    }));
    
    // Calculate statistics
    const statistics = await getOrderStatistics(userId);
    
    // Prepare pagination info
    const totalOrders = count || 0;
    const totalPages = Math.ceil(totalOrders / pageSize);
    
    return {
      orders,
      pagination: {
        page,
        pageSize,
        totalPages,
        totalOrders,
      },
      statistics: statistics || {
        totalOrders: 0,
        totalSpent: 0,
        activeOrders: 0,
      },
    };
  } catch (error) {
    console.error('Failed to fetch order history:', error);
    return null;
  }
}

/**
 * Get order statistics for a user
 * 
 * Calculates:
 * - Total number of orders
 * - Total amount spent
 * - Number of active orders
 * - Date of last order
 * 
 * @param userId - The user's ID
 * @returns Order statistics
 */
export async function getOrderStatistics(
  userId: string
): Promise<OrderStatistics | null> {
  try {
    // Fetch all orders for this user
    const { data, error } = await supabase
      .from('orders')
      .select('status, total, created_at')
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error fetching order statistics:', error);
      return null;
    }
    
    if (!data || data.length === 0) {
      return {
        totalOrders: 0,
        totalSpent: 0,
        activeOrders: 0,
      };
    }
    
    // Calculate statistics
    const totalOrders = data.length;
    const totalSpent = data.reduce((sum, order) => sum + order.total, 0);
    const activeOrders = data.filter(
      (order) => 
        order.status !== 'delivered' && order.status !== 'cancelled'
    ).length;
    
    // Get most recent order date
    const dates = data.map((order) => new Date(order.created_at));
    const lastOrderDate = new Date(Math.max(...dates.map((d) => d.getTime())));
    
    return {
      totalOrders,
      totalSpent,
      activeOrders,
      lastOrderDate: lastOrderDate.toISOString(),
    };
  } catch (error) {
    console.error('Failed to fetch order statistics:', error);
    return null;
  }
}

/**
 * Update order status
 * 
 * This is typically called by admins, but users can also cancel orders.
 * 
 * @param input - Order ID and new status
 * @returns Updated order
 * 
 * Usage:
 * ```typescript
 * const updated = await updateOrderStatus({
 *   orderId: 'order-uuid',
 *   status: 'shipped',
 *   trackingNumber: '1Z999AA10123456784',
 *   estimatedDelivery: '2024-02-20',
 * });
 * ```
 */
export async function updateOrderStatus(
  input: UpdateOrderStatusInput
): Promise<Order | null> {
  try {
    const now = new Date().toISOString();
    
    const updateData: Partial<OrderRow> = {
      status: input.status,
      updated_at: now,
    };
    
    if (input.trackingNumber) {
      updateData.tracking_number = input.trackingNumber;
    }
    
    if (input.estimatedDelivery) {
      updateData.estimated_delivery = input.estimatedDelivery;
    }
    
    const { data, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', input.orderId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating order status:', error);
      return null;
    }
    
    return rowToOrder(data as OrderRow);
  } catch (error) {
    console.error('Failed to update order status:', error);
    return null;
  }
}

/**
 * Cancel an order
 * 
 * Users can cancel orders that are still pending or processing.
 * 
 * @param orderId - The order's ID
 * @param userId - The user's ID (for security)
 * @returns Updated order or null
 * 
 * Usage:
 * ```typescript
 * const cancelled = await cancelOrder('order-uuid', 'user-uuid');
 * ```
 */
export async function cancelOrder(
  orderId: string,
  userId: string
): Promise<Order | null> {
  try {
    // First, check if order can be cancelled
    const order = await getOrderById(orderId, userId);
    
    if (!order) {
      console.error('Order not found');
      return null;
    }
    
    // Only allow cancelling pending or processing orders
    if (order.status !== 'pending' && order.status !== 'processing') {
      console.error('Cannot cancel order with status:', order.status);
      return null;
    }
    
    // Update status to cancelled
    return await updateOrderStatus({
      orderId,
      status: 'cancelled',
    });
  } catch (error) {
    console.error('Failed to cancel order:', error);
    return null;
  }
}

/**
 * Reorder - Create a new order from an existing one
 * 
 * Copies items from a previous order to create a new order.
 * Useful for repeat purchases.
 * 
 * @param orderId - The order to copy
 * @param userId - The user's ID
 * @returns The items from the order (to be added to cart)
 * 
 * Usage:
 * ```typescript
 * const items = await getOrderItemsForReorder('order-uuid', 'user-uuid');
 * // Add items to cart
 * items.forEach(item => cart.addItem(item));
 * ```
 */
export async function getOrderItemsForReorder(
  orderId: string,
  userId: string
) {
  try {
    const order = await getOrderById(orderId, userId);
    
    if (!order) {
      return null;
    }
    
    // Return items in a format suitable for adding to cart
    return order.items.map((item) => ({
      id: item.productId,
      title: item.title,
      price: item.price,
      image: item.image,
      quantity: item.quantity,
      variant: item.variant,
    }));
  } catch (error) {
    console.error('Failed to get order items for reorder:', error);
    return null;
  }
}
