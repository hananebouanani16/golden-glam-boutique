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
    hero_description: 'Découvrez notre collection exclusive de sacs à main et bijoux artisanaux, créés avec passion et raffinement pour sublimer votre élégance.',
    discover_bags: 'Découvrir les Sacs',
    explore_jewelry: 'Explorer les Bijoux',
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
    light_theme: 'Clair',
    footer_description: 'Nesrine Golden Hands vous propose une collection unique de sacs à main et bijoux artisanaux, créés avec passion pour sublimer votre style et votre élégance au quotidien.',
    quick_links: 'Liens Rapides',
    location: 'Tlemcen, Algérie',
    copyright: '© 2024 Nesrine Golden Hands. Tous droits réservés.',
    privacy_policy: 'Politique de Confidentialité',
    terms_of_use: 'Conditions d\'Utilisation',
    // Wishlist
    wishlist_title: 'Liste de souhaits',
    wishlist_items: 'articles',
    wishlist_description: 'Vos articles favoris sauvegardés',
    wishlist_empty: 'Votre liste de souhaits est vide',
    remove: 'Supprimer',
    close: 'Fermer',
    // Cart
    cart_title: 'Panier',
    cart_description: 'Gérez vos articles avant de finaliser votre commande',
    cart_empty: 'Votre panier est vide',
    total: 'Total',
    continue_shopping: 'Continuer les achats',
    buy_now: 'Acheter maintenant',
    checkout_title: 'Finaliser la Commande',
    // Checkout
    error_fill_fields: 'Veuillez remplir tous les champs obligatoires',
    error_address_required: "L'adresse est obligatoire pour la livraison à domicile",
    order_success: 'Commande enregistrée avec succès!',
    order_number: 'Numéro de commande:',
    cancel: 'Annuler',
    confirm_order: 'Confirmer la Commande',
    // Order Confirmation
    order_confirmed_title: 'Commande Confirmée !',
    order_confirmed_subtitle: 'Merci pour votre commande',
    order_details: 'Détails de la commande',
    delivery_info: 'Informations de livraison',
    home_delivery: 'Livraison à domicile',
    pickup_point: 'Point de retrait',
    next_steps: 'Prochaines étapes',
    next_steps_line1: '• Nous vous contacterons dans les 24h pour confirmer votre commande',
    next_steps_line2: '• Préparation et expédition sous 2-3 jours ouvrables',
    next_steps_line3: '• Paiement à la livraison',
    back_to_home: "Retour à l'accueil",
    // Filters
    filters: 'Filtres',
    clear_filters: 'Effacer les filtres',
    category: 'Catégorie',
    price: 'Prix',
    all_categories: 'Toutes les catégories',
    price_range: 'Gamme de prix',
    all_prices: 'Tous les prix',
    price_range_1: '0 - 5,000 DA',
    price_range_2: '5,000 - 10,000 DA',
    price_range_3: '10,000 - 20,000 DA',
    price_range_4: '20,000+ DA',
    // Product Grid
    no_products_found: 'Aucun produit ne correspond à vos critères',
    try_other_filters: 'Essayez de modifier vos filtres',
    // Ratings
    reviews: 'avis',
    rate_product: 'Noter ce produit',
    evaluate_product: 'Évaluer',
    your_rating: 'Votre note :',
    comment_optional: 'Commentaire (optionnel) :',
    comment_placeholder: 'Partagez votre expérience avec ce produit...',
    submit_rating: "Envoyer l'évaluation",
    view_reviews: 'Voir les avis',
    customer_reviews: 'Avis clients',
    rating_success: 'Votre évaluation a été enregistrée !',
    rating_error_select: 'Veuillez sélectionner une note',
    // Search
    search_products: 'Rechercher des produits',
    search_placeholder: 'Rechercher par nom ou catégorie...',
    search_results_found: 'résultat(s) trouvé(s)',
    search_no_products: 'Aucun produit trouvé',
    search_try_other_keywords: "Essayez avec d'autres mots-clés"
  },
  en: {
    home: 'Home',
    bags: 'Handbags',
    jewelry: 'Jewelry',
    contact: 'Contact',
    hero_title: 'Nesrine Golden Hands',
    hero_subtitle: 'Exceptional Handcrafted Creations',
    hero_description: 'Discover our exclusive collection of handcrafted handbags and jewelry, created with passion and refinement to enhance your elegance.',
    discover_bags: 'Discover Bags',
    explore_jewelry: 'Explore Jewelry',
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
    light_theme: 'Light',
    footer_description: 'Nesrine Golden Hands offers you a unique collection of handcrafted handbags and jewelry, created with passion to enhance your style and elegance in everyday life.',
    quick_links: 'Quick Links',
    location: 'Tlemcen, Algeria',
    copyright: '© 2024 Nesrine Golden Hands. All rights reserved.',
    privacy_policy: 'Privacy Policy',
    terms_of_use: 'Terms of Use',
    // Wishlist
    wishlist_title: 'Wishlist',
    wishlist_items: 'items',
    wishlist_description: 'Your saved favorite items',
    wishlist_empty: 'Your wishlist is empty',
    remove: 'Remove',
    close: 'Close',
    // Cart
    cart_title: 'Cart',
    cart_description: 'Manage your items before finalizing your order',
    cart_empty: 'Your cart is empty',
    total: 'Total',
    continue_shopping: 'Continue shopping',
    buy_now: 'Buy now',
    checkout_title: 'Finalize Order',
    // Checkout
    error_fill_fields: 'Please fill in all required fields',
    error_address_required: 'Address is required for home delivery',
    order_success: 'Order placed successfully!',
    order_number: 'Order number:',
    cancel: 'Cancel',
    confirm_order: 'Confirm Order',
    // Order Confirmation
    order_confirmed_title: 'Order Confirmed!',
    order_confirmed_subtitle: 'Thank you for your order',
    order_details: 'Order Details',
    delivery_info: 'Delivery Information',
    home_delivery: 'Home delivery',
    pickup_point: 'Pickup point',
    next_steps: 'Next steps',
    next_steps_line1: '• We will contact you within 24h to confirm your order',
    next_steps_line2: '• Preparation and shipping within 2-3 business days',
    next_steps_line3: '• Payment on delivery',
    back_to_home: 'Back to home',
    // Filters
    filters: 'Filters',
    clear_filters: 'Clear filters',
    category: 'Category',
    price: 'Price',
    all_categories: 'All categories',
    price_range: 'Price range',
    all_prices: 'All prices',
    price_range_1: '0 - 5,000 DA',
    price_range_2: '5,000 - 10,000 DA',
    price_range_3: '10,000 - 20,000 DA',
    price_range_4: '20,000+ DA',
    // Product Grid
    no_products_found: 'No products match your criteria',
    try_other_filters: 'Try changing your filters',
    // Ratings
    reviews: 'reviews',
    rate_product: 'Rate this product',
    evaluate_product: 'Evaluate',
    your_rating: 'Your rating:',
    comment_optional: 'Comment (optional):',
    comment_placeholder: 'Share your experience with this product...',
    submit_rating: 'Submit rating',
    view_reviews: 'View reviews',
    customer_reviews: 'Customer reviews',
    rating_success: 'Your rating has been saved!',
    rating_error_select: 'Please select a rating',
    // Search
    search_products: 'Search products',
    search_placeholder: 'Search by name or category...',
    search_results_found: 'result(s) found',
    search_no_products: 'No products found',
    search_try_other_keywords: 'Try other keywords'
  },
  ar: {
    home: 'الرئيسية',
    bags: 'الحقائب',
    jewelry: 'المجوهرات',
    contact: 'اتصل بنا',
    hero_title: 'نسرين الأيادي الذهبية',
    hero_subtitle: 'إبداعات يدوية استثنائية',
    hero_description: 'اكتشف مجموعتنا الحصرية من الحقائب والمجوهرات المصنوعة يدوياً، والمصممة بشغف وتطور لتعزيز أناقتك.',
    discover_bags: 'اكتشف الحقائب',
    explore_jewelry: 'استكشف المجوهرات',
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
    light_theme: 'فاتح',
    footer_description: 'نسرين الأيادي الذهبية تقدم لك مجموعة فريدة من الحقائب والمجوهرات المصنوعة يدوياً، والمصممة بشغف لتعزيز أناقتك وجمالك في الحياة اليومية.',
    quick_links: 'روابط سريعة',
    location: 'تلمسان، الجزائر',
    copyright: '© 2024 نسرين الأيادي الذهبية. جميع الحقوق محفوظة.',
    privacy_policy: 'سياسة الخصوصية',
    terms_of_use: 'شروط الاستخدام',
    // Wishlist
    wishlist_title: 'قائمة الرغبات',
    wishlist_items: 'عناصر',
    wishlist_description: 'العناصر المفضلة المحفوظة',
    wishlist_empty: 'قائمة رغباتك فارغة',
    remove: 'إزالة',
    close: 'إغلاق',
    // Cart
    cart_title: 'السلة',
    cart_description: 'إدارة العناصر الخاصة بك قبل إنهاء طلبك',
    cart_empty: 'سلتك فارغة',
    total: 'المجموع',
    continue_shopping: 'متابعة التسوق',
    buy_now: 'شراء الآن',
    checkout_title: 'إنهاء الطلب',
    // Checkout
    error_fill_fields: 'يرجى ملء جميع الحقول المطلوبة',
    error_address_required: 'العنوان مطلوب للتوصيل للمنزل',
    order_success: 'تم تسجيل الطلب بنجاح!',
    order_number: 'رقم الطلب:',
    cancel: 'إلغاء',
    confirm_order: 'تأكيد الطلب',
    // Order Confirmation
    order_confirmed_title: 'تم تأكيد الطلب!',
    order_confirmed_subtitle: 'شكرا لطلبك',
    order_details: 'تفاصيل الطلب',
    delivery_info: 'معلومات التوصيل',
    home_delivery: 'توصيل للمنزل',
    pickup_point: 'نقطة استلام',
    next_steps: 'الخطوات التالية',
    next_steps_line1: '• سنتصل بك في غضون 24 ساعة لتأكيد طلبك',
    next_steps_line2: '• التحضير والشحن في غضون 2-3 أيام عمل',
    next_steps_line3: '• الدفع عند الاستلام',
    back_to_home: 'العودة إلى الرئيسية',
    // Filters
    filters: 'الفلاتر',
    clear_filters: 'مسح الفلاتر',
    category: 'الفئة',
    price: 'السعر',
    all_categories: 'جميع الفئات',
    price_range: 'نطاق السعر',
    all_prices: 'كل الأسعار',
    price_range_1: '0 - 5,000 د.ج',
    price_range_2: '5,000 - 10,000 د.ج',
    price_range_3: '10,000 - 20,000 د.ج',
    price_range_4: '20,000+ د.ج',
    // Product Grid
    no_products_found: 'لم يتم العثور على منتجات تطابق معاييرك',
    try_other_filters: 'حاول تغيير فلاترك',
    // Ratings
    reviews: 'تقييمات',
    rate_product: 'تقييم هذا المنتج',
    evaluate_product: 'تقييم',
    your_rating: 'تقييمك:',
    comment_optional: 'تعليق (اختياري):',
    comment_placeholder: 'شارك تجربتك مع هذا المنتج...',
    submit_rating: 'إرسال التقييم',
    view_reviews: 'عرض التقييمات',
    customer_reviews: 'تقييمات العملاء',
    rating_success: 'تم حفظ تقييمك بنجاح!',
    rating_error_select: 'يرجى تحديد تقييم',
    // Search
    search_products: 'البحث عن منتجات',
    search_placeholder: 'البحث بالاسم أو الفئة...',
    search_results_found: 'نتيجة (نتائج) معثور عليها',
    search_no_products: 'لم يتم العثور على منتجات',
    search_try_other_keywords: 'جرب كلمات رئيسية أخرى'
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
