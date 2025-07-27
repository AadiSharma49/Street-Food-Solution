-- Fix products table schema to match our interface
ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE products ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Ensure all required columns exist with proper defaults
ALTER TABLE products ALTER COLUMN created_at SET DEFAULT NOW();
ALTER TABLE products ALTER COLUMN updated_at SET DEFAULT NOW();

-- Update existing records to have timestamps if they don't
UPDATE products SET created_at = NOW() WHERE created_at IS NULL;
UPDATE products SET updated_at = NOW() WHERE updated_at IS NULL;

-- Add some sample image URLs for existing products
UPDATE products SET image_url = CASE 
  WHEN category = 'Vegetables' THEN '/placeholder.svg?height=200&width=200&text=Fresh+Vegetables'
  WHEN category = 'Fruits' THEN '/placeholder.svg?height=200&width=200&text=Fresh+Fruits'
  WHEN category = 'Grains & Cereals' THEN '/placeholder.svg?height=200&width=200&text=Quality+Grains'
  WHEN category = 'Spices & Condiments' THEN '/placeholder.svg?height=200&width=200&text=Premium+Spices'
  WHEN category = 'Dairy Products' THEN '/placeholder.svg?height=200&width=200&text=Fresh+Dairy'
  WHEN category = 'Oils & Fats' THEN '/placeholder.svg?height=200&width=200&text=Pure+Oils'
  WHEN category = 'Pulses & Legumes' THEN '/placeholder.svg?height=200&width=200&text=Quality+Pulses'
  WHEN category = 'Meat & Poultry' THEN '/placeholder.svg?height=200&width=200&text=Fresh+Meat'
  WHEN category = 'Seafood' THEN '/placeholder.svg?height=200&width=200&text=Fresh+Seafood'
  WHEN category = 'Beverages' THEN '/placeholder.svg?height=200&width=200&text=Quality+Beverages'
  ELSE '/placeholder.svg?height=200&width=200&text=' || name
END
WHERE image_url IS NULL;

-- Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
