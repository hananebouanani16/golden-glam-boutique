import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Product } from '@/types/product';

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

  const fetchProducts = async () => {
    console.log("[ProductContext] 🔄 Début chargement produits depuis Supabase...");
    setLoading(true);
    
    // Timeout de sécurité: 8 secondes max
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), 8000)
    );
    
    const fetchPromise = supabase
      .from('products')
      .select('*')
      .is('deleted_at', null)
      .order('title', { ascending: true });
    
    try {
      const { data, error } = await Promise.race([fetchPromise, timeoutPromise]) as any;
      
      if (error) {
        console.error("[ProductContext] ❌ Erreur Supabase:", error);
      } else if (data) {
        console.log("[ProductContext] ✅ Produits chargés:", data.length);
        setProducts(data as Product[]);
      }
    } catch (err: any) {
      if (err.message === 'Timeout') {
        console.error("[ProductContext] ⏱️ Timeout - la requête a pris trop de temps");
      } else {
        console.error("[ProductContext] ❌ Erreur réseau:", err);
      }
      // Garder les produits du cache si disponibles
    } finally {
      setLoading(false);
      console.log("[ProductContext] ✅ Chargement terminé");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addProduct = async (productData: Omit<Product, "id">) => {
    try {
      console.log("[ProductContext] ➕ Ajout produit");
      console.log("[ProductContext] Images dans la galerie:", productData.images?.length || 0);
      
      // Insérer directement dans la table avec les nouvelles colonnes
      const { data, error } = await supabase
        .from('products')
        .insert({
          title: productData.title,
          price: productData.price,
          category: productData.category,
          original_price: productData.originalPrice || null,
          image: productData.image || null,
          images: productData.images || [],
          stock_quantity: productData.stock_quantity || 0,
          low_stock_threshold: productData.low_stock_threshold || 5
        })
        .select()
        .single();
      
      if (error) {
        console.error("[ProductContext] ❌ Erreur ajout:", error);
        throw error;
      }
      
      console.log("[ProductContext] ✅ Produit ajouté");
      await fetchProducts();
    } catch (error) {
      console.error("[ProductContext] addProduct error:", error);
      throw error;
    }
  };

  const updateProduct = async (updatedProduct: Product) => {
    try {
      console.log("[ProductContext] 📝 Mise à jour produit:", updatedProduct.id);
      console.log("[ProductContext] Images dans la galerie:", updatedProduct.images?.length || 0);
      
      // Mettre à jour directement dans la table avec les nouvelles colonnes
      const { data, error } = await supabase
        .from('products')
        .update({
          title: updatedProduct.title,
          price: updatedProduct.price,
          category: updatedProduct.category,
          original_price: updatedProduct.originalPrice || null,
          image: updatedProduct.image ?? null,
          images: updatedProduct.images || [],
          stock_quantity: updatedProduct.stock_quantity || 0,
          low_stock_threshold: updatedProduct.low_stock_threshold || 5
        })
        .eq('id', updatedProduct.id)
        .is('deleted_at', null)
        .select()
        .single();
      
      if (error) {
        console.error("[ProductContext] ❌ Erreur mise à jour:", error);
        throw error;
      }
      
      console.log("[ProductContext] ✅ Produit mis à jour");
      await fetchProducts();
    } catch (error) {
      console.error("[ProductContext] updateProduct error:", error);
      throw error;
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      console.log("[ProductContext] 🗑️ Tentative suppression produit:", productId);
      
      // Vérifier l'authentification
      const { data: { session } } = await supabase.auth.getSession();
      console.log("[ProductContext] Session auth:", session ? "✅ Authentifié" : "❌ Non authentifié");
      
      // Soft delete directement
      const { data, error } = await supabase
        .from('products')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', productId)
        .is('deleted_at', null);
      
      if (error) {
        console.error("[ProductContext] ❌ Erreur suppression:", error);
        throw error;
      }
      
      console.log("[ProductContext] ✅ Produit supprimé, rechargement...");
      await fetchProducts();
    } catch (error) {
      console.error("[ProductContext] deleteProduct error:", error);
      throw error;
    }
  };

  const restoreProduct = async (productId: string) => {
    try {
      // Restaurer le produit directement
      const { data, error } = await supabase
        .from('products')
        .update({ deleted_at: null })
        .eq('id', productId)
        .not('deleted_at', 'is', null);
      
      if (error) throw error;
      await fetchProducts();
    } catch (error) {
      console.error("[ProductContext] restoreProduct error:", error);
      throw error;
    }
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
