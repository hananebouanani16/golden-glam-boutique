
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Home, Phone, MapPin } from "lucide-react";

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
  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="text-center mb-8">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold gold-text mb-2">Commande Confirmée !</h1>
        <p className="text-gold-300">Merci pour votre commande</p>
      </div>

      <Card className="bg-gray-800/50 border-gold-500/20 mb-6">
        <CardHeader>
          <CardTitle className="gold-text">Détails de la commande</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gold-300">Numéro de commande:</span>
            <span className="text-white font-mono">{orderNumber}</span>
          </div>
          
          <div className="border-t border-gold-500/20 pt-4">
            <h3 className="text-gold-300 font-semibold mb-3">Informations de livraison</h3>
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
                  {customerInfo.deliveryType === 'home' ? 'Livraison à domicile' : 'Point de retrait'}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-blue-50/10 border border-blue-500/20 rounded-lg p-4 mb-6">
        <h3 className="text-blue-300 font-semibold mb-2">Prochaines étapes</h3>
        <ul className="text-blue-200 space-y-1 text-sm">
          <li>• Nous vous contacterons dans les 24h pour confirmer votre commande</li>
          <li>• Préparation et expédition sous 2-3 jours ouvrables</li>
          <li>• Paiement à la livraison</li>
        </ul>
      </div>

      <div className="text-center">
        <Button onClick={onClose} className="gold-button">
          Retour à l'accueil
        </Button>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
