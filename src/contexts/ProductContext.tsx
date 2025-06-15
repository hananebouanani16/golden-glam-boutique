
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

  useEffect(() => {
    let useBase = false;
    try {
      const savedProductsRaw = localStorage.getItem('products');
      if (savedProductsRaw) {
        const parsed = JSON.parse(savedProductsRaw);
        if (Array.isArray(parsed)) {
          setProducts(parsed);
        } else {
          useBase = true;
        }
      } else {
        useBase = true;
      }
    } catch (e) {
      useBase = true;
    }
    if (useBase) {
      setProducts(baseProducts);
      localStorage.setItem('products', JSON.stringify(baseProducts));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  const resetProducts = () => {
    setProducts(baseProducts);
    localStorage.setItem('products', JSON.stringify(baseProducts));
  };

  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
    };
    setProducts(prev => [newProduct, ...prev]);
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const deleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
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

