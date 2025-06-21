
import { useApp } from "@/contexts/AppContext";
import LanguageThemeSelector from "./LanguageThemeSelector";
import CartDrawer from "./CartDrawer";
import WishlistDrawer from "./WishlistDrawer";
import MobileMenu from "./MobileMenu";
import SearchBar from "./SearchBar";

const Header = () => {
  const { t } = useApp();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gold-500/20 bg-black/90 backdrop-blur-md [data-theme='light']_&:bg-white/90">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 sm:h-16 items-center justify-between">
          {/* Logo - optimisé mobile */}
          <div className="flex items-center min-w-0 flex-shrink-0">
            <img 
              src="/lovable-uploads/285022db-a31d-4333-8f9d-08c7ce0263fb.png" 
              alt="Nesrine Golden Hands" 
              className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 animate-glow rounded-full object-cover border-2 border-gold-400 flex-shrink-0"
            />
            <div className="ml-2 sm:ml-3 hidden xs:block sm:block min-w-0">
              <h1 className="text-sm sm:text-lg lg:text-xl font-bold gold-text truncate">Nesrine</h1>
              <p className="text-xs sm:text-xs text-gold-400 truncate">Golden Hands</p>
            </div>
          </div>

          {/* Navigation desktop */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <a href="#accueil" className="text-gold-300 hover:text-gold-200 transition-colors duration-300 relative group text-sm lg:text-base">
              {t('home')}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold-400 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#sacs" className="text-gold-300 hover:text-gold-200 transition-colors duration-300 relative group text-sm lg:text-base">
              {t('bags')}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold-400 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#bijoux" className="text-gold-300 hover:text-gold-200 transition-colors duration-300 relative group text-sm lg:text-base">
              {t('jewelry')}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold-400 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#contact" className="text-gold-300 hover:text-gold-200 transition-colors duration-300 relative group text-sm lg:text-base">
              {t('contact')}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold-400 group-hover:w-full transition-all duration-300"></span>
            </a>
          </nav>

          {/* Actions - optimisées mobile */}
          <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
            <div className="hidden sm:block">
              <LanguageThemeSelector />
            </div>
            <div className="hidden md:block">
              <SearchBar />
            </div>
            <WishlistDrawer />
            <CartDrawer />
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
