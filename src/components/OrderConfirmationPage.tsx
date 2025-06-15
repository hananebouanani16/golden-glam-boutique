
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Home, Phone, MapPin } from "lucide-react";
import { useApp } from '@/contexts/AppContext';

interface OrderConfirmationPageProps {
  orderNumber: string;
  customerInfo: {
    firstName: string;
    lastName: string;
    phone: string;
    wilaya: string;
    deliveryType: 'home' | 'office';
    address?: string;
  };
  onClose: () => void;
}

const OrderConfirmationPage = ({ orderNumber, customerInfo, onClose }: OrderConfirmationPageProps) => {
  const { t } = useApp();

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="text-center mb-8">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold gold-text mb-2">{t('order_confirmed_title')}</h1>
        <p className="text-gold-300">{t('order_confirmed_subtitle')}</p>
      </div>

      <Card className="bg-gray-800/50 border-gold-500/20 mb-6">
        <CardHeader>
          <CardTitle className="gold-text">{t('order_details')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gold-300">{t('order_number')}</span>
            <span className="text-white font-mono">{orderNumber}</span>
          </div>
          
          <div className="border-t border-gold-500/20 pt-4">
            <h3 className="text-gold-300 font-semibold mb-3">{t('delivery_info')}</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Home className="h-4 w-4 text-gold-400" />
                <span className="text-white">{customerInfo.firstName} {customerInfo.lastName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gold-400" />
                <span className="text-white">{customerInfo.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gold-400" />
                <span className="text-white">{customerInfo.wilaya}</span>
              </div>
              {customerInfo.deliveryType === 'home' && customerInfo.address && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gold-400" />
                  <span className="text-white">{customerInfo.address}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="text-gold-400">Type:</span>
                <span className="text-white">
                  {customerInfo.deliveryType === 'home' ? t('home_delivery') : t('pickup_point')}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-blue-50/10 border border-blue-500/20 rounded-lg p-4 mb-6">
        <h3 className="text-blue-300 font-semibold mb-2">{t('next_steps')}</h3>
        <ul className="text-blue-200 space-y-1 text-sm">
          <li>{t('next_steps_line1')}</li>
          <li>{t('next_steps_line2')}</li>
          <li>{t('next_steps_line3')}</li>
        </ul>
      </div>

      <div className="text-center">
        <Button onClick={onClose} className="gold-button">
          {t('back_to_home')}
        </Button>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
