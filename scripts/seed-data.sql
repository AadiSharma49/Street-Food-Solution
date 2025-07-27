-- Create suppliers table
CREATE TABLE suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  business_type TEXT,
  years_in_business TEXT,
  gst_number TEXT,
  fssai_license TEXT,
  description TEXT,
  categories TEXT[],
  min_order_value NUMERIC,
  delivery_radius INT,
  verified BOOLEAN DEFAULT FALSE,
  rating NUMERIC
);

-- Create products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID REFERENCES suppliers(id),
  name TEXT NOT NULL,
  category TEXT,
  price NUMERIC,
  unit TEXT,
  stock_quantity INT,
  min_order_quantity INT,
  description TEXT,
  status TEXT
);

-- Create group_orders table
CREATE TABLE group_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id),
  target_quantity INT,
  current_quantity INT,
  price_per_unit NUMERIC,
  normal_price NUMERIC,
  end_date TIMESTAMP,
  status TEXT,
  participants UUID[]
);
