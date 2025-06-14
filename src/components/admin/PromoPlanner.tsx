
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Promotion {
  id: string;
  title: string;
  discount: number;
  startDate: string;
  endDate: string;
  category: string;
  status: "active" | "scheduled" | "expired";
}

const PromoPlanner = () => {
  const { toast } = useToast();
  const [promotions, setPromotions] = useState<Promotion[]>([
    {
      id: "1",
      title: "Soldes d'Été - Sacs",
      discount: 25,
      startDate: "2024-06-01",
      endDate: "2024-08-31",
      category: "sacs",
      status: "active"
    },
    {
      id: "2",
      title: "Collection Bijoux - Automne",
      discount: 15,
      startDate: "2024-09-01",
      endDate: "2024-11-30",
      category: "bijoux",
      status: "scheduled"
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<Promotion | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    discount: "",
    startDate: "",
    endDate: "",
    category: ""
  });

  const categories = [
    { value: "sacs", label: "Sacs à main" },
    { value: "bijoux", label: "Bijoux" },
    { value: "all", label: "Toutes catégories" }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "bg-green-500",
      scheduled: "bg-blue-500", 
      expired: "bg-red-500"
    };
    
    const labels = {
      active: "Active",
      scheduled: "Programmée",
      expired: "Expirée"
    };

    return (
      <Badge className={`${variants[status as keyof typeof variants]} text-white`}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const currentDate = new Date();
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    
    let status: "active" | "scheduled" | "expired" = "scheduled";
    if (currentDate >= startDate && currentDate <= endDate) {
      status = "active";
    } else if (currentDate > endDate) {
      status = "expired";
    }
    
    if (editingPromo) {
      setPromotions(promotions.map(p => 
        p.id === editingPromo.id 
          ? { 
              ...editingPromo, 
              ...formData, 
              discount: parseInt(formData.discount),
              status 
            }
          : p
      ));
      toast({
        title: "Promotion modifiée",
        description: "La promotion a été modifiée avec succès."
      });
    } else {
      const newPromo: Promotion = {
        id: Date.now().toString(),
        ...formData,
        discount: parseInt(formData.discount),
        status
      };
      setPromotions([...promotions, newPromo]);
      toast({
        title: "Promotion ajoutée",
        description: "La nouvelle promotion a été ajoutée avec succès."
      });
    }
    
    resetForm();
  };

  const handleEdit = (promo: Promotion) => {
    setEditingPromo(promo);
    setFormData({
      title: promo.title,
      discount: promo.discount.toString(),
      startDate: promo.startDate,
      endDate: promo.endDate,
      category: promo.category
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setPromotions(promotions.filter(p => p.id !== id));
    toast({
      title: "Promotion supprimée",
      description: "La promotion a été supprimée avec succès."
    });
  };

  const resetForm = () => {
    setFormData({
      title: "",
      discount: "",
      startDate: "",
      endDate: "",
      category: ""
    });
    setEditingPromo(null);
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold gold-text">Planification des Promotions</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gold-button">
              <Plus className="w-4 h-4 mr-2" />
              Planifier une Promotion
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border border-gold-500/20 text-white">
            <DialogHeader>
              <DialogTitle className="gold-text">
                {editingPromo ? "Modifier la Promotion" : "Nouvelle Promotion"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Titre de la Promotion</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="bg-gray-800 border-gold-500/20 text-white"
                  placeholder="ex: Soldes d'Été"
                  required
                />
              </div>
              <div>
                <Label htmlFor="discount">Réduction (%)</Label>
                <Input
                  id="discount"
                  type="number"
                  min="1"
                  max="99"
                  value={formData.discount}
                  onChange={(e) => setFormData({...formData, discount: e.target.value})}
                  className="bg-gray-800 border-gold-500/20 text-white"
                  placeholder="ex: 25"
                  required
                />
              </div>
              <div>
                <Label htmlFor="startDate">Date de Début</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  className="bg-gray-800 border-gold-500/20 text-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="endDate">Date de Fin</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  className="bg-gray-800 border-gold-500/20 text-white"
                  required
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
              <div className="flex space-x-2">
                <Button type="submit" className="gold-button flex-1">
                  {editingPromo ? "Modifier" : "Planifier"}
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
              <TableHead className="text-gold-300">Titre</TableHead>
              <TableHead className="text-gold-300">Réduction</TableHead>
              <TableHead className="text-gold-300">Période</TableHead>
              <TableHead className="text-gold-300">Catégorie</TableHead>
              <TableHead className="text-gold-300">Statut</TableHead>
              <TableHead className="text-gold-300">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {promotions.map((promo) => (
              <TableRow key={promo.id} className="border-gold-500/20">
                <TableCell className="text-white font-medium">{promo.title}</TableCell>
                <TableCell className="text-gold-300">{promo.discount}%</TableCell>
                <TableCell className="text-gray-300">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span className="text-xs">
                      {new Date(promo.startDate).toLocaleDateString()} - {new Date(promo.endDate).toLocaleDateString()}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-white">
                  {categories.find(c => c.value === promo.category)?.label}
                </TableCell>
                <TableCell>
                  {getStatusBadge(promo.status)}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(promo)}
                      className="text-gold-300 hover:text-gold-200"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(promo.id)}
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

export default PromoPlanner;
