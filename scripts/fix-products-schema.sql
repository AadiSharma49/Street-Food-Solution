-- Add missing columns to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for products table
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Update existing products with sample image URLs based on category
UPDATE products SET image_url = CASE 
    WHEN category = 'vegetables' THEN '/placeholder.svg?height=200&width=200'
    WHEN category = 'spices' THEN '/placeholder.svg?height=200&width=200'
    WHEN category = 'grains' THEN '/placeholder.svg?height=200&width=200'
    WHEN category = 'dairy' THEN '/placeholder.svg?height=200&width=200'
    WHEN category = 'meat' THEN '/placeholder.svg?height=200&width=200'
    WHEN category = 'oils' THEN '/placeholder.svg?height=200&width=200'
    ELSE '/placeholder.svg?height=200&width=200'
END
WHERE image_url IS NULL;

-- Ensure proper indexes exist
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_supplier_id ON products(supplier_id);
