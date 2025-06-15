
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { validateName, validatePhone, sanitizeInput } from "@/utils/securityUtils";
import { useState } from "react";

interface PersonalInfoSectionProps {
  personalInfo: {
    firstName: string;
    lastName: string;
    phone: string;
  };
  setPersonalInfo: (info: { firstName: string; lastName: string; phone: string }) => void;
  errors: Record<string, string>;
}

const PersonalInfoSection = ({ personalInfo, setPersonalInfo, errors }: PersonalInfoSectionProps) => {
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});

  const handleFirstNameChange = (value: string) => {
    const sanitized = sanitizeInput(value);
    setPersonalInfo({ ...personalInfo, firstName: sanitized });
    
    if (!validateName(sanitized)) {
      setLocalErrors({ ...localErrors, firstName: "Prénom invalide (2-50 caractères, lettres uniquement)" });
    } else {
      const { firstName, ...rest } = localErrors;
      setLocalErrors(rest);
    }
  };

  const handleLastNameChange = (value: string) => {
    const sanitized = sanitizeInput(value);
    setPersonalInfo({ ...personalInfo, lastName: sanitized });
    
    if (!validateName(sanitized)) {
      setLocalErrors({ ...localErrors, lastName: "Nom invalide (2-50 caractères, lettres uniquement)" });
    } else {
      const { lastName, ...rest } = localErrors;
      setLocalErrors(rest);
    }
  };

  const handlePhoneChange = (value: string) => {
    const sanitized = sanitizeInput(value);
    setPersonalInfo({ ...personalInfo, phone: sanitized });
    
    if (!validatePhone(sanitized)) {
      setLocalErrors({ ...localErrors, phone: "Numéro de téléphone invalide" });
    } else {
      const { phone, ...rest } = localErrors;
      setLocalErrors(rest);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold gold-text">Informations Personnelles</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">Prénom *</Label>
          <Input
            id="firstName"
            value={personalInfo.firstName}
            onChange={(e) => handleFirstNameChange(e.target.value)}
            className="bg-gray-800 border-gold-500/20 text-white"
            required
          />
          {(errors.firstName || localErrors.firstName) && (
            <p className="text-red-400 text-sm mt-1">{errors.firstName || localErrors.firstName}</p>
          )}
        </div>
        <div>
          <Label htmlFor="lastName">Nom *</Label>
          <Input
            id="lastName"
            value={personalInfo.lastName}
            onChange={(e) => handleLastNameChange(e.target.value)}
            className="bg-gray-800 border-gold-500/20 text-white"
            required
          />
          {(errors.lastName || localErrors.lastName) && (
            <p className="text-red-400 text-sm mt-1">{errors.lastName || localErrors.lastName}</p>
          )}
        </div>
      </div>
      <div>
        <Label htmlFor="phone">Téléphone *</Label>
        <Input
          id="phone"
          value={personalInfo.phone}
          onChange={(e) => handlePhoneChange(e.target.value)}
          className="bg-gray-800 border-gold-500/20 text-white"
          placeholder="+213 XX XX XX XX"
          required
        />
        {(errors.phone || localErrors.phone) && (
          <p className="text-red-400 text-sm mt-1">{errors.phone || localErrors.phone}</p>
        )}
      </div>
    </div>
  );
};

export default PersonalInfoSection;
