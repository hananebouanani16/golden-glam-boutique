
// Utilitaires de sécurité pour la validation des données

export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Supprimer les balises HTML basiques
    .replace(/javascript:/gi, '') // Supprimer les tentatives d'injection JS
    .replace(/on\w+=/gi, '') // Supprimer les gestionnaires d'événements
    .slice(0, 1000); // Limiter la longueur maximale
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email) && email.length <= 254 && email.length >= 5;
};

export const validatePhone = (phone: string): boolean => {
  // Format algérien: commence par 0, suivi de 5, 6, 7 puis 8 chiffres
  const phoneRegex = /^0[5-7][0-9]{8}$/;
  return phoneRegex.test(phone.replace(/[\s\-()]/g, ''));
};

export const validateName = (name: string): boolean => {
  // Accepter lettres, espaces, tirets et apostrophes (incluant caractères arabes et français)
  const nameRegex = /^[\u0600-\u06FFa-zA-ZÀ-ÿ\s\-']{2,100}$/;
  return nameRegex.test(name);
};

export const validateAddress = (address: string): boolean => {
  return address.length >= 10 && address.length <= 500;
};

export const validateWilaya = (wilaya: string): boolean => {
  const validWilayas = [
    "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Béjaïa", 
    "Biskra", "Béchar", "Blida", "Bouira", "Tamanrasset", "Tébessa", 
    "Tlemcen", "Tiaret", "Tizi Ouzou", "Alger", "Djelfa", "Jijel", 
    "Sétif", "Saïda", "Skikda", "Sidi Bel Abbès", "Annaba", "Guelma", 
    "Constantine", "Médéa", "Mostaganem", "M'Sila", "Mascara", "Ouargla", 
    "Oran", "El Bayadh", "Illizi", "Bordj Bou Arréridj", "Boumerdès", 
    "El Tarf", "Tindouf", "Tissemsilt", "El Oued", "Khenchela", 
    "Souk Ahras", "Tipaza", "Mila", "Aïn Defla", "Naâma", "Aïn Témouchent", 
    "Ghardaïa", "Relizane"
  ];
  return validWilayas.includes(wilaya);
};

export const validatePrice = (price: number): boolean => {
  return !isNaN(price) && price >= 0 && price <= 10000000; // Max 10M DA
};

export const validateQuantity = (quantity: number): boolean => {
  return Number.isInteger(quantity) && quantity >= 0 && quantity <= 10000;
};

// Validation des données de commande
export const validateOrderData = (orderData: any): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!validateName(orderData.firstName)) {
    errors.push("Prénom invalide");
  }

  if (!validateName(orderData.lastName)) {
    errors.push("Nom invalide");
  }

  if (!validateEmail(orderData.email)) {
    errors.push("Email invalide");
  }

  if (!validatePhone(orderData.phone)) {
    errors.push("Numéro de téléphone invalide (format: 05XXXXXXXX)");
  }

  if (!validateAddress(orderData.address)) {
    errors.push("Adresse invalide (minimum 10 caractères)");
  }

  if (!validateWilaya(orderData.wilaya)) {
    errors.push("Wilaya invalide");
  }

  return {
    valid: errors.length === 0,
    errors
  };
};
