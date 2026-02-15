# Step 8: User Dashboard & Order History - Implementation Guide

## 🎯 Overview for Junior Developers

**What is this step about?**
Creating a user account dashboard where logged-in users can:
1. View all their past orders
2. See detailed information about each order
3. Track order status (pending → processing → shipped → delivered)
4. View order items, shipping addresses, and totals
5. Manage their account settings

**Real-world analogy:**
Think of Amazon's "Your Orders" page - that's what we're building! Users can see everything they've bought, track packages, and manage their account.

---

## 📦 What Files We're Creating

### 1. Order Details Page
**File:** `src/routes/account/orders/[id]/index.tsx`
**Purpose:** Shows complete info about a single order
**Features:**
- Order number and date
- Status timeline (ordered → processing → shipped → delivered)
- List of items with images
- Shipping address
- Price breakdown
- Track package button

### 2. Order Types
**File:** `src/types/order.ts`
**Purpose:** TypeScript interfaces for order data
**What it defines:**
- Order structure
- Order status types
- Order item structure
- Shipping address format

### 3. Order Status Component
**File:** `src/components/account/OrderStatusBadge.tsx`
**Purpose:** Reusable component to display order status
**Features:**
- Color-coded badges (yellow for pending, green for delivered, etc.)
- Consistent styling across the app

---

## 🏗️ Architecture

### How Order Data Flows

```
User visits /account/orders/123
    ↓
routeLoader$ runs on SERVER
    ↓
Fetches order from Supabase database
    ↓
Checks: Does order belong to this user? (security!)
    ↓
Returns order data
    ↓
Page renders with data already loaded
    ↓
User sees order details immediately (no loading spinner!)
```

### Database Schema

The `orders` table in Supabase looks like this:

```sql
orders (
  id UUID PRIMARY KEY,           -- Unique order ID
  user_id UUID REFERENCES users, -- Who placed the order
  status TEXT,                   -- pending, processing, shipped, delivered, cancelled
  total_amount INTEGER,          -- Price in cents (9999 = $99.99)
  shipping_address JSONB,        -- Address as JSON object
  items JSONB,                   -- Array of products as JSON
  created_at TIMESTAMP,          -- When order was placed
  updated_at TIMESTAMP           -- Last modified
)
```

---

## 🚀 Step-by-Step Implementation

### Step 1: Create the Order Details Page

**Where:** `src/routes/account/orders/[id]/index.tsx`

**What to do:**
1. Copy the `order-details-page.tsx` file content
2. Save it to the path above
3. Make sure the folder structure is correct:
   ```
   src/routes/account/orders/
   └── [id]/
       └── index.tsx  ← Your file goes here
   ```

**Why the [id] folder?**
The brackets `[]` mean this is a **dynamic route**.
- User visits: `/account/orders/abc-123`
- Qwik extracts: `params.id = "abc-123"`
- We use that to fetch the right order

### Step 2: Verify Database Structure

**Check your Supabase dashboard:**

1. Open Supabase Dashboard
2. Go to SQL Editor
3. Run this query to see if the orders table exists:
   ```sql
   SELECT * FROM orders LIMIT 1;
   ```

**If table doesn't exist,** run this SQL:

```sql
-- Create orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending',
  total_amount INTEGER NOT NULL,
  shipping_address JSONB NOT NULL,
  items JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own orders
CREATE POLICY "Users can view their own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: System can insert orders (for checkout)
CREATE POLICY "System can create orders"
  ON orders FOR INSERT
  WITH CHECK (true);
```

### Step 3: Test with Sample Data

**Insert a test order** to see if everything works:

```sql
-- Get your user ID first
SELECT id FROM auth.users WHERE email = 'your-email@example.com';

-- Insert test order (replace USER_ID with your actual ID)
INSERT INTO orders (
  user_id,
  status,
  total_amount,
  shipping_address,
  items
) VALUES (
  'YOUR_USER_ID_HERE',
  'processing',
  9999,  -- $99.99
  '{
    "full_name": "John Doe",
    "address_line1": "123 Main St",
    "city": "New York",
    "state": "NY",
    "postal_code": "10001",
    "country": "USA"
  }'::jsonb,
  '[
    {
      "id": 1,
      "title": "Wireless Headphones",
      "price": 99.99,
      "quantity": 1,
      "image": "https://fakestoreapi.com/img/placeholder.jpg"
    }
  ]'::jsonb
);
```

### Step 4: Navigate and Test

1. **Start your dev server:**
   ```bash
   pnpm dev
   ```

2. **Login to your account:**
   - Go to `/auth/login`
   - Sign in with your credentials

3. **View orders:**
   - Go to `/account/orders`
   - You should see your test order listed

4. **Click on an order:**
   - Click "View Details"
   - You should see the full order information

5. **Check the order ID in URL:**
   - URL should be like: `/account/orders/abc-123-def-456`
   - The page should show matching order details

---

## 🎨 Features Explained

### Feature 1: Order Status Timeline

**What it does:**
Shows a visual timeline of order progress.

**How it works:**
```tsx
// Check if order has reached this status
const isShipped = ['shipped', 'delivered'].includes(order.status);

// If yes, show green checkmark
// If no, show gray circle
```

**Visual:**
```
✅ Order Placed    (always green - order exists)
✅ Processing      (green if status is processing+)
⚪ Shipped         (gray if not shipped yet)
⚪ Delivered       (gray if not delivered yet)
```

### Feature 2: Price Formatting

**Why store prices in cents?**

**Wrong way (causes bugs):**
```javascript
price = 99.99
// JavaScript math: 99.99 * 100 = 9998.999999999998
// Rounding errors! 😱
```

**Right way (no bugs):**
```javascript
price = 9999  // Store as cents
display = price / 100  // Convert for display: 99.99
```

**The code:**
```typescript
// Convert cents to dollar string
const formatPrice = (cents: number) => {
  return `$${(cents / 100).toFixed(2)}`;
};

// Usage
formatPrice(9999)  // Returns: "$99.99"
```

### Feature 3: Security Check

**CRITICAL: Users can only see THEIR OWN orders!**

```typescript
// This query includes TWO conditions:
.eq('id', orderId)          // 1. Match order ID
.eq('user_id', user.id)     // 2. Match user ID

// This prevents users from viewing other people's orders!
// Example: Even if someone guesses another order ID,
// they can't see it unless it belongs to them.
```

---

## 📊 Status System Explained

### Order Status Flow

```
pending
  ↓ (order confirmed)
processing
  ↓ (items packaged)
shipped
  ↓ (package arrives)
delivered
```

### Status Colors

| Status | Color | Meaning |
|--------|-------|---------|
| pending | Yellow | Waiting for confirmation |
| processing | Blue | Being prepared |
| shipped | Purple | On the way |
| delivered | Green | Completed |
| cancelled | Red | Order cancelled |

### Code for Status Colors

```typescript
const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };
  return colors[status.toLowerCase()] || 'bg-gray-100 text-gray-800';
};
```

---

## 🐛 Common Issues & Solutions

### Issue 1: "Order Not Found"

**Symptoms:**
- Page shows "Order Not Found" error
- Order exists in database

**Possible causes:**
1. **Wrong user ID:** Order belongs to different user
2. **RLS policy:** Database policy blocking access
3. **Wrong order ID:** Typo in URL

**How to debug:**
```sql
-- Check if order exists
SELECT * FROM orders WHERE id = 'your-order-id';

-- Check if RLS is blocking
SELECT * FROM orders WHERE id = 'your-order-id' AND user_id = 'your-user-id';

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'orders';
```

### Issue 2: TypeScript Errors

**Error:** "Property 'items' does not exist on type 'Order'"

**Solution:**
Make sure you've defined the Order interface at the top of the file:

```typescript
interface Order {
  id: string;
  user_id: string;
  status: string;
  total_amount: number;
  shipping_address: {
    full_name: string;
    address_line1: string;
    // ... other fields
  };
  items: Array<{
    id: number;
    title: string;
    // ... other fields
  }>;
  created_at: string;
  updated_at: string;
}
```

### Issue 3: "Cannot read property of null"

**Error in console:**
```
Cannot read property 'items' of null
```

**Cause:** Trying to access `order.items` when order is null

**Solution:**
Always check if order exists first:

```typescript
if (!order) {
  return <div>Order not found</div>;
}

// Now safe to use order.items
return <div>{order.items.map(...)}</div>;
```

---

## ✅ Testing Checklist

Before considering Step 8 complete, test these scenarios:

### Viewing Orders
- [ ] Can access `/account/orders` page
- [ ] See list of all your orders
- [ ] Each order shows: number, date, total, status
- [ ] Orders are sorted by date (newest first)

### Order Details
- [ ] Click "View Details" opens correct order
- [ ] URL changes to `/account/orders/[id]`
- [ ] Page shows correct order information
- [ ] All order items display with images
- [ ] Shipping address displays correctly
- [ ] Status badge shows correct color
- [ ] Status timeline updates based on status

### Security
- [ ] Cannot view other users' orders
- [ ] Redirects to login if not authenticated
- [ ] Database RLS policies enforced

### Edge Cases
- [ ] Works with empty cart items
- [ ] Handles missing images gracefully
- [ ] Shows "Not Found" for invalid order IDs
- [ ] Back button returns to orders list
- [ ] Responsive on mobile devices

---

## 🎓 Learning Outcomes

After completing this step, you'll understand:

### 1. Dynamic Routes in Qwik
**What you learned:**
- How `[id]` in folder names creates dynamic routes
- How to extract parameters from the URL
- How to use `params.id` in route loaders

**Real-world use:**
- Blog posts: `/blog/[slug]`
- Product pages: `/product/[id]`
- User profiles: `/user/[username]`

### 2. Server-Side Data Loading
**What you learned:**
- `routeLoader$` runs on the server
- Data is loaded BEFORE page renders
- No loading spinners needed
- Better SEO and performance

**Benefits:**
- Faster perceived load times
- Search engines can see content
- Works without JavaScript

### 3. Database Security
**What you learned:**
- Row Level Security (RLS) in Supabase
- Users can only access their own data
- Database enforces security rules
- Cannot bypass with URL manipulation

**Why it matters:**
- Protects user privacy
- Prevents unauthorized access
- Compliance with data protection laws

### 4. TypeScript Interfaces
**What you learned:**
- Defining data structures
- Type safety prevents bugs
- Autocomplete in VS Code
- Catches errors before runtime

**Example:**
```typescript
// Without types
const total = order.totoal;  // Typo! Bug in production

// With types
const total = order.totoal;  // Error: Property 'totoal' does not exist
```

---

## 🚀 What's Next?

After completing Step 8, you can move on to:

### Step 9: Wishlist Feature
Add ability to save items for later:
- Heart icon on products
- Wishlist page
- Add/remove from wishlist
- Share wishlist

### Step 10: Reviews & Ratings
Let users review products:
- Star rating system
- Written reviews
- Helpful votes
- Review moderation

---

## 💡 Pro Tips

### Tip 1: Use Transactions for Orders

When creating orders (in checkout), use database transactions:

```sql
BEGIN;
  INSERT INTO orders (...) VALUES (...);
  UPDATE products SET stock = stock - quantity WHERE id = product_id;
COMMIT;
```

This ensures both happen or neither happens (no half-created orders).

### Tip 2: Add Order Search

Let users search their orders:

```typescript
// Add search to orders loader
.ilike('items', `%${searchTerm}%`)
```

### Tip 3: Email Notifications

Send email when order status changes:

```typescript
// In your status update function
if (newStatus === 'shipped') {
  await sendEmail({
    to: user.email,
    subject: 'Your order has shipped!',
    body: 'Track your package here: ...'
  });
}
```

---

**✅ Step 8 Complete!**

You now have a fully functional user dashboard with order history and detailed order tracking. Users can view their purchase history, track packages, and manage their account - just like professional e-commerce sites!

**Great job! 🎉**
