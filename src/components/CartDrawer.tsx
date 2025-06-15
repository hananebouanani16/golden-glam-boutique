
import React from 'react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Plus, Minus, Trash2, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useOrders } from "@/contexts/OrderContext";
import { useApp } from "@/contexts/AppContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import CheckoutFormContent from "./CheckoutFormContent";
import { useState } from "react";
import { convertToDinars, formatPrice } from "@/utils/priceUtils";

const CartDrawer = () => {
  const { t } = useApp();
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, getCartItemsCount } = useCart();
  const { orders } = useOrders();
  const [showCheckout, setShowCheckout] = useState(false);

  // Filtrer les produits déjà achetés du panier
  const availableCartItems = cartItems.filter(item => {
    const isProductPurchased = orders.some(order => 
      order.items.some(orderItem => orderItem.id === item.id)
    );
    return !isProductPurchased;
  });

  return (
    <>
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="ghost" size="icon" className="text-gold-300 hover:text-gold-200 hover:bg-gold-500/10 relative">
            <ShoppingBag className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-gold-500 text-black text-xs flex items-center justify-center font-bold">
              {availableCartItems.reduce((acc, item) => acc + item.quantity, 0)}
            </span>
          </Button>
        </DrawerTrigger>
        <DrawerContent className="max-h-[80vh]">
          <DrawerHeader>
            <DrawerTitle className="gold-text">Panier ({availableCartItems.reduce((acc, item) => acc + item.quantity, 0)} articles)</DrawerTitle>
            <DrawerDescription>
              Gérez vos articles avant de finaliser votre commande
            </DrawerDescription>
          </DrawerHeader>
          
          <div className="px-4 flex-1 overflow-y-auto">
            {availableCartItems.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingBag className="h-12 w-12 text-gold-400 mx-auto mb-4" />
                <p className="text-gold-300">Votre panier est vide</p>
              </div>
            ) : (
              <div className="space-y-4">
                {availableCartItems.map(item => {
                  const priceInDA = convertToDinars(item.price);
                  return (
                    <div key={item.id} className="flex items-center space-x-4 p-4 gold-border rounded-lg">
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="text-gold-200 font-semibold">{item.title}</h4>
                        <p className="text-gold-400">{formatPrice(priceInDA)}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="h-8 w-8 text-gold-300 hover:text-gold-200"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="text-gold-200 min-w-[2rem] text-center">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="h-8 w-8 text-gold-300 hover:text-gold-200"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCart(item.id)}
                          className="h-8 w-8 text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {availableCartItems.length > 0 && (
            <DrawerFooter>
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-bold text-gold-200">Total:</span>
                <span className="text-lg font-bold gold-text">
                  {formatPrice(availableCartItems.reduce((total, item) => {
                    const priceInDA = convertToDinars(item.price);
                    return total + (priceInDA * item.quantity);
                  }, 0))}
                </span>
              </div>
              <div className="flex gap-2">
                <DrawerClose asChild>
                  <Button variant="outline" className="flex-1 gold-border">
                    Continuer les achats
                  </Button>
                </DrawerClose>
                <Button 
                  className="flex-1 gold-button"
                  onClick={() => setShowCheckout(true)}
                >
                  Acheter maintenant
                </Button>
              </div>
            </DrawerFooter>
          )}
        </DrawerContent>
      </Drawer>

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
          <CheckoutFormContent onClose={() => setShowCheckout(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CartDrawer;
