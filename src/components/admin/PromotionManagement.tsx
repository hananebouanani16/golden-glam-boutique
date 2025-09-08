import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Promotion } from "@/types/stock";
import { Plus, Edit, Trash2, Calendar, Percent } from "lucide-react";

const PromotionManagement = () => {
  const { toast } = useToast();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    discount_percentage: "",
    start_date: "",
    end_date: "",
    category: "",
    is_active: true
  });

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      const { data, error } = await supabase
        .from('promotions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPromotions(data || []);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: `Impossible de charger les promotions: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.discount_percentage || !formData.start_date || !formData.end_date) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      return;
    }

    try {
      const promotionData = {
        title: formData.title,
        description: formData.description || null,
        discount_percentage: parseInt(formData.discount_percentage),
        start_date: formData.start_date,
        end_date: formData.end_date,
        category: formData.category || null,
        is_active: formData.is_active
      };

      if (editingPromotion) {
        const { error } = await supabase
          .from('promotions')
          .update(promotionData)
          .eq('id', editingPromotion.id);
        
        if (error) throw error;
        
        toast({
          title: "Promotion modifiée",
          description: "La promotion a été modifiée avec succès.",
        });
      } else {
        const { error } = await supabase
          .from('promotions')
          .insert([promotionData]);
        
        if (error) throw error;
        
        toast({
          title: "Promotion créée",
          description: "La nouvelle promotion a été créée avec succès.",
        });
      }

      resetForm();
      fetchPromotions();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: `Impossible de sauvegarder la promotion: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (promotion: Promotion) => {
    setEditingPromotion(promotion);
    setFormData({
      title: promotion.title,
      description: promotion.description || "",
      discount_percentage: promotion.discount_percentage.toString(),
      start_date: new Date(promotion.start_date).toISOString().slice(0, 16),
      end_date: new Date(promotion.end_date).toISOString().slice(0, 16),
      category: promotion.category || "",
      is_active: promotion.is_active
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('promotions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Promotion supprimée",
        description: "La promotion a été supprimée avec succès.",
      });

      fetchPromotions();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: `Impossible de supprimer la promotion: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      discount_percentage: "",
      start_date: "",
      end_date: "",
      category: "",
      is_active: true
    });
    setEditingPromotion(null);
    setIsDialogOpen(false);
  };

  const getPromotionStatus = (promotion: Promotion) => {
    const now = new Date();
    const startDate = new Date(promotion.start_date);
    const endDate = new Date(promotion.end_date);

    if (!promotion.is_active) return { status: "Inactive", color: "secondary" };
    if (now < startDate) return { status: "Programmée", color: "default" };
    if (now > endDate) return { status: "Expirée", color: "destructive" };
    return { status: "Active", color: "success" };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gold-300">Chargement des promotions...</div>
      </div>
    );
  }

  const activePromotions = promotions.filter(p => {
    const now = new Date();
    const startDate = new Date(p.start_date);
    const endDate = new Date(p.end_date);
    return p.is_active && now >= startDate && now <= endDate;
  }).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold gold-text">Gestion des Promotions</h2>
          <p className="text-gray-400 mt-1">
            Créez et gérez vos offres promotionnelles ({activePromotions} active{activePromotions !== 1 ? 's' : ''})
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gold-button" onClick={() => resetForm()}>
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle Promotion
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border border-gold-500/30 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-gold-300">
                {editingPromotion ? "Modifier la promotion" : "Créer une promotion"}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Titre *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="bg-gray-800 border-gray-600 text-white"
                    placeholder="Ex: Soldes d'hiver"
                  />
                </div>
                <div>
                  <Label htmlFor="discount">Pourcentage de remise *</Label>
                  <Input
                    id="discount"
                    type="number"
                    min="1"
                    max="100"
                    value={formData.discount_percentage}
                    onChange={(e) => setFormData({...formData, discount_percentage: e.target.value})}
                    className="bg-gray-800 border-gray-600 text-white"
                    placeholder="20"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="bg-gray-800 border-gray-600 text-white"
                  placeholder="Description de la promotion..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start_date">Date de début *</Label>
                  <Input
                    id="start_date"
                    type="datetime-local"
                    value={formData.start_date}
                    onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="end_date">Date de fin *</Label>
                  <Input
                    id="end_date"
                    type="datetime-local"
                    value={formData.end_date}
                    onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="category">Catégorie</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue placeholder="Toutes les catégories" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="">Toutes les catégories</SelectItem>
                    <SelectItem value="sacs">Sacs</SelectItem>
                    <SelectItem value="bijoux">Bijoux</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Annuler
                </Button>
                <Button type="submit" className="gold-button">
                  {editingPromotion ? "Modifier" : "Créer"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Liste des promotions */}
      <div className="grid gap-4">
        {promotions.map((promotion) => {
          const status = getPromotionStatus(promotion);
          return (
            <Card key={promotion.id} className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">{promotion.title}</h3>
                      <Badge variant={status.color as any}>{status.status}</Badge>
                      <Badge variant="outline" className="text-gold-400 border-gold-400">
                        <Percent className="w-3 h-3 mr-1" />
                        {promotion.discount_percentage}%
                      </Badge>
                    </div>
                    
                    {promotion.description && (
                      <p className="text-gray-400 mb-3">{promotion.description}</p>
                    )}
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Du {new Date(promotion.start_date).toLocaleDateString('fr-FR')}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Au {new Date(promotion.end_date).toLocaleDateString('fr-FR')}
                      </div>
                      {promotion.category && (
                        <Badge variant="secondary">{promotion.category}</Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(promotion)}
                      className="border-gold-500/20 text-gold-300"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(promotion.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {promotions.length === 0 && (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-12 text-center">
            <div className="text-gray-400">
              <Percent className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Aucune promotion créée pour le moment</p>
              <p className="text-sm mt-2">Cliquez sur "Nouvelle Promotion" pour commencer</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PromotionManagement;