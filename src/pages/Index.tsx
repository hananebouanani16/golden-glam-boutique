
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

  // Données des bijoux avec vos vraies photos
  const jewelryData = [
    {
      id: "jewelry1",
      image: "/lovable-uploads/b35dea3e-6731-4270-bcef-3038d8adf66f.png",
      title: "Collier et Bracelet Fleurs Dorées",
      price: "65€",
      category: "Colliers"
    },
    {
      id: "jewelry2",
      image: "/lovable-uploads/2ecfc2e9-afd1-4b42-9b9d-4ff0f1b24911.png",
      title: "Chaîne de Taille Fleurs Cristal",
      price: "55€",
      category: "Bijoux de Corps"
    },
    {
      id: "jewelry3",
      image: "/lovable-uploads/b980ceff-e6ed-4dec-b265-4d9c6cdd52a1.png",
      title: "Ensemble Collier Boucles d'Oreilles Perles",
      price: "75€",
      category: "Ensembles"
    },
    {
      id: "jewelry4",
      image: "/lovable-uploads/1c983e48-9a0d-426a-a9fc-6b0b53cc30cd.png",
      title: "Bracelet de Cheville Fleurs Dorées",
      price: "35€",
      category: "Bracelets"
    },
    {
      id: "jewelry5",
      image: "/lovable-uploads/d8774639-274a-4667-832a-57da084a19da.png",
      title: "Épingles à Cheveux Perles et Fleurs",
      price: "45€",
      category: "Accessoires Cheveux"
    },
    {
      id: "jewelry6",
      image: "/lovable-uploads/828dd4a2-3c8a-4bfa-99ac-2f3430e1e17c.png",
      title: "Parure Collier Boucles d'Oreilles Bronze",
      price: "85€",
      originalPrice: "110€",
      category: "Parures"
    },
    {
      id: "jewelry7",
      image: "/lovable-uploads/d2907c05-2fee-4108-a0ea-bc9a786ba09b.png",
      title: "Peigne à Cheveux Fleurs et Cristaux",
      price: "95€",
      category: "Accessoires Cheveux"
    },
    {
      id: "jewelry8",
      image: "/lovable-uploads/492f53a7-ba64-472a-ab8d-01ecba50a803.png",
      title: "Collier Délicat Fleur Dorée",
      price: "42€",
      category: "Colliers"
    },
    {
      id: "jewelry9",
      image: "/lovable-uploads/0b99f4ce-9d47-49e9-b1e7-424e7abd0e24.png",
      title: "Ensemble Pendentif et Boucles d'Oreilles",
      price: "88€",
      category: "Ensembles"
    },
    {
      id: "jewelry10",
      image: "/lovable-uploads/fcbc9f4e-2059-4dcb-95f6-c80751233790.png",
      title: "Collier Fleurs Délicates Dorées",
      price: "58€",
      category: "Colliers"
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
