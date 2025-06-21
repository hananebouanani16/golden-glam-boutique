
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import { useApp } from "@/contexts/AppContext";

const Hero = () => {
  const { t } = useApp();

  return (
    <section id="accueil" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Image de fond avec overlay */}
      <div className="absolute inset-0">
        <img 
          src="/lovable-uploads/aac767de-fe55-4182-b493-b85c6a749c49.png" 
          alt="Artisans créant des sacs à main"
          className="w-full h-full object-cover"
        />
        {/* Overlay sombre pour améliorer la lisibilité */}
        <div className="absolute inset-0 bg-black/60 [data-theme='light']_&:bg-white/40"></div>
      </div>
      
      {/* Animated background particles */}
      <div className="absolute inset-0 z-10">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gold-400 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-20 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        {/* Logo principal - optimisé mobile */}
        <div className="mb-6 sm:mb-8 animate-float">
          <img 
            src="/lovable-uploads/285022db-a31d-4333-8f9d-08c7ce0263fb.png" 
            alt="Nesrine Golden Hands" 
            className="mx-auto h-24 w-24 sm:h-32 sm:w-32 lg:h-40 lg:w-40 animate-glow rounded-full object-cover border-4 border-gold-400 shadow-lg shadow-gold-500/50"
          />
        </div>

        {/* Titre principal - responsive */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 gold-text animate-fade-in drop-shadow-lg leading-tight">
          {t('hero_title')}
        </h1>
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-light mb-6 sm:mb-8 text-gold-300 animate-fade-in drop-shadow-lg leading-tight">
          {t('hero_subtitle')}
        </h2>

        {/* Sous-titre - responsive */}
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gold-200 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in drop-shadow-md px-4">
          {t('hero_description')}
        </p>

        {/* Boutons d'action - stack sur mobile */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in max-w-lg mx-auto">
          <Button 
            size="lg" 
            className="w-full sm:w-auto group relative overflow-hidden bg-gradient-to-r from-gold-600 to-gold-400 hover:from-purple-600 hover:via-gold-500 hover:to-pink-500 text-black font-semibold px-6 sm:px-8 py-3 text-base sm:text-lg transition-all duration-500 transform hover:scale-105 hover:shadow-xl hover:shadow-gold-500/50 gradient-animate touch-target"
            onClick={() => document.getElementById('sacs')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <span className="relative z-10">{t('discover_bags')}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="w-full sm:w-auto group relative overflow-hidden border-2 border-gold-500/50 text-gold-300 bg-black/30 hover:bg-gradient-to-r hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 hover:text-white hover:border-transparent px-6 sm:px-8 py-3 text-base sm:text-lg transition-all duration-500 transform hover:scale-105 hover:shadow-xl hover:shadow-purple-500/50 gradient-animate touch-target"
            onClick={() => document.getElementById('bijoux')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <span className="relative z-10">{t('explore_jewelry')}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          </Button>
        </div>

        {/* Flèche de défilement */}
        <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ArrowDown className="h-5 w-5 sm:h-6 sm:w-6 text-gold-400 drop-shadow-lg" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
