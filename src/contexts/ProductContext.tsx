
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

  // Force à chaque modification une lecture fraîche depuis Supabase !
  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*');
      // No order by 'created_at' since the column doesn't exist on this table
    if (error) {
      console.error("[ProductContext] Error fetching products from Supabase:", error);
      setProducts([]);
      setLoading(false);
      return;
    }
    // Exclure soft-deleted (deleted_at non null)
    const filtered = (data as Product[])
      .filter((p) => !p.deleted_at);
    setProducts(filtered);
    setLoading(false);

    // Log pour tracking
    console.log("[ProductContext] Produits rafraîchis: ", filtered);
  };

  useEffect(() => {
    // Rafraîchit toujours à l’init (montage)
    fetchProducts();
    // ... on pourrait ajouter du temps réel plus tard
  }, []);

  const addProduct = async (productData: Omit<Product, "id">) => {
    const { error } = await supabase.from('products').insert([{
      title: productData.title,
      price: productData.price,
      original_price: productData.originalPrice || null,
      category: productData.category,
      image: productData.image || null,
    }]);
    if (error) {
      console.error("[ProductContext] addProduct Supabase error:", error);
      throw error;
    }
    await fetchProducts();  // On force le refetch
  };

  const updateProduct = async (updatedProduct: Product) => {
    const { error } = await supabase
      .from("products")
      .update({
        title: updatedProduct.title,
        price: updatedProduct.price,
        original_price: updatedProduct.originalPrice || null,
        category: updatedProduct.category,
        image: updatedProduct.image ?? null,
      })
      .eq("id", updatedProduct.id);
    if (error) {
      console.error("[ProductContext] updateProduct Supabase error:", error);
      throw error;
    }
    await fetchProducts(); // On force le refetch ici aussi
  };

  // Soft delete : pose simplement deleted_at 
  const deleteProduct = async (productId: string) => {
    const { error } = await supabase
      .from("products")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", productId);
    if (error) {
      console.error("[ProductContext] deleteProduct Supabase error:", error);
      throw error;
    }
    await fetchProducts(); // On force le refetch
  };

  // Restaure : repasse deleted_at à null
  const restoreProduct = async (productId: string) => {
    const { error } = await supabase
      .from("products")
      .update({ deleted_at: null })
      .eq("id", productId);
    if (error) {
      console.error("[ProductContext] restoreProduct Supabase error:", error);
      throw error;
    }
    await fetchProducts();
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
