
import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'fr' | 'en' | 'ar';
type Theme = 'dark' | 'light';

interface AppContextType {
  language: Language;
  theme: Theme;
  setLanguage: (lang: Language) => void;
  setTheme: (theme: Theme) => void;
  t: (key: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const translations = {
  fr: {
    home: 'Accueil',
    bags: 'Sacs à Main',
    jewelry: 'Bijoux',
    contact: 'Contact',
    hero_title: 'Nesrine Golden Hands',
    hero_subtitle: 'Créations Artisanales d\'Exception',
    hero_description: 'Découvrez notre collection unique de sacs à main et bijoux, créés avec passion et savoir-faire traditionnel.',
    bags_title: 'Collection Sacs à Main',
    bags_subtitle: 'Découvrez nos sacs à main uniques, alliant style et fonctionnalité pour toutes les occasions.',
    jewelry_title: 'Collection Bijoux',
    jewelry_subtitle: 'Sublimez votre beauté avec nos bijoux artisanaux, créés avec passion et savoir-faire.',
    add_to_cart: 'Ajouter au Panier',
    handmade: 'Fait Main',
    premium_leather: 'Cuir Premium',
    evening: 'Soirée',
    vintage: 'Vintage',
    language: 'Langue',
    theme: 'Thème',
    dark_theme: 'Sombre',
    light_theme: 'Clair'
  },
  en: {
    home: 'Home',
    bags: 'Handbags',
    jewelry: 'Jewelry',
    contact: 'Contact',
    hero_title: 'Nesrine Golden Hands',
    hero_subtitle: 'Exceptional Handcrafted Creations',
    hero_description: 'Discover our unique collection of handbags and jewelry, created with passion and traditional craftsmanship.',
    bags_title: 'Handbags Collection',
    bags_subtitle: 'Discover our unique handbags, combining style and functionality for all occasions.',
    jewelry_title: 'Jewelry Collection',
    jewelry_subtitle: 'Enhance your beauty with our handcrafted jewelry, created with passion and expertise.',
    add_to_cart: 'Add to Cart',
    handmade: 'Handmade',
    premium_leather: 'Premium Leather',
    evening: 'Evening',
    vintage: 'Vintage',
    language: 'Language',
    theme: 'Theme',
    dark_theme: 'Dark',
    light_theme: 'Light'
  },
  ar: {
    home: 'الرئيسية',
    bags: 'الحقائب',
    jewelry: 'المجوهرات',
    contact: 'اتصل بنا',
    hero_title: 'نسرين الأيادي الذهبية',
    hero_subtitle: 'إبداعات يدوية استثنائية',
    hero_description: 'اكتشف مجموعتنا الفريدة من الحقائب والمجوهرات، المصنوعة بشغف وحرفية تقليدية.',
    bags_title: 'مجموعة الحقائب',
    bags_subtitle: 'اكتشف حقائبنا الفريدة، التي تجمع بين الأناقة والوظائف العملية لجميع المناسبات.',
    jewelry_title: 'مجموعة المجوهرات',
    jewelry_subtitle: 'أبرز جمالك مع مجوهراتنا المصنوعة يدوياً، والمصممة بشغف وخبرة.',
    add_to_cart: 'أضف إلى السلة',
    handmade: 'صناعة يدوية',
    premium_leather: 'جلد فاخر',
    evening: 'سهرة',
    vintage: 'كلاسيكي',
    language: 'اللغة',
    theme: 'المظهر',
    dark_theme: 'داكن',
    light_theme: 'فاتح'
  }
};

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>('fr');
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    const savedTheme = localStorage.getItem('theme') as Theme;
    
    if (savedLanguage) setLanguage(savedLanguage);
    if (savedTheme) setTheme(savedTheme);
  }, []);

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
  }, [language]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <AppContext.Provider value={{ language, theme, setLanguage, setTheme, t }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
