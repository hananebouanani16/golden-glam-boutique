
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { useOrders } from "@/contexts/OrderContext";
import { deliveryRates } from "@/data/deliveryRates";
import { convertToDinars } from "@/utils/priceUtils";
import { toast } from "sonner";
import PersonalInfoSection from "./checkout/PersonalInfoSection";
import DeliveryInfoSection from "./checkout/DeliveryInfoSection";
import OrderSummarySection from "./checkout/OrderSummarySection";
import PaymentInfoSection from "./checkout/PaymentInfoSection";
import OrderConfirmationPage from "./OrderConfirmationPage";

interface CheckoutFormContentProps {
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

const CheckoutFormContent = ({ onClose, initialProduct }: CheckoutFormContentProps) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [wilaya, setWilaya] = useState("");
  const [deliveryType, setDeliveryType] = useState<'home' | 'office'>('home');
  const [address, setAddress] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

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
    const newOrderNumber = `CMD-${Date.now()}`;
    setOrderNumber(newOrderNumber);
    clearCart();
    
    toast.success("Commande enregistrée avec succès!", {
      description: `Numéro de commande: ${newOrderNumber}`,
      duration: 5000,
    });
    
    setShowConfirmation(true);
  };

  if (showConfirmation) {
    return (
      <OrderConfirmationPage
        orderNumber={orderNumber}
        customerInfo={{
          firstName,
          lastName,
          phone,
          wilaya,
          deliveryType,
          address
        }}
        onClose={onClose}
      />
    );
  }

  return (
    <div className="space-y-6 p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <PersonalInfoSection
          firstName={firstName}
          setFirstName={setFirstName}
          lastName={lastName}
          setLastName={setLastName}
          phone={phone}
          setPhone={setPhone}
        />

        <Separator className="bg-gold-500/20" />

        <DeliveryInfoSection
          wilaya={wilaya}
          setWilaya={setWilaya}
          deliveryType={deliveryType}
          setDeliveryType={setDeliveryType}
          address={address}
          setAddress={setAddress}
        />

        <Separator className="bg-gold-500/20" />

        <OrderSummarySection
          items={items}
          subtotal={subtotal}
          deliveryFee={deliveryFee}
          totalAmount={totalAmount}
        />

        <Separator className="bg-gold-500/20" />

        <PaymentInfoSection />

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
    </div>
  );
};

export default CheckoutFormContent;
