
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useForm } from "react-hook-form";
import { useApp } from "@/contexts/AppContext";
import { useCart } from "@/contexts/CartContext";
import { toast } from "@/hooks/use-toast";

interface CheckoutFormData {
  firstName: string;
  lastName: string;
  wilaya: string;
  address?: string;
  deliveryCompany: 'yalidine' | 'zr-express';
  deliveryType: 'home' | 'pickup';
}

const WILAYAS = [
  'Adrar', 'Chlef', 'Laghouat', 'Oum El Bouaghi', 'Batna', 'Béjaïa', 'Biskra', 'Béchar',
  'Blida', 'Bouira', 'Tamanrasset', 'Tébessa', 'Tlemcen', 'Tiaret', 'Tizi Ouzou', 'Alger',
  'Djelfa', 'Jijel', 'Sétif', 'Saïda', 'Skikda', 'Sidi Bel Abbès', 'Annaba', 'Guelma',
  'Constantine', 'Médéa', 'Mostaganem', 'MSila', 'Mascara', 'Ouargla', 'Oran', 'El Bayadh',
  'Illizi', 'Bordj Bou Arréridj', 'Boumerdès', 'El Tarf', 'Tindouf', 'Tissemsilt', 'El Oued',
  'Khenchela', 'Souk Ahras', 'Tipaza', 'Mila', 'Aïn Defla', 'Naâma', 'Aïn Témouchent',
  'Ghardaïa', 'Relizane'
];

interface CheckoutFormProps {
  onClose: () => void;
}

const CheckoutForm = ({ onClose }: CheckoutFormProps) => {
  const { t } = useApp();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<CheckoutFormData>();

  const deliveryType = watch('deliveryType');

  const onSubmit = (data: CheckoutFormData) => {
    console.log('Commande soumise:', data);
    toast({
      title: "Commande confirmée !",
      description: "Votre commande a été envoyée avec succès. Nous vous contactons bientôt.",
    });
    clearCart();
    onClose();
  };

  if (cartItems.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-gold-300 mb-4">Votre panier est vide</p>
        <Button onClick={onClose} variant="outline" className="gold-border">
          Continuer les achats
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold gold-text mb-6">Finaliser la commande</h2>
      
      {/* Résumé de la commande */}
      <div className="mb-6 p-4 gold-border rounded-lg">
        <h3 className="text-lg font-semibold text-gold-200 mb-3">Résumé de votre commande</h3>
        {cartItems.map(item => (
          <div key={item.id} className="flex justify-between items-center mb-2">
            <span className="text-gold-300">{item.title} x{item.quantity}</span>
            <span className="text-gold-400 font-semibold">{item.price}</span>
          </div>
        ))}
        <div className="border-t border-gold-500/30 pt-2 mt-3">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-gold-200">Total:</span>
            <span className="text-lg font-bold gold-text">{getCartTotal().toFixed(2)} DA</span>
          </div>
        </div>
      </div>

      {/* Formulaire */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName" className="text-gold-200">Prénom *</Label>
            <Input
              id="firstName"
              {...register('firstName', { required: 'Le prénom est requis' })}
              className="gold-border"
            />
            {errors.firstName && (
              <p className="text-red-400 text-sm mt-1">{errors.firstName.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="lastName" className="text-gold-200">Nom *</Label>
            <Input
              id="lastName"
              {...register('lastName', { required: 'Le nom est requis' })}
              className="gold-border"
            />
            {errors.lastName && (
              <p className="text-red-400 text-sm mt-1">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        <div>
          <Label className="text-gold-200">Wilaya *</Label>
          <Select onValueChange={(value) => setValue('wilaya', value)}>
            <SelectTrigger className="gold-border">
              <SelectValue placeholder="Sélectionnez votre wilaya" />
            </SelectTrigger>
            <SelectContent>
              {WILAYAS.map(wilaya => (
                <SelectItem key={wilaya} value={wilaya}>{wilaya}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.wilaya && (
            <p className="text-red-400 text-sm mt-1">{errors.wilaya.message}</p>
          )}
        </div>

        <div>
          <Label className="text-gold-200">Type de livraison *</Label>
          <RadioGroup onValueChange={(value) => setValue('deliveryType', value as 'home' | 'pickup')}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="pickup" id="pickup" />
              <Label htmlFor="pickup" className="text-gold-300">Retrait en point relais</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="home" id="home" />
              <Label htmlFor="home" className="text-gold-300">Livraison à domicile</Label>
            </div>
          </RadioGroup>
        </div>

        {deliveryType === 'home' && (
          <div>
            <Label htmlFor="address" className="text-gold-200">Adresse complète *</Label>
            <Input
              id="address"
              {...register('address', { 
                required: deliveryType === 'home' ? 'L\'adresse est requise pour la livraison à domicile' : false 
              })}
              className="gold-border"
              placeholder="Rue, numéro, quartier..."
            />
            {errors.address && (
              <p className="text-red-400 text-sm mt-1">{errors.address.message}</p>
            )}
          </div>
        )}

        <div>
          <Label className="text-gold-200">Société de livraison *</Label>
          <RadioGroup onValueChange={(value) => setValue('deliveryCompany', value as 'yalidine' | 'zr-express')}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yalidine" id="yalidine" />
              <Label htmlFor="yalidine" className="text-gold-300">Yalidine</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="zr-express" id="zr-express" />
              <Label htmlFor="zr-express" className="text-gold-300">ZR Express</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="flex gap-4 pt-4">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1 gold-border">
            Annuler
          </Button>
          <Button type="submit" className="flex-1 gold-button">
            Confirmer la commande
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutForm;
