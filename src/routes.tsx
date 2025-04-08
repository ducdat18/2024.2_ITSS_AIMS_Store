// src/routes.tsx
import { createBrowserRouter, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from './components/layout/MainLayout';
import AdminLayout from './components/layout/AdminLayout';

// Customer pages
import HomePage from './pages/customer/HomePage';
import ProductDetailPage from './pages/customer/ProductDetailPage';
import ProductPage from './pages/customer/ProductPage';
import CartPage from './pages/customer/CartPage';
import CheckoutPage from './pages/customer/CheckoutPage';
import OrderConfirmationPage from './pages/customer/OrderConfirmationPage';
import About from './components/common/About';

// Admin pages
import AdminDashboardPage from './pages/admin/DashboardPage';
import UserManagementPage from './pages/admin/UserManagementPage';
import UserDetailPage from './pages/admin/UserDetailPage';
import UserFormPage from './pages/admin/UserFormPage';

// Auth
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

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
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: 'dashboard', element: <AdminDashboardPage /> },
      { path: 'users', element: <UserManagementPage /> },
      { path: 'users/:id', element: <UserDetailPage /> },
      { path: 'users/add', element: <UserFormPage /> },
      { path: 'users/:id/edit', element: <UserFormPage /> },
      { path: 'profile', element: <UserDetailPage /> },
      { path: 'settings', element: <Navigate to="/admin/dashboard" replace /> },
    ],
  },
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
