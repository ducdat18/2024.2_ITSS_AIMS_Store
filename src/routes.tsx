// src/routes.tsx
import { createBrowserRouter, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from './components/layout/MainLayout';

// Customer pages
import HomePage from './pages/customer/HomePage';
import ProductDetailPage from './pages/customer/ProductDetailPage';
import CartPage from './pages/customer/CartPage';
import CheckoutPage from './pages/customer/CheckoutPage';
import OrderConfirmationPage from './pages/customer/OrderConfirmationPage';

// Admin pages

// Product Manager pages

// Auth
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ProductPage from './pages/customer/ProductPage';
import About from './components/common/About';
import AdminLayout from './components/layout/AdminLayout';

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
      { path: 'products', element: <ProductPage /> },
      { path: 'about', element: <About /> },
      { path: 'admin', element: <AdminLayout /> },
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
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
