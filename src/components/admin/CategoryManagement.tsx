
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Category {
  id: string;
  name: string;
  value: string;
  description: string;
}

const CategoryManagement = () => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([
    {
      id: "1",
      name: "Sacs à main",
      value: "sacs",
      description: "Collection de sacs à main élégants et fonctionnels"
    },
    {
      id: "2",
      name: "Bijoux",
      value: "bijoux", 
      description: "Bijoux raffinés et accessoires précieux"
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    value: "",
    description: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingCategory) {
      setCategories(categories.map(c => 
        c.id === editingCategory.id 
          ? { ...editingCategory, ...formData }
          : c
      ));
      toast({
        title: "Catégorie modifiée",
        description: "La catégorie a été modifiée avec succès."
      });
    } else {
      const newCategory: Category = {
        id: Date.now().toString(),
        ...formData
      };
      setCategories([...categories, newCategory]);
      toast({
        title: "Catégorie ajoutée",
        description: "La nouvelle catégorie a été ajoutée avec succès."
      });
    }
    
    resetForm();
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      value: category.value,
      description: category.description
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setCategories(categories.filter(c => c.id !== id));
    toast({
      title: "Catégorie supprimée",
      description: "La catégorie a été supprimée avec succès."
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      value: "",
      description: ""
    });
    setEditingCategory(null);
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold gold-text">Gestion des Catégories</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gold-button">
              <Plus className="w-4 h-4 mr-2" />
              Ajouter une Catégorie
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border border-gold-500/20 text-white">
            <DialogHeader>
              <DialogTitle className="gold-text">
                {editingCategory ? "Modifier la Catégorie" : "Nouvelle Catégorie"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nom de la Catégorie</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="bg-gray-800 border-gold-500/20 text-white"
                  placeholder="ex: Accessoires"
                  required
                />
              </div>
              <div>
                <Label htmlFor="value">Valeur (identifiant)</Label>
                <Input
                  id="value"
                  value={formData.value}
                  onChange={(e) => setFormData({...formData, value: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                  className="bg-gray-800 border-gold-500/20 text-white"
                  placeholder="ex: accessoires"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="bg-gray-800 border-gold-500/20 text-white"
                  placeholder="Description de la catégorie"
                  required
                />
              </div>
              <div className="flex space-x-2">
                <Button type="submit" className="gold-button flex-1">
                  {editingCategory ? "Modifier" : "Ajouter"}
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
              <TableHead className="text-gold-300">Nom</TableHead>
              <TableHead className="text-gold-300">Identifiant</TableHead>
              <TableHead className="text-gold-300">Description</TableHead>
              <TableHead className="text-gold-300">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id} className="border-gold-500/20">
                <TableCell className="text-white font-medium">{category.name}</TableCell>
                <TableCell className="text-gold-300">{category.value}</TableCell>
                <TableCell className="text-gray-300">{category.description}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(category)}
                      className="text-gold-300 hover:text-gold-200"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(category.id)}
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

export default CategoryManagement;
