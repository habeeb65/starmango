/*
  # Initial Schema Setup for Fruit Wholesaler ERP

  1. New Tables
    - `tenants`
      - `id` (uuid, primary key)
      - `name` (text)
      - `logo` (text, nullable)
      - `primary_color` (text, nullable)
      - `active` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `users`
      - `id` (uuid, primary key, matches auth.users.id)
      - `email` (text)
      - `name` (text)
      - `role` (text)
      - `tenant_id` (uuid, references tenants)
      - `avatar` (text, nullable)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `products`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text, nullable)
      - `sku` (text)
      - `price` (numeric)
      - `cost` (numeric)
      - `quantity` (integer)
      - `tenant_id` (uuid, references tenants)
      - `lot_number` (text, nullable)
      - `damage_count` (integer, nullable)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `vendors`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text, nullable)
      - `phone` (text, nullable)
      - `address` (text, nullable)
      - `tenant_id` (uuid, references tenants)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `customers`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text, nullable)
      - `phone` (text, nullable)
      - `address` (text, nullable)
      - `credit_limit` (numeric)
      - `current_credit` (numeric)
      - `tenant_id` (uuid, references tenants)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `purchases`
      - `id` (uuid, primary key)
      - `vendor_id` (uuid, references vendors)
      - `total_amount` (numeric)
      - `payment_status` (text)
      - `payment_method` (text, nullable)
      - `notes` (text, nullable)
      - `tenant_id` (uuid, references tenants)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `purchase_items`
      - `id` (uuid, primary key)
      - `purchase_id` (uuid, references purchases)
      - `product_id` (uuid, references products)
      - `quantity` (integer)
      - `unit_price` (numeric)
      - `lot_number` (text)
      - `created_at` (timestamptz)

    - `sales`
      - `id` (uuid, primary key)
      - `customer_id` (uuid, references customers)
      - `total_amount` (numeric)
      - `payment_status` (text)
      - `payment_method` (text, nullable)
      - `notes` (text, nullable)
      - `tenant_id` (uuid, references tenants)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `sale_items`
      - `id` (uuid, primary key)
      - `sale_id` (uuid, references sales)
      - `product_id` (uuid, references products)
      - `quantity` (integer)
      - `unit_price` (numeric)
      - `lot_number` (text)
      - `created_at` (timestamptz)

    - `damage_reports`
      - `id` (uuid, primary key)
      - `product_id` (uuid, references products)
      - `quantity` (integer)
      - `reason` (text)
      - `lot_number` (text)
      - `tenant_id` (uuid, references tenants)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their tenant's data
    - Link users table with auth.users

  3. Notes
    - All tables include created_at/updated_at timestamps
    - Foreign key constraints ensure data integrity
    - Tenant isolation through RLS policies
*/

-- Create tables
CREATE TABLE tenants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo text,
  primary_color text,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE users (
  id uuid PRIMARY KEY REFERENCES auth.users,
  email text NOT NULL,
  name text NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'manager', 'staff')),
  tenant_id uuid REFERENCES tenants ON DELETE CASCADE,
  avatar text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  sku text NOT NULL,
  price numeric NOT NULL CHECK (price >= 0),
  cost numeric NOT NULL CHECK (cost >= 0),
  quantity integer NOT NULL DEFAULT 0,
  tenant_id uuid NOT NULL REFERENCES tenants ON DELETE CASCADE,
  lot_number text,
  damage_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (sku, tenant_id)
);

CREATE TABLE vendors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  phone text,
  address text,
  tenant_id uuid NOT NULL REFERENCES tenants ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  phone text,
  address text,
  credit_limit numeric NOT NULL DEFAULT 0,
  current_credit numeric NOT NULL DEFAULT 0,
  tenant_id uuid NOT NULL REFERENCES tenants ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id uuid NOT NULL REFERENCES vendors ON DELETE RESTRICT,
  total_amount numeric NOT NULL CHECK (total_amount >= 0),
  payment_status text NOT NULL CHECK (payment_status IN ('paid', 'partial', 'unpaid')),
  payment_method text CHECK (payment_method IN ('cash', 'credit', 'bank_transfer')),
  notes text,
  tenant_id uuid NOT NULL REFERENCES tenants ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE purchase_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_id uuid NOT NULL REFERENCES purchases ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products ON DELETE RESTRICT,
  quantity integer NOT NULL CHECK (quantity > 0),
  unit_price numeric NOT NULL CHECK (unit_price >= 0),
  lot_number text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE sales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES customers ON DELETE RESTRICT,
  total_amount numeric NOT NULL CHECK (total_amount >= 0),
  payment_status text NOT NULL CHECK (payment_status IN ('paid', 'partial', 'unpaid')),
  payment_method text CHECK (payment_method IN ('cash', 'credit', 'bank_transfer')),
  notes text,
  tenant_id uuid NOT NULL REFERENCES tenants ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE sale_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_id uuid NOT NULL REFERENCES sales ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products ON DELETE RESTRICT,
  quantity integer NOT NULL CHECK (quantity > 0),
  unit_price numeric NOT NULL CHECK (unit_price >= 0),
  lot_number text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE damage_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products ON DELETE RESTRICT,
  quantity integer NOT NULL CHECK (quantity > 0),
  reason text NOT NULL,
  lot_number text NOT NULL,
  tenant_id uuid NOT NULL REFERENCES tenants ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE sale_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE damage_reports ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Users can view their own tenant"
  ON tenants
  FOR SELECT
  TO authenticated
  USING (id IN (
    SELECT tenant_id FROM users WHERE users.id = auth.uid()
  ));

CREATE POLICY "Users can view and update their own data"
  ON users
  FOR ALL
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Users can access their tenant's products"
  ON products
  FOR ALL
  TO authenticated
  USING (tenant_id IN (
    SELECT tenant_id FROM users WHERE users.id = auth.uid()
  ));

CREATE POLICY "Users can access their tenant's vendors"
  ON vendors
  FOR ALL
  TO authenticated
  USING (tenant_id IN (
    SELECT tenant_id FROM users WHERE users.id = auth.uid()
  ));

CREATE POLICY "Users can access their tenant's customers"
  ON customers
  FOR ALL
  TO authenticated
  USING (tenant_id IN (
    SELECT tenant_id FROM users WHERE users.id = auth.uid()
  ));

CREATE POLICY "Users can access their tenant's purchases"
  ON purchases
  FOR ALL
  TO authenticated
  USING (tenant_id IN (
    SELECT tenant_id FROM users WHERE users.id = auth.uid()
  ));

CREATE POLICY "Users can access their tenant's purchase items"
  ON purchase_items
  FOR ALL
  TO authenticated
  USING (purchase_id IN (
    SELECT id FROM purchases WHERE tenant_id IN (
      SELECT tenant_id FROM users WHERE users.id = auth.uid()
    )
  ));

CREATE POLICY "Users can access their tenant's sales"
  ON sales
  FOR ALL
  TO authenticated
  USING (tenant_id IN (
    SELECT tenant_id FROM users WHERE users.id = auth.uid()
  ));

CREATE POLICY "Users can access their tenant's sale items"
  ON sale_items
  FOR ALL
  TO authenticated
  USING (sale_id IN (
    SELECT id FROM sales WHERE tenant_id IN (
      SELECT tenant_id FROM users WHERE users.id = auth.uid()
    )
  ));

CREATE POLICY "Users can access their tenant's damage reports"
  ON damage_reports
  FOR ALL
  TO authenticated
  USING (tenant_id IN (
    SELECT tenant_id FROM users WHERE users.id = auth.uid()
  ));

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tenants_updated_at
  BEFORE UPDATE ON tenants
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vendors_updated_at
  BEFORE UPDATE ON vendors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_purchases_updated_at
  BEFORE UPDATE ON purchases
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sales_updated_at
  BEFORE UPDATE ON sales
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_damage_reports_updated_at
  BEFORE UPDATE ON damage_reports
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better query performance
CREATE INDEX idx_users_tenant_id ON users(tenant_id);
CREATE INDEX idx_products_tenant_id ON products(tenant_id);
CREATE INDEX idx_vendors_tenant_id ON vendors(tenant_id);
CREATE INDEX idx_customers_tenant_id ON customers(tenant_id);
CREATE INDEX idx_purchases_tenant_id ON purchases(tenant_id);
CREATE INDEX idx_sales_tenant_id ON sales(tenant_id);
CREATE INDEX idx_damage_reports_tenant_id ON damage_reports(tenant_id);
CREATE INDEX idx_purchase_items_purchase_id ON purchase_items(purchase_id);
CREATE INDEX idx_sale_items_sale_id ON sale_items(sale_id);