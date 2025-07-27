-- Fix suppliers table schema
ALTER TABLE suppliers 
ADD COLUMN IF NOT EXISTS business_name TEXT,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS rating DECIMAL(3,2) DEFAULT 4.0;

-- Update existing suppliers with business_name if missing
UPDATE suppliers 
SET business_name = company_name 
WHERE business_name IS NULL AND company_name IS NOT NULL;

UPDATE suppliers 
SET business_name = owner_name 
WHERE business_name IS NULL AND owner_name IS NOT NULL;

-- Update location field
UPDATE suppliers 
SET location = CONCAT(city, ', ', state)
WHERE location IS NULL AND city IS NOT NULL AND state IS NOT NULL;

UPDATE suppliers 
SET location = city
WHERE location IS NULL AND city IS NOT NULL;

-- Fix products table schema
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

-- Add some sample featured products if they don't exist
INSERT INTO products (name, description, category, price, unit, supplier_id, status, image_url) 
SELECT 'Fresh Tomatoes', 'Premium quality fresh tomatoes, perfect for street food preparations', 'Vegetables', 45, 'kg', s.id, 'active', '/placeholder.svg?height=200&width=200&text=Fresh+Tomatoes'
FROM suppliers s LIMIT 1
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Fresh Tomatoes');

INSERT INTO products (name, description, category, price, unit, supplier_id, status, image_url) 
SELECT 'Basmati Rice', 'Premium long grain basmati rice, ideal for biryanis and pulao', 'Grains & Cereals', 120, 'kg', s.id, 'active', '/placeholder.svg?height=200&width=200&text=Basmati+Rice'
FROM suppliers s LIMIT 1
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Basmati Rice');

INSERT INTO products (name, description, category, price, unit, supplier_id, status, image_url) 
SELECT 'Red Chili Powder', 'Authentic red chili powder with perfect heat and color', 'Spices & Condiments', 180, 'kg', s.id, 'active', '/placeholder.svg?height=200&width=200&text=Red+Chili+Powder'
FROM suppliers s LIMIT 1
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Red Chili Powder');

INSERT INTO products (name, description, category, price, unit, supplier_id, status, image_url) 
SELECT 'Fresh Paneer', 'Daily fresh paneer made from pure milk, perfect for curries', 'Dairy Products', 280, 'kg', s.id, 'active', '/placeholder.svg?height=200&width=200&text=Fresh+Paneer'
FROM suppliers s LIMIT 1
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Fresh Paneer');

INSERT INTO products (name, description, category, price, unit, supplier_id, status, image_url) 
SELECT 'Cooking Oil', 'Premium refined cooking oil for all your frying needs', 'Oils & Fats', 140, 'liter', s.id, 'active', '/placeholder.svg?height=200&width=200&text=Cooking+Oil'
FROM suppliers s LIMIT 1
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Cooking Oil');

INSERT INTO products (name, description, category, price, unit, supplier_id, status, image_url) 
SELECT 'Green Coriander', 'Fresh green coriander leaves for garnishing and flavor', 'Vegetables', 25, 'bunch', s.id, 'active', '/placeholder.svg?height=200&width=200&text=Green+Coriander'
FROM suppliers s LIMIT 1
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Green Coriander');

INSERT INTO products (name, description, category, price, unit, supplier_id, status, image_url) 
SELECT 'Wheat Flour', 'Fine quality wheat flour for rotis, naans and bread', 'Grains & Cereals', 35, 'kg', s.id, 'active', '/placeholder.svg?height=200&width=200&text=Wheat+Flour'
FROM suppliers s LIMIT 1
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Wheat Flour');

INSERT INTO products (name, description, category, price, unit, supplier_id, status, image_url) 
SELECT 'Garam Masala', 'Aromatic blend of traditional Indian spices', 'Spices & Condiments', 320, 'kg', s.id, 'active', '/placeholder.svg?height=200&width=200&text=Garam+Masala'
FROM suppliers s LIMIT 1
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Garam Masala');
