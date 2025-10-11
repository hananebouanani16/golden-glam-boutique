
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { useOrders } from "@/contexts/OrderContext";
import { deliveryRates } from "@/data/deliveryRates";
import { convertToDinars } from "@/utils/priceUtils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
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
  const [commune, setCommune] = useState("");
  const [office, setOffice] = useState("");
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

    if (deliveryType === 'home' && (!commune || !address)) {
      toast.error('Veuillez sélectionner une commune et entrer votre adresse complète');
      return;
    }

    if (deliveryType === 'office' && !office) {
      toast.error('Veuillez sélectionner un bureau de retrait');
      return;
    }

    const newOrderNumber = `CMD-${Date.now()}`;

    // Sauvegarder dans Supabase
    try {
      const { error } = await supabase.from('orders').insert({
        order_number: newOrderNumber,
        customer_info: {
          firstName: personalInfo.firstName,
          lastName: personalInfo.lastName,
          phone: personalInfo.phone,
          wilaya,
          deliveryType: deliveryType as 'home' | 'office',
          address: deliveryType === 'home' ? `${commune} - ${address}` : office,
          commune: deliveryType === 'home' ? commune : undefined,
          office: deliveryType === 'office' ? office : undefined
        },
        items: items.map(item => ({
          id: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        total_products: totalProducts,
        delivery_fee: deliveryFee,
        total_amount: totalAmount,
        status: 'pending',
        sent_to_zr_express: false
      });

      if (error) {
        console.error('Erreur lors de la sauvegarde de la commande:', error);
        toast.error('Erreur lors de la sauvegarde de la commande');
        return;
      }

      // Aussi sauvegarder dans le contexte local pour l'affichage
      const order = {
        customerInfo: {
          firstName: personalInfo.firstName,
          lastName: personalInfo.lastName,
          phone: personalInfo.phone,
          wilaya,
          deliveryType: deliveryType as 'home' | 'office',
          address: deliveryType === 'home' ? `${commune} - ${address}` : office,
          commune: deliveryType === 'home' ? commune : undefined,
          office: deliveryType === 'office' ? office : undefined
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
      setOrderNumber(newOrderNumber);
      clearCart();
      
      toast.success(t('order_success'), {
        description: `${t('order_number')} ${newOrderNumber}. Votre commande sera traitée par notre équipe.`,
        duration: 5000,
      });
      
      setShowConfirmation(true);
    } catch (error) {
      console.error('Erreur lors de la création de la commande:', error);
      toast.error('Erreur lors de la création de la commande');
    }
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
          address: deliveryType === 'home' ? `${commune} - ${address}` : office
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
          commune={commune}
          setCommune={setCommune}
          office={office}
          setOffice={setOffice}
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
