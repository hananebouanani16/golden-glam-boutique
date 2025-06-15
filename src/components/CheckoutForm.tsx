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
import { ShoppingCart, Truck, Package, MapPin, Phone, User, CreditCard } from "lucide-react";

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

  const { cartItems, clearCart, addToCart } = useCart();
  const { addOrder } = useOrders();

  const items = initialProduct ? [{ ...initialProduct, quantity: 1 }] : cartItems;
  const totalProducts = items.reduce((acc, item) => acc + item.quantity, 0);

  const deliveryFee = deliveryRates[wilaya] ? deliveryRates[wilaya][deliveryType === 'home' ? 'home' : 'office'] : 0;
  
  const subtotal = items.reduce((acc, item) => {
    const priceInDA = convertToDinars(item.price);
    return acc + (priceInDA * item.quantity);
  }, 0);

  const totalAmount = subtotal + convertToDinars(deliveryFee.toString());
  
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

    const orderData = {
      firstName,
      lastName,
      phone,
      wilaya,
      deliveryType,
      address: deliveryType === 'home' ? address : undefined
    };

    console.log('Commande soumise:', orderData);
    console.log('Articles:', items);
    console.log('Total produits:', totalProducts);
    console.log('Frais de livraison:', deliveryFee);
    console.log('Total final:', totalAmount);

    // Create order object
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

    // Add order to context
    addOrder(order);

    // Clear cart and close form
    clearCart();
    toast.success("Commande enregistrée avec succès!");
    onClose();
  };

  return (
    <Card className="w-full bg-gray-800 border-gold-500/20">
      <CardHeader>
        <CardTitle className="text-2xl gold-text flex items-center">
          <ShoppingCart className="h-5 w-5 mr-2" />
          Finaliser la Commande
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Personal Information */}
          <div className="space-y-2">
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
                  className="bg-gray-700 border-gold-500/30 text-white"
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
                  className="bg-gray-700 border-gold-500/30 text-white"
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
                className="bg-gray-700 border-gold-500/30 text-white"
                required
              />
            </div>
          </div>

          <Separator className="bg-gold-500/20" />

          {/* Delivery Information */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold gold-text flex items-center">
              <Truck className="h-4 w-4 mr-2" />
              Informations de Livraison
            </h3>
            <div>
              <Label htmlFor="wilaya" className="text-gold-300">
                Wilaya
              </Label>
              <Select value={wilaya} onValueChange={setWilaya}>
                <SelectTrigger className="bg-gray-700 border-gold-500/30 text-white">
                  <SelectValue placeholder="Sélectionner une wilaya" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gold-500/30 text-white">
                  {Object.keys(deliveryRates).sort().map((wilayaName) => (
                    <SelectItem key={wilayaName} value={wilayaName}>
                      {wilayaName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-gold-300">
                Type de Livraison
              </Label>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Input
                    type="radio"
                    id="homeDelivery"
                    name="deliveryType"
                    value="home"
                    className="mr-2 h-4 w-4 text-gold-500 focus:ring-gold-500 bg-gray-700 border-gold-500/30"
                    checked={deliveryType === 'home'}
                    onChange={() => setDeliveryType('home')}
                  />
                  <Label htmlFor="homeDelivery" className="text-gold-300">
                    À Domicile
                  </Label>
                </div>
                <div className="flex items-center">
                  <Input
                    type="radio"
                    id="officeDelivery"
                    name="deliveryType"
                    value="office"
                    className="mr-2 h-4 w-4 text-gold-500 focus:ring-gold-500 bg-gray-700 border-gold-500/30"
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
                  className="bg-gray-700 border-gold-500/30 text-white"
                  required={deliveryType === 'home'}
                />
              </div>
            )}
          </div>

          <Separator className="bg-gold-500/20" />

          {/* Order Summary */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold gold-text flex items-center">
              <Package className="h-4 w-4 mr-2" />
              Récapitulatif de la Commande
            </h3>
            <ul className="space-y-2">
              {items.map((item) => (
                <li key={item.id} className="flex items-center justify-between text-white">
                  <div className="flex items-center">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-12 h-12 object-cover rounded mr-2"
                    />
                    <span>{item.title} x {item.quantity}</span>
                  </div>
                  <span>{formatPrice(convertToDinars(item.price) * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between text-gold-300">
              <span>Sous-total</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-gold-300">
              <span>Frais de livraison</span>
              <span>{formatPrice(convertToDinars(deliveryFee.toString()))}</span>
            </div>
            <div className="flex justify-between font-semibold text-gold-400">
              <span>Total</span>
              <span>{formatPrice(totalAmount)}</span>
            </div>
          </div>

          <Separator className="bg-gold-500/20" />

          {/* Payment Information */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold gold-text flex items-center">
              <CreditCard className="h-4 w-4 mr-2" />
              Paiement
            </h3>
            <p className="text-gray-400">
              Paiement à la livraison.
            </p>
          </div>

          <Button type="submit" className="w-full bg-gold-500 hover:bg-gold-600 text-black font-semibold">
            Confirmer la Commande
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CheckoutForm;
