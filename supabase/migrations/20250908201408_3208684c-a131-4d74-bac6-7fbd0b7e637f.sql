-- Add stock management fields to products table
ALTER TABLE public.products 
ADD COLUMN stock_quantity integer DEFAULT 0,
ADD COLUMN low_stock_threshold integer DEFAULT 5,
ADD COLUMN is_out_of_stock boolean DEFAULT false;

-- Create promotions table
CREATE TABLE public.promotions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  discount_percentage integer NOT NULL CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
  start_date timestamp with time zone NOT NULL,
  end_date timestamp with time zone NOT NULL,
  category text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on promotions
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;

-- Promotions policies
CREATE POLICY "Public read promotions" ON public.promotions FOR SELECT USING (true);
CREATE POLICY "Public insert promotions" ON public.promotions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update promotions" ON public.promotions FOR UPDATE USING (true);
CREATE POLICY "Public delete promotions" ON public.promotions FOR DELETE USING (true);

-- Create delivery_rates table
CREATE TABLE public.delivery_rates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wilaya text NOT NULL UNIQUE,
  home_price integer NOT NULL,
  office_price integer,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on delivery_rates
ALTER TABLE public.delivery_rates ENABLE ROW LEVEL SECURITY;

-- Delivery rates policies
CREATE POLICY "Public read delivery_rates" ON public.delivery_rates FOR SELECT USING (true);
CREATE POLICY "Public insert delivery_rates" ON public.delivery_rates FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update delivery_rates" ON public.delivery_rates FOR UPDATE USING (true);
CREATE POLICY "Public delete delivery_rates" ON public.delivery_rates FOR DELETE USING (true);

-- Insert default delivery rates from existing data
INSERT INTO public.delivery_rates (wilaya, home_price, office_price) VALUES
('Adrar', 800, 600),
('Chlef', 400, 300),
('Laghouat', 600, 450),
('Ouargla', 800, 600),
('Batna', 500, 400),
('Béjaïa', 400, 300),
('Biskra', 600, 450),
('Béchar', 1000, 800),
('Blida', 300, 250),
('Bouira', 400, 300),
('Tebessa', 600, 450),
('Tlemcen', 500, 400),
('Tiaret', 500, 400),
('Tizi Ouzou', 400, 300),
('Alger', 250, 200),
('Djelfa', 500, 400),
('Jijel', 500, 400),
('Sétif', 400, 300),
('Saïda', 600, 450),
('Skikda', 500, 400),
('Sidi Bel Abbès', 500, 400),
('Annaba', 600, 450),
('Guelma', 600, 450),
('Constantine', 400, 300),
('Médéa', 400, 300),
('Mostaganem', 400, 300),
('Msila', 500, 400),
('Mascara', 500, 400),
('Ouled Djellal', 600, NULL),
('Bordj Bou Arreridj', 400, 300),
('Boumerdès', 300, 250),
('El Bayadh', 700, 550),
('Tarf', 700, 550),
('Tindouf', 1200, 1000),
('Tissemsilt', 500, 400),
('El Oued', 700, 550),
('Khenchela', 600, 450),
('Ain Defla', 400, 300),
('Ain Temouchent', 500, 400),
('Ghardaïa', 700, 550),
('Relizane', 500, 400),
('Timimoun', 900, NULL),
('Bordj Badji Mokhtar', 1200, NULL),
('Ouled Djellal', 600, NULL),
('Beni Abbes', 1000, NULL),
('Tamanrasset', 1500, NULL),
('Illizi', 1200, NULL),
('In Salah', 1200, NULL);