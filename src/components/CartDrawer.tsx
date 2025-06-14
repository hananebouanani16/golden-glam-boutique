
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
import { ShoppingBag, Plus, Minus, Trash2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useApp } from "@/contexts/AppContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import CheckoutForm from "./CheckoutForm";
import { useState } from "react";

const CartDrawer = () => {
  const { t } = useApp();
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, getCartItemsCount } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);

  return (
    <>
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="ghost" size="icon" className="text-gold-300 hover:text-gold-200 hover:bg-gold-500/10 relative">
            <ShoppingBag className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-gold-500 text-black text-xs flex items-center justify-center font-bold">
              {getCartItemsCount()}
            </span>
          </Button>
        </DrawerTrigger>
        <DrawerContent className="max-h-[80vh]">
          <DrawerHeader>
            <DrawerTitle className="gold-text">Panier ({getCartItemsCount()} articles)</DrawerTitle>
            <DrawerDescription>
              Gérez vos articles avant de finaliser votre commande
            </DrawerDescription>
          </DrawerHeader>
          
          <div className="px-4 flex-1 overflow-y-auto">
            {cartItems.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingBag className="h-12 w-12 text-gold-400 mx-auto mb-4" />
                <p className="text-gold-300">Votre panier est vide</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map(item => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 gold-border rounded-lg">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="text-gold-200 font-semibold">{item.title}</h4>
                      <p className="text-gold-400">{item.price}</p>
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
                ))}
              </div>
            )}
          </div>

          {cartItems.length > 0 && (
            <DrawerFooter>
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-bold text-gold-200">Total:</span>
                <span className="text-lg font-bold gold-text">{getCartTotal().toFixed(2)} DA</span>
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <CheckoutForm onClose={() => setShowCheckout(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CartDrawer;
