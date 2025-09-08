import { Product } from "./product";

export interface StockProduct extends Product {
  stock_quantity: number;
  low_stock_threshold: number;
  is_out_of_stock: boolean;
}

export interface Promotion {
  id: string;
  title: string;
  description?: string;
  discount_percentage: number;
  start_date: string;
  end_date: string;
  category?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DeliveryRate {
  id: string;
  wilaya: string;
  home_price: number;
  office_price?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}