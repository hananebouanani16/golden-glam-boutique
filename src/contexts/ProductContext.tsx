import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Product } from '@/types/product';
import { usePromotions } from '@/hooks/usePromotions';

// Token d'administration pour les fonctions sécurisées
const ADMIN_TOKEN = "25051985n*N";

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  restoreProduct: (productId: string) => Promise<void>;
  resetProducts: () => void;
  loading: boolean;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: React.ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { applyPromotions } = usePromotions();

  // Force à chaque modification une lecture fraîche depuis Supabase !
  const fetchProducts = async () => {
    console.log("[ProductContext] Début de fetchProducts");
    setLoading(true);
    
    try {
      console.log("[ProductContext] Tentative de connexion à Supabase...");
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('title', { ascending: true });
      
      console.log("[ProductContext] Réponse Supabase - data:", data);
      console.log("[ProductContext] Réponse Supabase - error:", error);
      
      if (error) {
        console.error("[ProductContext] Error fetching products from Supabase:", error);
        setProducts([]);
        setLoading(false);
        return;
      }
      
      // Exclure soft-deleted (deleted_at non null)
      const filtered = (data as Product[])
        .filter((p) => !p.deleted_at);
      
      console.log("[ProductContext] Produits filtrés (sans deleted_at):", filtered);
      console.log("[ProductContext] Nombre de produits:", filtered.length);
      
      // Appliquer les promotions actives
      const productsWithPromotions = applyPromotions(filtered);
      
      setProducts(productsWithPromotions);
      setLoading(false);

      // Log pour tracking
      console.log("[ProductContext] Produits rafraîchis: ", filtered);
    } catch (err) {
      console.error("[ProductContext] Exception lors de fetchProducts:", err);
      setProducts([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("[ProductContext] useEffect - Début du chargement des produits");
    // Rafraîchit toujours à l'init (montage)
    fetchProducts();
    
    // Rafraîchissement automatique toutes les 30 secondes pour garder le stock à jour
    const interval = setInterval(() => {
      console.log("[ProductContext] Auto-refresh du stock");
      fetchProducts();
    }, 30000); // 30 secondes
    
    return () => clearInterval(interval);
  }, []);

  const addProduct = async (productData: Omit<Product, "id">) => {
    try {
      const { data, error } = await supabase.rpc('admin_create_product', {
        p_title: productData.title,
        p_price: productData.price,
        p_category: productData.category,
        p_admin_token: ADMIN_TOKEN,
        p_original_price: productData.originalPrice || null,
        p_image: productData.image || null,
        p_stock_quantity: productData.stock_quantity || 0
      });
      
      if (error) {
        console.error("[ProductContext] addProduct Supabase error:", error);
        throw error;
      }
      
      await fetchProducts();  // On force le refetch
    } catch (error) {
      console.error("[ProductContext] addProduct error:", error);
      throw error;
    }
  };

  const updateProduct = async (updatedProduct: Product) => {
    try {
      const { data, error } = await supabase.rpc('admin_update_product', {
        p_id: updatedProduct.id,
        p_title: updatedProduct.title,
        p_price: updatedProduct.price,
        p_category: updatedProduct.category,
        p_admin_token: ADMIN_TOKEN,
        p_original_price: updatedProduct.originalPrice || null,
        p_image: updatedProduct.image ?? null,
        p_stock_quantity: updatedProduct.stock_quantity || 0
      });
      
      if (error) {
        console.error("[ProductContext] updateProduct Supabase error:", error);
        throw error;
      }
      
      await fetchProducts(); // On force le refetch ici aussi
    } catch (error) {
      console.error("[ProductContext] updateProduct error:", error);
      throw error;
    }
  };

  // Soft delete : utilise la fonction sécurisée
  const deleteProduct = async (productId: string) => {
    try {
      const { data, error } = await supabase.rpc('admin_delete_product', {
        p_id: productId,
        p_admin_token: ADMIN_TOKEN
      });
      
      if (error) {
        console.error("[ProductContext] deleteProduct Supabase error:", error);
        throw error;
      }
      
      await fetchProducts(); // On force le refetch
    } catch (error) {
      console.error("[ProductContext] deleteProduct error:", error);
      throw error;
    }
  };

  // Restaure : utilise une requête UPDATE directe (non critique)
  // Note: Cette fonctionnalité nécessiterait une fonction sécurisée séparée
  const restoreProduct = async (productId: string) => {
    console.warn("[ProductContext] restoreProduct: Cette fonctionnalité nécessite une implémentation sécurisée");
    // Pour l'instant, cette fonction est désactivée pour des raisons de sécurité
    throw new Error("Restore product functionality is disabled for security reasons");
  };

  // Pour interface : on garde la méthode pour forcer rafraîchissement manuel
  const resetProducts = () => {
    fetchProducts();
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        restoreProduct,
        resetProducts,
        loading
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error("useProducts must be used within a ProductProvider");
  return context;
};
