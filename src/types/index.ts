// src/types/index.ts

// Enums
export enum ProductCategory {
  BOOK = 'BOOK',
  CD = 'CD',
  LP = 'LP',
  DVD = 'DVD'
}

export enum UserRole {
  ADMIN = 'ADMIN',
  PRODUCT_MANAGER = 'PRODUCT_MANAGER'
  // Note: Customer is not a role in the system as they don't need to log in
}

export enum OrderStatus {
  PENDING_PROCESSING = 'PENDING_PROCESSING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED'
}

export enum CoverType {
  PAPERBACK = 'PAPERBACK',
  HARDCOVER = 'HARDCOVER'
}

export enum DiscType {
  BLURAY = 'BLURAY',
  HDDVD = 'HDDVD'
}

// Base Product Type - contains attributes required for ALL products
export interface BaseProduct {
  id: string;
  title: string;
  category: ProductCategory;
  value: number; // Base value without VAT
  price: number; // Current price without VAT (30%-150% of value)
  discount?: number; 
  // Physical attributes (required for all products)
  barcode: string;
  description: string; // new, used, primary color, condition for return
  quantity: number;
  warehouseEntryDate: string;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  weight: number;
}

// Book-specific attributes
export interface BookProduct extends BaseProduct {
  category: ProductCategory.BOOK;
  authors: string[];
  coverType: CoverType;
  publisher: string;
  publicationDate: string;
  
  // Optional attributes
  pages?: number;
  language?: string;
  genre?: string;
}

// CD-specific attributes
export interface CDProduct extends BaseProduct {
  category: ProductCategory.CD;
  artists: string[];
  recordLabel: string;
  tracklist: string[];
  genre: string;
  
  // Optional attributes
  releaseDate?: string;
}

// LP Record-specific attributes (similar to CD)
export interface LPProduct extends BaseProduct {
  category: ProductCategory.LP;
  artists: string[];
  recordLabel: string;
  tracklist: string[];
  genre: string;
  
  // Optional attributes
  releaseDate?: string;
}

// DVD-specific attributes
export interface DVDProduct extends BaseProduct {
  category: ProductCategory.DVD;
  discType: DiscType;
  director: string;
  runtime: number; // in minutes
  studio: string;
  language: string[];
  subtitles: string[];
  
  // Optional attributes
  releaseDate?: string;
  genre?: string;
}

// Union type for all product types
export type Product = BookProduct | CDProduct | LPProduct | DVDProduct;

// User Type
export interface User {
  id: string;
  username: string;
  email: string;
  roles: UserRole[];
  isBlocked: boolean;
}

// Cart Item
export interface CartItem {
  product: Product;
  quantity: number;
}

// Cart
export interface Cart {
  items: CartItem[];
  totalPriceExcludingVAT: number;
}

// Delivery Information
export interface DeliveryInfo {
  recipientName: string;
  email: string;
  phone: string;
  province: string;
  address: string;
  isRushDelivery: boolean;
  rushDeliveryTime?: string;
  rushDeliveryInstructions?: string;
}

// Order Item
export interface OrderItem {
  product: Product;
  quantity: number;
  price: number; // Price at time of order
}

// Order
export interface Order {
  id: string;
  items: OrderItem[];
  deliveryInfo: DeliveryInfo;
  status: OrderStatus;
  
  // Financial details
  subtotal: number; // Total without VAT
  vat: number; // 10% of subtotal
  deliveryFee: number;
  totalAmount: number; // subtotal + vat + deliveryFee
  
  // Transaction details
  transactionId?: string;
  transactionContent?: string;
  transactionDatetime?: string;
  
  createdAt: string;
}