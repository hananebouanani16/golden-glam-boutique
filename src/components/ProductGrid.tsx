
import { useState } from "react";
import ProductCard from "./ProductCard";
import FilterSection from "./FilterSection";
import { useApp } from "@/contexts/AppContext";

interface Product {
  id: string;
  image: string;
  title: string;
  price: string;
  originalPrice?: string;
  category: string;
}

interface ProductGridProps {
  id: string;
  title: string;
  subtitle: string;
  products: Product[];
}

const ProductGrid = ({ id, title, subtitle, products }: ProductGridProps) => {
  const { t } = useApp();
  const [filters, setFilters] = useState({ category: "all", priceRange: "all" });

  const categories = [...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(product => {
    if (!product || !product.price) return false;

    // Category filter
    if (filters.category !== "all" && product.category?.trim() !== filters.category) {
      return false;
    }

    // Price range filter
    if (filters.priceRange !== "all") {
      // Utilisation directe du prix, plus besoin de conversion
      const priceInDA = Number(product.price);
      switch (filters.priceRange) {
        case "0-5000":
          if (priceInDA > 5000) return false;
          break;
        case "5000-10000":
          if (priceInDA < 5000 || priceInDA > 10000) return false;
          break;
        case "10000-20000":
          if (priceInDA < 10000 || priceInDA > 20000) return false;
          break;
        case "20000+":
          if (priceInDA < 20000) return false;
          break;
      }
    }

    return true;
  });

  const handleFilterChange = (category: string, priceRange: string) => {
    setFilters({ category, priceRange });
  };

  return (
    <section id={id} className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold gold-text mb-4">{title}</h2>
          <p className="text-xl text-gold-300 max-w-2xl mx-auto">{subtitle}</p>
        </div>
        
        {products.length > 0 && (
          <FilterSection
            onFilterChange={handleFilterChange}
            categories={categories}
            activeFilters={filters}
          />
        )}
        
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gold-300 text-lg">Aucun produit disponible dans cette catégorie</p>
            <p className="text-gold-500">Les produits seront bientôt disponibles!</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gold-300 text-lg">{t('no_products_found')}</p>
                <p className="text-gold-500">{t('try_other_filters')}</p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;
