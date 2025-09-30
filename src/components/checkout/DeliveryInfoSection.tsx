
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Truck, MapPin } from "lucide-react";
import { deliveryRates } from "@/data/deliveryRates";
import { toast } from "sonner";

interface Location {
  id: string;
  name: string;
  address?: string;
}

interface DeliveryInfoSectionProps {
  wilaya: string;
  setWilaya: (value: string) => void;
  deliveryType: 'home' | 'office';
  setDeliveryType: (value: 'home' | 'office') => void;
  address: string;
  setAddress: (value: string) => void;
  commune: string;
  setCommune: (value: string) => void;
  office: string;
  setOffice: (value: string) => void;
}

const DeliveryInfoSection = ({
  wilaya,
  setWilaya,
  deliveryType,
  setDeliveryType,
  address,
  setAddress,
  commune,
  setCommune,
  office,
  setOffice
}: DeliveryInfoSectionProps) => {
  const [communes, setCommunes] = useState<Location[]>([]);
  const [offices, setOffices] = useState<Location[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(false);

  // Charger les communes ou bureaux quand la wilaya ou le type de livraison change
  useEffect(() => {
    if (!wilaya) return;

    const loadLocations = async () => {
      setLoadingLocations(true);
      console.log('Chargement des emplacements pour:', { wilaya, deliveryType });
      
      try {
        const locationType = deliveryType === 'home' ? 'communes' : 'offices';
        
        console.log('Appel à get-zr-locations avec:', { wilaya, type: locationType });
        
        const response = await fetch('https://jgtrvwydouplehrchgoy.supabase.co/functions/v1/get-zr-locations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpndHJ2d3lkb3VwbGVocmNoZ295Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5OTc4MDEsImV4cCI6MjA2NTU3MzgwMX0.ijUq8CKVV3LRecUa2LxjV0XQZQTUgeHDhLrW2-jiE9E`
          },
          body: JSON.stringify({
            wilaya: wilaya,
            type: locationType
          })
        });

        console.log('Réponse HTTP status:', response.status);
        const result = await response.json();
        console.log('Réponse complète:', result);
        
        if (result.success) {
          const locations = result.locations || [];
          console.log(`${locations.length} emplacements trouvés`);
          console.log('Exemple de location:', locations[0]);
          
          // S'assurer que les données ont le bon format
          const formattedLocations = locations.map((loc: any) => ({
            id: String(loc.id || loc.name || Math.random()),
            name: String(loc.name || ''),
            address: loc.address ? String(loc.address) : undefined
          }));
          
          if (deliveryType === 'home') {
            setCommunes(formattedLocations);
            setCommune(''); // Reset la sélection
          } else {
            setOffices(formattedLocations);
            setOffice(''); // Reset la sélection
          }
          
          if (locations.length === 0) {
            toast.info('Aucun emplacement trouvé', {
              description: `Aucun ${locationType === 'communes' ? 'commune' : 'bureau'} disponible pour ${wilaya}`
            });
          }
        } else {
          console.error('Erreur lors du chargement des emplacements:', result);
          toast.error('Erreur lors du chargement des emplacements', {
            description: result.details || result.error || 'Impossible de charger la liste des emplacements pour cette wilaya'
          });
        }
      } catch (error) {
        console.error('Erreur de connexion:', error);
        toast.error('Erreur de connexion', {
          description: error instanceof Error ? error.message : 'Impossible de contacter le service de livraison'
        });
      } finally {
        setLoadingLocations(false);
      }
    };

    loadLocations();
  }, [wilaya, deliveryType]);

  // Reset les sélections quand on change de wilaya
  const handleWilayaChange = (newWilaya: string) => {
    setWilaya(newWilaya);
    setCommune('');
    setOffice('');
    setAddress('');
  };

  // Reset les sélections quand on change de type de livraison
  const handleDeliveryTypeChange = (newType: 'home' | 'office') => {
    setDeliveryType(newType);
    setCommune('');
    setOffice('');
    setAddress('');
  };

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
        <Select value={wilaya} onValueChange={handleWilayaChange}>
          <SelectTrigger className="bg-gray-800 border-gold-500/30 text-white focus:ring-gold-500 focus:border-gold-500">
            <SelectValue placeholder="Sélectionner une wilaya" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gold-500/30 text-white z-50">
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
        <RadioGroup 
          value={deliveryType} 
          onValueChange={handleDeliveryTypeChange}
          className="flex items-center space-x-6 mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem 
              value="home" 
              id="homeDelivery"
              className="border-gold-500/30 text-gold-500 focus:ring-gold-500"
            />
            <Label htmlFor="homeDelivery" className="text-gold-300">
              À Domicile
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem 
              value="office" 
              id="officeDelivery"
              className="border-gold-500/30 text-gold-500 focus:ring-gold-500"
            />
            <Label htmlFor="officeDelivery" className="text-gold-300">
              Point de Retrait
            </Label>
          </div>
        </RadioGroup>
      </div>

      {wilaya && deliveryType === 'home' && (
        <div>
          <Label htmlFor="commune" className="text-gold-300">
            Commune
          </Label>
          <Select value={commune} onValueChange={setCommune} disabled={loadingLocations}>
            <SelectTrigger className="bg-gray-800 border-gold-500/30 text-white focus:ring-gold-500 focus:border-gold-500">
              <SelectValue placeholder={loadingLocations ? "Chargement..." : "Sélectionner une commune"} />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gold-500/30 text-white z-50">
              {communes.map((communeItem) => (
                <SelectItem key={communeItem.id} value={communeItem.name} className="hover:bg-gray-700">
                  {communeItem.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {wilaya && deliveryType === 'office' && (
        <div>
          <Label htmlFor="office" className="text-gold-300">
            Bureau ZR Express
          </Label>
          <Select value={office} onValueChange={setOffice} disabled={loadingLocations}>
            <SelectTrigger className="bg-gray-800 border-gold-500/30 text-white focus:ring-gold-500 focus:border-gold-500">
              <SelectValue placeholder={loadingLocations ? "Chargement..." : "Sélectionner un bureau"} />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gold-500/30 text-white z-50">
              {offices.map((officeItem) => (
                <SelectItem 
                  key={officeItem.id} 
                  value={`${officeItem.name}${officeItem.address ? ` - ${officeItem.address}` : ''}`} 
                  className="hover:bg-gray-700"
                >
                  {officeItem.name}{officeItem.address ? ` - ${officeItem.address}` : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {deliveryType === 'home' && commune && (
        <div>
          <Label htmlFor="address" className="text-gold-300">
            Adresse Complète
          </Label>
          <Input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="bg-gray-800 border-gold-500/30 text-white focus:ring-gold-500 focus:border-gold-500"
            placeholder="Entrez votre adresse complète"
            required={deliveryType === 'home'}
          />
        </div>
      )}
    </div>
  );
};

export default DeliveryInfoSection;
