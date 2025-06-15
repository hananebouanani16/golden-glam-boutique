
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Truck } from "lucide-react";
import { deliveryRates } from "@/data/deliveryRates";

interface DeliveryInfoSectionProps {
  wilaya: string;
  setWilaya: (value: string) => void;
  deliveryType: 'home' | 'office';
  setDeliveryType: (value: 'home' | 'office') => void;
  address: string;
  setAddress: (value: string) => void;
}

const DeliveryInfoSection = ({
  wilaya,
  setWilaya,
  deliveryType,
  setDeliveryType,
  address,
  setAddress
}: DeliveryInfoSectionProps) => {
  return (
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
  );
};

export default DeliveryInfoSection;
