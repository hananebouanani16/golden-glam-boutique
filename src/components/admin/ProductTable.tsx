
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2, RotateCcw } from "lucide-react";
import { Product } from "@/types/product";

const categories = [
  { value: "sacs", label: "Sacs à main" },
  { value: "bijoux", label: "Bijoux" }
];

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onRestore: (id: string) => void;
  loading: boolean;
}
export default function ProductTable({ products, onEdit, onDelete, onRestore, loading }: ProductTableProps) {
  if (loading) {
    return <div className="p-8 text-center text-gold-400">Chargement des produits…</div>;
  }
  return (
    <div className="bg-gray-800/50 rounded-lg border border-gold-500/20 overflow-hidden">
      <div className="max-h-96 overflow-y-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-gray-800">
            <TableRow className="border-gold-500/20">
              <TableHead className="text-gold-300">Image</TableHead>
              <TableHead className="text-gold-300">Titre</TableHead>
              <TableHead className="text-gold-300">Prix</TableHead>
              <TableHead className="text-gold-300">Catégorie</TableHead>
              <TableHead className="text-gold-300">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id} className="border-gold-500/20">
                <TableCell>
                  <img 
                    src={product.image} 
                    alt={product.title}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                </TableCell>
                <TableCell className="text-white max-w-xs truncate" title={product.title}>
                  {product.title}
                </TableCell>
                <TableCell className="text-gold-300">
                  {parseInt(product.price, 10).toLocaleString()} DA
                  {product.originalPrice && (
                    <span className="text-gray-400 line-through ml-2 text-sm">
                      {parseInt(product.originalPrice, 10).toLocaleString()} DA
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-white">
                  {categories.find(c => c.value === product.category)?.label}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(product)}
                      className="text-gold-300 hover:text-gold-200"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(product.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    {/* Bouton RESTAURER (invisible si non supprimé) */}
                    {product.deleted_at && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onRestore(product.id)}
                        className="text-green-400 hover:text-green-300"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
