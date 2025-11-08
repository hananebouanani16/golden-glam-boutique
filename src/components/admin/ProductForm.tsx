import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Upload, X } from "lucide-react";
import { Product } from "@/types/product";
import { toast } from "sonner";

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
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Charger les images existantes si on édite un produit
    if (editingProduct?.images && editingProduct.images.length > 0) {
      console.log('[ProductForm] Images existantes chargées:', editingProduct.images.length);
      setImagePreviews(editingProduct.images);
    } else {
      setImagePreviews([]);
    }
  }, [editingProduct]);

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

  const handleGalleryFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const maxImages = 5;
    const currentImageCount = imagePreviews.length;
    const remainingSlots = maxImages - currentImageCount;

    if (remainingSlots === 0) {
      toast.error("Vous avez atteint la limite de 5 images");
      return;
    }

    // Filtrer uniquement les images valides
    const validFiles = Array.from(files).filter(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`Le fichier ${file.name} n'est pas une image`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    if (validFiles.length > remainingSlots) {
      toast.error(`Vous pouvez ajouter maximum ${remainingSlots} image(s) supplémentaire(s)`, {
        description: `Limite: ${maxImages} images au total`
      });
      return;
    }

    const newImages: string[] = [];
    let processed = 0;

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        newImages.push(result);
        processed++;

        if (processed === validFiles.length) {
          const updatedImages = [...imagePreviews, ...newImages];
          setImagePreviews(updatedImages);
          setFormData({ ...formData, images: updatedImages });
          toast.success(`${newImages.length} image(s) ajoutée(s) à la galerie`);
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset l'input
    if (galleryInputRef.current) {
      galleryInputRef.current.value = '';
    }
  };

  const removeImageFromGallery = (index: number) => {
    const updatedImages = imagePreviews.filter((_, i) => i !== index);
    setImagePreviews(updatedImages);
    setFormData({ ...formData, images: updatedImages });
    toast.success("Image supprimée de la galerie");
  };

  return (
    <ScrollArea className="h-[600px] pr-4">
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

      {/* Stock Management Fields */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="stock_quantity">Quantité en stock</Label>
          <Input
            id="stock_quantity"
            type="number"
            min="0"
            value={formData.stock_quantity || 0}
            onChange={(e) => setFormData({...formData, stock_quantity: parseInt(e.target.value) || 0})}
            className="bg-gray-800 border-gold-500/20 text-white"
            placeholder="0"
          />
        </div>
        <div>
          <Label htmlFor="low_stock_threshold">Seuil stock faible</Label>
          <Input
            id="low_stock_threshold"
            type="number"
            min="0"
            value={formData.low_stock_threshold || 5}
            onChange={(e) => setFormData({...formData, low_stock_threshold: parseInt(e.target.value) || 5})}
            className="bg-gray-800 border-gold-500/20 text-white"
            placeholder="5"
          />
        </div>
      </div>

      {/* Image principale */}
      <div>
        <Label htmlFor="image">Image Principale du Produit</Label>
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

      {/* Galerie d'images supplémentaires */}
      <div>
        <Label htmlFor="gallery">Galerie d'Images (max 5 images)</Label>
        <div className="space-y-2">
          <Input
            ref={galleryInputRef}
            id="gallery"
            type="file"
            accept="image/*"
            multiple
            onChange={handleGalleryFilesChange}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => galleryInputRef.current?.click()}
            className="w-full border-gold-500/20 text-gold-300 hover:bg-gold-500/10"
          >
            <Upload className="w-4 h-4 mr-2" />
            {imagePreviews.length === 5 
              ? "Galerie complète (5/5)" 
              : `Ajouter des images (${imagePreviews.length}/5)`}
          </Button>
          
          {/* Aperçu des images de la galerie */}
          {imagePreviews.length > 0 && (
            <div className="mt-3">
              <p className="text-sm text-gold-300 mb-2">
                {imagePreviews.length} image(s) dans la galerie
              </p>
              <div className="grid grid-cols-5 gap-2">
                {imagePreviews.map((img, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={img}
                      alt={`Galerie ${index + 1}`}
                      className="w-full h-20 object-cover rounded-lg border border-gold-500/20"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeImageFromGallery(index)}
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
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
    </ScrollArea>
  );
}