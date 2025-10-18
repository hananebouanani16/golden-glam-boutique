import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useOrders } from "@/contexts/OrderContext";
import { formatPrice } from "@/utils/priceUtils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import CheckoutFormContent from "./CheckoutFormContent";
import RatingComponent from "./RatingComponent";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export interface Product {
  id: string;
  image: string;
  title: string;
  price: string;
  originalPrice?: string;
  badge?: string;
  category: string;
  stock_quantity?: number;
  low_stock_threshold?: number;
  is_out_of_stock?: boolean;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart, addToWishlist, isInWishlist } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [isProductPurchased, setIsProductPurchased] = useState(false);
  
  let orders: any[] = [];
  let ordersError = false;
  
  try {
    const ordersContext = useOrders();
    orders = ordersContext.orders;
  } catch (error) {
    ordersError = true;
  }
  
  // Safety check for undefined product or missing price
  if (!product || !product.price) {
    console.error('ProductCard received invalid product:', product);
    return null;
  }

  // Conversion: plus besoin de convertToDinars !
  // Utilisation directe - forcer en nombre en cas de string
  const priceInDA = Number(product.price);
  const originalPriceInDA = product.originalPrice ? Number(product.originalPrice) : null;

  useEffect(() => {
    if (ordersError) {
      setIsProductPurchased(false);
      return;
    }

    const purchased = orders.some(order => {
      if (order.status !== 'confirmed') return false;
      return order.items.some(item => item.id === product.id);
    });
    
    setIsProductPurchased(purchased);
  }, [orders, product.id, ordersError]);
  
  const handleAddToCart = () => {
    if (product.is_out_of_stock || (product.stock_quantity !== undefined && product.stock_quantity === 0)) {
      toast.error("Produit en rupture de stock !", {
        description: "Ce produit n'est plus disponible actuellement.",
        duration: 4000,
      });
      return;
    }
    
    if (isProductPurchased) {
      toast.error("Ce produit a déjà été acheté !", {
        description: "Vous ne pouvez pas l'ajouter au panier.",
        duration: 4000,
      });
      return;
    }

    addToCart(product);
    toast.success("Produit ajouté au panier !", {
      description: product.title,
      duration: 3000,
    });
  };

  const handleToggleWishlist = () => {
    addToWishlist(product);
    if (!isInWishlist(product.id)) {
      toast.success("Ajouté à la liste de souhaits !", {
        description: product.title,
        duration: 3000,
      });
    }
  };

  const handleBuyNow = () => {
    if (product.is_out_of_stock || (product.stock_quantity !== undefined && product.stock_quantity === 0)) {
      toast.error("Produit en rupture de stock !", {
        description: "Ce produit n'est plus disponible actuellement.",
        duration: 4000,
      });
      return;
    }
    
    if (isProductPurchased) {
      toast.error("Ce produit a déjà été acheté !", {
        description: "Vous ne pouvez pas l'acheter à nouveau.",
        duration: 4000,
      });
      return;
    }

    addToCart(product);
    setShowCheckout(true);
  };

  return (
    <>
      <div className="group relative bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden hover:bg-white/20 transition-all duration-300 border border-gold-500/20 hover:border-gold-500/40 hover:shadow-lg hover:shadow-gold-500/20">
        <div className="relative overflow-hidden">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.is_out_of_stock || (product.stock_quantity !== undefined && product.stock_quantity === 0) ? (
            <Badge className="absolute top-2 left-2 bg-red-500 text-white">
              Rupture de stock
            </Badge>
          ) : product.stock_quantity !== undefined && product.stock_quantity > 0 ? (
            <Badge className="absolute top-2 left-2 bg-blue-500 text-white">
              Stock: {product.stock_quantity}
            </Badge>
          ) : isProductPurchased ? (
            <Badge className="absolute top-2 left-2 bg-green-500 text-white">
              Déjà acheté
            </Badge>
          ) : product.badge ? (
            <Badge className="absolute top-2 left-2 bg-gold-500 text-black hover:bg-gold-400">
              {product.badge}
            </Badge>
          ) : null}
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
          
          {/* Composant d'évaluation */}
          <div className="mb-3">
            <RatingComponent productId={product.id} productTitle={product.title} />
          </div>

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
              className={`flex-1 ${
                product.is_out_of_stock || (product.stock_quantity !== undefined && product.stock_quantity === 0) || isProductPurchased
                  ? 'opacity-50 cursor-not-allowed border-gray-500' 
                  : 'gold-border hover:bg-gold-500/10'
              }`}
              disabled={product.is_out_of_stock || (product.stock_quantity !== undefined && product.stock_quantity === 0) || isProductPurchased}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {product.is_out_of_stock || (product.stock_quantity !== undefined && product.stock_quantity === 0) ? 'Rupture' : isProductPurchased ? 'Acheté' : 'Ajouter'}
            </Button>
            <Button
              onClick={handleBuyNow}
              className={`flex-1 ${
                product.is_out_of_stock || (product.stock_quantity !== undefined && product.stock_quantity === 0) || isProductPurchased
                  ? 'opacity-50 cursor-not-allowed bg-gray-500' 
                  : 'gold-button'
              }`}
              disabled={product.is_out_of_stock || (product.stock_quantity !== undefined && product.stock_quantity === 0) || isProductPurchased}
            >
              {product.is_out_of_stock || (product.stock_quantity !== undefined && product.stock_quantity === 0) ? 'Rupture' : isProductPurchased ? 'Acheté' : 'Acheter'}
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900/95 backdrop-blur-sm border-gold-500/20 shadow-2xl">
          <DialogHeader className="bg-gray-800/80 border-b border-gold-500/20 p-6 -m-6 mb-6">
            <DialogTitle className="text-2xl gold-text flex items-center justify-between">
              <div className="flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Finaliser la Commande
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowCheckout(false)}
                className="text-gold-300 hover:text-gold-200"
              >
                ✕
              </Button>
            </DialogTitle>
          </DialogHeader>
          <CheckoutFormContent 
            onClose={() => setShowCheckout(false)}
            initialProduct={product}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductCard;
