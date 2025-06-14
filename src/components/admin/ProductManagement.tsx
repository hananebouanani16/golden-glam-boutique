
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  title: string;
  price: string;
  originalPrice?: string;
  category: string;
  image: string;
}

const ProductManagement = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([
    {
      id: "1",
      title: "Sac à Main Élégant",
      price: "89€",
      originalPrice: "120€",
      category: "sacs",
      image: "/lovable-uploads/c9200fe8-042b-4ac7-ae45-607103646612.png"
    },
    {
      id: "2", 
      title: "Collier Or Rose",
      price: "145€",
      category: "bijoux",
      image: "/lovable-uploads/db919936-c4c1-4126-83b9-1baa157af9ae.png"
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    originalPrice: "",
    category: "",
    image: ""
  });

  const categories = [
    { value: "sacs", label: "Sacs à main" },
    { value: "bijoux", label: "Bijoux" }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingProduct) {
      setProducts(products.map(p => 
        p.id === editingProduct.id 
          ? { ...editingProduct, ...formData }
          : p
      ));
      toast({
        title: "Produit modifié",
        description: "Le produit a été modifié avec succès."
      });
    } else {
      const newProduct: Product = {
        id: Date.now().toString(),
        ...formData
      };
      setProducts([...products, newProduct]);
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
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
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
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold gold-text">Gestion des Articles</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gold-button">
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un Article
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border border-gold-500/20 text-white">
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
                <Label htmlFor="price">Prix</Label>
                <Input
                  id="price"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="bg-gray-800 border-gold-500/20 text-white"
                  placeholder="ex: 89€"
                  required
                />
              </div>
              <div>
                <Label htmlFor="originalPrice">Prix Original (optionnel)</Label>
                <Input
                  id="originalPrice"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData({...formData, originalPrice: e.target.value})}
                  className="bg-gray-800 border-gold-500/20 text-white"
                  placeholder="ex: 120€"
                />
              </div>
              <div>
                <Label htmlFor="category">Catégorie</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                  <SelectTrigger className="bg-gray-800 border-gold-500/20 text-white">
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gold-500/20">
                    {categories.map(cat => (
                      <SelectItem key={cat.value} value={cat.value} className="text-white">
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="image">URL de l'Image</Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  className="bg-gray-800 border-gold-500/20 text-white"
                  placeholder="/lovable-uploads/..."
                  required
                />
              </div>
              <div className="flex space-x-2">
                <Button type="submit" className="gold-button flex-1">
                  {editingProduct ? "Modifier" : "Ajouter"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm} className="flex-1">
                  Annuler
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-gray-800/50 rounded-lg border border-gold-500/20 overflow-hidden">
        <Table>
          <TableHeader>
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
                <TableCell className="text-white">{product.title}</TableCell>
                <TableCell className="text-gold-300">
                  {product.price}
                  {product.originalPrice && (
                    <span className="text-gray-400 line-through ml-2 text-sm">
                      {product.originalPrice}
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
  );
};

export default ProductManagement;
