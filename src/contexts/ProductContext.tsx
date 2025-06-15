
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/types/product';
import { bagsData } from "@/data/bagsData";
import { jewelryData } from "@/data/jewelryData";

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: React.ReactNode }) => {
  const baseProducts: Product[] = [
    ...bagsData.map(bag => ({ ...bag, category: "sacs" })),
    ...jewelryData.map(jewelry => ({ ...jewelry, category: "bijoux" })),
  ];
  const [products, setProducts] = useState<Product[]>([]);

  // Charger les produits au démarrage
  useEffect(() => {
    const savedProductsRaw = localStorage.getItem('products');
    if (savedProductsRaw) {
      try {
        const savedProducts: Product[] = JSON.parse(savedProductsRaw);
        setProducts(savedProducts);
      } catch (e) {
        setProducts(baseProducts);
      }
    } else {
      setProducts(baseProducts);
    }
  }, []);

  // Sauvegarder à chaque modification
  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  // Si liste vide, réinjecter les produits de base
  useEffect(() => {
    if (products.length === 0) {
      setProducts(baseProducts);
      localStorage.setItem('products', JSON.stringify(baseProducts));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products.length]);

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
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct }}>
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
