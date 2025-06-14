
import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { useCart } from "@/contexts/CartContext";

interface ProductCardProps {
  image: string;
  title: string;
  price: string;
  originalPrice?: string;
  category: string;
}

const ProductCard = ({ image, title, price, originalPrice, category }: ProductCardProps) => {
  const { t } = useApp();
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();

  // Créer un objet product pour les fonctions du panier
  const product = {
    id: `${title}-${price}`, // Simple ID basé sur le titre et prix
    image,
    title,
    price,
    originalPrice,
    category
  };

  const isLiked = isInWishlist(product.id);

  const handleWishlistToggle = () => {
    if (isLiked) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <div className="group relative bg-gradient-to-br from-gray-900 to-black [data-theme='light']_&:from-white [data-theme='light']_&:to-gray-50 rounded-xl overflow-hidden gold-border hover:shadow-2xl hover:shadow-gold-500/20 transition-all duration-500 transform hover:-translate-y-2">
      {/* Image container */}
      <div className="relative aspect-square overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Favorite button */}
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-3 right-3 rounded-full ${isLiked ? 'text-red-500 bg-white/20' : 'text-white/70 bg-black/20'} hover:bg-white/30 transition-all duration-300`}
          onClick={handleWishlistToggle}
        >
          <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
        </Button>

        {/* Category badge */}
        <div className="absolute top-3 left-3 bg-gold-500 text-black px-3 py-1 rounded-full text-xs font-semibold">
          {category}
        </div>

        {/* Shimmer effect */}
        <div className="absolute inset-0 shimmer-effect opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gold-200 mb-2 group-hover:gold-text transition-colors duration-300">
          {title}
        </h3>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold gold-text">{price}</span>
            {originalPrice && (
              <span className="text-sm text-gray-400 line-through">{originalPrice}</span>
            )}
          </div>
        </div>

        {/* Action button */}
        <Button 
          className="w-full gold-button group-hover:animate-glow"
          onClick={handleAddToCart}
        >
          <ShoppingBag className="w-4 h-4 mr-2" />
          {t('add_to_cart')}
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
