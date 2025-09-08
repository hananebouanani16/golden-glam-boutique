
export interface Product {
  id: string;
  title: string;
  price: string;
  originalPrice?: string;
  category: string;
  image: string;
  deleted_at?: string | null;
  stock_quantity?: number;
  low_stock_threshold?: number;
  is_out_of_stock?: boolean;
}
