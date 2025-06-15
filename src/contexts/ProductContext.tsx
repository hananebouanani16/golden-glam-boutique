
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

function deduplicateProducts(products: Product[]): Product[] {
  const seen = new Set();
  const deduped: Product[] = [];
  for (const p of products) {
    if (!seen.has(p.id)) {
      deduped.push(p);
      seen.add(p.id);
    }
  }
  return deduped;
}

export const ProductProvider = ({ children }: { children: React.ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const savedProductsRaw = localStorage.getItem('products');
    let initialProducts: Product[] = [
      ...bagsData.map(bag => ({ ...bag, category: "sacs" })),
      ...jewelryData.map(jewelry => ({ ...jewelry, category: "bijoux" })),
    ];

    if (savedProductsRaw) {
      try {
        const savedProducts: Product[] = JSON.parse(savedProductsRaw);

        // Mélange les produits initiaux avec ceux du localStorage,
        // en gardant les modifs/localStorage “par-dessus”
        const merged: Product[] = deduplicateProducts([
          ...savedProducts,
          ...initialProducts
        ]);
        setProducts(merged);
      } catch(e) {
        // Si la lecture échoue, fallback sur initial
        setProducts(initialProducts);
      }
    } else {
      setProducts(initialProducts);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

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
