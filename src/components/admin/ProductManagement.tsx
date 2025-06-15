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

const ProductManagement = () => {
  const { toast } = useToast();
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        setFormData({...formData, image: result});
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // On vérifie que le prix est un nombre positif
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
            <form onSubmit={handleSubmit} className="space-y-4">
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
                    // on accepte seulement des chiffres
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
                <Button type="button" variant="outline" onClick={resetForm} className="flex-1 border-gold-500/20 text-gold-300">
                  Annuler
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-gray-800/50 rounded-lg border border-gold-500/20 overflow-hidden">
        <div className="max-h-96 overflow-y-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-gray-800">
              <TableRow className="border-gold-500/20">
                <TableHead className="text-gold-300">Image</TableHead>
                <TableHead className="text-gold-300">Titre</TableHead>
                <TableHead className="text-gold-300">Prix</TableHead>
                <TableHead className="text-gold-300">Catégorie</TableHead>
                <TableHead className="text-gold-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id} className="border-gold-500/20">
                  <TableCell>
                    <img 
                      src={product.image} 
                      alt={product.title}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                  </TableCell>
                  <TableCell className="text-white max-w-xs truncate" title={product.title}>
                    {product.title}
                  </TableCell>
                  <TableCell className="text-gold-300">
                    {/* Affichage du prix en DA (formaté avec séparateur de milliers si possible) */}
                    {parseInt(product.price, 10).toLocaleString()} DA
                    {product.originalPrice && (
                      <span className="text-gray-400 line-through ml-2 text-sm">
                        {parseInt(product.originalPrice, 10).toLocaleString()} DA
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-white">
                    {categories.find(c => c.value === product.category)?.label}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(product)}
                        className="text-gold-300 hover:text-gold-200"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(product.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;
