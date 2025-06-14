
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Tags, Calendar, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import ProductManagement from "@/components/admin/ProductManagement";
import CategoryManagement from "@/components/admin/CategoryManagement";
import PromoPlanner from "@/components/admin/PromoPlanner";

const Admin = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" size="icon" className="text-gold-300 hover:text-gold-200">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold gold-text">Administration</h1>
          </div>
        </div>

        {/* Admin Tabs */}
        <Tabs defaultValue="products" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800 border border-gold-500/20">
            <TabsTrigger value="products" className="data-[state=active]:bg-gold-500 data-[state=active]:text-black">
              <Package className="w-4 h-4 mr-2" />
              Articles
            </TabsTrigger>
            <TabsTrigger value="categories" className="data-[state=active]:bg-gold-500 data-[state=active]:text-black">
              <Tags className="w-4 h-4 mr-2" />
              Catégories
            </TabsTrigger>
            <TabsTrigger value="promos" className="data-[state=active]:bg-gold-500 data-[state=active]:text-black">
              <Calendar className="w-4 h-4 mr-2" />
              Promotions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="mt-6">
            <ProductManagement />
          </TabsContent>

          <TabsContent value="categories" className="mt-6">
            <CategoryManagement />
          </TabsContent>

          <TabsContent value="promos" className="mt-6">
            <PromoPlanner />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
