import React, { createContext, useContext, useState, useEffect } from 'react';
import { Order } from '@/types/order';

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'status'>) => void;
  updateOrderStatus: (orderId: string, status: 'confirmed' | 'cancelled') => void;
  getOrderStats: () => {
    totalOrders: number;
    confirmedOrders: number;
    cancelledOrders: number;
    topWilayas: { wilaya: string; count: number }[];
    topCustomers: { name: string; phone: string; orders: number }[];
  };
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: React.ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  // Load orders from localStorage
  useEffect(() => {
    try {
      const savedOrders = localStorage.getItem('orders');
      console.log('OrderContext - Loading orders from localStorage:', savedOrders);
      if (savedOrders) {
        const parsedOrders = JSON.parse(savedOrders);
        // Convert date strings (or objects) back to Date objects
        const ordersWithDates = parsedOrders.map((order: any) => ({
          ...order,
          createdAt:
            typeof order.createdAt === 'string'
              ? new Date(order.createdAt)
              : order.createdAt && typeof order.createdAt.value?.iso === 'string'
                ? new Date(order.createdAt.value.iso)
                : new Date(),
        }));
        console.log('OrderContext - Parsed orders with dates:', ordersWithDates);
        setOrders(ordersWithDates);
      } else {
        console.log('OrderContext - No saved orders found in localStorage');
      }
    } catch (error) {
      console.error('OrderContext - Error loading orders from localStorage:', error);
    }
  }, []);

  // Save orders to localStorage, always serialize Date as ISO string
  useEffect(() => {
    try {
      console.log('OrderContext - Saving orders to localStorage:', orders.length, 'orders');
      const serializableOrders = orders.map(order => ({
        ...order,
        createdAt: order.createdAt instanceof Date
          ? order.createdAt.toISOString()
          : order.createdAt, // fallback
      }));
      localStorage.setItem('orders', JSON.stringify(serializableOrders));
    } catch (error) {
      console.error('OrderContext - Error saving orders to localStorage:', error);
    }
  }, [orders]);

  const addOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'status'>) => {
    const newOrder: Order = {
      ...orderData,
      id: Date.now().toString(),
      orderNumber: `CMD-${Date.now()}`,
      status: 'pending', // <--- CORRECTIF: le statut par défaut est maintenant 'pending'
      createdAt: new Date()
    };
    
    console.log('OrderContext - Adding new order with pending status:', newOrder);
    console.log('OrderContext - Order items:', newOrder.items);
    console.log('OrderContext - Customer info:', newOrder.customerInfo);
    
    setOrders(prev => {
      const newOrders = [newOrder, ...prev];
      console.log('OrderContext - Updated orders list length:', newOrders.length);
      console.log('OrderContext - All orders:', newOrders);
      return newOrders;
    });
  };

  const updateOrderStatus = (orderId: string, status: 'confirmed' | 'cancelled') => {
    console.log('OrderContext - Updating order status:', orderId, status);
    setOrders(prev => 
      prev.map(order => 
        order.id === orderId ? { ...order, status } : order
      )
    );
  };

  const getOrderStats = () => {
    const confirmedOrders = orders.filter(order => order.status === 'confirmed').length;
    const cancelledOrders = orders.filter(order => order.status === 'cancelled').length;

    // Top wilayas
    const wilayaCount: { [key: string]: number } = {};
    orders.forEach(order => {
      if (order.status === 'confirmed') {
        wilayaCount[order.customerInfo.wilaya] = (wilayaCount[order.customerInfo.wilaya] || 0) + 1;
      }
    });
    
    const topWilayas = Object.entries(wilayaCount)
      .map(([wilaya, count]) => ({ wilaya, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Top customers
    const customerCount: { [key: string]: { name: string; phone: string; orders: number } } = {};
    orders.forEach(order => {
      if (order.status === 'confirmed') {
        const key = order.customerInfo.phone;
        if (customerCount[key]) {
          customerCount[key].orders++;
        } else {
          customerCount[key] = {
            name: `${order.customerInfo.firstName} ${order.customerInfo.lastName}`,
            phone: order.customerInfo.phone,
            orders: 1
          };
        }
      }
    });

    const topCustomers = Object.values(customerCount)
      .sort((a, b) => b.orders - a.orders)
      .slice(0, 5);

    return {
      totalOrders: orders.length,
      confirmedOrders,
      cancelledOrders,
      topWilayas,
      topCustomers
    };
  };

  return (
    <OrderContext.Provider value={{
      orders,
      addOrder,
      updateOrderStatus,
      getOrderStats
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within OrderProvider');
  }
  return context;
};
