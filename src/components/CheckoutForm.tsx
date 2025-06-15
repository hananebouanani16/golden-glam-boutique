
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useForm } from "react-hook-form";
import { useApp } from "@/contexts/AppContext";
import { useCart } from "@/contexts/CartContext";
import { toast } from "@/hooks/use-toast";
import { deliveryRates, getDeliveryRate } from "@/data/deliveryRates";
import { convertToDinars, formatPrice } from "@/utils/priceUtils";
import { Product } from "./ProductCard";

interface CheckoutFormData {
  firstName: string;
  lastName: string;
  phone: string;
  wilaya: string;
  address?: string;
  deliveryType: 'home' | 'office';
}

interface CheckoutFormProps {
  onClose: () => void;
  initialProduct?: Product;
}

const CheckoutForm = ({ onClose, initialProduct }: CheckoutFormProps) => {
  const { t } = useApp();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<CheckoutFormData>();
  const [deliveryCost, setDeliveryCost] = useState(0);

  const selectedWilaya = watch('wilaya');
  const deliveryType = watch('deliveryType');

  // Si on a un produit initial, on l'utilise, sinon on utilise le panier
  const orderItems = initialProduct ? [{ ...initialProduct, quantity: 1 }] : cartItems;
  const orderTotal = initialProduct 
    ? convertToDinars(initialProduct.price)
    : cartItems.reduce((total, item) => {
        const price = convertToDinars(item.price);
        return total + (price * item.quantity);
      }, 0);

  useEffect(() => {
    if (selectedWilaya && deliveryType) {
      const rate = getDeliveryRate(selectedWilaya);
      if (rate) {
        const cost = deliveryType === 'home' ? rate.home : (rate.office || 0);
        setDeliveryCost(cost);
      }
    }
  }, [selectedWilaya, deliveryType]);

  const onSubmit = (data: CheckoutFormData) => {
    console.log('Commande soumise:', data);
    console.log('Articles:', orderItems);
    console.log('Total produits:', orderTotal);
    console.log('Frais de livraison:', deliveryCost);
    console.log('Total final:', orderTotal + deliveryCost);
    
    toast({
      title: "Commande confirmée !",
      description: "Votre commande a été envoyée avec succès. Nous vous contacterons bientôt.",
    });
    
    if (!initialProduct) {
      clearCart();
    }
    onClose();
  };

  const selectedWilayaRate = selectedWilaya ? getDeliveryRate(selectedWilaya) : null;
  const hasOfficeDelivery = selectedWilayaRate?.office !== undefined;

  if (orderItems.length === 0 && !initialProduct) {
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
        {orderItems.map(item => {
          const priceInDA = convertToDinars(item.price);
          return (
            <div key={item.id} className="flex justify-between items-center mb-2">
              <span className="text-gold-300">
                {item.title} {!initialProduct && `x${item.quantity}`}
              </span>
              <span className="text-gold-400 font-semibold">
                {formatPrice(priceInDA * (item.quantity || 1))}
              </span>
            </div>
          );
        })}
        
        <div className="border-t border-gold-500/30 pt-2 mt-3 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gold-300">Sous-total:</span>
            <span className="text-gold-400">{formatPrice(orderTotal)}</span>
          </div>
          {deliveryCost > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-gold-300">Livraison:</span>
              <span className="text-gold-400">{formatPrice(deliveryCost)}</span>
            </div>
          )}
          <div className="flex justify-between items-center border-t border-gold-500/30 pt-2">
            <span className="text-lg font-bold text-gold-200">Total:</span>
            <span className="text-lg font-bold gold-text">{formatPrice(orderTotal + deliveryCost)}</span>
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
              className="gold-border bg-black/50 text-white"
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
              className="gold-border bg-black/50 text-white"
            />
            {errors.lastName && (
              <p className="text-red-400 text-sm mt-1">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="phone" className="text-gold-200">Numéro de téléphone *</Label>
          <Input
            id="phone"
            {...register('phone', { required: 'Le numéro de téléphone est requis' })}
            className="gold-border bg-black/50 text-white"
            placeholder="0X XX XX XX XX"
          />
          {errors.phone && (
            <p className="text-red-400 text-sm mt-1">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <Label className="text-gold-200">Wilaya *</Label>
          <Select onValueChange={(value) => setValue('wilaya', value)}>
            <SelectTrigger className="gold-border bg-black/50 text-white">
              <SelectValue placeholder="Sélectionnez votre wilaya" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gold-500/20">
              {deliveryRates.map(rate => (
                <SelectItem key={rate.wilaya} value={rate.wilaya} className="text-white">
                  {rate.wilaya}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.wilaya && (
            <p className="text-red-400 text-sm mt-1">La wilaya est requise</p>
          )}
        </div>

        {selectedWilaya && (
          <div>
            <Label className="text-gold-200">Type de livraison *</Label>
            <RadioGroup onValueChange={(value) => setValue('deliveryType', value as 'home' | 'office')}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="home" id="home" />
                <Label htmlFor="home" className="text-gold-300">
                  Livraison à domicile ({formatPrice(selectedWilayaRate?.home || 0)})
                </Label>
              </div>
              {hasOfficeDelivery && (
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="office" id="office" />
                  <Label htmlFor="office" className="text-gold-300">
                    Retrait au bureau de livraison ({formatPrice(selectedWilayaRate?.office || 0)})
                  </Label>
                </div>
              )}
            </RadioGroup>
          </div>
        )}

        {deliveryType === 'home' && (
          <div>
            <Label htmlFor="address" className="text-gold-200">Adresse complète *</Label>
            <Input
              id="address"
              {...register('address', { 
                required: deliveryType === 'home' ? 'L\'adresse est requise pour la livraison à domicile' : false 
              })}
              className="gold-border bg-black/50 text-white"
              placeholder="Rue, numéro, quartier..."
            />
            {errors.address && (
              <p className="text-red-400 text-sm mt-1">{errors.address.message}</p>
            )}
          </div>
        )}

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
