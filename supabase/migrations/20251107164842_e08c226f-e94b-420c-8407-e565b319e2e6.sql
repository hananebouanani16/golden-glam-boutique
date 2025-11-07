-- Add images array column to products table
ALTER TABLE public.products 
ADD COLUMN images text[] DEFAULT ARRAY[]::text[];

-- Update existing products to move single image to images array
UPDATE public.products 
SET images = ARRAY[image]::text[]
WHERE image IS NOT NULL AND image != '';

-- Keep the image column for backward compatibility but it will be used as the main/first image