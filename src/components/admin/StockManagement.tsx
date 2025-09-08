import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";
import { AlertTriangle, Package, TrendingDown } from "lucide-react";

const StockManagement = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('title', { ascending: true });

      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: `Impossible de charger les produits: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStock = async (productId: string, field: string, value: number | boolean) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ [field]: value })
        .eq('id', productId);

      if (error) throw error;

      setProducts(prev => prev.map(p => 
        p.id === productId ? { ...p, [field]: value } : p
      ));

      toast({
        title: "Stock mis à jour",
        description: "Les informations de stock ont été mises à jour avec succès.",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: `Impossible de mettre à jour le stock: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const getStockStatus = (product: Product) => {
    if (product.is_out_of_stock) return { status: "Rupture", color: "destructive" };
    if (product.stock_quantity <= product.low_stock_threshold) return { status: "Stock faible", color: "warning" };
    return { status: "En stock", color: "default" };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gold-300">Chargement du stock...</div>
      </div>
    );
  }

  const lowStockProducts = products.filter(p => 
    (p.stock_quantity || 0) <= (p.low_stock_threshold || 5) && !p.is_out_of_stock
  );
  const outOfStockProducts = products.filter(p => p.is_out_of_stock);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold gold-text">Gestion des Stocks</h2>
        <p className="text-gray-400 mt-1">
          Gérez les quantités et les seuils d'alerte pour vos produits
        </p>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Produits</CardTitle>
            <Package className="h-4 w-4 text-gold-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gold-300">{products.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Stock Faible</CardTitle>
            <TrendingDown className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400">{lowStockProducts.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Rupture de Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">{outOfStockProducts.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des produits avec gestion des stocks */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-gold-300">Stock des Produits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {products.map((product) => {
              const stockStatus = getStockStatus(product);
              return (
                <div key={product.id} className="flex items-center justify-between p-4 border border-gray-600 rounded-lg">
                  <div className="flex items-center space-x-4">
                    {product.image && (
                      <img 
                        src={product.image} 
                        alt={product.title} 
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
                    <div>
                      <h3 className="font-medium text-white">{product.title}</h3>
                      <p className="text-sm text-gray-400">{product.category}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    <Badge variant={stockStatus.color as any}>
                      {stockStatus.status}
                    </Badge>

                    <div className="flex items-center space-x-2">
                      <Label htmlFor={`stock-${product.id}`} className="text-sm text-gray-300">
                        Quantité:
                      </Label>
                      <Input
                        id={`stock-${product.id}`}
                        type="number"
                        min="0"
                        value={product.stock_quantity || 0}
                        onChange={(e) => updateStock(product.id, 'stock_quantity', parseInt(e.target.value) || 0)}
                        className="w-20 bg-gray-700 border-gray-600 text-white"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Label htmlFor={`threshold-${product.id}`} className="text-sm text-gray-300">
                        Seuil:
                      </Label>
                      <Input
                        id={`threshold-${product.id}`}
                        type="number"
                        min="0"
                        value={product.low_stock_threshold || 5}
                        onChange={(e) => updateStock(product.id, 'low_stock_threshold', parseInt(e.target.value) || 5)}
                        className="w-20 bg-gray-700 border-gray-600 text-white"
                      />
                    </div>

                    <Button
                      variant={product.is_out_of_stock ? "default" : "destructive"}
                      size="sm"
                      onClick={() => updateStock(product.id, 'is_out_of_stock', !product.is_out_of_stock)}
                    >
                      {product.is_out_of_stock ? "Remettre en stock" : "Marquer rupture"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StockManagement;