import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Product } from '@/types/product';

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

  const fetchProducts = async () => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('title', { ascending: true });
      
      if (error) {
        console.error("[ProductContext] Error fetching products:", error);
        setProducts([]);
        setLoading(false);
        return;
      }
      
      const filtered = (data as Product[]).filter((p) => !p.deleted_at);
      setProducts(filtered);
      setLoading(false);
    } catch (err) {
      console.error("[ProductContext] Error:", err);
      setProducts([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
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
      
      if (error) throw error;
      await fetchProducts();
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
      
      if (error) throw error;
      await fetchProducts();
    } catch (error) {
      console.error("[ProductContext] updateProduct error:", error);
      throw error;
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      const { data, error } = await supabase.rpc('admin_delete_product', {
        p_id: productId,
        p_admin_token: ADMIN_TOKEN
      });
      
      if (error) throw error;
      await fetchProducts();
    } catch (error) {
      console.error("[ProductContext] deleteProduct error:", error);
      throw error;
    }
  };

  const restoreProduct = async (productId: string) => {
    try {
      const { data, error } = await supabase.rpc('admin_restore_product', {
        p_id: productId,
        p_admin_token: ADMIN_TOKEN
      });
      
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
