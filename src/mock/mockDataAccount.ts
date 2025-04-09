import { UserAccount, UserRole } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Mock user account data
export const mockUserAccounts: UserAccount[] = [
  {
    id: 'acc-001',
    userId: 'user-001',
    username: 'admin',
    email: 'admin@aims.com',
    password: 'admin123', // In a real app, this would be hashed
    roles: [UserRole.ADMIN],
    isBlocked: false,
    lastLogin: '2025-04-01T08:30:45',
    createdAt: '2024-01-15T10:00:00',
    updatedAt: '2024-01-15T10:00:00',
  },
  {
    id: 'acc-002',
    userId: 'user-002',
    username: 'product_manager',
    email: 'pm@aims.com',
    password: 'pm123', // In a real app, this would be hashed
    roles: [UserRole.PRODUCT_MANAGER],
    isBlocked: false,
    lastLogin: '2025-04-05T14:22:10',
    createdAt: '2024-01-20T11:30:00',
    updatedAt: '2024-01-20T11:30:00',
  },
  {
    id: 'acc-003',
    userId: 'user-003',
    username: 'super_user',
    email: 'super@aims.com',
    password: 'super123', // In a real app, this would be hashed
    roles: [UserRole.ADMIN, UserRole.PRODUCT_MANAGER],
    isBlocked: false,
    lastLogin: '2025-04-07T09:15:33',
    createdAt: '2024-01-25T09:45:00',
    updatedAt: '2024-01-25T09:45:00',
  },
  {
    id: 'acc-004',
    userId: 'user-004',
    username: 'inventory_admin',
    email: 'inventory@aims.com',
    password: 'inventory123', // In a real app, this would be hashed
    roles: [UserRole.PRODUCT_MANAGER],
    isBlocked: false,
    lastLogin: '2025-04-02T16:40:21',
    createdAt: '2024-02-05T13:20:00',
    updatedAt: '2024-02-05T13:20:00',
  },
  {
    id: 'acc-005',
    userId: 'user-005',
    username: 'system_admin',
    email: 'system@aims.com',
    password: 'system123', // In a real app, this would be hashed
    roles: [UserRole.ADMIN],
    isBlocked: false,
    lastLogin: '2025-04-06T11:05:17',
    createdAt: '2024-02-10T15:30:00',
    updatedAt: '2024-02-10T15:30:00',
  },
  {
    id: 'acc-006',
    userId: 'user-006',
    username: 'john_manager',
    email: 'john@aims.com',
    password: 'john123', 
    roles: [UserRole.PRODUCT_MANAGER],
    isBlocked: true, // Example of a blocked user
    lastLogin: '2025-03-15T10:30:00',
    createdAt: '2024-02-15T09:10:00',
    updatedAt: '2024-03-20T14:25:00',
  },
  {
    id: 'acc-007',
    userId: 'user-007',
    username: 'sarah_admin',
    email: 'sarah@aims.com',
    password: 'sarah123', // In a real app, this would be hashed
    roles: [UserRole.ADMIN],
    isBlocked: false,
    lastLogin: '2025-04-03T13:45:29',
    createdAt: '2024-02-20T11:15:00',
    updatedAt: '2024-02-20T11:15:00',
  },
  {
    id: 'acc-008',
    userId: 'user-008',
    username: 'michael_pm',
    email: 'michael@aims.com',
    password: 'michael123', // In a real app, this would be hashed
    roles: [UserRole.PRODUCT_MANAGER],
    isBlocked: false,
    lastLogin: '2025-04-04T10:20:15',
    createdAt: '2024-03-01T10:00:00',
    updatedAt: '2024-03-01T10:00:00',
  },
  {
    id: 'acc-009',
    userId: 'user-009',
    username: 'emma_admin',
    email: 'emma@aims.com',
    password: 'emma123', // In a real app, this would be hashed
    roles: [UserRole.ADMIN],
    isBlocked: false,
    lastLogin: '2025-04-01T15:10:40',
    createdAt: '2024-03-10T09:30:00',
    updatedAt: '2024-03-10T09:30:00',
  },
  // Added customer accounts
  {
    id: 'acc-010',
    userId: 'user-010',
    username: 'john_customer',
    email: 'john_customer@example.com',
    password: 'customer123',
    roles: [UserRole.CUSTOMER],
    isBlocked: false,
    lastLogin: '2025-04-06T10:15:30',
    createdAt: '2024-03-15T14:30:00',
    updatedAt: '2024-03-15T14:30:00',
  },
  {
    id: 'acc-011',
    userId: 'user-011',
    username: 'mary_customer',
    email: 'mary_customer@example.com',
    password: 'customer123',
    roles: [UserRole.CUSTOMER],
    isBlocked: false,
    lastLogin: '2025-04-05T16:45:20',
    createdAt: '2024-03-20T09:15:00',
    updatedAt: '2024-03-20T09:15:00',
  },
  {
    id: 'acc-012',
    userId: 'user-012',
    username: 'david_customer',
    email: 'david_customer@example.com',
    password: 'customer123',
    roles: [UserRole.CUSTOMER],
    isBlocked: false,
    lastLogin: '2025-04-07T11:30:15',
    createdAt: '2024-03-25T10:45:00',
    updatedAt: '2024-03-25T10:45:00',
  }
];

// Mock service for admin account operations
export const mockAccountService = {
  getAccounts: async (): Promise<UserAccount[]> => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    return [...mockUserAccounts];
  },
  
  getAccountById: async (id: string): Promise<UserAccount | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockUserAccounts.find(account => account.id === id);
  },
  
  createAccount: async (account: Omit<UserAccount, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserAccount> => {
    await new Promise(resolve => setTimeout(resolve, 700));
    const newAccount: UserAccount = {
      ...account,
      id: `acc-${uuidv4().substring(0, 8)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return newAccount;
  },
  
  updateAccount: async (id: string, updates: Partial<UserAccount>): Promise<UserAccount | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const account = mockUserAccounts.find(acc => acc.id === id);
    if (!account) return undefined;
    
    const updatedAccount: UserAccount = {
      ...account,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return updatedAccount;
  },
  
  deleteAccount: async (id: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    const accountIndex = mockUserAccounts.findIndex(acc => acc.id === id);
    if (accountIndex === -1) return false;
    return true;
  },
  
  resetPassword: async (id: string): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return 'new-temp-password';
  },
  
  blockAccount: async (id: string): Promise<UserAccount | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const account = mockUserAccounts.find(acc => acc.id === id);
    if (!account) return undefined;
    
    const updatedAccount: UserAccount = {
      ...account,
      isBlocked: true,
      updatedAt: new Date().toISOString(),
    };
    return updatedAccount;
  },
  
  unblockAccount: async (id: string): Promise<UserAccount | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const account = mockUserAccounts.find(acc => acc.id === id);
    if (!account) return undefined;
    
    const updatedAccount: UserAccount = {
      ...account,
      isBlocked: false,
      updatedAt: new Date().toISOString(),
    };
    return updatedAccount;
  },
  
  changePassword: async (id: string, currentPassword: string, newPassword: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const account = mockUserAccounts.find(acc => acc.id === id);
    if (!account) return false;
    if (account.password !== currentPassword) return false;
    
    return true;
  },

  // Added for customer functionality
  registerCustomer: async (userData: { username: string, email: string, password: string }): Promise<UserAccount> => {
    await new Promise(resolve => setTimeout(resolve, 700));
    const newAccount: UserAccount = {
      id: `acc-${uuidv4().substring(0, 8)}`,
      userId: `user-${uuidv4().substring(0, 8)}`,
      username: userData.username,
      email: userData.email,
      password: userData.password,
      roles: [UserRole.CUSTOMER],
      isBlocked: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return newAccount;
  }
};