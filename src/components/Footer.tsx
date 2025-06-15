
import { Facebook, Instagram, Mail, Phone, MapPin, Video } from "lucide-react";
import { useApp } from "@/contexts/AppContext";

const Footer = () => {
  const { t } = useApp();

  return (
    <footer className="bg-gradient-to-t from-black to-gray-900 border-t border-gold-500/20 pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Logo et description */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <img 
                src="/lovable-uploads/285022db-a31d-4333-8f9d-08c7ce0263fb.png" 
                alt="Nesrine Golden Hands" 
                className="h-12 w-12"
              />
              <div className="ml-3">
                <h3 className="text-xl font-bold gold-text">Nesrine</h3>
                <p className="text-sm text-gold-400">Golden Hands</p>
              </div>
            </div>
            <p className="text-gold-200 leading-relaxed max-w-md">
              {t('footer_description')}
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="https://www.facebook.com/profile.php?id=100064048024708" target="_blank" rel="noopener noreferrer" className="text-gold-400 hover:text-gold-300 transition-colors duration-300">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="https://www.instagram.com/nesrine._goldenhands?igsh=MXFwcnVrY3d3NTI0cg==" target="_blank" rel="noopener noreferrer" className="text-gold-400 hover:text-gold-300 transition-colors duration-300">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="https://www.tiktok.com/@nesrine.golden.hands?_t=ZN-8xEcJ6bwtyo&_r=1" target="_blank" rel="noopener noreferrer" className="text-gold-400 hover:text-gold-300 transition-colors duration-300">
                <Video className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Liens rapides */}
          <div>
            <h4 className="text-lg font-semibold gold-text mb-4">{t('quick_links')}</h4>
            <ul className="space-y-2">
              <li><a href="#accueil" className="text-gold-300 hover:text-gold-200 transition-colors duration-300">{t('home')}</a></li>
              <li><a href="#sacs" className="text-gold-300 hover:text-gold-200 transition-colors duration-300">{t('bags')}</a></li>
              <li><a href="#bijoux" className="text-gold-300 hover:text-gold-200 transition-colors duration-300">{t('jewelry')}</a></li>
              <li><a href="#contact" className="text-gold-300 hover:text-gold-200 transition-colors duration-300">{t('contact')}</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div id="contact">
            <h4 className="text-lg font-semibold gold-text mb-4">{t('contact')}</h4>
            <ul className="space-y-3">
              <li className="flex items-center text-gold-300">
                <Mail className="h-4 w-4 mr-3" />
                <span>goldenladytlm@gmail.com</span>
              </li>
              <li className="flex items-center text-gold-300">
                <Phone className="h-4 w-4 mr-3" />
                <span>0560128042</span>
              </li>
              <li className="flex items-center text-gold-300">
                <MapPin className="h-4 w-4 mr-3" />
                <span>{t('location')}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Ligne de séparation */}
        <div className="border-t border-gold-500/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gold-400 text-sm">
              {t('copyright')}
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gold-400 hover:text-gold-300 text-sm transition-colors duration-300">
                {t('privacy_policy')}
              </a>
              <a href="#" className="text-gold-400 hover:text-gold-300 text-sm transition-colors duration-300">
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

