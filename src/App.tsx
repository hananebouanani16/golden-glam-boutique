import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { OrderProvider } from "@/contexts/OrderContext";
import { ProductProvider } from "@/contexts/ProductContext";
import { AppProvider } from "@/contexts/AppContext";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <AuthProvider>
        <AdminAuthProvider>
          <ProductProvider>
            <CartProvider>
              <OrderProvider>
                <TooltipProvider>
                  <Toaster />
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/admin_gestion" element={<Admin />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </TooltipProvider>
              </OrderProvider>
            </CartProvider>
          </ProductProvider>
        </AdminAuthProvider>
      </AuthProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
