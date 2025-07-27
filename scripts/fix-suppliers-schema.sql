-- Fix suppliers table to match our interface
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS business_name TEXT;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS rating DECIMAL(3,2) DEFAULT 0.0;

-- Update business_name from company_name if it exists
UPDATE suppliers SET business_name = company_name WHERE business_name IS NULL AND company_name IS NOT NULL;

-- Update location from city and state if they exist
UPDATE suppliers SET location = CONCAT(city, ', ', state) WHERE location IS NULL AND city IS NOT NULL AND state IS NOT NULL;

-- Set default rating for suppliers without ratings
UPDATE suppliers SET rating = 4.0 WHERE rating IS NULL OR rating = 0;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_suppliers_business_name ON suppliers(business_name);
CREATE INDEX IF NOT EXISTS idx_suppliers_location ON suppliers(location);
CREATE INDEX IF NOT EXISTS idx_suppliers_rating ON suppliers(rating);
