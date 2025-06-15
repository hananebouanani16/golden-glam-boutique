
-- Table des produits
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  price TEXT NOT NULL,
  original_price TEXT,
  category TEXT NOT NULL,
  image TEXT,
  deleted_at TIMESTAMP WITH TIME ZONE -- pour restaurer les produits supprimés
);

-- Table des commandes
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL,
  customer_info JSONB NOT NULL,
  items JSONB NOT NULL,
  total_products INTEGER NOT NULL,
  delivery_fee INTEGER NOT NULL,
  total_amount INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Activez la RLS pour une sécurité future
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Ouverture (publique) pour lecture/écriture temporaire
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public edit products" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update products" ON public.products FOR UPDATE USING (true);
CREATE POLICY "Public delete products" ON public.products FOR DELETE USING (true);

CREATE POLICY "Public read orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Public insert orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update orders" ON public.orders FOR UPDATE USING (true);

