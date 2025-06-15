import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useOrders } from "@/contexts/OrderContext";
import { formatPrice } from "@/utils/priceUtils";
import { CheckCircle, XCircle, Package, Phone, MapPin } from "lucide-react";

const OrderManagement = () => {
  const { orders, updateOrderStatus } = useOrders();
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Debug logging
  useEffect(() => {
    console.log('OrderManagement - Orders updated:', orders.length);
    console.log('OrderManagement - All orders:', orders);
  }, [orders]);

  const filteredOrders = orders.filter(order => {
    if (statusFilter === 'all') return true;
    return order.status === statusFilter;
  });

  console.log('OrderManagement - Filtered orders:', filteredOrders.length);

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

  const handleStatusChange = (orderId: string, newStatus: string) => {
    if (newStatus === 'confirmed' || newStatus === 'cancelled') {
      updateOrderStatus(orderId, newStatus);
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
              (Total: {orders.length})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
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
                  <TableHead className="text-gold-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id} className="border-gold-500/10">
                    <TableCell className="text-white font-mono">
                      {order.orderNumber}
                    </TableCell>
                    <TableCell className="text-white">
                      {order.customerInfo.firstName} {order.customerInfo.lastName}
                    </TableCell>
                    <TableCell className="text-white">
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-1 text-gold-400" />
                        {order.customerInfo.phone}
                      </div>
                    </TableCell>
                    <TableCell className="text-white">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1 text-gold-400" />
                        {order.customerInfo.wilaya}
                      </div>
                    </TableCell>
                    <TableCell className="text-white">
                      {order.items.length} article(s)
                    </TableCell>
                    <TableCell className="text-gold-400 font-semibold">
                      {formatPrice(order.totalAmount)}
                    </TableCell>
                    <TableCell className="text-white">
                      {order.createdAt.toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(order.status)}
                    </TableCell>
                    <TableCell>
                      {order.status === 'pending' && (
                        <div className="flex gap-2">
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
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredOrders.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              {orders.length === 0 
                ? "Aucune commande enregistrée" 
                : "Aucune commande trouvée pour ce filtre"
              }
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderManagement;
