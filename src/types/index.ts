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

export interface Dimensions {
  width: number;
  height: number;
  depth: number;
}

export interface BaseProduct {
  id: string;
  title: string;
  category: ProductCategory;
  value: number; 
  price: number; 
  discount?: number; 
  barcode: string;
  description: string; 
  quantity: number;
  warehouseEntryDate: string;
  dimensions: Dimensions;
  weight: number;
}


export interface BookProduct extends BaseProduct {
  category: ProductCategory.BOOK;
  authors: string[];
  coverType: CoverType;
  publisher: string;
  publicationDate: string;
  pages?: number;
  language?: string;
  genre?: string;
}

export interface CDProduct extends BaseProduct {
  category: ProductCategory.CD;
  artists: string[];
  recordLabel: string;
  tracklist: string[];
  genre: string;
  releaseDate?: string;
}

export interface LPProduct extends BaseProduct {
  category: ProductCategory.LP;
  artists: string[];
  recordLabel: string;
  tracklist: string[];
  genre: string;
  releaseDate?: string;
}

export interface DVDProduct extends BaseProduct {
  category: ProductCategory.DVD;
  discType: DiscType;
  director: string;
  runtime: number; 
  studio: string;
  language: string[];
  subtitles: string[];
  releaseDate?: string;
  genre?: string;
}

export type Product = BookProduct | CDProduct | LPProduct | DVDProduct;

export interface User {
  id: string;
  username: string;
  email: string;
  roles: UserRole[];
  isBlocked: boolean;
}

export interface UserAccount {
  id: string;
  userId: string;
  username: string;
  email: string;
  password: string; 
  roles: UserRole[];
  isBlocked: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  totalPriceExcludingVAT: number;
}

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

export interface OrderItem {
  product: Product;
  quantity: number;
  price: number; 
}

export interface Order {
  id: string;
  items: OrderItem[];
  deliveryInfo: DeliveryInfo;
  status: OrderStatus;
  subtotal: number; 
  vat: number; 
  deliveryFee: number;
  totalAmount: number; 
  transactionId?: string;
  transactionContent?: string;
  transactionDatetime?: string;
  createdAt: string;
}