
export const convertToDinars = (priceString: string): number => {
  // Extraire le nombre du string de prix (ex: "89€" -> 89)
  const numericValue = parseFloat(priceString.replace(/[^\d.]/g, ''));
  // Conversion approximative Euro vers Dinar Algérien (1€ ≈ 145 DA)
  return Math.round(numericValue * 145);
};

export const formatPrice = (price: number): string => {
  return `${price.toLocaleString()} DA`;
};
