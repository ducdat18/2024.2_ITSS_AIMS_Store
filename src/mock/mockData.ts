// src/mocks/mockData.ts
import { 
  Product, ProductCategory, CoverType, DiscType, 
  User, UserRole, Order, OrderStatus
} from '../types';

// Mock Products
export const mockProducts: Product[] = [
  // Books
  {
    id: 'book-001',
    title: 'The Great Gatsby',
    category: ProductCategory.BOOK,
    value: 150000, // 150,000 VND
    price: 180000, // 180,000 VND
    barcode: '9780743273565',
    description: 'New, mint condition, eligible for return within 30 days',
    quantity: 25,
    warehouseEntryDate: '2024-10-15',
    dimensions: {
      width: 13,
      height: 21,
      depth: 1.5
    },
    weight: 0.3, // 0.3kg
    authors: ['F. Scott Fitzgerald'],
    coverType: CoverType.PAPERBACK,
    publisher: 'Scribner',
    publicationDate: '2004-09-30',
    pages: 180,
    language: 'English',
    genre: 'Classic Fiction'
  },
  {
    id: 'book-002',
    title: 'Đắc Nhân Tâm',
    category: ProductCategory.BOOK,
    value: 100000,
    price: 120000,
    barcode: '8935086838137',
    description: 'New, Vietnamese translation, hardcover',
    quantity: 50,
    warehouseEntryDate: '2024-11-01',
    dimensions: {
      width: 14.5,
      height: 20.5,
      depth: 2
    },
    weight: 0.5,
    authors: ['Dale Carnegie'],
    coverType: CoverType.HARDCOVER,
    publisher: 'First News',
    publicationDate: '2020-01-01',
    pages: 320,
    language: 'Vietnamese',
    genre: 'Self-help'
  },
  
  // CDs
  {
    id: 'cd-001',
    title: 'Thriller',
    category: ProductCategory.CD,
    value: 200000,
    price: 220000,
    barcode: '074643811224',
    description: 'New, sealed in original packaging',
    quantity: 15,
    warehouseEntryDate: '2024-09-20',
    dimensions: {
      width: 12.5,
      height: 12.5,
      depth: 1
    },
    weight: 0.1,
    artists: ['Michael Jackson'],
    recordLabel: 'Epic',
    tracklist: [
      'Wanna Be Startin\' Somethin\'',
      'Baby Be Mine',
      'The Girl Is Mine',
      'Thriller',
      'Beat It',
      'Billie Jean',
      'Human Nature',
      'P.Y.T. (Pretty Young Thing)',
      'The Lady in My Life'
    ],
    genre: 'Pop',
    releaseDate: '1982-11-30'
  },
  
  // LP Records
  {
    id: 'lp-001',
    title: 'Dark Side of the Moon',
    category: ProductCategory.LP,
    value: 500000,
    price: 600000,
    barcode: '5099902987613',
    description: 'New, 180g vinyl, gatefold sleeve',
    quantity: 10,
    warehouseEntryDate: '2024-10-10',
    dimensions: {
      width: 31,
      height: 31,
      depth: 0.5
    },
    weight: 0.3,
    artists: ['Pink Floyd'],
    recordLabel: 'Harvest',
    tracklist: [
      'Speak to Me',
      'Breathe',
      'On the Run',
      'Time',
      'The Great Gig in the Sky',
      'Money',
      'Us and Them',
      'Any Colour You Like',
      'Brain Damage',
      'Eclipse'
    ],
    genre: 'Progressive Rock',
    releaseDate: '1973-03-01'
  },
  
  // DVDs
  {
    id: 'dvd-001',
    title: 'The Shawshank Redemption',
    category: ProductCategory.DVD,
    value: 180000,
    price: 200000,
    barcode: '5051892045605',
    description: 'New, special edition with director commentary',
    quantity: 20,
    warehouseEntryDate: '2024-11-05',
    dimensions: {
      width: 13.5,
      height: 19,
      depth: 1.5
    },
    weight: 0.15,
    discType: DiscType.BLURAY,
    director: 'Frank Darabont',
    runtime: 142,
    studio: 'Castle Rock Entertainment',
    language: ['English', 'French'],
    subtitles: ['English', 'French', 'Vietnamese', 'Chinese'],
    releaseDate: '1994-09-23',
    genre: 'Drama'
  }
];

// Mock Users
export const mockUsers: User[] = [
  {
    id: 'user-001',
    username: 'admin',
    email: 'admin@aims.com',
    roles: [UserRole.ADMIN],
    isBlocked: false
  },
  {
    id: 'user-002',
    username: 'product_manager',
    email: 'pm@aims.com',
    roles: [UserRole.PRODUCT_MANAGER],
    isBlocked: false
  },
  {
    id: 'user-003',
    username: 'super_user',
    email: 'super@aims.com',
    roles: [UserRole.ADMIN, UserRole.PRODUCT_MANAGER],
    isBlocked: false
  }
];

// Mock Orders
export const mockOrders: Order[] = [
  {
    id: 'order-001',
    items: [
      {
        product: mockProducts[0],
        quantity: 2,
        price: mockProducts[0].price
      },
      {
        product: mockProducts[2],
        quantity: 1,
        price: mockProducts[2].price
      }
    ],
    deliveryInfo: {
      recipientName: 'Nguyen Van A',
      email: 'nguyenvana@example.com',
      phone: '0901234567',
      province: 'Hanoi',
      address: '123 Cau Giay Street, Cau Giay District',
      isRushDelivery: true,
      rushDeliveryTime: '2025-03-05T14:00:00',
      rushDeliveryInstructions: 'Please call before delivering'
    },
    status: OrderStatus.PENDING_PROCESSING,
    subtotal: 580000, // 2*180000 + 1*220000
    vat: 58000, // 10% of subtotal
    deliveryFee: 22000, // Base fee for Hanoi
    totalAmount: 660000, // subtotal + vat + deliveryFee
    transactionId: 'VNP1234567890',
    transactionContent: 'Payment for order #order-001',
    transactionDatetime: '2025-03-04T10:15:30',
    createdAt: '2025-03-04T10:15:30'
  },
  {
    id: 'order-002',
    items: [
      {
        product: mockProducts[3],
        quantity: 1,
        price: mockProducts[3].price
      }
    ],
    deliveryInfo: {
      recipientName: 'Tran Thi B',
      email: 'tranthib@example.com',
      phone: '0909876543',
      province: 'Ho Chi Minh City',
      address: '456 Le Loi Street, District 1',
      isRushDelivery: false
    },
    status: OrderStatus.APPROVED,
    subtotal: 600000,
    vat: 60000,
    deliveryFee: 0, // Free shipping as order > 100,000 VND
    totalAmount: 660000,
    transactionId: 'VNP0987654321',
    transactionContent: 'Payment for order #order-002',
    transactionDatetime: '2025-03-03T15:45:22',
    createdAt: '2025-03-03T15:45:22'
  }
];