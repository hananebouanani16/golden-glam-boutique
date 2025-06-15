
import React from 'react';
import { CreditCard } from "lucide-react";

const PaymentInfoSection = () => {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold gold-text flex items-center">
        <CreditCard className="h-4 w-4 mr-2" />
        Paiement
      </h3>
      <p className="text-gray-400 bg-gray-800/50 p-3 rounded-lg border border-gold-500/20">
        Paiement à la livraison uniquement.
      </p>
    </div>
  );
};

export default PaymentInfoSection;
