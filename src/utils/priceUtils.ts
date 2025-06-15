
export const convertToDinars = (priceString: string): number => {
  if (!priceString || typeof priceString !== 'string') {
    console.error('Invalid price string:', priceString);
    return 0;
  }
  
  // Extraire le nombre du string de prix (ex: "89€" -> 89)
  const numericValue = parseFloat(priceString.replace(/[^\d.]/g, ''));
  
  if (isNaN(numericValue)) {
    console.error('Could not parse price:', priceString);
    return 0;
  }
  
  // Conversion approximative Euro vers Dinar Algérien (1€ ≈ 145 DA)
  return Math.round(numericValue * 145);
};

export const formatPrice = (price: number): string => {
  if (typeof price !== 'number' || isNaN(price)) {
    console.error('Invalid price number:', price);
    return '0 DA';
  }
  return `${price.toLocaleString()} DA`;
};
