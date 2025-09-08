import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { DeliveryRate } from "@/types/stock";
import { Plus, Edit, Trash2, Truck, Home, Building } from "lucide-react";

const DeliveryManagement = () => {
  const { toast } = useToast();
  const [deliveryRates, setDeliveryRates] = useState<DeliveryRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRate, setEditingRate] = useState<DeliveryRate | null>(null);
  
  const [formData, setFormData] = useState({
    wilaya: "",
    home_price: "",
    office_price: "",
    is_active: true
  });

  useEffect(() => {
    fetchDeliveryRates();
  }, []);

  const fetchDeliveryRates = async () => {
    try {
      const { data, error } = await supabase
        .from('delivery_rates')
        .select('*')
        .order('wilaya', { ascending: true });

      if (error) throw error;
      setDeliveryRates(data || []);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: `Impossible de charger les tarifs de livraison: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.wilaya || !formData.home_price) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir au minimum la wilaya et le prix à domicile.",
        variant: "destructive",
      });
      return;
    }

    try {
      const rateData = {
        wilaya: formData.wilaya,
        home_price: parseInt(formData.home_price),
        office_price: formData.office_price ? parseInt(formData.office_price) : null,
        is_active: formData.is_active
      };

      if (editingRate) {
        const { error } = await supabase
          .from('delivery_rates')
          .update(rateData)
          .eq('id', editingRate.id);
        
        if (error) throw error;
        
        toast({
          title: "Tarif modifié",
          description: "Le tarif de livraison a été modifié avec succès.",
        });
      } else {
        const { error } = await supabase
          .from('delivery_rates')
          .insert([rateData]);
        
        if (error) throw error;
        
        toast({
          title: "Tarif créé",
          description: "Le nouveau tarif de livraison a été créé avec succès.",
        });
      }

      resetForm();
      fetchDeliveryRates();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: `Impossible de sauvegarder le tarif: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (rate: DeliveryRate) => {
    setEditingRate(rate);
    setFormData({
      wilaya: rate.wilaya,
      home_price: rate.home_price.toString(),
      office_price: rate.office_price?.toString() || "",
      is_active: rate.is_active
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('delivery_rates')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Tarif supprimé",
        description: "Le tarif de livraison a été supprimé avec succès.",
      });

      fetchDeliveryRates();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: `Impossible de supprimer le tarif: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('delivery_rates')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      setDeliveryRates(prev => prev.map(rate => 
        rate.id === id ? { ...rate, is_active: !currentStatus } : rate
      ));

      toast({
        title: "Statut modifié",
        description: `Le tarif a été ${!currentStatus ? 'activé' : 'désactivé'}.`,
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: `Impossible de modifier le statut: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      wilaya: "",
      home_price: "",
      office_price: "",
      is_active: true
    });
    setEditingRate(null);
    setIsDialogOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gold-300">Chargement des tarifs de livraison...</div>
      </div>
    );
  }

  const activeRates = deliveryRates.filter(r => r.is_active).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold gold-text">Gestion de la Livraison</h2>
          <p className="text-gray-400 mt-1">
            Gérez les tarifs de livraison par wilaya ({activeRates} active{activeRates !== 1 ? 's' : ''})
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gold-button" onClick={() => resetForm()}>
              <Plus className="w-4 h-4 mr-2" />
              Nouveau Tarif
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border border-gold-500/30">
            <DialogHeader>
              <DialogTitle className="text-gold-300">
                {editingRate ? "Modifier le tarif" : "Ajouter un tarif"}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="wilaya">Wilaya *</Label>
                <Input
                  id="wilaya"
                  value={formData.wilaya}
                  onChange={(e) => setFormData({...formData, wilaya: e.target.value})}
                  className="bg-gray-800 border-gray-600 text-white"
                  placeholder="Ex: Alger"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="home_price">Prix livraison à domicile (DA) *</Label>
                  <Input
                    id="home_price"
                    type="number"
                    min="0"
                    value={formData.home_price}
                    onChange={(e) => setFormData({...formData, home_price: e.target.value})}
                    className="bg-gray-800 border-gray-600 text-white"
                    placeholder="300"
                  />
                </div>
                <div>
                  <Label htmlFor="office_price">Prix livraison bureau (DA)</Label>
                  <Input
                    id="office_price"
                    type="number"
                    min="0"
                    value={formData.office_price}
                    onChange={(e) => setFormData({...formData, office_price: e.target.value})}
                    className="bg-gray-800 border-gray-600 text-white"
                    placeholder="250"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Annuler
                </Button>
                <Button type="submit" className="gold-button">
                  {editingRate ? "Modifier" : "Ajouter"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Wilayas</CardTitle>
            <Truck className="h-4 w-4 text-gold-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gold-300">{deliveryRates.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Prix Moyen Domicile</CardTitle>
            <Home className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">
              {Math.round(deliveryRates.reduce((acc, rate) => acc + rate.home_price, 0) / deliveryRates.length || 0)} DA
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Prix Moyen Bureau</CardTitle>
            <Building className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">
              {Math.round(deliveryRates
                .filter(r => r.office_price)
                .reduce((acc, rate) => acc + (rate.office_price || 0), 0) / 
                deliveryRates.filter(r => r.office_price).length || 0)} DA
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des tarifs */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-gold-300">Tarifs par Wilaya</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-300">Wilaya</th>
                  <th className="text-left py-3 px-4 text-gray-300">Prix Domicile</th>
                  <th className="text-left py-3 px-4 text-gray-300">Prix Bureau</th>
                  <th className="text-left py-3 px-4 text-gray-300">Statut</th>
                  <th className="text-right py-3 px-4 text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {deliveryRates.map((rate) => (
                  <tr key={rate.id} className="border-b border-gray-700 hover:bg-gray-750">
                    <td className="py-3 px-4 text-white font-medium">{rate.wilaya}</td>
                    <td className="py-3 px-4 text-gray-300">
                      <div className="flex items-center gap-2">
                        <Home className="w-4 h-4 text-blue-400" />
                        {rate.home_price} DA
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-300">
                      {rate.office_price ? (
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4 text-green-400" />
                          {rate.office_price} DA
                        </div>
                      ) : (
                        <span className="text-gray-500">Non disponible</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <Badge 
                        variant={rate.is_active ? "default" : "secondary"}
                        className={`cursor-pointer ${rate.is_active ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'}`}
                        onClick={() => toggleActive(rate.id, rate.is_active)}
                      >
                        {rate.is_active ? "Actif" : "Inactif"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(rate)}
                          className="border-gold-500/20 text-gold-300"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(rate.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {deliveryRates.length === 0 && (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-12 text-center">
            <div className="text-gray-400">
              <Truck className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Aucun tarif de livraison configuré</p>
              <p className="text-sm mt-2">Cliquez sur "Nouveau Tarif" pour commencer</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DeliveryManagement;