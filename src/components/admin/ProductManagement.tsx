
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useProducts } from "@/contexts/ProductContext";
import { Product } from "@/types/product";
import ProductForm from "./ProductForm";
import ProductTable from "./ProductTable";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";


const ProductManagement = () => {
  const { toast } = useToast();
  const { products, addProduct, updateProduct, deleteProduct, restoreProduct, resetProducts, loading } = useProducts();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    title: "",
    price: "",
    originalPrice: "",
    category: "",
    image: "",
    images: [],
    stock_quantity: 0,
    low_stock_threshold: 5,
    is_out_of_stock: false
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  useEffect(() => {
    console.log("[DEBUG Products] Liste complète des produits :", products);
  }, [products]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[ProductManagement] Submitting form with data:", formData);
    if (!/^\d+$/.test(formData.price) || (formData.originalPrice && !/^\d+$/.test(formData.originalPrice))) {
      console.log("[ProductManagement] Price validation failed.");
      toast({
        title: "Format de prix invalide",
        description: "Veuillez entrer un prix en dinar algérien sans caractères spéciaux.",
        variant: "destructive"
      });
      return;
    }
    console.log("[ProductManagement] Price validation passed.");
    try {
      if (editingProduct) {
        console.log("[ProductManagement] Updating product...");
        await updateProduct({ ...formData, id: editingProduct.id });
        toast({
          title: "Produit modifié",
          description: "Le produit a été modifié avec succès."
        });
      } else {
        console.log("[ProductManagement] Adding new product...");
        await addProduct(formData);
        toast({
          title: "Produit ajouté",
          description: "Le nouveau produit a été ajouté avec succès."
        });
      }
      console.log("[ProductManagement] Form submission successful, resetting form.");
      resetForm();
    } catch (error: any) {
      console.error("[ProductManagement] Product form submission error:", error);
      toast({
        title: "Échec de la soumission",
        description: `Une erreur est survenue: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      price: product.price,
      originalPrice: product.originalPrice || "",
      category: product.category,
      image: product.image,
      images: product.images || [],
      stock_quantity: product.stock_quantity || 0,
      low_stock_threshold: product.low_stock_threshold || 5,
      is_out_of_stock: product.is_out_of_stock || false
    });
    setImagePreview(product.image || "");
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    console.log("[ProductManagement] 🗑️ Début suppression produit:", id);
    try {
      await deleteProduct(id);
      console.log("[ProductManagement] ✅ Suppression réussie");
      toast({
        title: "Produit supprimé",
        description: "Le produit a été supprimé avec succès. (Restaurable)"
      });
    } catch (error: any) {
      console.error("[ProductManagement] ❌ Erreur suppression:", error);
      toast({
        title: "Échec de la suppression",
        description: error.message || "Une erreur est survenue lors de la suppression",
        variant: "destructive",
      });
    }
  };

  const handleRestore = async (id: string) => {
    try {
      await restoreProduct(id);
      toast({
        title: "Produit restauré",
        description: "Le produit a bien été restauré."
      });
    } catch (error: any) {
      console.error("Restore product error:", error);
      toast({
        title: "Échec de la restauration",
        description: `Une erreur est survenue: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      price: "",
      originalPrice: "",
      category: "",
      image: "",
      images: [],
      stock_quantity: 0,
      low_stock_threshold: 5,
      is_out_of_stock: false
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
            {products.length} produits au total ({products.filter(p => p.category?.trim() === 'sacs').length} sacs, {products.filter(p => p.category?.trim() === 'bijoux').length} bijoux)
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
                title: "Produits rafraîchis",
                description: "La liste des produits a été actualisée depuis Supabase."
              });
            }}
          >
            Rafraîchir les produits
          </Button>

          <Dialog open={isDialogOpen} onOpenChange={(open) => {
              if (!open) resetForm();
              setIsDialogOpen(open);
            }}>
            <DialogTrigger asChild>
              <Button
                type="button"
                className="gold-button"
                onClick={() => {
                  resetForm();
                  setIsDialogOpen(true);
                }}
              >
                Ajouter un produit
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border border-gold-500/30">
              <DialogHeader>
                <DialogTitle>{editingProduct ? "Modifier le produit" : "Ajouter un produit"}</DialogTitle>
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

      

      <ProductTable 
        products={products}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRestore={handleRestore}
        loading={loading}
      />
    </div>
  );
};

export default ProductManagement;
