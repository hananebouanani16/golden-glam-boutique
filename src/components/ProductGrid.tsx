
import ProductCard from "./ProductCard";
import { useApp } from "@/contexts/AppContext";

interface ProductGridProps {
  title: string;
  subtitle: string;
  products: Array<{
    id: string;
    image: string;
    title: string;
    price: string;
    originalPrice?: string;
    category: string;
  }>;
  id: string;
}

const ProductGrid = ({ title, subtitle, products, id }: ProductGridProps) => {
  const { t } = useApp();

  return (
    <section id={id} className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold gold-text mb-4">
            {title}
          </h2>
          <p className="text-xl text-gold-300 max-w-2xl mx-auto">
            {subtitle}
          </p>
          <div className="w-24 h-1 bg-gold-gradient mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              image={product.image}
              title={product.title}
              price={product.price}
              originalPrice={product.originalPrice}
              category={product.category}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
