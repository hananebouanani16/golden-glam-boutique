
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { convertToDinars, formatPrice } from "@/utils/priceUtils";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import CheckoutForm from "./CheckoutForm";
import { useState } from "react";

export interface Product {
  id: string;
  image: string;
  title: string;
  price: string;
  originalPrice?: string;
  badge?: string;
  category: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart, addToWishlist, isInWishlist } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  
  // Safety check for undefined product or missing price
  if (!product || !product.price) {
    console.error('ProductCard received invalid product:', product);
    return null;
  }
  
  const handleAddToCart = () => {
    addToCart(product);
  };

  const handleToggleWishlist = () => {
    addToWishlist(product);
  };

  const handleBuyNow = () => {
    addToCart(product);
    setShowCheckout(true);
  };

  const priceInDA = convertToDinars(product.price);
  const originalPriceInDA = product.originalPrice ? convertToDinars(product.originalPrice) : null;

  return (
    <>
      <div className="group relative bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden hover:bg-white/20 transition-all duration-300 border border-gold-500/20">
        <div className="relative overflow-hidden">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.badge && (
            <Badge className="absolute top-2 left-2 bg-gold-500 text-black hover:bg-gold-400">
              {product.badge}
            </Badge>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleWishlist}
            className={`absolute top-2 right-2 ${
              isInWishlist(product.id) 
                ? 'text-red-500 hover:text-red-400' 
                : 'text-gold-300 hover:text-gold-200'
            } hover:bg-black/20`}
          >
            <Heart className={`h-5 w-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
          </Button>
        </div>
        
        <div className="p-4">
          <h3 className="text-gold-200 font-semibold mb-2 line-clamp-2">{product.title}</h3>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-gold-400 font-bold">{formatPrice(priceInDA)}</span>
              {originalPriceInDA && (
                <span className="text-gray-400 line-through text-sm">
                  {formatPrice(originalPriceInDA)}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={handleAddToCart}
              variant="outline"
              className="flex-1 gold-border hover:bg-gold-500/10"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Ajouter
            </Button>
            <Button
              onClick={handleBuyNow}
              className="flex-1 gold-button"
            >
              Acheter
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-black/95 backdrop-blur-sm border-gold-500/20">
          <CheckoutForm 
            onClose={() => setShowCheckout(false)}
            initialProduct={product}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductCard;
