/**
 * Order Types
 *
 * This file contains all TypeScript interfaces and types for the order management system.
 *
 * For Junior Developers:
 * - Orders are created when users complete checkout
 * - Each order contains: items, shipping address, payment info, status
 * - Orders are stored in Supabase database
 * - Users can view their order history in the account section
 *
 * Database Structure:
 * - orders table: Main order info (total, status, dates)
 * - order_items table: Individual products in each order
 * - Both linked by order_id
 */

/**
 * OrderStatus - All possible states of an order
 *
 * Flow:
 * pending → processing → shipped → delivered
 *                    ↓
 *                cancelled
 */
export type OrderStatus =
  | 'pending' // Order placed, awaiting payment confirmation
  | 'processing' // Payment confirmed, preparing order
  | 'shipped' // Order sent to shipping carrier
  | 'delivered' // Order delivered to customer
  | 'cancelled'; // Order cancelled by user or admin

/**
 * PaymentMethod - How the customer paid
 */
export type PaymentMethod =
  | 'credit_card'
  | 'debit_card'
  | 'paypal'
  | 'apple_pay'
  | 'google_pay';

/**
 * ShippingAddress - Where to deliver the order
 *
 * This matches the structure from checkout form.
 */
export interface ShippingAddress {
  fullName: string; // Recipient's full name
  addressLine1: string; // Street address
  addressLine2?: string; // Apt, suite, etc. (optional)
  city: string; // City name
  state: string; // State/Province
  postalCode: string; // ZIP/Postal code
  country: string; // Country code (e.g., 'US', 'CA')
  phone: string; // Contact phone number
}

/**
 * OrderItem - A single product in an order
 *
 * Why separate from cart items?
 * - Cart items can change (quantity, price)
 * - Order items are "frozen" snapshots at purchase time
 * - We store the price at time of purchase
 */
export interface OrderItem {
  id: string; // Unique identifier for this order item
  productId: number; // Reference to the product (from FakeStore API)
  title: string; // Product name (frozen at purchase time)
  price: number; // Price when purchased (might differ from current price)
  quantity: number; // How many were ordered
  image: string; // Product image URL
  variant?: {
    // Product variant (if applicable)
    size?: string; // Size selected (e.g., 'M', 'L', 'XL')
    color?: string; // Color selected (e.g., 'Red', 'Blue')
  };
  subtotal: number; // price × quantity
}

/**
 * Order - Complete order information
 *
 * This is the main order object that contains everything:
 * - Who ordered (userId)
 * - What they ordered (items)
 * - Where it's going (shippingAddress)
 * - How they paid (paymentMethod)
 * - Current status (status)
 * - Pricing (subtotal, shipping, tax, total)
 * - Dates (ordered, updated)
 */
export interface Order {
  // Identification
  id: string; // Unique order ID (UUID)
  orderNumber: string; // Human-friendly order number (e.g., 'ORD-2024-001234')
  userId: string; // Who placed the order (user UUID)

  // Order Contents
  items: OrderItem[]; // Products in this order

  // Delivery Information
  shippingAddress: ShippingAddress; // Where to ship

  // Payment Information
  paymentMethod: PaymentMethod; // How they paid

  // Pricing (all in USD or your currency)
  subtotal: number; // Sum of all item subtotals
  shippingCost: number; // Shipping fee
  tax: number; // Sales tax
  total: number; // subtotal + shippingCost + tax

  // Order Status & Tracking
  status: OrderStatus; // Current status
  trackingNumber?: string; // Shipping tracking number (optional, added when shipped)
  estimatedDelivery?: string; // ISO date string (e.g., '2024-02-20')

  // Timestamps
  createdAt: string; // When order was placed (ISO date string)
  updatedAt: string; // Last status update (ISO date string)

  // Notes
  orderNotes?: string; // Customer notes (optional)
}

/**
 * OrderSummary - Lightweight version for order lists
 *
 * Why a separate type?
 * - Loading full orders (with all items) can be slow
 * - For order history page, we only need basic info
 * - This is more efficient for listing many orders
 */
export interface OrderSummary {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  total: number;
  itemCount: number; // Total number of items (all quantities summed)
  createdAt: string;

  // Preview of first item (for thumbnail)
  firstItemImage?: string;
  firstItemTitle?: string;
}

/**
 * OrderFilters - For filtering order history
 *
 * Users can filter their orders by:
 * - Status (show only shipped orders)
 * - Date range (orders from last 30 days)
 * - Search term (find order by product name)
 */
export interface OrderFilters {
  status?: OrderStatus | 'all'; // Filter by status
  dateFrom?: string; // ISO date string
  dateTo?: string; // ISO date string
  searchTerm?: string; // Search in product names
}

/**
 * OrderStatistics - Summary stats for dashboard
 *
 * Shows user their order statistics:
 * - Total orders placed
 * - Total amount spent
 * - Active orders (pending, processing, shipped)
 */
export interface OrderStatistics {
  totalOrders: number; // All-time order count
  totalSpent: number; // All-time amount spent
  activeOrders: number; // Orders not delivered/cancelled
  lastOrderDate?: string; // ISO date of most recent order
}

/**
 * Database Row Types
 *
 * These match the Supabase database structure.
 * We convert between these and the types above.
 */

/**
 * OrderRow - How orders are stored in Supabase 'orders' table
 */
export interface OrderRow {
  id: string;
  user_id: string;
  order_number: string;
  status: OrderStatus;

  // JSON columns
  items: OrderItem[];
  shipping_address: ShippingAddress;

  // Pricing
  subtotal: number;
  shipping_cost: number;
  tax: number;
  total: number;

  // Payment
  payment_method: PaymentMethod;

  // Tracking
  tracking_number?: string;
  estimated_delivery?: string;

  // Notes
  order_notes?: string;

  // Timestamps
  created_at: string;
  updated_at: string;
}

/**
 * Helper type for creating new orders
 *
 * Omits fields that are auto-generated:
 * - id (generated by database)
 * - orderNumber (generated by our code)
 * - createdAt (generated by database)
 * - updatedAt (generated by database)
 */
export type CreateOrderInput = Omit<
  Order,
  'id' | 'orderNumber' | 'createdAt' | 'updatedAt'
>;

/**
 * Helper type for updating order status
 */
export interface UpdateOrderStatusInput {
  orderId: string;
  status: OrderStatus;
  trackingNumber?: string;
  estimatedDelivery?: string;
}

/**
 * Pagination for order lists
 */
export interface OrderPagination {
  page: number; // Current page (1-based)
  pageSize: number; // Items per page
  totalPages: number; // Total number of pages
  totalOrders: number; // Total number of orders
}

/**
 * Complete order history response
 *
 * This is what the API returns when fetching order history.
 */
export interface OrderHistoryResponse {
  orders: OrderSummary[];
  pagination: OrderPagination;
  statistics: OrderStatistics;
}

/**
 * Status Badge Configuration
 *
 * For styling status badges in the UI.
 * Each status has a color and icon.
 */
export interface StatusBadgeConfig {
  label: string; // Display text
  color: string; // Tailwind color class
  bgColor: string; // Background color class
  icon: string; // Icon name or emoji
}

/**
 * Status configurations for UI
 *
 * This maps each status to its visual representation.
 */
export const ORDER_STATUS_CONFIG: Record<OrderStatus, StatusBadgeConfig> = {
  pending: {
    label: 'Pending',
    color: 'text-yellow-800',
    bgColor: 'bg-yellow-100',
    icon: '⏳',
  },
  processing: {
    label: 'Processing',
    color: 'text-blue-800',
    bgColor: 'bg-blue-100',
    icon: '⚙️',
  },
  shipped: {
    label: 'Shipped',
    color: 'text-purple-800',
    bgColor: 'bg-purple-100',
    icon: '🚚',
  },
  delivered: {
    label: 'Delivered',
    color: 'text-green-800',
    bgColor: 'bg-green-100',
    icon: '✅',
  },
  cancelled: {
    label: 'Cancelled',
    color: 'text-red-800',
    bgColor: 'bg-red-100',
    icon: '❌',
  },
};
