// src/routes.tsx
import { createBrowserRouter, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from './components/layout/MainLayout';
import AdminLayout from './components/layout/AdminLayout';
import ProductManagerLayout from './components/layout/ProductManagerLayout';

// Customer pages
import HomePage from './pages/customer/HomePage';
import ProductDetailPage from './pages/customer/ProductDetailPage';
import CartPage from './pages/customer/CartPage';
import CheckoutPage from './pages/customer/CheckoutPage';
import OrderConfirmationPage from './pages/customer/OrderConfirmationPage';

// Admin pages
import AdminDashboardPage from './pages/admin/DashboardPage';
import UserManagementPage from './pages/admin/UserManagementPage';

// Product Manager pages

// Auth
import LoginPage from './pages/auth/LoginPage';
import ProtectedRoute from './components/common/ProtectedRoute';
import { UserRole } from './types';
import OrderManagementPage from './pages/product-management/OrderManagementPage';
import EditProductPage from './pages/product-management/EditProductPage';
import AddProductPage from './pages/product-management/AddProductPage';
import ProductListPage from './pages/product-management/ProductListPage';
import ProductDashboardPage from './pages/product-management/ProductDashboardPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'product/:id', element: <ProductDetailPage /> },
      { path: 'cart', element: <CartPage /> },
      { path: 'checkout', element: <CheckoutPage /> },
      { path: 'order/confirmation/:id', element: <OrderConfirmationPage /> },
    ],
  },
  // {
  //   path: '/admin',
  //   element: (
  //     <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
  //       <AdminLayout />
  //     </ProtectedRoute>
  //   ),
  //   children: [
  //     { index: true, element: <AdminDashboardPage /> },
  //     { path: 'users', element: <UserManagementPage /> },
  //   ],
  // },
  // {
  //   path: '/product-management',
  //   element: (
  //     <ProtectedRoute allowedRoles={[UserRole.PRODUCT_MANAGER]}>
  //       <ProductManagerLayout />
  //     </ProtectedRoute>
  //   ),
  //   children: [
  //     { index: true, element: <ProductDashboardPage /> },
  //     { path: 'products', element: <ProductListPage /> },
  //     { path: 'products/add', element: <AddProductPage /> },
  //     { path: 'products/edit/:id', element: <EditProductPage /> },
  //     { path: 'orders', element: <OrderManagementPage /> },
  //   ],
  // },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
