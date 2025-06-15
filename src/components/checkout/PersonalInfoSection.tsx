
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sanitizeInput, validateEmail, validatePhone, validateName } from "@/utils/securityUtils";
import { useState, useEffect } from "react";

interface PersonalInfoSectionProps {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  onUpdate: (field: string, value: string) => void;
  errors: Record<string, string>;
}

const PersonalInfoSection = ({ formData, onUpdate, errors }: PersonalInfoSectionProps) => {
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    const sanitizedValue = sanitizeInput(value);
    onUpdate(field, sanitizedValue);
    
    // Validation en temps réel
    let error = '';
    switch (field) {
      case 'firstName':
      case 'lastName':
        if (!validateName(sanitizedValue)) {
          error = 'Le nom doit contenir entre 2 et 50 caractères (lettres uniquement)';
        }
        break;
      case 'email':
        if (!validateEmail(sanitizedValue)) {
          error = 'Format d\'email invalide';
        }
        break;
      case 'phone':
        if (!validatePhone(sanitizedValue)) {
          error = 'Numéro de téléphone invalide (8-15 caractères)';
        }
        break;
    }
    
    setLocalErrors(prev => ({ ...prev, [field]: error }));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gold-300 mb-4">Informations personnelles</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-gold-300">
            Prénom *
          </Label>
          <Input
            id="firstName"
            type="text"
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            className="bg-gray-700 border-gold-500/30 text-white"
            placeholder="Votre prénom"
            required
            maxLength={50}
            autoComplete="given-name"
          />
          {(localErrors.firstName || errors.firstName) && (
            <p className="text-red-400 text-sm">{localErrors.firstName || errors.firstName}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-gold-300">
            Nom *
          </Label>
          <Input
            id="lastName"
            type="text"
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            className="bg-gray-700 border-gold-500/30 text-white"
            placeholder="Votre nom"
            required
            maxLength={50}
            autoComplete="family-name"
          />
          {(localErrors.lastName || errors.lastName) && (
            <p className="text-red-400 text-sm">{localErrors.lastName || errors.lastName}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-gold-300">
          Email *
        </Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          className="bg-gray-700 border-gold-500/30 text-white"
          placeholder="votre@email.com"
          required
          maxLength={254}
          autoComplete="email"
        />
        {(localErrors.email || errors.email) && (
          <p className="text-red-400 text-sm">{localErrors.email || errors.email}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone" className="text-gold-300">
          Téléphone *
        </Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          className="bg-gray-700 border-gold-500/30 text-white"
          placeholder="+213 XXX XXX XXX"
          required
          maxLength={15}
          autoComplete="tel"
        />
        {(localErrors.phone || errors.phone) && (
          <p className="text-red-400 text-sm">{localErrors.phone || errors.phone}</p>
        )}
      </div>
    </div>
  );
};

export default PersonalInfoSection;
