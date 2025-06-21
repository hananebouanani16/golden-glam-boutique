
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
    const config = {
      active: { className: "bg-green-500 text-white", label: "Active" },
      scheduled: { className: "bg-blue-500 text-white", label: "Programmée" },
      expired: { className: "bg-red-500 text-white", label: "Expirée" }
    };
    
    const statusConfig = config[status as keyof typeof config] || config.scheduled;
    
    return (
      <Badge className={statusConfig.className}>
        {statusConfig.label}
      </Badge>
    );
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast({
        title: "Erreur",
        description: "Le titre est requis",
        variant: "destructive"
      });
      return false;
    }
    
    const discount = parseInt(formData.discount);
    if (!discount || discount < 1 || discount > 99) {
      toast({
        title: "Erreur",
        description: "La réduction doit être entre 1 et 99%",
        variant: "destructive"
      });
      return false;
    }
    
    if (!formData.startDate || !formData.endDate) {
      toast({
        title: "Erreur",
        description: "Les dates de début et fin sont requises",
        variant: "destructive"
      });
      return false;
    }
    
    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      toast({
        title: "Erreur",
        description: "La date de fin doit être après la date de début",
        variant: "destructive"
      });
      return false;
    }
    
    if (!formData.category) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une catégorie",
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };

  const determineStatus = (startDate: string, endDate: string): "active" | "scheduled" | "expired" => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (now >= start && now <= end) return "active";
    if (now < start) return "scheduled";
    return "expired";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const status = determineStatus(formData.startDate, formData.endDate);
    
    try {
      if (editingPromo) {
        setPromotions(prev => prev.map(p => 
          p.id === editingPromo.id 
            ? { 
                ...p,
                title: formData.title,
                discount: parseInt(formData.discount),
                startDate: formData.startDate,
                endDate: formData.endDate,
                category: formData.category,
                status 
              }
            : p
        ));
        toast({
          title: "Succès",
          description: "Promotion modifiée avec succès"
        });
      } else {
        const newPromo: Promotion = {
          id: Date.now().toString(),
          title: formData.title,
          discount: parseInt(formData.discount),
          startDate: formData.startDate,
          endDate: formData.endDate,
          category: formData.category,
          status
        };
        setPromotions(prev => [...prev, newPromo]);
        toast({
          title: "Succès",
          description: "Promotion créée avec succès"
        });
      }
      
      resetForm();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la sauvegarde de la promotion",
        variant: "destructive"
      });
    }
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
    try {
      setPromotions(prev => prev.filter(p => p.id !== id));
      toast({
        title: "Succès",
        description: "Promotion supprimée avec succès"
      });
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression",
        variant: "destructive"
      });
    }
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

  const handleDialogOpen = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold gold-text">Planification des Promotions</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleDialogOpen} className="gold-button">
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle Promotion
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border border-gold-500/20 text-white max-w-md">
            <DialogHeader>
              <DialogTitle className="gold-text">
                {editingPromo ? "Modifier la Promotion" : "Nouvelle Promotion"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Titre de la Promotion *</Label>
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
                <Label htmlFor="discount">Réduction (%) *</Label>
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
                <Label htmlFor="startDate">Date de Début *</Label>
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
                <Label htmlFor="endDate">Date de Fin *</Label>
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
                <Label htmlFor="category">Catégorie *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                  <SelectTrigger className="bg-gray-800 border-gold-500/20 text-white">
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gold-500/20">
                    {categories.map(cat => (
                      <SelectItem key={cat.value} value={cat.value} className="text-white focus:bg-gold-500/20">
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="gold-button flex-1">
                  {editingPromo ? "Modifier" : "Créer"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm} className="flex-1 border-gold-500/20 text-gold-300 hover:bg-gold-500/10">
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
            {promotions.length === 0 ? (
              <TableRow className="border-gold-500/20">
                <TableCell colSpan={6} className="text-center text-gray-400 py-8">
                  Aucune promotion créée
                </TableCell>
              </TableRow>
            ) : (
              promotions.map((promo) => (
                <TableRow key={promo.id} className="border-gold-500/20">
                  <TableCell className="text-white font-medium">{promo.title}</TableCell>
                  <TableCell className="text-gold-300">{promo.discount}%</TableCell>
                  <TableCell className="text-gray-300">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span className="text-xs">
                        {new Date(promo.startDate).toLocaleDateString('fr-FR')} - {new Date(promo.endDate).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-white">
                    {categories.find(c => c.value === promo.category)?.label || promo.category}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(promo.status)}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(promo)}
                        className="text-gold-300 hover:text-gold-200 hover:bg-gold-500/10"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(promo.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PromoPlanner;
