
export interface OrderItem {
  id: string;
  title: string;
  price: string;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerInfo: {
    firstName: string;
    lastName: string;
    phone: string;
    wilaya: string;
    deliveryType: 'home' | 'office';
    address?: string;
  };
  items: OrderItem[];
  totalProducts: number;
  deliveryFee: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: Date;
}
