
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import AdminLogin from "@/components/AdminLogin";
import Dashboard from "@/components/admin/Dashboard";
import ProductManagement from "@/components/admin/ProductManagement";
import OrderManagement from "@/components/admin/OrderManagement";
import StockManagement from "@/components/admin/StockManagement";
import PromotionManagement from "@/components/admin/PromotionManagement";
import DeliveryManagement from "@/components/admin/DeliveryManagement";
import ChatManagement from "@/components/admin/ChatManagement";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Warehouse,
  Percent,
  Truck,
  MessageCircle,
  LogOut
} from "lucide-react";

const Admin = () => {
  const { isAdmin, loading, signOut } = useAdminAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-gold-300 text-xl">Chargement...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return <AdminLogin />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Administration
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Gérez votre boutique Nesrine Golden Hands
            </p>
          </div>
          <Button
            onClick={signOut}
            variant="outline"
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Déconnexion
          </Button>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7 lg:w-auto lg:grid-cols-7">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Tableau</span>
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Produits</span>
            </TabsTrigger>
            <TabsTrigger value="stock" className="flex items-center gap-2">
              <Warehouse className="h-4 w-4" />
              <span className="hidden sm:inline">Stocks</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">Commandes</span>
            </TabsTrigger>
            <TabsTrigger value="promotions" className="flex items-center gap-2">
              <Percent className="h-4 w-4" />
              <span className="hidden sm:inline">Promos</span>
            </TabsTrigger>
            <TabsTrigger value="delivery" className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              <span className="hidden sm:inline">Livraison</span>
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Chat</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Dashboard />
          </TabsContent>

          <TabsContent value="products">
            <ProductManagement />
          </TabsContent>

          <TabsContent value="stock">
            <StockManagement />
          </TabsContent>

          <TabsContent value="orders">
            <OrderManagement />
          </TabsContent>

          <TabsContent value="promotions">
            <PromotionManagement />
          </TabsContent>

          <TabsContent value="delivery">
            <DeliveryManagement />
          </TabsContent>

          <TabsContent value="chat">
            <ChatManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
