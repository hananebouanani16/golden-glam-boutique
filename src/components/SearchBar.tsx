
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import ProductCard from "./ProductCard";
import { useProducts } from '@/contexts/ProductContext';
import { useApp } from '@/contexts/AppContext';

const SearchBar = () => {
  const { t } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const { products } = useProducts();

  const allProducts = products;

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = allProducts.filter(product => 
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  }, [searchTerm, allProducts]);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="text-gold-300 hover:text-gold-200 hover:bg-gold-500/10"
      >
        <Search className="h-5 w-5" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] bg-gray-900/95 backdrop-blur-sm border-gold-500/20">
          <DialogHeader>
            <DialogTitle className="gold-text flex items-center justify-between">
              <span>{t('search_products')}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-gold-300 hover:text-gold-200"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gold-400 h-4 w-4" />
              <Input
                placeholder={t('search_placeholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800 border-gold-500/30 text-white focus:ring-gold-500 focus:border-gold-500"
                autoFocus
              />
            </div>

            <div className="max-h-96 overflow-y-auto">
              {searchTerm.trim() && (
                <div className="mb-4">
                  <Badge variant="outline" className="border-gold-500/30 text-gold-300">
                    {filteredProducts.length} {t('search_results_found')}
                  </Badge>
                </div>
              )}
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredProducts.map((product) => (
                  <div key={product.id} onClick={() => setIsOpen(false)}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>

              {searchTerm.trim() && filteredProducts.length === 0 && (
                <div className="text-center py-8">
                  <Search className="h-12 w-12 text-gold-400 mx-auto mb-4" />
                  <p className="text-gold-300">{t('search_no_products')}</p>
                  <p className="text-gold-500 text-sm">{t('search_try_other_keywords')}</p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SearchBar;
