
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/types/product';
import { bagsData } from "@/data/bagsData";
import { jewelryData } from "@/data/jewelryData";

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  resetProducts: () => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: React.ReactNode }) => {
  // Construction de la base à chaque démarrage
  const baseProducts: Product[] = [
    ...bagsData.map(bag => ({ ...bag, category: "sacs" })),
    ...jewelryData.map(jewelry => ({ ...jewelry, category: "bijoux" })),
  ];

  const [products, setProducts] = useState<Product[]>([]);

  // Chargement initial
  useEffect(() => {
    let useBase = false;
    try {
      const savedProductsRaw = localStorage.getItem('products');
      console.log('[ProductContext] Chargement depuis localStorage:', savedProductsRaw);
      if (savedProductsRaw) {
        const parsed = JSON.parse(savedProductsRaw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProducts(parsed);
          console.log("[ProductContext] Produits chargés depuis localStorage", parsed.length);
        } else {
          useBase = true;
          console.log("[ProductContext] Le tableau dans le localStorage est vide, on remet les produits de base.");
        }
      } else {
        useBase = true;
        console.log("[ProductContext] Rien dans le localStorage, on insère la base.");
      }
    } catch (e) {
      useBase = true;
      console.log("[ProductContext] Erreur en lisant le localStorage, reset avec base.", e);
    }
    if (useBase) {
      setProducts(baseProducts);
      localStorage.setItem('products', JSON.stringify(baseProducts));
      console.log("[ProductContext] baseProducts insérés dans localStorage:", baseProducts.length);
    }
  }, []);

  // Sauvegarde automatique dès qu'on modifie products
  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
    console.log("[ProductContext] Sauvegarde dans localStorage:", products.length, products.map(p => ({title: p.title, price: p.price})));
  }, [products]);

  // Actions
  const resetProducts = () => {
    setProducts(baseProducts);
    localStorage.setItem('products', JSON.stringify(baseProducts));
    console.log("[ProductContext] resetProducts : retour à la baseProducts.");
  };

  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
    };
    setProducts(prev => {
      const updated = [newProduct, ...prev];
      localStorage.setItem('products', JSON.stringify(updated));
      console.log("[ProductContext] addProduct : produit ajouté");
      return updated;
    });
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts(prev => {
      const updated = prev.map(p => p.id === updatedProduct.id ? updatedProduct : p);
      localStorage.setItem('products', JSON.stringify(updated));
      console.log("[ProductContext] updateProduct : produit modifié", updatedProduct.id);
      return updated;
    });
  };

  const deleteProduct = (productId: string) => {
    setProducts(prev => {
      const updated = prev.filter(p => p.id !== productId);
      localStorage.setItem('products', JSON.stringify(updated));
      console.log("[ProductContext] deleteProduct : produit supprimé", productId);
      return updated;
    });
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, resetProducts }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
