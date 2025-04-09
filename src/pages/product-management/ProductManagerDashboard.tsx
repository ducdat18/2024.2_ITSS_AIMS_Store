// src/pages/product-manager/ProductManagerDashboard.tsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid2,
  Paper,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  ShoppingBag as ShoppingBagIcon,
  LocalShipping as LocalShippingIcon,
  Warning as WarningIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { mockApiService } from '../../mock/mockApi';
import { Product, Order, OrderStatus, ProductCategory } from '../../types';

const ProductManagerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockProducts: 0,
    pendingOrders: 0,
    productsByCategory: {
      [ProductCategory.BOOK]: 0,
      [ProductCategory.CD]: 0,
      [ProductCategory.LP]: 0,
      [ProductCategory.DVD]: 0,
    },
  });

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const productsData = await mockApiService.getProducts();
        const ordersData = await mockApiService.getOrders();

        setProducts(productsData);
        setOrders(ordersData);

        // Calculate statistics
        const lowStockThreshold = 10;
        const lowStockCount = productsData.filter(
          (product) => product.quantity <= lowStockThreshold
        ).length;

        const pendingOrdersCount = ordersData.filter(
          (order) => order.status === OrderStatus.PENDING_PROCESSING
        ).length;

        const categoryCount = {
          [ProductCategory.BOOK]: 0,
          [ProductCategory.CD]: 0,
          [ProductCategory.LP]: 0,
          [ProductCategory.DVD]: 0,
        };

        productsData.forEach((product) => {
          categoryCount[product.category]++;
        });

        setStats({
          totalProducts: productsData.length,
          lowStockProducts: lowStockCount,
          pendingOrders: pendingOrdersCount,
          productsByCategory: categoryCount,
        });

        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle refresh
  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Get recent products (last 5 added)
  const recentProducts = [...products]
    .sort(
      (a, b) =>
        new Date(b.warehouseEntryDate).getTime() -
        new Date(a.warehouseEntryDate).getTime()
    )
    .slice(0, 5);

  // Get pending orders (last 5)
  const pendingOrders = orders
    .filter((order) => order.status === OrderStatus.PENDING_PROCESSING)
    .slice(0, 5);

  return (
    <Box
      sx={{
        py: 4,
        position: 'relative',
        overflow: 'hidden',
        minHeight: '100vh',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage:
            'radial-gradient(circle at 20% 30%, rgba(2, 136, 209, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(100, 255, 218, 0.05) 0%, transparent 50%)',
          zIndex: 1,
        },
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          position: 'relative',
          zIndex: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 'bold',
              color: 'primary.light',
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -8,
                left: 0,
                width: 60,
                height: 3,
                background:
                  'linear-gradient(90deg, rgba(100, 255, 218, 0.7), rgba(100, 255, 218, 0.1))',
                borderRadius: 2,
              },
            }}
          >
            <DashboardIcon /> Product Manager Dashboard
          </Typography>

          <Box>
            <Tooltip title="Refresh Data">
              <IconButton onClick={handleRefresh}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Statistics Cards */}
        <Grid2 container spacing={3} sx={{ mb: 4 }}>
          <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundImage:
                  'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
                border: '1px solid rgba(100, 255, 218, 0.1)',
                borderRadius: 2,
                height: '100%',
              }}
            >
              <InventoryIcon
                sx={{
                  fontSize: 48,
                  color: 'primary.light',
                  mb: 1,
                }}
              />
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                {stats.totalProducts}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Total Products
              </Typography>
            </Paper>
          </Grid2>

          <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundImage:
                  'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
                border: '1px solid rgba(100, 255, 218, 0.1)',
                borderRadius: 2,
                height: '100%',
              }}
            >
              <WarningIcon
                sx={{
                  fontSize: 48,
                  color: 'warning.main',
                  mb: 1,
                }}
              />
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                {stats.lowStockProducts}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Low Stock Products
              </Typography>
            </Paper>
          </Grid2>

          <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundImage:
                  'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
                border: '1px solid rgba(100, 255, 218, 0.1)',
                borderRadius: 2,
                height: '100%',
              }}
            >
              <LocalShippingIcon
                sx={{
                  fontSize: 48,
                  color: 'info.main',
                  mb: 1,
                }}
              />
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                {stats.pendingOrders}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Pending Orders
              </Typography>
            </Paper>
          </Grid2>

          <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundImage:
                  'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
                border: '1px solid rgba(100, 255, 218, 0.1)',
                borderRadius: 2,
                height: '100%',
              }}
            >
              <ShoppingBagIcon
                sx={{
                  fontSize: 48,
                  color: 'success.main',
                  mb: 1,
                }}
              />
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Products by Category
              </Typography>
              <Box sx={{ width: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption">Books</Typography>
                  <Typography variant="caption">
                    {stats.productsByCategory[ProductCategory.BOOK]}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption">CDs</Typography>
                  <Typography variant="caption">
                    {stats.productsByCategory[ProductCategory.CD]}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption">LPs</Typography>
                  <Typography variant="caption">
                    {stats.productsByCategory[ProductCategory.LP]}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption">DVDs</Typography>
                  <Typography variant="caption">
                    {stats.productsByCategory[ProductCategory.DVD]}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid2>
        </Grid2>

        {/* Quick Actions */}
        <Paper
          elevation={3}
          sx={{
            p: 3,
            mb: 4,
            backgroundImage:
              'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
            border: '1px solid rgba(100, 255, 218, 0.1)',
            borderRadius: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              color: 'primary.light',
              mb: 2,
            }}
          >
            Quick Actions
          </Typography>
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ py: 1.5 }}
                startIcon={<AddIcon />}
                onClick={() => navigate('/product-management/products/add')}
              >
                Add New Product
              </Button>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                sx={{ py: 1.5 }}
                startIcon={<InventoryIcon />}
                onClick={() => navigate('/product-management/products')}
              >
                Manage Products
              </Button>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                sx={{ py: 1.5 }}
                startIcon={<LocalShippingIcon />}
                onClick={() => navigate('/product-management/orders')}
              >
                Manage Orders
              </Button>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                sx={{ py: 1.5 }}
                startIcon={<WarningIcon />}
                onClick={() =>
                  navigate('/product-management/products?filter=low-stock')
                }
              >
                View Low Stock
              </Button>
            </Grid2>
          </Grid2>
        </Paper>

        <Grid2 container spacing={4}>
          {/* Recent Products */}
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                backgroundImage:
                  'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
                border: '1px solid rgba(100, 255, 218, 0.1)',
                borderRadius: 2,
                height: '100%',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 'bold',
                    color: 'primary.light',
                  }}
                >
                  Recently Added Products
                </Typography>
                <Button
                  size="small"
                  onClick={() => navigate('/product-management/products')}
                  sx={{ textTransform: 'none' }}
                >
                  View All
                </Button>
              </Box>
              <Divider
                sx={{ mb: 2, borderColor: 'rgba(100, 255, 218, 0.1)' }}
              />

              <List>
                {recentProducts.map((product) => (
                  <React.Fragment key={product.id}>
                    <ListItem
                      sx={{
                        borderRadius: 1,
                        '&:hover': {
                          backgroundColor: 'rgba(2, 136, 209, 0.08)',
                        },
                        cursor: 'pointer',
                      }}
                      onClick={() =>
                        navigate(
                          `/product-management/products/edit/${product.id}`
                        )
                      }
                    >
                      <ListItemText
                        primary={product.title}
                        secondary={
                          <React.Fragment>
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.secondary"
                            >
                              {product.category} • Stock: {product.quantity} •
                              Added:{' '}
                              {new Date(
                                product.warehouseEntryDate
                              ).toLocaleDateString()}
                            </Typography>
                          </React.Fragment>
                        }
                      />
                    </ListItem>
                    <Divider
                      component="li"
                      sx={{ borderColor: 'rgba(100, 255, 218, 0.05)' }}
                    />
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid2>

          {/* Pending Orders */}
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                backgroundImage:
                  'linear-gradient(135deg, #0d2538 0%, #041c2c 100%)',
                border: '1px solid rgba(100, 255, 218, 0.1)',
                borderRadius: 2,
                height: '100%',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 'bold',
                    color: 'primary.light',
                  }}
                >
                  Pending Orders
                </Typography>
                <Button
                  size="small"
                  onClick={() => navigate('/product-management/orders')}
                  sx={{ textTransform: 'none' }}
                >
                  View All
                </Button>
              </Box>
              <Divider
                sx={{ mb: 2, borderColor: 'rgba(100, 255, 218, 0.1)' }}
              />

              {pendingOrders.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography color="text.secondary">
                    No pending orders at the moment
                  </Typography>
                </Box>
              ) : (
                <List>
                  {pendingOrders.map((order) => (
                    <React.Fragment key={order.id}>
                      <ListItem
                        sx={{
                          borderRadius: 1,
                          '&:hover': {
                            backgroundColor: 'rgba(2, 136, 209, 0.08)',
                          },
                          cursor: 'pointer',
                        }}
                        onClick={() =>
                          navigate(`/product-management/orders/${order.id}`)
                        }
                      >
                        <ListItemText
                          primary={`Order #${order.id}`}
                          secondary={
                            <React.Fragment>
                              <Typography
                                component="span"
                                variant="body2"
                                color="text.secondary"
                              >
                                {order.deliveryInfo.recipientName} • Items:{' '}
                                {order.items.length} • Total:{' '}
                                {new Intl.NumberFormat('vi-VN', {
                                  style: 'currency',
                                  currency: 'VND',
                                }).format(order.totalAmount)}
                              </Typography>
                            </React.Fragment>
                          }
                        />
                      </ListItem>
                      <Divider
                        component="li"
                        sx={{ borderColor: 'rgba(100, 255, 218, 0.05)' }}
                      />
                    </React.Fragment>
                  ))}
                </List>
              )}
            </Paper>
          </Grid2>
        </Grid2>
      </Container>
    </Box>
  );
};

export default ProductManagerDashboard;
