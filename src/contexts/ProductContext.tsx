
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

  // Chargement initial : priorité 100% au localStorage (même si tableau vide)
  useEffect(() => {
    try {
      const savedProductsRaw = localStorage.getItem('products');
      console.log('[ProductContext] Chargement depuis localStorage:', savedProductsRaw);

      if (savedProductsRaw !== null) {
        // On se fie totalement à la source locale, même pour [] vide (cas suppression totale).
        const parsed = JSON.parse(savedProductsRaw);
        if (Array.isArray(parsed)) {
          setProducts(parsed);
          console.log("[ProductContext] Produits chargés depuis localStorage (y compris tableau vide !)", parsed.length);
          return;
        } else {
          // Cas inattendu : localStorage présent mais format mauvais -> on réinitialise pour ne pas bloquer l’UI.
          setProducts(baseProducts);
          localStorage.setItem('products', JSON.stringify(baseProducts));
          console.log("[ProductContext] Format localStorage mauvais, baseProducts insérés.");
          return;
        }
      } else {
        // Pas de clé enregistrée : première visite, on injecte la base.
        setProducts(baseProducts);
        localStorage.setItem('products', JSON.stringify(baseProducts));
        console.log("[ProductContext] Rien dans le localStorage, baseProducts insérés :", baseProducts.length);
        return;
      }
    } catch (e) {
      // Cas d’erreur parsing : on reset à la base.
      setProducts(baseProducts);
      localStorage.setItem('products', JSON.stringify(baseProducts));
      console.log("[ProductContext] Erreur parsing localStorage, reset avec base :", e);
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

