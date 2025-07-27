-- Add image_url column to products table if it doesn't exist
ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Update the products table structure to match our interface
ALTER TABLE products ALTER COLUMN image_url SET DEFAULT NULL;

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
