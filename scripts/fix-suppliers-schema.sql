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

-- Add some sample featured products
INSERT INTO products (name, description, category, price, unit, supplier_id, status, image_url) VALUES
('Fresh Tomatoes', 'Premium quality red tomatoes, perfect for street food preparations', 'Vegetables', 45, 'kg', (SELECT id FROM suppliers LIMIT 1), 'active', '/placeholder.svg?height=200&width=200&text=Fresh+Tomatoes'),
('Basmati Rice', 'Long grain aromatic basmati rice, ideal for biryanis and pulao', 'Grains & Cereals', 120, 'kg', (SELECT id FROM suppliers LIMIT 1), 'active', '/placeholder.svg?height=200&width=200&text=Basmati+Rice'),
('Red Chili Powder', 'Pure and spicy red chili powder for authentic Indian flavors', 'Spices & Condiments', 180, 'kg', (SELECT id FROM suppliers LIMIT 1), 'active', '/placeholder.svg?height=200&width=200&text=Chili+Powder'),
('Fresh Paneer', 'Soft and fresh cottage cheese, made daily', 'Dairy Products', 280, 'kg', (SELECT id FROM suppliers LIMIT 1), 'active', '/placeholder.svg?height=200&width=200&text=Fresh+Paneer'),
('Cooking Oil', 'Refined sunflower oil for healthy cooking', 'Oils & Fats', 140, 'liter', (SELECT id FROM suppliers LIMIT 1), 'active', '/placeholder.svg?height=200&width=200&text=Cooking+Oil'),
('Green Coriander', 'Fresh green coriander leaves for garnishing', 'Vegetables', 25, 'bunch', (SELECT id FROM suppliers LIMIT 1), 'active', '/placeholder.svg?height=200&width=200&text=Green+Coriander'),
('Wheat Flour', 'Fine quality wheat flour for rotis and parathas', 'Grains & Cereals', 35, 'kg', (SELECT id FROM suppliers LIMIT 1), 'active', '/placeholder.svg?height=200&width=200&text=Wheat+Flour'),
('Garam Masala', 'Aromatic blend of traditional Indian spices', 'Spices & Condiments', 320, 'kg', (SELECT id FROM suppliers LIMIT 1), 'active', '/placeholder.svg?height=200&width=200&text=Garam+Masala')
ON CONFLICT DO NOTHING;
