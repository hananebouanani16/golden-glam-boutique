
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";

const Index = () => {
  // Données d'exemple pour les sacs à main
  const bagsData = [
    {
      id: "bag1",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
      title: "Sac Élégance Dorée",
      price: "89€",
      originalPrice: "120€",
      category: "Cuir Premium"
    },
    {
      id: "bag2",
      image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop",
      title: "Pochette Luxe",
      price: "65€",
      category: "Soirée"
    },
    {
      id: "bag3",
      image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&h=400&fit=crop",
      title: "Sac Artisanal",
      price: "95€",
      category: "Fait Main"
    },
    {
      id: "bag4",
      image: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=400&h=400&fit=crop",
      title: "Collection Vintage",
      price: "110€",
      originalPrice: "140€",
      category: "Vintage"
    }
  ];

  // Données d'exemple pour les bijoux
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
        title="Collection Sacs à Main"
        subtitle="Découvrez nos sacs à main uniques, alliant style et fonctionnalité pour toutes les occasions."
        products={bagsData}
      />
      
      <ProductGrid 
        id="bijoux"
        title="Collection Bijoux"
        subtitle="Sublimez votre beauté avec nos bijoux artisanaux, créés avec passion et savoir-faire."
        products={jewelryData}
      />
      
      <Footer />
    </div>
  );
};

export default Index;
