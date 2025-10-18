import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/types/product";
import { AlertTriangle, Package, TrendingDown, Save } from "lucide-react";
import { useProducts } from "@/contexts/ProductContext";

const StockManagement = () => {
  const { toast } = useToast();
  const { products, updateProduct, loading } = useProducts();
  const [localChanges, setLocalChanges] = useState<Record<string, Partial<Product>>>({});
  const [hasChanges, setHasChanges] = useState(false);

  const updateLocalStock = (productId: string, field: string, value: number | boolean) => {
    setLocalChanges(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [field]: value
      }
    }));
    setHasChanges(true);
  };

  const saveAllChanges = async () => {
    try {
      const updates = Object.entries(localChanges).map(async ([productId, changes]) => {
        const product = products.find(p => p.id === productId);
        if (!product) return;
        
        await updateProduct({
          ...product,
          ...changes
        });
      });

      await Promise.all(updates);

      toast({
        title: "Succès",
        description: "Tous les changements ont été sauvegardés et la boutique a été mise à jour.",
      });
      
      setLocalChanges({});
      setHasChanges(false);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: `Impossible de sauvegarder: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const getDisplayValue = (product: Product, field: string) => {
    return localChanges[product.id]?.[field] ?? product[field];
  };

  const getStockStatus = (product: Product) => {
    if (product.is_out_of_stock) return { status: "Rupture", color: "destructive" };
    if (product.stock_quantity <= product.low_stock_threshold) return { status: "Stock faible", color: "warning" };
    return { status: "En stock", color: "default" };
  };

  const productsWithChanges = products.map(p => ({
    ...p,
    ...localChanges[p.id]
  }));

  const lowStockProducts = productsWithChanges.filter(p => 
    (p.stock_quantity || 0) <= (p.low_stock_threshold || 5) && !p.is_out_of_stock
  );
  const outOfStockProducts = productsWithChanges.filter(p => p.is_out_of_stock);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gold-300">Chargement du stock...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold gold-text">Gestion des Stocks</h2>
          <p className="text-gray-400 mt-1">
            Modifiez les quantités puis cliquez sur "Sauvegarder" pour mettre à jour la boutique
          </p>
        </div>
        {hasChanges && (
          <Button 
            onClick={saveAllChanges}
            className="gold-button"
            size="lg"
          >
            <Save className="h-4 w-4 mr-2" />
            Sauvegarder tout
          </Button>
        )}
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
            {productsWithChanges.map((product) => {
              const stockStatus = getStockStatus(product);
              const hasProductChanges = !!localChanges[product.id];
              
              return (
                <div 
                  key={product.id} 
                  className={`flex items-center justify-between p-4 border rounded-lg transition-all ${
                    hasProductChanges ? 'border-gold-500 bg-gold-500/5' : 'border-gray-600'
                  }`}
                >
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
                        value={getDisplayValue(product, 'stock_quantity') || 0}
                        onChange={(e) => updateLocalStock(product.id, 'stock_quantity', Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-20 bg-gray-700 border-gray-600 text-white"
                      />
                    </div>

                    <Button
                      variant={getDisplayValue(product, 'is_out_of_stock') ? "default" : "destructive"}
                      size="sm"
                      onClick={() => updateLocalStock(product.id, 'is_out_of_stock', !getDisplayValue(product, 'is_out_of_stock'))}
                    >
                      {getDisplayValue(product, 'is_out_of_stock') ? "Remettre en stock" : "Marquer rupture"}
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