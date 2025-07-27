-- Insert sample suppliers (if not exists)
INSERT INTO suppliers (id, company_name, owner_name, phone, email, address, city, state, pincode, business_type, years_in_business, gst_number, fssai_license, description, categories, min_order_value, delivery_radius, verified, rating)
SELECT 
  gen_random_uuid(),
  'Fresh Vegetables Co.',
  'Rajesh Kumar',
  '+91-9876543210',
  'rajesh@freshveggies.com',
  '123 Market Street',
  'Mumbai',
  'Maharashtra',
  '400001',
  'Wholesale',
  '5-10 years',
  'GST123456789',
  'FSSAI123456',
  'Premium quality fresh vegetables supplier',
  ARRAY['Vegetables', 'Fruits'],
  1000,
  50,
  true,
  4.5
WHERE NOT EXISTS (SELECT 1 FROM suppliers WHERE phone = '+91-9876543210');

INSERT INTO suppliers (id, company_name, owner_name, phone, email, address, city, state, pincode, business_type, years_in_business, gst_number, fssai_license, description, categories, min_order_value, delivery_radius, verified, rating)
SELECT 
  gen_random_uuid(),
  'Spice Masters Ltd.',
  'Priya Sharma',
  '+91-9876543211',
  'priya@spicemasters.com',
  '456 Spice Market',
  'Delhi',
  'Delhi',
  '110001',
  'Wholesale',
  '10+ years',
  'GST987654321',
  'FSSAI987654',
  'Authentic Indian spices and condiments',
  ARRAY['Spices & Condiments', 'Oils & Fats'],
  500,
  75,
  true,
  4.8
WHERE NOT EXISTS (SELECT 1 FROM suppliers WHERE phone = '+91-9876543211');

-- Insert sample products
INSERT INTO products (supplier_id, name, category, price, unit, stock_quantity, min_order_quantity, description, status)
SELECT 
  s.id,
  'Fresh Tomatoes',
  'Vegetables',
  25.00,
  'kg',
  1000,
  10,
  'Farm fresh red tomatoes, perfect for cooking',
  'active'
FROM suppliers s
WHERE s.phone = '+91-9876543210'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Fresh Tomatoes' AND supplier_id = s.id);

INSERT INTO products (supplier_id, name, category, price, unit, stock_quantity, min_order_quantity, description, status)
SELECT 
  s.id,
  'Red Chili Powder',
  'Spices & Condiments',
  150.00,
  'kg',
  500,
  5,
  'Premium quality red chili powder, medium spice level',
  'active'
FROM suppliers s
WHERE s.phone = '+91-9876543211'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Red Chili Powder' AND supplier_id = s.id);

INSERT INTO products (supplier_id, name, category, price, unit, stock_quantity, min_order_quantity, description, status)
SELECT 
  s.id,
  'Fresh Onions',
  'Vegetables',
  20.00,
  'kg',
  2000,
  15,
  'Quality onions sourced directly from farms',
  'active'
FROM suppliers s
WHERE s.phone = '+91-9876543210'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Fresh Onions' AND supplier_id = s.id);

INSERT INTO products (supplier_id, name, category, price, unit, stock_quantity, min_order_quantity, description, status)
SELECT 
  s.id,
  'Turmeric Powder',
  'Spices & Condiments',
  120.00,
  'kg',
  300,
  3,
  'Pure turmeric powder with high curcumin content',
  'active'
FROM suppliers s
WHERE s.phone = '+91-9876543211'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Turmeric Powder' AND supplier_id = s.id);

-- Insert more sample products for variety
INSERT INTO products (supplier_id, name, category, price, unit, stock_quantity, min_order_quantity, description, status)
SELECT 
  s.id,
  'Green Chilies',
  'Vegetables',
  40.00,
  'kg',
  500,
  5,
  'Fresh green chilies with perfect heat level',
  'active'
FROM suppliers s
WHERE s.phone = '+91-9876543210'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Green Chilies' AND supplier_id = s.id);

INSERT INTO products (supplier_id, name, category, price, unit, stock_quantity, min_order_quantity, description, status)
SELECT 
  s.id,
  'Garam Masala',
  'Spices & Condiments',
  200.00,
  'kg',
  200,
  2,
  'Traditional blend of aromatic spices',
  'active'
FROM suppliers s
WHERE s.phone = '+91-9876543211'
AND NOT EXISTS (SELECT 1 FROM products WHERE name = 'Garam Masala' AND supplier_id = s.id);
