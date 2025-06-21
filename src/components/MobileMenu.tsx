
import React, { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, X, Search } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import LanguageThemeSelector from "./LanguageThemeSelector";
import SearchBar from "./SearchBar";

const MobileMenu = () => {
  const { t } = useApp();
  const [open, setOpen] = useState(false);

  const menuItems = [
    { href: "#accueil", label: t('home') },
    { href: "#sacs", label: t('bags') },
    { href: "#bijoux", label: t('jewelry') },
    { href: "#contact", label: t('contact') },
  ];

  const handleItemClick = (href: string) => {
    document.getElementById(href.replace('#', ''))?.scrollIntoView({ behavior: 'smooth' });
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden text-gold-300 hover:text-gold-200 touch-target">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[280px] sm:w-[350px] bg-gray-900/95 backdrop-blur-sm border-gold-500/20">
        <div className="flex flex-col space-y-6 mt-8">
          {/* Header avec logo */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img 
                src="/lovable-uploads/285022db-a31d-4333-8f9d-08c7ce0263fb.png" 
                alt="Nesrine Golden Hands" 
                className="h-8 w-8 rounded-full border border-gold-400"
              />
              <div className="ml-2">
                <h2 className="text-sm font-bold gold-text">Nesrine</h2>
                <p className="text-xs text-gold-400">Golden Hands</p>
              </div>
            </div>
          </div>

          {/* Barre de recherche mobile */}
          <div className="md:hidden">
            <SearchBar />
          </div>
          
          {/* Navigation */}
          <nav className="flex flex-col space-y-4">
            {menuItems.map((item) => (
              <button
                key={item.href}
                onClick={() => handleItemClick(item.href)}
                className="text-left text-gold-300 hover:text-gold-200 transition-colors duration-300 py-3 text-lg touch-target"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Sélecteur de langue et thème */}
          <div className="sm:hidden pt-4 border-t border-gold-500/20">
            <LanguageThemeSelector />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
