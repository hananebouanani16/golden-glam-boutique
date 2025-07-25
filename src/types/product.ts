
export interface Product {
  id: string;
  title: string;
  price: string;
  originalPrice?: string;
  category: string;
  image: string;
  deleted_at?: string | null;
}
