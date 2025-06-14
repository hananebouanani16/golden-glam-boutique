
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import { useApp } from "@/contexts/AppContext";

const Hero = () => {
  const { t } = useApp();

  return (
    <section id="accueil" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
      
      {/* Animated background particles */}
      <div className="absolute inset-0">
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

      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
        {/* Logo principal */}
        <div className="mb-8 animate-float">
          <img 
            src="/lovable-uploads/285022db-a31d-4333-8f9d-08c7ce0263fb.png" 
            alt="Nesrine Golden Hands" 
            className="mx-auto h-32 w-32 sm:h-40 sm:w-40 animate-glow"
          />
        </div>

        {/* Titre principal */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6 gold-text animate-fade-in">
          {t('hero_title')}
        </h1>
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-light mb-8 text-gold-300 animate-fade-in">
          {t('hero_subtitle')}
        </h2>

        {/* Sous-titre */}
        <p className="text-lg sm:text-xl lg:text-2xl text-gold-200 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in">
          {t('hero_description')}
        </p>

        {/* Boutons d'action */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in">
          <Button 
            size="lg" 
            className="gold-button px-8 py-3 text-lg shimmer-effect"
            onClick={() => document.getElementById('sacs')?.scrollIntoView({ behavior: 'smooth' })}
          >
            {t('discover_bags')}
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="gold-border text-gold-300 hover:bg-gold-500/10 px-8 py-3 text-lg"
            onClick={() => document.getElementById('bijoux')?.scrollIntoView({ behavior: 'smooth' })}
          >
            {t('explore_jewelry')}
          </Button>
        </div>

        {/* Flèche de défilement */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ArrowDown className="h-6 w-6 text-gold-400" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
