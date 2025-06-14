
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
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useApp } from "@/contexts/AppContext";

const WishlistDrawer = () => {
  const { t } = useApp();
  const { wishlistItems, removeFromWishlist, addToCart } = useCart();

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon" className="text-gold-300 hover:text-gold-200 hover:bg-gold-500/10 relative">
          <Heart className="h-5 w-5" />
          {wishlistItems.length > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-gold-500 text-black text-xs flex items-center justify-center font-bold">
              {wishlistItems.length}
            </span>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[80vh]">
        <DrawerHeader>
          <DrawerTitle className="gold-text">Liste de souhaits ({wishlistItems.length} articles)</DrawerTitle>
          <DrawerDescription>
            Vos articles favoris sauvegardés
          </DrawerDescription>
        </DrawerHeader>
        
        <div className="px-4 flex-1 overflow-y-auto">
          {wishlistItems.length === 0 ? (
            <div className="text-center py-8">
              <Heart className="h-12 w-12 text-gold-400 mx-auto mb-4" />
              <p className="text-gold-300">Votre liste de souhaits est vide</p>
            </div>
          ) : (
            <div className="space-y-4">
              {wishlistItems.map(item => (
                <div key={item.id} className="flex items-center space-x-4 p-4 gold-border rounded-lg">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="text-gold-200 font-semibold">{item.title}</h4>
                    <p className="text-gold-400">{item.price}</p>
                    <p className="text-xs text-gold-500">{item.category}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      size="sm"
                      onClick={() => addToCart(item)}
                      className="gold-button text-xs px-3 py-1"
                    >
                      <ShoppingBag className="h-3 w-3 mr-1" />
                      Ajouter au panier
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromWishlist(item.id)}
                      className="text-red-400 hover:text-red-300 text-xs px-3 py-1"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Supprimer
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline" className="gold-border">
              Fermer
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default WishlistDrawer;
