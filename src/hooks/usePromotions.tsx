import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Promotion } from '@/types/stock';
import { Product } from '@/types/product';

export const usePromotions = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivePromotions();
  }, []);

  const fetchActivePromotions = async () => {
    try {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from('promotions')
        .select('*')
        .eq('is_active', true)
        .lte('start_date', now)
        .gte('end_date', now);

      if (error) throw error;
      setPromotions(data || []);
    } catch (error) {
      console.error('Error fetching promotions:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyPromotions = (products: Product[]): Product[] => {
    if (!promotions.length) return products;

    return products.map(product => {
      // Trouver la promotion applicable (par catégorie ou globale)
      const applicablePromo = promotions.find(promo => 
        !promo.category || promo.category === '' || promo.category === product.category
      );

      if (!applicablePromo) return product;

      // Calculer le nouveau prix avec la réduction
      const originalPrice = parseFloat(product.price);
      const discountedPrice = originalPrice * (1 - applicablePromo.discount_percentage / 100);

      return {
        ...product,
        originalPrice: product.price, // Prix original
        price: discountedPrice.toString(), // Nouveau prix réduit
        badge: `${applicablePromo.discount_percentage}% OFF` // Badge de promo
      };
    });
  };

  return { promotions, loading, applyPromotions };
};
