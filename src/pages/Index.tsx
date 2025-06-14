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

  // Données des bijoux avec vos vraies photos - collection étendue
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
    },
    {
      id: "jewelry11",
      image: "/lovable-uploads/1b4637af-7270-45ff-800e-4b2a0e483818.png",
      title: "Ensemble Collier Perles Carrées et Boucles d'Oreilles",
      price: "92€",
      category: "Ensembles"
    },
    {
      id: "jewelry12",
      image: "/lovable-uploads/26220fa2-db62-4a55-a039-b2b2ab87f44b.png",
      title: "Boucles d'Oreilles Perlées Multicolores",
      price: "48€",
      category: "Boucles d'Oreilles"
    },
    {
      id: "jewelry13",
      image: "/lovable-uploads/a57e5bcc-0bd2-4eda-becb-5d9d9a426705.png",
      title: "Parure Florale Dorée et Pierres Précieuses",
      price: "135€",
      originalPrice: "165€",
      category: "Parures"
    },
    {
      id: "jewelry14",
      image: "/lovable-uploads/b4609112-128a-4c0a-b83b-a637248f4523.png",
      title: "Collier Délicat à Fleurs",
      price: "52€",
      category: "Colliers"
    },
    {
      id: "jewelry15",
      image: "/lovable-uploads/85607faa-c640-4678-88e0-da4efc2a3822.png",
      title: "Ensemble Chaîne Cubaine Dorée Premium",
      price: "115€",
      category: "Ensembles"
    },
    {
      id: "jewelry16",
      image: "/lovable-uploads/36516e48-bccc-4f8e-a400-a87a4880f5ed.png",
      title: "Coffret à Bijoux Rose Luxe",
      price: "38€",
      category: "Accessoires"
    },
    {
      id: "jewelry17",
      image: "/lovable-uploads/7589f38b-48ba-4804-a28d-e0f554595948.png",
      title: "Parure Perles Blanches et Cristaux",
      price: "98€",
      category: "Parures"
    },
    {
      id: "jewelry18",
      image: "/lovable-uploads/649727cb-c426-4765-ba00-34a7547eee35.png",
      title: "Collier Fleur Délicate Dorée",
      price: "44€",
      category: "Colliers"
    },
    {
      id: "jewelry19",
      image: "/lovable-uploads/7f642d8d-1ef5-49b1-aad2-21eeb7b51e69.png",
      title: "Accessoire Cheveux Perles et Cristaux",
      price: "68€",
      category: "Accessoires Cheveux"
    },
    {
      id: "jewelry20",
      image: "/lovable-uploads/11563c7d-17dc-451b-ad73-5f8bb8a74162.png",
      title: "Collection Bagues Pierres Colorées",
      price: "32€",
      category: "Bagues"
    },
    {
      id: "jewelry21",
      image: "/lovable-uploads/f058ee6a-57bc-4f73-b224-ab586914aaeb.png",
      title: "Peigne à Cheveux Fleurs Rose et Cristaux",
      price: "125€",
      category: "Accessoires Cheveux"
    },
    {
      id: "jewelry22",
      image: "/lovable-uploads/6a302d85-7343-4e1a-bd3d-564fd8ee12b5.png",
      title: "Parure Bracelet et Boucles d'Oreilles Rose",
      price: "78€",
      category: "Parures"
    },
    {
      id: "jewelry23",
      image: "/lovable-uploads/94046d6e-2901-4ff8-9829-29c9e405a616.png",
      title: "Ensemble Collier et Boucles d'Oreilles Perles Blanches",
      price: "95€",
      category: "Ensembles"
    },
    {
      id: "jewelry24",
      image: "/lovable-uploads/71f6616d-79eb-435a-9d20-30973ed5c2f1.png",
      title: "Boucles d'Oreilles Perles et Cristaux Rose",
      price: "65€",
      category: "Boucles d'Oreilles"
    },
    {
      id: "jewelry25",
      image: "/lovable-uploads/924a9a11-83fa-494f-92c5-77a6062ff51e.png",
      title: "Parure Bracelet et Boucles d'Oreilles Rouge",
      price: "88€",
      category: "Parures"
    },
    {
      id: "jewelry26",
      image: "/lovable-uploads/5db391e7-267f-4d95-8020-b0f3e856fcee.png",
      title: "Ensemble Colliers et Boucles d'Oreilles Fleurs",
      price: "105€",
      category: "Ensembles"
    },
    {
      id: "jewelry27",
      image: "/lovable-uploads/254f2f25-d71d-4d38-bf05-9f74a545a040.png",
      title: "Parure Bracelet Perles Multicolores",
      price: "72€",
      category: "Bracelets"
    },
    {
      id: "jewelry28",
      image: "/lovable-uploads/f456b0db-9f47-412f-8879-fe3e5c9f088f.png",
      title: "Collier Double Perles et Boucles d'Oreilles Turquoise",
      price: "115€",
      category: "Parures"
    },
    {
      id: "jewelry29",
      image: "/lovable-uploads/289d3d00-31f2-4b35-950f-c8841da36276.png",
      title: "Boucles d'Oreilles Pendantes Feuilles",
      price: "58€",
      category: "Boucles d'Oreilles"
    },
    {
      id: "jewelry30",
      image: "/lovable-uploads/6634adf0-e50b-4362-b911-747422e4b8f6.png",
      title: "Parure Complète Perles Argentées",
      price: "145€",
      originalPrice: "180€",
      category: "Parures"
    },
    {
      id: "jewelry31",
      image: "/lovable-uploads/fbfeabe1-a76d-42b5-8064-16302a9473c3.png",
      title: "Parure Complète Perles Blanches Luxe",
      price: "165€",
      originalPrice: "200€",
      category: "Parures"
    },
    {
      id: "jewelry32",
      image: "/lovable-uploads/671889df-b538-4046-80df-1e2a7eeb9652.png",
      title: "Boucles d'Oreilles Perles et Cristaux Colorés",
      price: "62€",
      category: "Boucles d'Oreilles"
    },
    {
      id: "jewelry33",
      image: "/lovable-uploads/61dc3cd0-4d8f-4367-87ce-eb95f8b175eb.png",
      title: "Bracelet Perles Fleurs Dorées et Bague Assortie",
      price: "85€",
      category: "Ensembles"
    },
    {
      id: "jewelry34",
      image: "/lovable-uploads/b710b450-1b0e-4c74-8c28-6b917157fda2.png",
      title: "Boucles d'Oreilles Perles Blanches en Grappes",
      price: "75€",
      category: "Boucles d'Oreilles"
    },
    {
      id: "jewelry35",
      image: "/lovable-uploads/dd334006-6a3c-4573-a09d-4e3cc1c1b239.png",
      title: "Parure Perles et Cristaux Multicolores Fantaisie",
      price: "135€",
      category: "Parures"
    },
    {
      id: "jewelry36",
      image: "/lovable-uploads/80464386-c2b2-486a-86da-680115e67745.png",
      title: "Boucles d'Oreilles Perles Cercles Élégantes",
      price: "95€",
      category: "Boucles d'Oreilles"
    },
    {
      id: "jewelry37",
      image: "/lovable-uploads/bb035c99-5043-4b8e-bd1e-d537944406e3.png",
      title: "Boucles d'Oreilles Perles Cascade Argentées",
      price: "88€",
      category: "Boucles d'Oreilles"
    },
    {
      id: "jewelry38",
      image: "/lovable-uploads/64060d7c-bda7-47a3-abd5-a6515a01ae28.png",
      title: "Boucles d'Oreilles Dorées Perles et Cristaux",
      price: "105€",
      category: "Boucles d'Oreilles"
    },
    {
      id: "jewelry39",
      image: "/lovable-uploads/64d5df36-b43b-44bc-955c-16d66bfffc89.png",
      title: "Boucles d'Oreilles Cristaux Champagne Pendantes",
      price: "78€",
      category: "Boucles d'Oreilles"
    },
    {
      id: "jewelry40",
      image: "/lovable-uploads/0008ae53-f175-4b62-b33e-3dac706c04aa.png",
      title: "Boucles d'Oreilles Perles Dorées Raffinées",
      price: "68€",
      category: "Boucles d'Oreilles"
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
