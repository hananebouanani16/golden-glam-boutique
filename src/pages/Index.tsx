
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";
import { useApp } from "@/contexts/AppContext";

const Index = () => {
  const { t } = useApp();

  // Données des sacs à main avec vos vraies photos
  const bagsData = [
    {
      id: "bag1",
      image: "/lovable-uploads/94dcffea-b617-4c6c-bae7-5c356b236b2b.png",
      title: "Sac Perlé Doré Élégant",
      price: "120€",
      originalPrice: "150€",
      category: t('handmade')
    },
    {
      id: "bag2",
      image: "/lovable-uploads/db919936-c4c1-4126-83b9-1baa157af9ae.png",
      title: "Sac Cristal Multicolore",
      price: "95€",
      category: t('handmade')
    },
    {
      id: "bag3",
      image: "/lovable-uploads/2b952f34-6137-4f2d-8405-946fca0bff55.png",
      title: "Pochette Argentée Premium",
      price: "85€",
      category: t('handmade')
    },
    {
      id: "bag4",
      image: "/lovable-uploads/a32b9b89-e95a-446d-b342-cca6c8e7ac22.png",
      title: "Sac Soirée Noir Sophistiqué",
      price: "110€",
      originalPrice: "140€",
      category: t('evening')
    },
    {
      id: "bag5",
      image: "/lovable-uploads/987572a0-ba74-4225-b5b9-e7fc36f26068.png",
      title: "Ensemble Sac Cristal Transparent",
      price: "130€",
      category: t('handmade')
    },
    {
      id: "bag6",
      image: "/lovable-uploads/00041e96-6e2e-46bc-bf88-6de37c324b8b.png",
      title: "Sac Perlé Noir avec Nœud",
      price: "100€",
      category: t('evening')
    },
    {
      id: "bag7",
      image: "/lovable-uploads/c9200fe8-042b-4ac7-ae45-607103646612.png",
      title: "Sac Argenté à Franges",
      price: "140€",
      category: t('handmade')
    },
    {
      id: "bag8",
      image: "/lovable-uploads/6865038a-f00f-4aac-9549-ce6fb3e9d044.png",
      title: "Sac Rouge Bordeaux Élégant",
      price: "115€",
      category: t('handmade')
    },
    {
      id: "bag9",
      image: "/lovable-uploads/efed3b11-59c7-4736-a736-4b01300b7b4a.png",
      title: "Mini Sac Perlé Blanc avec Anse Dorée",
      price: "75€",
      category: t('handmade')
    },
    {
      id: "bag10",
      image: "/lovable-uploads/f90ce3b5-ca69-4c3b-8e6c-55be3f91aaa8.png",
      title: "Sac Perlé Blanc à Franges",
      price: "125€",
      category: t('handmade')
    }
  ];

  // Données d'exemple pour les bijoux (gardées comme avant)
  const jewelryData = [
    {
      id: "jewelry1",
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop",
      title: "Collier Doré Royal",
      price: "45€",
      category: "Colliers"
    },
    {
      id: "jewelry2",
      image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400&h=400&fit=crop",
      title: "Boucles d'Oreilles Élégantes",
      price: "35€",
      originalPrice: "50€",
      category: "Boucles d'Oreilles"
    },
    {
      id: "jewelry3",
      image: "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=400&h=400&fit=crop",
      title: "Bracelet Artisanal",
      price: "28€",
      category: "Bracelets"
    },
    {
      id: "jewelry4",
      image: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop",
      title: "Bague Précieuse",
      price: "55€",
      category: "Bagues"
    }
  ];

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
