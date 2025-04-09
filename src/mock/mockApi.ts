import { Product, User, Order, ProductCategory } from '../types';
import { mockProducts, mockUsers, mockOrders } from './mockData';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApiService = {
  // Product API
  getProducts: async (): Promise<Product[]> => {
    await delay(500);
    return [...mockProducts];
  },
  
  getProductById: async (id: string): Promise<Product | undefined> => {
    await delay(300);
    return mockProducts.find(product => product.id === id);
  },
  
  getProductsByCategory: async (category: ProductCategory): Promise<Product[]> => {
    await delay(500);
    return mockProducts.filter(product => product.category === category);
  },
  
  searchProducts: async (query: string): Promise<Product[]> => {
    await delay(700);
    const lowercaseQuery = query.toLowerCase();
    return mockProducts.filter(product => 
      product.title.toLowerCase().includes(lowercaseQuery) ||
      (('authors' in product) && product.authors.some(author => 
        author.toLowerCase().includes(lowercaseQuery))) ||
      (('artists' in product) && product.artists.some(artist => 
        artist.toLowerCase().includes(lowercaseQuery))) ||
      (('director' in product) && product.director.toLowerCase().includes(lowercaseQuery))
    );
  },
  
  // User API
  getUsers: async (): Promise<User[]> => {
    await delay(500);
    return [...mockUsers];
  },
  
  getUserById: async (id: string): Promise<User | undefined> => {
    await delay(300);
    return mockUsers.find(user => user.id === id);
  },
  
  // Order API
  getOrders: async (): Promise<Order[]> => {
    await delay(500);
    return [...mockOrders];
  },
  
  getOrderById: async (id: string): Promise<Order | undefined> => {
    await delay(300);
    return mockOrders.find(order => order.id === id);
  },
  
  // This simulates the VNPay integration for payment processing
  processPayment: async (amount: number): Promise<{
    success: boolean;
    transactionId: string;
    transactionDatetime: string;
  }> => {
    await delay(1500);
    // Simulate successful payment 90% of the time
    const success = Math.random() < 0.9;
    
    if (success) {
      return {
        success: true,
        transactionId: `VNP${Date.now()}`,
        transactionDatetime: new Date().toISOString()
      };
    } else {
      throw new Error('Payment failed. Please try again.');
    }
  }
};