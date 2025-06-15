
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";

interface PersonalInfoSectionProps {
  firstName: string;
  setFirstName: (value: string) => void;
  lastName: string;
  setLastName: (value: string) => void;
  phone: string;
  setPhone: (value: string) => void;
}

const PersonalInfoSection = ({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  phone,
  setPhone
}: PersonalInfoSectionProps) => {
  return (
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
  );
};

export default PersonalInfoSection;
