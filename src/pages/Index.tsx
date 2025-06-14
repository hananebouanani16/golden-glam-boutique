
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";
import { useApp } from "@/contexts/AppContext";
import { getBagsWithTranslations, getJewelryWithTranslations } from "@/utils/productUtils";

const Index = () => {
  const { t } = useApp();

  const bagsData = getBagsWithTranslations(t);
  const jewelryData = getJewelryWithTranslations();

  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      
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
