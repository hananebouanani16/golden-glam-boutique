
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { useApp } from "@/contexts/AppContext";
import { useProducts } from "@/contexts/ProductContext";

const Index = () => {
  const { t } = useApp();
  const { products, loading } = useProducts();

  const bagsData = products.filter((p) => p.category?.trim() === "sacs");
  const jewelryData = products.filter((p) => p.category?.trim() === "bijoux");

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-gold-300 text-xl mb-4">Chargement des produits...</div>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-300"></div>
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
      <WhatsAppButton />
    </div>
  );
};

export default Index;
