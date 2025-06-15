
export interface ProductRating {
  productId: string;
  userId: string;
  rating: number;
  comment?: string;
  date: string;
}

export const saveRating = (productId: string, rating: number, comment?: string): void => {
  const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const newRating: ProductRating = {
    productId,
    userId,
    rating,
    comment,
    date: new Date().toISOString()
  };

  const existingRatings = getRatings(productId);
  const updatedRatings = [...existingRatings, newRating];
  
  localStorage.setItem(`ratings_${productId}`, JSON.stringify(updatedRatings));
};

export const getRatings = (productId: string): ProductRating[] => {
  const ratings = localStorage.getItem(`ratings_${productId}`);
  return ratings ? JSON.parse(ratings) : [];
};

export const getAverageRating = (productId: string): number => {
  const ratings = getRatings(productId);
  if (ratings.length === 0) return 4.0 + Math.random(); // Valeur par défaut pour les produits sans évaluation
  
  const sum = ratings.reduce((acc, rating) => acc + rating.rating, 0);
  return sum / ratings.length;
};

export const getRatingCount = (productId: string): number => {
  return getRatings(productId).length;
};
