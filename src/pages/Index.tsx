
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import { useApp } from "@/contexts/AppContext";
import { useProducts } from "@/contexts/ProductContext";
import { useEffect } from "react";

const Index = () => {
  const { t } = useApp();
  const { products, loading } = useProducts();

  // Log pour débogage
  useEffect(() => {
    console.log("[Index] useEffect - loading:", loading);
    console.log("[Index] useEffect - products:", products);
    console.log("[Index] useEffect - products.length:", products.length);
    
    if (!loading && products.length > 0) {
      console.log("--- [Index] Vérification des catégories des produits sur la page d'accueil ---");
      products.forEach(p => {
        console.log(`Produit: "${p.title}", Catégorie: "${p.category}"`);
      });
      console.log("--- Fin de la vérification ---");
    } else if (!loading && products.length === 0) {
      console.warn("[Index] ATTENTION: Aucun produit trouvé!");
    }
  }, [products, loading]);

  // On garde aussi les sections par catégories comme avant, en s'assurant de la propreté des données
  const bagsData = products.filter((p) => p.category?.trim() === "sacs");
  const jewelryData = products.filter((p) => p.category?.trim() === "bijoux");

  console.log("[Index] bagsData:", bagsData.length, "produits");
  console.log("[Index] jewelryData:", jewelryData.length, "produits");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gold-300 text-xl">Chargement des produits...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      {products.length === 0 && (
        <div className="text-center py-20">
          <h2 className="text-2xl text-gold-300 mb-4">Aucun produit trouvé</h2>
          <p className="text-gold-500">Vérifiez la configuration de votre base de données Supabase.</p>
        </div>
      )}
      <ProductGrid
        id="sacs"
        title={t('bags_title')}
        subtitle={t('bags_subtitle')}
        products={bagsData}
      />
      <ProductGrid
        id="bijoux"
        title={t('jewelry_title')}
        subtitle={t('jewelry_subtitle')}
        products={jewelryData}
      />
      <Footer />
      <ChatWidget />
    </div>
  );
};

export default Index;
