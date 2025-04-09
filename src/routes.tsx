// src/routes.tsx
import { createBrowserRouter, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from './components/layout/MainLayout';
import AdminLayout from './components/layout/AdminLayout';
import ProductManagerLayout from './components/layout/ProductManagerLayout';

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

// Product management pages

// Auth
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import OrderDetailPage from './pages/product-management/OrderDetailPage';
import OrderManagementPage from './pages/product-management/OrderManagementPage';
import ProductFormPage from './pages/product-management/ProductFormPage';
import ProductListPage from './pages/product-management/ProductListPage';
import ProductManagerDashboard from './pages/product-management/ProductManagerDashboard';

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
  {
    path: '/product-management',
    element: <ProductManagerLayout />,
    children: [
      { index: true, element: <ProductManagerDashboard /> },
      { path: 'dashboard', element: <ProductManagerDashboard /> },
      { path: 'products', element: <ProductListPage /> },
      { path: 'products/add', element: <ProductFormPage /> },
      { path: 'products/edit/:id', element: <ProductFormPage /> },
      { path: 'orders', element: <OrderManagementPage /> },
      { path: 'orders/:id', element: <OrderDetailPage /> },
      {
        path: 'analytics',
        element: <Navigate to="/product-management/dashboard" replace />,
      },
    ],
  },
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
