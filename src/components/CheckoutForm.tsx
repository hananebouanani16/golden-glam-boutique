
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { useOrders } from "@/contexts/OrderContext";
import { deliveryRates } from "@/data/deliveryRates";
import { convertToDinars, formatPrice } from "@/utils/priceUtils";
import { toast } from "sonner";
import { ShoppingCart, Truck, Package, User, CreditCard } from "lucide-react";

interface CheckoutFormProps {
  onClose: () => void;
  initialProduct?: {
    id: string;
    image: string;
    title: string;
    price: string;
    originalPrice?: string;
    category: string;
  };
}

const CheckoutForm = ({ onClose, initialProduct }: CheckoutFormProps) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [wilaya, setWilaya] = useState("");
  const [deliveryType, setDeliveryType] = useState<'home' | 'office'>('home');
  const [address, setAddress] = useState("");

  const { cartItems, clearCart } = useCart();
  const { addOrder } = useOrders();

  const items = initialProduct ? [{ ...initialProduct, quantity: 1 }] : cartItems;
  const totalProducts = items.reduce((acc, item) => acc + item.quantity, 0);

  const selectedDeliveryRate = deliveryRates.find(rate => rate.wilaya === wilaya);
  const deliveryFee = selectedDeliveryRate 
    ? (deliveryType === 'home' ? selectedDeliveryRate.home : (selectedDeliveryRate.office || selectedDeliveryRate.home))
    : 0;
  
  const subtotal = items.reduce((acc, item) => {
    const priceInDA = convertToDinars(item.price);
    return acc + (priceInDA * item.quantity);
  }, 0);

  const totalAmount = subtotal + deliveryFee;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName || !lastName || !phone || !wilaya || !deliveryType) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    if (deliveryType === 'home' && !address) {
      toast.error("L'adresse est obligatoire pour la livraison à domicile");
      return;
    }

    const order = {
      customerInfo: {
        firstName,
        lastName,
        phone,
        wilaya,
        deliveryType: deliveryType as 'home' | 'office',
        address: deliveryType === 'home' ? address : undefined
      },
      items: items.map(item => ({
        id: item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })),
      totalProducts,
      deliveryFee,
      totalAmount
    };

    addOrder(order);
    clearCart();
    toast.success("Commande enregistrée avec succès!");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <Card className="w-full bg-gray-900/95 backdrop-blur-sm border-gold-500/20 shadow-2xl">
          <CardHeader className="bg-gray-800/80 border-b border-gold-500/20">
            <CardTitle className="text-2xl gold-text flex items-center justify-between">
              <div className="flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Finaliser la Commande
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClose}
                className="text-gold-300 hover:text-gold-200"
              >
                ✕
              </Button>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6 p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold gold-text flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Informations Personnelles
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-gold-300">
                      Prénom
                    </Label>
                    <Input
                      type="text"
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="bg-gray-800 border-gold-500/30 text-white focus:ring-gold-500 focus:border-gold-500"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-gold-300">
                      Nom
                    </Label>
                    <Input
                      type="text"
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="bg-gray-800 border-gold-500/30 text-white focus:ring-gold-500 focus:border-gold-500"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="phone" className="text-gold-300">
                    Numéro de Téléphone
                  </Label>
                  <Input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="bg-gray-800 border-gold-500/30 text-white focus:ring-gold-500 focus:border-gold-500"
                    required
                  />
                </div>
              </div>

              <Separator className="bg-gold-500/20" />

              {/* Delivery Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold gold-text flex items-center">
                  <Truck className="h-4 w-4 mr-2" />
                  Informations de Livraison
                </h3>
                <div>
                  <Label htmlFor="wilaya" className="text-gold-300">
                    Wilaya
                  </Label>
                  <Select value={wilaya} onValueChange={setWilaya}>
                    <SelectTrigger className="bg-gray-800 border-gold-500/30 text-white focus:ring-gold-500 focus:border-gold-500">
                      <SelectValue placeholder="Sélectionner une wilaya" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gold-500/30 text-white">
                      {deliveryRates.map((rate) => (
                        <SelectItem key={rate.wilaya} value={rate.wilaya} className="hover:bg-gray-700">
                          {rate.wilaya}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-gold-300">
                    Type de Livraison
                  </Label>
                  <div className="flex items-center space-x-6 mt-2">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="homeDelivery"
                        name="deliveryType"
                        value="home"
                        className="mr-2 h-4 w-4 text-gold-500 focus:ring-gold-500 bg-gray-800 border-gold-500/30"
                        checked={deliveryType === 'home'}
                        onChange={() => setDeliveryType('home')}
                      />
                      <Label htmlFor="homeDelivery" className="text-gold-300">
                        À Domicile
                      </Label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="officeDelivery"
                        name="deliveryType"
                        value="office"
                        className="mr-2 h-4 w-4 text-gold-500 focus:ring-gold-500 bg-gray-800 border-gold-500/30"
                        checked={deliveryType === 'office'}
                        onChange={() => setDeliveryType('office')}
                      />
                      <Label htmlFor="officeDelivery" className="text-gold-300">
                        Point de Retrait
                      </Label>
                    </div>
                  </div>
                </div>
                {deliveryType === 'home' && (
                  <div>
                    <Label htmlFor="address" className="text-gold-300">
                      Adresse
                    </Label>
                    <Input
                      type="text"
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="bg-gray-800 border-gold-500/30 text-white focus:ring-gold-500 focus:border-gold-500"
                      required={deliveryType === 'home'}
                    />
                  </div>
                )}
              </div>

              <Separator className="bg-gold-500/20" />

              {/* Order Summary */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold gold-text flex items-center">
                  <Package className="h-4 w-4 mr-2" />
                  Récapitulatif de la Commande
                </h3>
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gold-500/20">
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-white">
                        <div className="flex items-center">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-12 h-12 object-cover rounded mr-3"
                          />
                          <span>{item.title} x {item.quantity}</span>
                        </div>
                        <span className="text-gold-300 font-semibold">
                          {formatPrice(convertToDinars(item.price) * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <Separator className="bg-gold-500/20 my-4" />
                  <div className="space-y-2">
                    <div className="flex justify-between text-gold-300">
                      <span>Sous-total</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-gold-300">
                      <span>Frais de livraison</span>
                      <span>{formatPrice(deliveryFee)}</span>
                    </div>
                    <Separator className="bg-gold-500/20 my-2" />
                    <div className="flex justify-between font-bold text-gold-400 text-lg">
                      <span>Total</span>
                      <span>{formatPrice(totalAmount)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="bg-gold-500/20" />

              {/* Payment Information */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold gold-text flex items-center">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Paiement
                </h3>
                <p className="text-gray-400 bg-gray-800/50 p-3 rounded-lg border border-gold-500/20">
                  Paiement à la livraison uniquement.
                </p>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onClose}
                  className="flex-1 border-gold-500/30 text-gold-300 hover:bg-gold-500/10"
                >
                  Annuler
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 bg-gold-500 hover:bg-gold-600 text-black font-semibold"
                >
                  Confirmer la Commande
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CheckoutForm;
