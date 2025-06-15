
import ProductCard from "./ProductCard";

interface Product {
  id: string;
  image: string;
  title: string;
  price: string;
  originalPrice?: string;
  category: string;
}

interface ProductGridProps {
  id: string;
  title: string;
  subtitle: string;
  products: Product[];
}

const ProductGrid = ({ id, title, subtitle, products }: ProductGridProps) => {
  return (
    <section id={id} className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold gold-text mb-4">{title}</h2>
          <p className="text-xl text-gold-300 max-w-2xl mx-auto">{subtitle}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.filter(product => product && product.price).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
