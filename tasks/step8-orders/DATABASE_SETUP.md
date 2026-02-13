# Database Setup for Orders

This file contains all the SQL you need to run in Supabase to set up the orders system.

## Instructions

1. Open your Supabase Dashboard
2. Go to **SQL Editor**
3. Click **New Query**
4. Copy and paste the SQL below
5. Click **Run**

---

## SQL Script

```sql
-- ============================================
-- ORDERS TABLE
-- ============================================
-- This table stores all order information

CREATE TABLE IF NOT EXISTS orders (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- User Reference
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Order Identification
  order_number TEXT NOT NULL UNIQUE,
  
  -- Order Status
  status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  
  -- Order Contents (stored as JSON)
  items JSONB NOT NULL,
  
  -- Shipping Information (stored as JSON)
  shipping_address JSONB NOT NULL,
  
  -- Pricing
  subtotal DECIMAL(10, 2) NOT NULL,
  shipping_cost DECIMAL(10, 2) NOT NULL DEFAULT 0,
  tax DECIMAL(10, 2) NOT NULL DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  
  -- Payment
  payment_method TEXT NOT NULL,
  
  -- Tracking
  tracking_number TEXT,
  estimated_delivery TIMESTAMPTZ,
  
  -- Notes
  order_notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
-- Speed up common queries

-- Index for fetching user's orders
CREATE INDEX idx_orders_user_id ON orders(user_id);

-- Index for filtering by status
CREATE INDEX idx_orders_status ON orders(status);

-- Index for sorting by date
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- Index for searching by order number
CREATE INDEX idx_orders_order_number ON orders(order_number);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
-- Ensure users can only access their own orders

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own orders
CREATE POLICY "Users can view own orders"
  ON orders
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can create their own orders
CREATE POLICY "Users can create own orders"
  ON orders
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own orders
-- (Limited to cancelling - status change to 'cancelled')
CREATE POLICY "Users can update own orders"
  ON orders
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id AND
    -- Only allow changing to cancelled if current status is pending or processing
    (
      (status = 'cancelled' AND OLD.status IN ('pending', 'processing')) OR
      -- Or allow updating without changing status (for adding tracking numbers, etc.)
      status = OLD.status
    )
  );

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_orders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function
CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_orders_updated_at();

-- ============================================
-- SAMPLE DATA (Optional)
-- ============================================
-- Uncomment to insert sample orders for testing

/*
INSERT INTO orders (
  user_id,
  order_number,
  status,
  items,
  shipping_address,
  subtotal,
  shipping_cost,
  tax,
  total,
  payment_method,
  tracking_number,
  estimated_delivery
) VALUES (
  'YOUR_USER_ID_HERE', -- Replace with actual user ID
  'ORD-2024-000001',
  'delivered',
  '[
    {
      "id": "1",
      "productId": 1,
      "title": "Fjallraven - Foldsack No. 1 Backpack",
      "price": 109.95,
      "quantity": 1,
      "image": "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
      "subtotal": 109.95
    }
  ]'::jsonb,
  '{
    "fullName": "John Doe",
    "addressLine1": "123 Main St",
    "city": "San Francisco",
    "state": "CA",
    "postalCode": "94102",
    "country": "US",
    "phone": "+1-555-0123"
  }'::jsonb,
  109.95,
  10.00,
  9.90,
  129.85,
  'credit_card',
  '1Z999AA10123456784',
  NOW() + INTERVAL '3 days'
);
*/

-- ============================================
-- VERIFICATION
-- ============================================
-- Run this to verify the table was created correctly

SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'orders'
ORDER BY ordinal_position;

-- Check policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'orders';
```

---

## Verification

After running the SQL, you should see:

1. ✅ `orders` table created
2. ✅ 4 indexes created
3. ✅ 3 RLS policies created
4. ✅ 1 trigger created

---

## Troubleshooting

### Error: "relation already exists"
**Solution**: Table already exists. You can either:
- Drop the table: `DROP TABLE orders CASCADE;` (⚠️ This deletes all data!)
- Or skip this step

### Error: "column does not exist"
**Solution**: Make sure you're running the entire script, not parts of it.

### Error: "permission denied"
**Solution**: Make sure you're logged in as the database owner in Supabase.

---

## Next Steps

After creating the database:

1. Test by creating an order through checkout
2. View orders in `/account/orders`
3. Click on an order to see details
4. Try cancelling a pending order

---

**Created**: February 13, 2026  
**Database**: Supabase PostgreSQL  
**Compatibility**: PostgreSQL 14+
