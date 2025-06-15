
import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload } from "lucide-react";
import { Product } from "@/types/product";

interface ProductFormProps {
  formData: Omit<Product, "id">;
  setFormData: (data: Omit<Product, "id">) => void;
  editingProduct: Product | null;
  imagePreview: string;
  setImagePreview: (url: string) => void;
  setImageFile: (file: File | null) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const categories = [
  { value: "sacs", label: "Sacs à main" },
  { value: "bijoux", label: "Bijoux" }
];

export default function ProductForm({
  formData,
  setFormData,
  editingProduct,
  imagePreview,
  setImagePreview,
  setImageFile,
  fileInputRef,
  onSubmit,
  onCancel
}: ProductFormProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        setImagePreview(result);
        setFormData({ ...formData, image: result });
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Titre</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          className="bg-gray-800 border-gold-500/20 text-white"
          required
        />
      </div>
      <div>
        <Label htmlFor="price">Prix (en DA)</Label>
        <Input
          id="price"
          value={formData.price}
          onChange={(e) => {
            // On accepte seulement des chiffres
            const val = e.target.value.replace(/[^\d]/g,"");
            setFormData({...formData, price: val});
          }}
          className="bg-gray-800 border-gold-500/20 text-white"
          placeholder="ex: 12000"
          inputMode="numeric"
          required
        />
      </div>
      <div>
        <Label htmlFor="originalPrice">Prix Original (optionnel, en DA)</Label>
        <Input
          id="originalPrice"
          value={formData.originalPrice || ''}
          onChange={(e) => {
            const val = e.target.value.replace(/[^\d]/g,"");
            setFormData({...formData, originalPrice: val});
          }}
          className="bg-gray-800 border-gold-500/20 text-white"
          placeholder="ex: 15000"
          inputMode="numeric"
        />
      </div>
      <div>
        <Label htmlFor="category">Catégorie</Label>
        <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
          <SelectTrigger className="bg-gray-800 border-gold-500/20 text-white">
            <SelectValue placeholder="Sélectionner une catégorie" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gold-500/20 z-50">
            {categories.map(cat => (
              <SelectItem key={cat.value} value={cat.value} className="text-white hover:bg-gray-700">
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="image">Image du Produit</Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Input
              ref={fileInputRef}
              id="image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="bg-gray-800 border-gold-500/20 text-white file:bg-gold-500 file:text-black file:border-0 file:rounded-md file:px-3 file:py-1 file:mr-3"
              required={!editingProduct}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              className="border-gold-500/20 text-gold-300 hover:bg-gold-500/10"
            >
              <Upload className="w-4 h-4" />
            </Button>
          </div>
          {imagePreview && (
            <div className="mt-2">
              <img
                src={imagePreview}
                alt="Aperçu"
                className="w-20 h-20 object-cover rounded-lg border border-gold-500/20"
              />
            </div>
          )}
        </div>
      </div>
      <div className="flex space-x-2 pt-4">
        <Button type="submit" className="gold-button flex-1">
          {editingProduct ? "Modifier" : "Ajouter"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1 border-gold-500/20 text-gold-300">
          Annuler
        </Button>
      </div>
    </form>
  );
}
