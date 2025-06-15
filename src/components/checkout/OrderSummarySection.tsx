
import React from 'react';
import { Separator } from "@/components/ui/separator";
import { Package } from "lucide-react";
import { convertToDinars, formatPrice } from "@/utils/priceUtils";

interface OrderItem {
  id: string;
  image: string;
  title: string;
  price: string;
  quantity: number;
}

interface OrderSummarySectionProps {
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
}

const OrderSummarySection = ({
  items,
  subtotal,
  deliveryFee,
  totalAmount
}: OrderSummarySectionProps) => {
  return (
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
  );
};

export default OrderSummarySection;
