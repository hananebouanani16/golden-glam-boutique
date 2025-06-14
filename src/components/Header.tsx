
import { ShoppingBag, Heart, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import LanguageThemeSelector from "./LanguageThemeSelector";
import { useApp } from "@/contexts/AppContext";

const Header = () => {
  const { t } = useApp();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gold-500/20 bg-black/90 backdrop-blur-md [data-theme='light']_&:bg-white/90">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/285022db-a31d-4333-8f9d-08c7ce0263fb.png" 
              alt="Nesrine Golden Hands" 
              className="h-12 w-12 animate-glow"
            />
            <div className="ml-3 hidden sm:block">
              <h1 className="text-xl font-bold gold-text">Nesrine</h1>
              <p className="text-xs text-gold-400">Golden Hands</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#accueil" className="text-gold-300 hover:text-gold-200 transition-colors duration-300 relative group">
              {t('home')}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold-400 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#sacs" className="text-gold-300 hover:text-gold-200 transition-colors duration-300 relative group">
              {t('bags')}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold-400 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#bijoux" className="text-gold-300 hover:text-gold-200 transition-colors duration-300 relative group">
              {t('jewelry')}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold-400 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#contact" className="text-gold-300 hover:text-gold-200 transition-colors duration-300 relative group">
              {t('contact')}
              <span className="absolute -bottom-1 left-0 h-0.5 bg-gold-400 group-hover:w-full transition-all duration-300"></span>
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <LanguageThemeSelector />
            <Button variant="ghost" size="icon" className="text-gold-300 hover:text-gold-200 hover:bg-gold-500/10">
              <Heart className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gold-300 hover:text-gold-200 hover:bg-gold-500/10">
              <User className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gold-300 hover:text-gold-200 hover:bg-gold-500/10 relative">
              <ShoppingBag className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-gold-500 text-black text-xs flex items-center justify-center font-bold">
                0
              </span>
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden text-gold-300 hover:text-gold-200">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
