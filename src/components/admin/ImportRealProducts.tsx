
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/contexts/ProductContext";
// On importe les vraies données sources
import { bagsData } from "@/data/bagsData";
import { jewelryData } from "@/data/jewelryData";

// Helpers : conversion prix en € → DA (1€ ≈ 145 DA, à ajuster si besoin)
function euroToDA(price: string): string {
  // Si le prix contient "€", conversion, sinon retourne l'original
  if (price.includes("€")) {
    const val = Number(price.replace("€", "").replace(/\s/g, "").replace(",", "."));
    return Math.round(val * 145).toString();
  }
  // Sinon c’est déjà du DA (depuis l’admin)
  return price;
}

// Pour harmoniser les catégories des Bijoux
function mapJewelryCategory(cat: string): string {
  // Par défaut, on met tout dans "bijoux"
  return "bijoux";
}

export default function ImportRealProducts() {
  const { addProduct, resetProducts, products } = useProducts();
  const [loading, setLoading] = useState(false);
  const [imported, setImported] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Prépare les produits à insérer (filtrage des doublons par titre déjà présent)
  const alreadyInDbTitles = products.map((p) => p.title);

  // Regroupe tous les produits, prépare les champs pour Supabase
  const dataToImport = [
    ...bagsData.map((p) => ({
      title: p.title,
      price: euroToDA(p.price),
      originalPrice: p.originalPrice ? euroToDA(p.originalPrice) : "",
      image: p.image,
      category: "sacs",
    })),
    ...jewelryData.map((p) => ({
      title: p.title,
      price: euroToDA(p.price),
      originalPrice: p.originalPrice ? euroToDA(p.originalPrice) : "",
      image: p.image,
      category: mapJewelryCategory(p.category),
    })),
  ].filter((p) => !alreadyInDbTitles.includes(p.title));

  const handleImport = async () => {
    setLoading(true);
    setError(null);
    try {
      // Import boucle pour chaque produit, pause de 100ms pour éviter rate-limit
      for (const product of dataToImport) {
        await addProduct(product);
        await new Promise((r) => setTimeout(r, 100)); // Petite pause
      }
      setImported(true);
      resetProducts();
    } catch (err: any) {
      setError("Erreur import : " + err.message);
    }
    setLoading(false);
  };

  if (imported) {
    return (
      <div className="text-green-400 my-6 font-bold">
        ✅ Import terminé ! {dataToImport.length} produits importés.<br/>
        <span className="text-sm text-gold-200">Tu peux retirer ce composant « ImportRealProducts » du code si tu veux.</span>
      </div>
    );
  }

  return (
    <div className="my-8 p-4 border border-gold-500/30 bg-gray-900 rounded-lg">
      <div className="mb-2 gold-text font-bold">
        Import des vrais produits du site (1 clic) 
      </div>
      <p className="mb-2 text-gold-300 text-sm">
        {dataToImport.length} produits peuvent être importés dans Supabase (ceux qui ne sont pas déjà présents). 
        <br />Si tu l’as déjà fait, le bouton devient inutile.
      </p>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      <Button 
        onClick={handleImport} 
        disabled={loading || dataToImport.length === 0}
        className="gold-button"
      >
        {loading ? "Importation en cours..." : "Importer tous les produits réels"}
      </Button>
    </div>
  );
}
