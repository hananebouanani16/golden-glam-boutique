
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
import { useApp } from '@/contexts/AppContext';

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
  const { t } = useApp();
  const [personalInfo, setPersonalInfo] = useState({
    firstName: "",
    lastName: "",
    phone: ""
  });
  const [wilaya, setWilaya] = useState("");
  const [deliveryType, setDeliveryType] = useState<'home' | 'office'>('home');
  const [address, setAddress] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { cartItems, clearCart } = useCart();
  const { addOrder } = useOrders();

  const items = initialProduct ? [{ ...initialProduct, quantity: 1 }] : cartItems;
  const totalProducts = items.reduce((acc, item) => acc + item.quantity, 0);

  const selectedDeliveryRate = deliveryRates.find(rate => rate.wilaya === wilaya);
  const deliveryFee = selectedDeliveryRate 
    ? (deliveryType === 'home' ? selectedDeliveryRate.home : (selectedDeliveryRate.office || selectedDeliveryRate.home))
    : 0;
  
  const subtotal = items.reduce((acc, item) => {
    const priceInDA = Number(item.price);
    return acc + (priceInDA * item.quantity);
  }, 0);

  const totalAmount = subtotal + deliveryFee;
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!personalInfo.firstName || !personalInfo.lastName || !personalInfo.phone || !wilaya || !deliveryType) {
      toast.error(t('error_fill_fields'));
      return;
    }

    if (deliveryType === 'home' && !address) {
      toast.error(t('error_address_required'));
      return;
    }

    const order = {
      customerInfo: {
        firstName: personalInfo.firstName,
        lastName: personalInfo.lastName,
        phone: personalInfo.phone,
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
    
    toast.success(t('order_success'), {
      description: `${t('order_number')} ${newOrderNumber}`,
      duration: 5000,
    });

    // Envoyer automatiquement la commande vers ZR Express
    try {
      const zrExpressData = {
        orderNumber: newOrderNumber,
        customerInfo: {
          firstName: personalInfo.firstName,
          lastName: personalInfo.lastName,
          phone: personalInfo.phone,
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

      console.log('Envoi vers ZR Express:', zrExpressData);
      
      const response = await fetch('https://jgtrvwydouplehrchgoy.supabase.co/functions/v1/send-to-zr-express', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpndHJ2d3lkb3VwbGVocmNoZ295Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5OTc4MDEsImV4cCI6MjA2NTU3MzgwMX0.ijUq8CKVV3LRecUa2LxjV0XQZQTUgeHDhLrW2-jiE9E'}`
        },
        body: JSON.stringify(zrExpressData)
      });

      const result = await response.json();
      
      if (result.success) {
        console.log('Commande envoyée avec succès à ZR Express:', result);
        toast.success('Commande transmise au service de livraison', {
          description: 'Votre commande a été automatiquement envoyée à ZR Express',
          duration: 3000,
        });
      } else {
        console.error('Erreur lors de l\'envoi à ZR Express:', result);
        toast.error('Erreur de transmission', {
          description: 'La commande n\'a pas pu être envoyée au service de livraison',
          duration: 5000,
        });
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi vers ZR Express:', error);
      toast.error('Erreur de connexion', {
        description: 'Impossible de contacter le service de livraison',
        duration: 5000,
      });
    }
    
    setShowConfirmation(true);
  };

  if (showConfirmation) {
    return (
      <OrderConfirmationPage
        orderNumber={orderNumber}
        customerInfo={{
          firstName: personalInfo.firstName,
          lastName: personalInfo.lastName,
          phone: personalInfo.phone,
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
          personalInfo={personalInfo}
          setPersonalInfo={setPersonalInfo}
          errors={errors}
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
            {t('cancel')}
          </Button>
          <Button 
            type="submit" 
            className="flex-1 bg-gold-500 hover:bg-gold-600 text-black font-semibold"
          >
            {t('confirm_order')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutFormContent;
