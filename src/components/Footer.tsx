
import { Facebook, Instagram, Mail, Phone, MapPin, Video } from "lucide-react";
import { useApp } from "@/contexts/AppContext";

const Footer = () => {
  const { t } = useApp();

  return (
    <footer className="bg-gradient-to-t from-black to-gray-900 border-t border-gold-500/20 pt-12 sm:pt-16 pb-6 sm:pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Logo et description */}
          <div className="sm:col-span-2 lg:col-span-2 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start mb-4">
              <img 
                src="/lovable-uploads/285022db-a31d-4333-8f9d-08c7ce0263fb.png" 
                alt="Nesrine Golden Hands" 
                className="h-10 w-10 sm:h-12 sm:w-12"
              />
              <div className="ml-3">
                <h3 className="text-lg sm:text-xl font-bold gold-text">Nesrine</h3>
                <p className="text-sm text-gold-400">Golden Hands</p>
              </div>
            </div>
            <p className="text-gold-200 leading-relaxed max-w-md mx-auto sm:mx-0 text-sm sm:text-base">
              {t('footer_description')}
            </p>
            <div className="flex justify-center sm:justify-start space-x-4 mt-4 sm:mt-6">
              <a href="https://www.facebook.com/profile.php?id=100064048024708" target="_blank" rel="noopener noreferrer" className="text-gold-400 hover:text-gold-300 transition-colors duration-300 touch-target">
                <Facebook className="h-5 w-5 sm:h-6 sm:w-6" />
              </a>
              <a href="https://www.instagram.com/nesrine._goldenhands?igsh=MXFwcnVrY3d3NTI0cg==" target="_blank" rel="noopener noreferrer" className="text-gold-400 hover:text-gold-300 transition-colors duration-300 touch-target">
                <Instagram className="h-5 w-5 sm:h-6 sm:w-6" />
              </a>
              <a href="https://www.tiktok.com/@nesrine.golden.hands?_t=ZN-8xEcJ6bwtyo&_r=1" target="_blank" rel="noopener noreferrer" className="text-gold-400 hover:text-gold-300 transition-colors duration-300 touch-target">
                <Video className="h-5 w-5 sm:h-6 sm:w-6" />
              </a>
            </div>
          </div>

          {/* Liens rapides */}
          <div className="text-center sm:text-left">
            <h4 className="text-base sm:text-lg font-semibold gold-text mb-3 sm:mb-4">{t('quick_links')}</h4>
            <ul className="space-y-2">
              <li><a href="#accueil" className="text-gold-300 hover:text-gold-200 transition-colors duration-300 text-sm sm:text-base touch-target block py-1">{t('home')}</a></li>
              <li><a href="#sacs" className="text-gold-300 hover:text-gold-200 transition-colors duration-300 text-sm sm:text-base touch-target block py-1">{t('bags')}</a></li>
              <li><a href="#bijoux" className="text-gold-300 hover:text-gold-200 transition-colors duration-300 text-sm sm:text-base touch-target block py-1">{t('jewelry')}</a></li>
              <li><a href="#contact" className="text-gold-300 hover:text-gold-200 transition-colors duration-300 text-sm sm:text-base touch-target block py-1">{t('contact')}</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div id="contact" className="text-center sm:text-left">
            <h4 className="text-base sm:text-lg font-semibold gold-text mb-3 sm:mb-4">{t('contact')}</h4>
            <ul className="space-y-3">
              <li className="flex items-center justify-center sm:justify-start text-gold-300 text-sm sm:text-base">
                <Mail className="h-4 w-4 mr-2 sm:mr-3 flex-shrink-0" />
                <span className="break-all">goldenladytlm@gmail.com</span>
              </li>
              <li className="flex items-center justify-center sm:justify-start text-gold-300 text-sm sm:text-base">
                <Phone className="h-4 w-4 mr-2 sm:mr-3 flex-shrink-0" />
                <span>0560128042</span>
              </li>
              <li className="flex items-center justify-center sm:justify-start text-gold-300 text-sm sm:text-base">
                <MapPin className="h-4 w-4 mr-2 sm:mr-3 flex-shrink-0" />
                <span>{t('location')}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Ligne de séparation */}
        <div className="border-t border-gold-500/20 pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-gold-400 text-xs sm:text-sm text-center sm:text-left">
              {t('copyright')}
            </p>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6">
              <a href="#" className="text-gold-400 hover:text-gold-300 text-xs sm:text-sm transition-colors duration-300 text-center touch-target">
                {t('privacy_policy')}
              </a>
              <a href="#" className="text-gold-400 hover:text-gold-300 text-xs sm:text-sm transition-colors duration-300 text-center touch-target">
                {t('terms_of_use')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
