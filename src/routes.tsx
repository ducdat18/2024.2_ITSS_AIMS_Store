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
import OrderManagementPage from './pages/product-management/OrderManagementPage';
import PMOrderDetailPage from './pages/product-management/OrderDetailPage';
import ProductFormPage from './pages/product-management/ProductFormPage';
import ProductListPage from './pages/product-management/ProductListPage';
import ProductManagerDashboard from './pages/product-management/ProductManagerDashboard';

// Auth
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Auth guard for protected routes
import { UserRole } from './types';
import AuthGuard from './components/customer/AuthGuard';
import AccountPage from './pages/account/AccountPage';
import AccountOrdersPage from './pages/account/AccountOrdersPage';
import AccountWishlistPage from './pages/account/AccountWislistPage';
import AccountAddressPage from './pages/account/AccountAdressPage';
import AccountSecurityPage from './pages/account/AccountSecurityPage';
import AccountOrderDetailPage from './pages/account/AccountOrderDetailPage';
import CancelOrderPage from './pages/customer/CancelOrderPage';

export const router = createBrowserRouter([
  // Main layout (for all users)
  {
    path: '/',
    element: <MainLayout />,
    children: [
      // Public routes - accessible to all users
      { index: true, element: <HomePage /> },
      { path: 'products', element: <ProductPage /> },
      { path: 'product/:id', element: <ProductDetailPage /> },
      { path: 'about', element: <About /> },
      { path: 'contact', element: <About /> }, // Placeholder until Contact page is created

      // Semi-protected routes - can be accessed without login but may require login for certain functionality
      { path: 'cart', element: <CartPage /> },
      { path: 'checkout', element: <CheckoutPage /> },
      { path: 'order/confirmation/:id', element: <OrderConfirmationPage /> },
      { path: 'order/cancel/:id', element: <CancelOrderPage /> },

      // Customer account pages (protected - require customer login)
      {
        path: 'account',
        element: (
          <AuthGuard
            requiredRoles={[UserRole.CUSTOMER]}
            component={AccountPage}
          />
        ),
      },
      {
        path: 'orders',
        element: (
          <AuthGuard
            requiredRoles={[UserRole.CUSTOMER]}
            component={AccountOrdersPage}
          />
        ),
      },
      {
        path: 'orders/:id',
        element: (
          <AuthGuard
            requiredRoles={[UserRole.CUSTOMER]}
            component={AccountOrderDetailPage}
          />
        ),
      },
      {
        path: 'wishlist',
        element: (
          <AuthGuard
            requiredRoles={[UserRole.CUSTOMER]}
            component={AccountWishlistPage}
          />
        ),
      },
      {
        path: 'account/addresses',
        element: (
          <AuthGuard
            requiredRoles={[UserRole.CUSTOMER]}
            component={AccountAddressPage}
          />
        ),
      },
      {
        path: 'account/security',
        element: (
          <AuthGuard
            requiredRoles={[UserRole.CUSTOMER]}
            component={AccountSecurityPage}
          />
        ),
      },
      {
        path: 'account/profile',
        element: (
          <AuthGuard
            requiredRoles={[UserRole.CUSTOMER]}
            component={AccountPage}
          />
        ),
      },
      {
        path: 'account/settings',
        element: (
          <AuthGuard
            requiredRoles={[UserRole.CUSTOMER]}
            component={AccountSecurityPage}
          />
        ),
      },
    ],
  },

  // Admin layout (protected - requires admin role)
  {
    path: '/admin',
    element: (
      <AuthGuard requiredRoles={[UserRole.ADMIN]} component={AdminLayout} />
    ),
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

  // Product Manager layout (protected - requires product manager role)
  {
    path: '/product-management',
    element: (
      <AuthGuard
        requiredRoles={[UserRole.PRODUCT_MANAGER]}
        component={ProductManagerLayout}
      />
    ),
    children: [
      { index: true, element: <ProductManagerDashboard /> },
      { path: 'dashboard', element: <ProductManagerDashboard /> },
      { path: 'products', element: <ProductListPage /> },
      { path: 'products/add', element: <ProductFormPage /> },
      { path: 'products/edit/:id', element: <ProductFormPage /> },
      { path: 'orders', element: <OrderManagementPage /> },
      { path: 'orders/:id', element: <PMOrderDetailPage /> },
      {
        path: 'analytics',
        element: <Navigate to="/product-management/dashboard" replace />,
      },
    ],
  },

  // Auth routes
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },

  // Catch-all route
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
