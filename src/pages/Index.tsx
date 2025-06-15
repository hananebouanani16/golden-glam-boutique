
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";
import { useApp } from "@/contexts/AppContext";
import { useProducts } from "@/contexts/ProductContext";

const Index = () => {
  const { t } = useApp();
  const { products } = useProducts();

  // Affiche maintenant TOUS les produits non supprimés, peu importe la catégorie
  const allData = products;

  // On garde aussi les sections par catégories comme avant
  const bagsData = products.filter((p) => p.category === "sacs");
  const jewelryData = products.filter((p) => p.category === "bijoux");

  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <ProductGrid
        id="all-products"
        title="Tous les produits"
        subtitle="Liste complète de tous les produits présents dans la base (hors supprimés)"
        products={allData}
      />
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
    </div>
  );
};

export default Index;

