import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useProducts } from "@/contexts/ProductContext";
import { Product } from "@/types/product";
import ProductForm from "./ProductForm";
import ProductTable from "./ProductTable";

const ProductManagement = () => {
  const { toast } = useToast();
  const { products, addProduct, updateProduct, deleteProduct, resetProducts } = useProducts();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    title: "",
    price: "",
    originalPrice: "",
    category: "",
    image: ""
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const categories = [
    { value: "sacs", label: "Sacs à main" },
    { value: "bijoux", label: "Bijoux" }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!/^\d+$/.test(formData.price) || (formData.originalPrice && !/^\d+$/.test(formData.originalPrice))) {
      toast({
        title: "Format de prix invalide",
        description: "Veuillez entrer un prix en dinar algérien sans caractères spéciaux.",
        variant: "destructive"
      });
      return;
    }

    if (editingProduct) {
      updateProduct({ ...formData, id: editingProduct.id });
      toast({
        title: "Produit modifié",
        description: "Le produit a été modifié avec succès."
      });
    } else {
      addProduct(formData);
      toast({
        title: "Produit ajouté",
        description: "Le nouveau produit a été ajouté avec succès."
      });
    }

    resetForm();
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      price: product.price,
      originalPrice: product.originalPrice || "",
      category: product.category,
      image: product.image
    });
    setImagePreview(product.image);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteProduct(id);
    toast({
      title: "Produit supprimé",
      description: "Le produit a été supprimé avec succès."
    });
  };

  const resetForm = () => {
    setFormData({
      title: "",
      price: "",
      originalPrice: "",
      category: "",
      image: ""
    });
    setEditingProduct(null);
    setImageFile(null);
    setImagePreview("");
    setIsDialogOpen(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold gold-text">Gestion des Articles</h2>
          <p className="text-gray-400 mt-1">
            {products.length} produits au total ({products.filter(p => p.category === 'sacs').length} sacs, {products.filter(p => p.category === 'bijoux').length} bijoux)
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="border-gold-500/20 text-gold-300"
            onClick={() => {
              resetProducts();
              toast({
                title: "Produits réinitialisés",
                description: "La liste de produits a été réinitialisée avec les articles de base."
              });
            }}
          >
            Réinitialiser les produits
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={(isOpen) => {
            setIsDialogOpen(isOpen);
            if (!isOpen) {
              resetForm();
            }
          }}>
            <DialogTrigger asChild>
              <Button className="gold-button">
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un Article
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border border-gold-500/20 text-white max-w-md">
              <DialogHeader>
                <DialogTitle className="gold-text">
                  {editingProduct ? "Modifier l'Article" : "Nouvel Article"}
                </DialogTitle>
              </DialogHeader>
              <ProductForm
                formData={formData}
                setFormData={setFormData}
                editingProduct={editingProduct}
                imagePreview={imagePreview}
                setImagePreview={setImagePreview}
                setImageFile={setImageFile}
                fileInputRef={fileInputRef}
                onSubmit={handleSubmit}
                onCancel={resetForm}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <ProductTable products={products} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
};

export default ProductManagement;
