
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useOrders } from "@/contexts/OrderContext";
import { formatPrice } from "@/utils/priceUtils";
import { CheckCircle, XCircle, Package, Phone, MapPin, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SupabaseOrder {
  id: string;
  order_number: string;
  customer_info: {
    firstName: string;
    lastName: string;
    phone: string;
    wilaya: string;
    deliveryType: 'home' | 'office';
    address: string;
    commune?: string;
    office?: string;
  };
  items: Array<{
    id: string;
    title: string;
    price: string;
    quantity: number;
    image: string;
  }>;
  total_products: number;
  delivery_fee: number;
  total_amount: number;
  status: string;
  created_at: string;
  sent_to_zr_express: boolean;
}

const OrderManagement = () => {
  console.log('🔵 OrderManagement component mounted');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [supabaseOrders, setSupabaseOrders] = useState<SupabaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingToZR, setSendingToZR] = useState<string | null>(null);

  // Migrer les anciennes commandes du localStorage vers Supabase
  const migrateLocalStorageOrders = async () => {
    try {
      const localOrders = localStorage.getItem('orders');
      if (localOrders) {
        const orders = JSON.parse(localOrders);
        if (orders.length > 0) {
          console.log('Migration des commandes du localStorage vers Supabase...', orders.length);
          
          for (const order of orders) {
            // Vérifier si la commande existe déjà
            const { data: existing } = await supabase
              .from('orders')
              .select('id')
              .eq('order_number', order.orderNumber)
              .maybeSingle();

            if (!existing) {
              await supabase.from('orders').insert({
                order_number: order.orderNumber,
                customer_info: order.customerInfo,
                items: order.items,
                total_products: order.totalProducts,
                delivery_fee: order.deliveryFee,
                total_amount: order.totalAmount,
                status: order.status || 'pending',
                sent_to_zr_express: false,
                created_at: order.createdAt
              });
            }
          }
          
          toast.success(`${orders.length} commande(s) migrée(s) avec succès!`);
          // Effacer le localStorage après migration
          localStorage.removeItem('orders');
        }
      }
    } catch (error) {
      console.error('Erreur lors de la migration:', error);
    }
  };

  // Charger les commandes depuis Supabase
  const fetchOrders = async () => {
    console.log('🔵 fetchOrders called');
    setLoading(true);
    try {
      console.log('🔵 Fetching from Supabase...');
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('🔵 Supabase response:', { data, error });
      
      if (error) {
        console.error('❌ Erreur lors du chargement des commandes:', error);
        toast.error('Erreur lors du chargement des commandes');
      } else {
        console.log('✅ Commandes chargées depuis Supabase:', data?.length || 0, data);
        setSupabaseOrders((data as any) || []);
      }
    } catch (error) {
      console.error('❌ Erreur:', error);
      toast.error('Erreur de connexion');
    } finally {
      console.log('🔵 fetchOrders finished, loading = false');
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('🔵 useEffect triggered in OrderManagement');
    // D'abord migrer les anciennes commandes, puis charger toutes les commandes
    migrateLocalStorageOrders().then(() => {
      console.log('🔵 Migration complete, calling fetchOrders');
      fetchOrders();
    });
  }, []);

  const filteredOrders = statusFilter === 'all'
    ? supabaseOrders
    : supabaseOrders.filter(order => order.status === statusFilter);

  console.log('Orders loaded:', supabaseOrders.length, 'Filtered:', filteredOrders.length);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-500 hover:bg-green-600">Validé</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500 hover:bg-red-600">Annulé</Badge>;
      default:
        return <Badge variant="secondary">En attente</Badge>;
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    if (newStatus === 'confirmed' || newStatus === 'cancelled') {
      try {
        const { error } = await supabase
          .from('orders')
          .update({ status: newStatus })
          .eq('id', orderId);

        if (error) {
          console.error('Erreur lors de la mise à jour du statut:', error);
          toast.error('Erreur lors de la mise à jour');
        } else {
          toast.success(`Commande ${newStatus === 'confirmed' ? 'validée' : 'annulée'}`);
          fetchOrders(); // Recharger les commandes
        }
      } catch (error) {
        console.error('Erreur:', error);
        toast.error('Erreur de connexion');
      }
    }
  };

  const handleSendToZRExpress = async (order: SupabaseOrder) => {
    setSendingToZR(order.id);
    try {
      const zrExpressData = {
        orderNumber: order.order_number,
        customerInfo: order.customer_info,
        items: order.items,
        totalProducts: order.total_products,
        deliveryFee: order.delivery_fee,
        totalAmount: order.total_amount
      };

      const response = await fetch('https://jgtrvwydouplehrchgoy.supabase.co/functions/v1/send-to-zr-express', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpndHJ2d3lkb3VwbGVocmNoZ295Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5OTc4MDEsImV4cCI6MjA2NTU3MzgwMX0.ijUq8CKVV3LRecUa2LxjV0XQZQTUgeHDhLrW2-jiE9E`
        },
        body: JSON.stringify(zrExpressData)
      });

      const result = await response.json();
      
      if (result.success) {
        // Mettre à jour la commande dans Supabase
        const { error } = await supabase
          .from('orders')
          .update({ 
            sent_to_zr_express: true,
            zr_express_response: result
          })
          .eq('id', order.id);

        if (error) {
          console.error('Erreur lors de la mise à jour:', error);
          toast.error('Erreur lors de la mise à jour');
        } else {
          toast.success('Commande envoyée à ZR Express avec succès!');
          fetchOrders(); // Recharger les commandes
        }
      } else {
        console.error('Erreur ZR Express:', result);
        toast.error('Erreur lors de l\'envoi à ZR Express');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur de connexion');
    } finally {
      setSendingToZR(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold gold-text">Gestion des Commandes</h2>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48 bg-gray-700 border-gold-500/30">
            <SelectValue placeholder="Filtrer par statut" />
          </SelectTrigger>
          <SelectContent className="bg-gray-700 border-gold-500/30">
            <SelectItem value="all">Toutes</SelectItem>
            <SelectItem value="pending">En attente</SelectItem>
            <SelectItem value="confirmed">Validées</SelectItem>
            <SelectItem value="cancelled">Annulées</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="bg-gray-800 border-gold-500/20">
        <CardHeader>
          <CardTitle className="gold-text flex items-center">
            <Package className="h-5 w-5 mr-2" />
            Commandes ({filteredOrders.length})
            <span className="ml-2 text-sm text-gray-400">
              (Total: {supabaseOrders.length})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-400">Chargement des commandes...</div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              {supabaseOrders.length === 0 
                ? "Aucune commande enregistrée" 
                : "Aucune commande trouvée pour ce filtre"}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gold-500/20">
                    <TableHead className="text-gold-300">N° Commande</TableHead>
                    <TableHead className="text-gold-300">Client</TableHead>
                    <TableHead className="text-gold-300">Contact</TableHead>
                    <TableHead className="text-gold-300">Wilaya</TableHead>
                    <TableHead className="text-gold-300">Articles</TableHead>
                    <TableHead className="text-gold-300">Total</TableHead>
                    <TableHead className="text-gold-300">Date</TableHead>
                    <TableHead className="text-gold-300">Statut</TableHead>
                    <TableHead className="text-gold-300">ZR Express</TableHead>
                    <TableHead className="text-gold-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id} className="border-gold-500/10">
                      <TableCell className="text-white font-mono">
                        {order.order_number}
                      </TableCell>
                      <TableCell className="text-white">
                        {order.customer_info.firstName} {order.customer_info.lastName}
                      </TableCell>
                      <TableCell className="text-white">
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-1 text-gold-400" />
                          {order.customer_info.phone}
                        </div>
                      </TableCell>
                      <TableCell className="text-white">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1 text-gold-400" />
                          {order.customer_info.wilaya}
                        </div>
                      </TableCell>
                      <TableCell className="text-white">
                        {order.items.length} article(s)
                      </TableCell>
                      <TableCell className="text-gold-400 font-semibold">
                        {formatPrice(order.total_amount)}
                      </TableCell>
                      <TableCell className="text-white">
                        {new Date(order.created_at).toLocaleDateString('fr-FR')}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(order.status)}
                      </TableCell>
                      <TableCell>
                        {order.sent_to_zr_express ? (
                          <Badge className="bg-blue-500">Envoyée</Badge>
                        ) : (
                          <Badge variant="secondary">Non envoyée</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2 flex-wrap">
                          {order.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white"
                                onClick={() => handleStatusChange(order.id, 'confirmed')}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Valider
                              </Button>
                              <Button
                                size="sm"
                                className="bg-red-600 hover:bg-red-700 text-white"
                                onClick={() => handleStatusChange(order.id, 'cancelled')}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Annuler
                              </Button>
                            </>
                          )}
                          {order.status === 'confirmed' && !order.sent_to_zr_express && (
                            <Button
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                              onClick={() => handleSendToZRExpress(order)}
                              disabled={sendingToZR === order.id}
                            >
                              <Send className="h-4 w-4 mr-1" />
                              {sendingToZR === order.id ? 'Envoi...' : 'Envoyer à ZR'}
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderManagement;
